# Authentica OTP Integration Notes

تمت مراجعة الوثائق الرسمية في 2026-08-16 قبل تنفيذ مسارات OTP في الخادم.

## المصادر الرسمية

- دليل سير OTP: https://docs.authentica.sa/guides/otp-workflow
- فهرس وثائق Authentica: https://docs.authentica.sa/
- مرجع API: https://docs.authentica.sa/api-reference
- أمثلة Node الرسمية: https://github.com/AuthenticaSA/Plug-and-Play-Auth

## ما تؤكده الوثائق

عنوان الخدمة الأساسي هو `https://api.authentica.sa`، وتستخدم طلبات API الترويسة `X-Authorization` مع `Accept: application/json` و`Content-Type: application/json`.

إرسال OTP يتم عبر `POST /api/v2/send-otp` مع جسم JSON مثل `{ "method": "sms", "phone": "+9665XXXXXXXX" }`. التحقق يتم عبر `POST /api/v2/verify-otp` مع `{ "phone": "+9665XXXXXXXX", "otp": "123456" }`. أرقام الهواتف يجب أن تكون بصيغة E.164.

## تطبيق المشروع

سجّل الخادم المسارين `/api/otp/send` و`/api/otp/verify`، ويحوّلان أرقام السعودية إلى E.164، ويمنعان الطلبات غير الصحيحة، ويطبقان حدّاً ابتدائياً للطلبات، ولا يطبعان مفاتيح أو رموز OTP في السجل. عند غياب `AUTHENTICA_API_KEY` أو فشل Authentica يعاد خطأ صريح، ولا يوجد fallback يعلن نجاحاً صورياً.

بعد نجاح التحقق الخارجي، يجب حفظ العميل الموثق في قاعدة البيانات عبر `upsertVerifiedCustomer` قبل إعادة `verified: true` إلى الواجهة. إذا تعذر الحفظ، لا يعاد نجاح تسجيل الدخول.

تظل أسرار Authentica في بيئة التشغيل (`AUTHENTICA_API_KEY`، مع دعم اختياري لـ`AUTHENTICA_API_URL` و`AUTHENTICA_TEMPLATE_ID`) ولا تحفظ في المصدر.
