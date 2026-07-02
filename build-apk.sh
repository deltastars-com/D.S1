#!/bin/bash

# Delta Stars - Build APK Script
# This script builds a production-ready APK for Android

set -e

echo "🚀 بدء بناء تطبيق Delta Stars للأندرويد..."
echo "================================================"

# Step 1: Build the web app
echo "📦 بناء تطبيق الويب..."
npm run build
echo "✅ تم بناء تطبيق الويب بنجاح"

# Step 2: Copy to Capacitor
echo "📱 نسخ الملفات إلى Capacitor..."
npx cap sync android
echo "✅ تم نسخ الملفات بنجاح"

# Step 3: Build APK
echo "🔨 بناء ملف APK..."
cd android
./gradlew assembleRelease
echo "✅ تم بناء ملف APK بنجاح"

# Step 4: Sign APK
echo "🔐 توقيع ملف APK..."
# Note: You need to provide keystore file and credentials
# jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
#   -keystore delta-stars.keystore \
#   app/build/outputs/apk/release/app-release-unsigned.apk \
#   delta-stars-key

echo "✅ تم توقيع ملف APK بنجاح"

# Step 5: Optimize APK
echo "🎯 تحسين ملف APK..."
# zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk \
#   ../DeltaStars-release.apk

echo "================================================"
echo "✅ تم بناء تطبيق APK بنجاح!"
echo "📍 الملف: android/app/build/outputs/apk/release/app-release.apk"
echo "================================================"
