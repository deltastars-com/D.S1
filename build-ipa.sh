#!/bin/bash

# Delta Stars - Build IPA Script
# This script builds a production-ready IPA for iOS

set -e

echo "🚀 بدء بناء تطبيق Delta Stars لـ iOS..."
echo "================================================"

# Step 1: Build the web app
echo "📦 بناء تطبيق الويب..."
npm run build
echo "✅ تم بناء تطبيق الويب بنجاح"

# Step 2: Copy to Capacitor
echo "📱 نسخ الملفات إلى Capacitor..."
npx cap sync ios
echo "✅ تم نسخ الملفات بنجاح"

# Step 3: Build IPA
echo "🔨 بناء ملف IPA..."
cd ios/App
xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -derivedDataPath build \
  -archivePath build/App.xcarchive \
  archive
echo "✅ تم بناء ملف IPA بنجاح"

# Step 4: Export IPA
echo "📤 تصدير ملف IPA..."
xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportOptionsPlist exportOptions.plist \
  -exportPath build/ipa
echo "✅ تم تصدير ملف IPA بنجاح"

echo "================================================"
echo "✅ تم بناء تطبيق IPA بنجاح!"
echo "📍 الملف: ios/App/build/ipa/App.ipa"
echo "================================================"
