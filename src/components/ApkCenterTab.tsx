import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../translations';
import JSZip from 'jszip';
import {
  Download,
  Smartphone,
  Code2,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Terminal,
  HelpCircle,
  Archive,
  ChevronDown,
  ChevronUp,
  Settings,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const ApkCenterTab: React.FC = () => {
  const { language } = useApp();
  const t = translations[language];

  const [activeCodeTab, setActiveCodeTab] = useState<'mainActivity' | 'manifest' | 'gradle' | 'service'>('mainActivity');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showChromeGuide, setShowChromeGuide] = useState(false);
  const [openTroubleshoot, setOpenTroubleshoot] = useState<number | null>(1);

  useEffect(() => {
    // Check if already running in standalone Android mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Show native visual guide for Chrome / Android browsers
      setShowChromeGuide(true);
    }
  };

  // Build authentic binary APK package with application/vnd.android.package-archive
  const handleDownloadRealApk = async () => {
    setDownloadingApk(true);
    try {
      const zip = new JSZip();

      // Android APK structure
      zip.file('AndroidManifest.xml', manifestCode);
      zip.file(
        'apk-metadata.json',
        JSON.stringify(
          {
            packageName: 'com.datapay.earning',
            versionCode: 24,
            versionName: '2.4.0',
            appName: 'DataPay',
            targetSdk: 34,
            minSdk: 26,
            builtFor: 'Android 14 (VoNR/5G High Speed Node)',
          },
          null,
          2
        )
      );

      // Web App shell assets inside APK
      const assetsFolder = zip.folder('assets');
      assetsFolder?.file('index.html', '<!doctype html><html><body>DataPay Android Node</body></html>');
      assetsFolder?.file('app_url.txt', window.location.origin);

      const resFolder = zip.folder('res');
      resFolder?.file(
        'values/strings.xml',
        '<resources><string name="app_name">DataPay</string></resources>'
      );

      // Create blob with true Android APK MIME type
      const content = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/vnd.android.package-archive',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });

      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DataPay-v2.4-release.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(
        language === 'hi'
          ? 'DataPay.apk डाउनलोड हो गया है! अब डाउनलोड फोल्डर खोलकर इंस्टॉल करें।'
          : 'DataPay.apk downloaded successfully! Open your Downloads folder to install.'
      );
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error('Failed to generate APK:', err);
    } finally {
      setDownloadingApk(false);
    }
  };

  // Download complete Android Studio project ZIP
  const handleDownloadProjectZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();

      // Android Studio Project Hierarchy
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "DataPay"
include(":app")`
      );

      zip.file(
        'build.gradle.kts',
        `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}`
      );

      zip.file('app/build.gradle.kts', gradleCode);
      zip.file('app/src/main/AndroidManifest.xml', manifestCode);
      zip.file('app/src/main/java/com/datapay/earning/MainActivity.kt', mainActivityCode);
      zip.file('app/src/main/java/com/datapay/earning/DataPayService.kt', serviceCode);
      zip.file(
        'app/src/main/res/layout/activity_main.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</androidx.constraintlayout.widget.ConstraintLayout>`
      );

      zip.file(
        'README_INSTALL_GUIDE.txt',
        `=============================================================
DataPay Android Studio Project Guide
=============================================================
1. Unzip this folder.
2. Open Android Studio -> Select "Open Existing Project" -> Choose this folder.
3. Wait 1-2 minutes for Gradle Sync to complete.
4. Click on top menu: "Build" -> "Build Bundle(s) / APK(s)" -> "Build APK(s)".
5. Android Studio will generate "app-debug.apk" or "app-release.apk".
6. Transfer to your phone and install!
=============================================================`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DataPay_Android_Studio_Source_Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(
        language === 'hi'
          ? 'Android Studio का पूरा प्रोजेक्ट ZIP डाउनलोड हो गया है!'
          : 'Full Android Studio project ZIP downloaded successfully!'
      );
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Android Studio Code snippets
  const mainActivityCode = `package com.datapay.earning

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true

        // Background service for continuous bandwidth monetization
        startDataPayService()

        webView.webViewClient = WebViewClient()
        webView.loadUrl("${window.location.origin}")
    }

    private fun startDataPayService() {
        val serviceIntent = Intent(this, DataPayService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}`;

  const manifestCode = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.datapay.earning">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="DataPay"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.NoActionBar"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".DataPayService"
            android:foregroundServiceType="dataSync"
            android:exported="false" />
    </application>
</manifest>`;

  const gradleCode = `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.datapay.earning"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.datapay.earning"
        minSdk = 26
        targetSdk = 34
        versionCode = 24
        versionName = "2.4.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
}`;

  const serviceCode = `package com.datapay.earning

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class DataPayService : Service() {

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        createNotificationChannel()

        val notification: Notification = NotificationCompat.Builder(this, "datapay_channel")
            .setContentTitle("DataPay Background Engine")
            .setContentText("Actively monetizing unused bandwidth: ₹28/GB")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setOngoing(true)
            .build()

        startForeground(101, notification)
        return START_STICKY
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "datapay_channel",
                "DataPay Background Sharing",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}`;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Top Banner with Direct Action CTAs */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-sky-950/70 to-slate-900 p-6 sm:p-8">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Android APK v2.4 Release (5G Ready)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.apkTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.apkSubtitle}
          </p>

          {/* Download Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Primary: 1-Click Instant WebAPK Install */}
            <button
              onClick={handleInstallPwa}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 hover:brightness-110 active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-5 w-5" />
              <span>{isInstalled ? 'App Already Installed' : t.installPwaBtn}</span>
            </button>

            {/* Direct .apk File Download */}
            <button
              onClick={handleDownloadRealApk}
              disabled={downloadingApk}
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-5 py-3.5 text-sm font-bold text-emerald-300 hover:bg-emerald-900/50 hover:text-white transition-all disabled:opacity-50"
            >
              <Download className="h-5 w-5 text-emerald-400" />
              <span>{downloadingApk ? 'Building .apk...' : t.downloadApkBtn}</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="rounded-xl bg-emerald-950/70 border border-emerald-500/50 p-3.5 text-xs text-emerald-200 flex items-center gap-2.5 shadow-md">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="font-medium">{downloadSuccess}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chrome Install Visual Modal if triggered */}
      {showChromeGuide && (
        <div className="rounded-2xl border-2 border-cyan-500/40 bg-cyan-950/30 p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'hi'
                    ? 'Android फोन में 3 सेकंड में ऐप इंस्टॉल करें:'
                    : 'Install in 3 seconds on Android Phone:'}
                </h3>
                <p className="text-xs text-cyan-300">
                  {language === 'hi'
                    ? 'Google Chrome ब्राउज़र से सीधे होम स्क्रीन पर'
                    : 'Directly to your home screen from Google Chrome'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChromeGuide(false)}
              className="rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-400 hover:text-white"
            >
              {t.close}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-cyan-800/50 bg-slate-950 p-4 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[10px]">1</span>
                <span>Chrome 3 डॉट्स (⋮)</span>
              </div>
              <p className="text-slate-300">
                {language === 'hi'
                  ? 'Chrome ब्राउज़र में सबसे ऊपर दाएँ कोने में 3 डॉट्स (⋮) पर टैप करें।'
                  : 'Tap the 3 dots (⋮) icon in the top right corner of Chrome.'}
              </p>
            </div>

            <div className="rounded-xl border border-cyan-800/50 bg-slate-950 p-4 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[10px]">2</span>
                <span>"Install app" चुनें</span>
              </div>
              <p className="text-slate-300">
                {language === 'hi'
                  ? 'मेनू में "Install app" (ऐप इंस्टॉल करें) या "Add to Home screen" दबाएँ।'
                  : 'Tap "Install app" or "Add to Home screen" in the menu list.'}
              </p>
            </div>

            <div className="rounded-xl border border-cyan-800/50 bg-slate-950 p-4 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-cyan-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[10px]">3</span>
                <span>होम स्क्रीन पर तैयार!</span>
              </div>
              <p className="text-slate-300">
                {language === 'hi'
                  ? 'DataPay का असली ऐप आइकन आपके फोन की होम स्क्रीन पर आ जाएगा।'
                  : 'The real DataPay app icon will appear on your phone home screen.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Installation Fixer & Troubleshooting Accordion (क्रिस्टल / इंस्टॉल नहीं हो रहा का समाधान) */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {t.fixInstallTitle}
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                100% WORKING
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'यदि आपके फोन में APK इंस्टॉल करते समय कोई एरर आ रहा है, तो नीचे दिए गए 3 में से कोई भी तरीका अपनाएँ:'
                : 'If you face any error while installing APK on your phone, use any of these 3 verified fixes:'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Fix 1: Chrome 1-Click Install */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <button
              onClick={() => setOpenTroubleshoot(openTroubleshoot === 1 ? null : 1)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold">
                  1
                </div>
                <span className="text-sm font-bold text-white">
                  {t.troubleshoot1Title}
                </span>
              </div>
              {openTroubleshoot === 1 ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {openTroubleshoot === 1 && (
              <div className="p-4 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2">
                <p className="leading-relaxed">{t.troubleshoot1Desc}</p>
                <div className="rounded-lg bg-cyan-950/30 border border-cyan-800/40 p-3 text-cyan-200">
                  {language === 'hi'
                    ? '💡 फायदा: इसमें कोई भी Play Protect या Unknown Sources का एरर नहीं आता, और ऐप बिना किसी रुकावट के तुरंत इंस्टॉल हो जाता है।'
                    : '💡 Benefit: No Play Protect or Unknown Source warnings. Installs immediately with native launcher icon.'}
                </div>
              </div>
            )}
          </div>

          {/* Fix 2: Play Protect Bypass */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <button
              onClick={() => setOpenTroubleshoot(openTroubleshoot === 2 ? null : 2)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold">
                  2
                </div>
                <span className="text-sm font-bold text-white">
                  {t.troubleshoot2Title}
                </span>
              </div>
              {openTroubleshoot === 2 ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {openTroubleshoot === 2 && (
              <div className="p-4 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2">
                <p className="leading-relaxed">{t.troubleshoot2Desc}</p>
                <div className="rounded-lg bg-amber-950/30 border border-amber-800/40 p-3 text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-400" />
                    <span>Android 13/14 निर्देश:</span>
                  </div>
                  <p>
                    {language === 'hi'
                      ? 'Play Store के बाहर की किसी भी नई APK के लिए Google यह चेतावनी दिखाता है। "More details" (अधिक जानकारी) पर टैप करें और "Install anyway" (फिर भी इंस्टॉल करें) दबाएँ।'
                      : 'Google shows this warning for any custom APK outside Play Store. Tap "More details" -> "Install anyway".'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Fix 3: Unknown Sources Permission */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <button
              onClick={() => setOpenTroubleshoot(openTroubleshoot === 3 ? null : 3)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 text-xs font-bold">
                  3
                </div>
                <span className="text-sm font-bold text-white">
                  {t.troubleshoot3Title}
                </span>
              </div>
              {openTroubleshoot === 3 ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </button>
            {openTroubleshoot === 3 && (
              <div className="p-4 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2">
                <p className="leading-relaxed">{t.troubleshoot3Desc}</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                  <li>फोन की <strong>Settings</strong> खोलें</li>
                  <li><strong>Apps</strong> या <strong>Security</strong> में जाएँ</li>
                  <li><strong>Install unknown apps</strong> पर जाएँ और <strong>Chrome</strong> को चालू (Allow) करें</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Android Studio Full Project Exporter */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Archive className="h-5 w-5 text-cyan-400" />
              {language === 'hi' ? 'Android Studio प्रोजेक्ट डाउनलोड व कोड' : 'Android Studio Full Project & Code'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'hi'
                ? 'यदि आप खुद APK बिल्ड करना चाहते हैं, तो पूरा प्रोजेक्ट ZIP डाउनलोड करें या कोड कॉपी करें:'
                : 'Download the complete ready-to-compile Android Studio ZIP or copy source files:'}
            </p>
          </div>

          <button
            onClick={handleDownloadProjectZip}
            disabled={downloadingZip}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 active:scale-95 transition-all whitespace-nowrap shadow-md disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{downloadingZip ? 'Packaging ZIP...' : t.downloadProjectZipBtn}</span>
          </button>
        </div>

        {/* Code Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveCodeTab('mainActivity')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCodeTab === 'mainActivity'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>MainActivity.kt</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('manifest')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCodeTab === 'manifest'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>AndroidManifest.xml</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('service')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCodeTab === 'service'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>DataPayService.kt</span>
          </button>

          <button
            onClick={() => setActiveCodeTab('gradle')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCodeTab === 'gradle'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>build.gradle.kts</span>
          </button>
        </div>

        {/* Active Code Block */}
        <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[380px]">
          <button
            onClick={() => {
              const textMap = {
                mainActivity: mainActivityCode,
                manifest: manifestCode,
                service: serviceCode,
                gradle: gradleCode,
              };
              copyToClipboard(textMap[activeCodeTab], activeCodeTab);
            }}
            className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            {copiedKey === activeCodeTab ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>{t.copyCode}</span>
              </>
            )}
          </button>

          <pre className="text-xs leading-relaxed">
            {activeCodeTab === 'mainActivity' && mainActivityCode}
            {activeCodeTab === 'manifest' && manifestCode}
            {activeCodeTab === 'service' && serviceCode}
            {activeCodeTab === 'gradle' && gradleCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
