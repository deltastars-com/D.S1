# Delta Stars - دليل النشر والتسليم

## 📋 المحتويات

1. [متطلبات النشر](#متطلبات-النشر)
2. [بناء التطبيقات](#بناء-التطبيقات)
3. [ملفات التوقيع](#ملفات-التوقيع)
4. [النشر على المتاجر](#النشر-على-المتاجر)
5. [المتطلبات الأمنية](#المتطلبات-الأمنية)

---

## متطلبات النشر

### الأدوات المطلوبة:
- Node.js 18+
- npm أو yarn
- Android SDK (لبناء APK)
- Xcode (لبناء IPA)
- Capacitor CLI

### التثبيت:
```bash
npm install -g @capacitor/cli
npm install
```

---

## بناء التطبيقات

### بناء تطبيق Android (APK)

```bash
# الطريقة 1: استخدام السكريبت
chmod +x build-apk.sh
./build-apk.sh

# الطريقة 2: يدويًا
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
```

**الملف الناتج:** `android/app/build/outputs/apk/release/app-release.apk`

### بناء تطبيق iOS (IPA)

```bash
# الطريقة 1: استخدام السكريبت
chmod +x build-ipa.sh
./build-ipa.sh

# الطريقة 2: يدويًا
npm run build
npx cap sync ios
cd ios/App
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release archive
```

**الملف الناتج:** `ios/App/build/ipa/App.ipa`

---

## ملفات التوقيع

### Android Keystore

**إنشاء مفتاح توقيع جديد:**
```bash
keytool -genkey -v -keystore delta-stars.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias delta-stars-key
```

**توقيع APK:**
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore delta-stars.keystore \
  app-release-unsigned.apk delta-stars-key

zipalign -v 4 app-release-unsigned.apk DeltaStars-release.apk
```

### iOS Certificates

**المتطلبات:**
- Apple Developer Account
- Development Certificate
- Distribution Certificate
- Provisioning Profile

**الخطوات:**
1. اذهب إلى [Apple Developer](https://developer.apple.com)
2. أنشئ Certificates و Provisioning Profiles
3. حمل الملفات وثبتها على جهازك
4. استخدم Xcode لإدارة الشهادات

---

## النشر على المتاجر

### Google Play Store

**المتطلبات:**
- Google Play Developer Account ($25)
- APK موقع
- صور وفيديوهات للعرض
- وصف التطبيق

**الخطوات:**
1. اذهب إلى [Google Play Console](https://play.google.com/console)
2. أنشئ تطبيق جديد
3. أضف البيانات الأساسية
4. رفع APK
5. أضف المحتوى والصور
6. قدم الطلب للمراجعة

### App Store

**المتطلبات:**
- Apple Developer Account ($99/سنة)
- IPA موقع
- صور وفيديوهات للعرض
- وصف التطبيق

**الخطوات:**
1. اذهب إلى [App Store Connect](https://appstoreconnect.apple.com)
2. أنشئ تطبيق جديد
3. أضف البيانات الأساسية
4. رفع IPA
5. أضف المحتوى والصور
6. قدم الطلب للمراجعة

---

## المتطلبات الأمنية

### متغيرات البيئة

**ملف `.env.production`:**
```
VITE_SUPABASE_URL=https://rgusisancfcdabfnfwoy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_7Nto0sKpBW67n76pDyI0Mg_xNxTTTIC
VITE_GEMINI_KEY=AIzaSyDq63A6ob2MfTudOfnZN94DQCNl3pi0bA0y
VITE_MAPS_KEY=AIzaSyAwjGrOiVKGEa9EtVlgU9p9E42JCFqKIHw
VITE_MOYASAR_PUBLISHABLE_KEY=pk_live_g4AiZEDz5NyQMizpPxZ3nMUqpjoEEBgBatMky3tz
```

### التشفير

- جميع البيانات الحساسة مشفرة
- HTTPS إلزامي
- JWT للمصادقة
- CORS محمي

### الصلاحيات المطلوبة

**Android:**
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_CONTACTS" />
```

**iOS:**
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>نحتاج إلى موقعك لتتبع الطلب</string>
<key>NSCameraUsageDescription</key>
<string>نحتاج إلى الكاميرا للتحقق من الهوية</string>
```

---

## قائمة التحقق قبل النشر

- [ ] جميع الأخطاء تم إصلاحها
- [ ] الاختبارات تمر بنجاح
- [ ] الأداء محسّن
- [ ] الأمان تم التحقق منه
- [ ] البيانات الحساسة آمنة
- [ ] الترجمة كاملة (عربي/إنجليزي)
- [ ] الصور والأيقونات جاهزة
- [ ] الوصف والشروط جاهزة
- [ ] ملفات التوقيع جاهزة
- [ ] اختبار على أجهزة حقيقية

---

## الدعم والمساعدة

للمزيد من المعلومات:
- [Capacitor Docs](https://capacitorjs.com)
- [Google Play Docs](https://developer.android.com)
- [Apple Developer Docs](https://developer.apple.com)

---

**آخر تحديث:** 2026-07-02
**الإصدار:** 1.0.0
