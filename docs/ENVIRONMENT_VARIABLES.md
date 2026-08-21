# 🔑 متغيرات البيئة — Delta Stars

## قائمة جميع المتغيرات المطلوبة

### 🗄️ قاعدة البيانات:
| المتغير | الوظيفة | مطلوب |
|---------|---------|-------|
| `DATABASE_URL` | رابط قاعدة البيانات (MySQL/TiDB) | اختياري |
| `SUPABASE_URL` | رابط مشروع Supabase | اختياري |
| `SUPABASE_ANON_KEY` | مفتاح Supabase العام | اختياري |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح Supabase للخادم | اختياري |

### 🔐 المصادقة:
| المتغير | الوظيفة | مطلوب |
|---------|---------|-------|
| `VITE_SUPABASE_URL` | رابط Supabase للواجهة | اختياري |
| `VITE_SUPABASE_ANON_KEY` | مفتاح Supabase العام للواجهة | اختياري |
| `VITE_ADMIN_BOOTSTRAP_PASSWORD` | كلمة مرور الإدارة الأولية | مطلوب |
| `VITE_DEV_BOOTSTRAP_PASSWORD` | كلمة مرور المطور الأولية | مطلوب |
| `JWT_SECRET` | سر JWT tokens | اختياري |
| `FIREBASE_API_KEY` | مفتاح Firebase | اختياري |

### 💳 الدفع:
| المتغير | الوظيفة | مطلوب |
|---------|---------|-------|
| `MOYASAR_SECRET_KEY` | مفتاح Moyasar | اختياري |
| `AUTHENTICA_API_KEY` | مفتاح Authentica (SMS) | اختياري |
| `AUTHENTICA_API_URL` | رابط Authentica | اختياري |

### 🤖 الذكاء الاصطناعي:
| المتغير | الوظيفة | مطلوب |
|---------|---------|-------|
| `GOOGLE_AI_API_KEY` | مفتاح Google Gemini | اختياري |

### 🗺️ الخرائط:
| المتغير | الوظيفة | مطلوب |
|---------|---------|-------|
| `VITE_GOOGLE_MAPS_API_KEY` | مفتاح Google Maps | اختياري |

### 📧 البريد:
| المتغير | الوظيفة | مطلوب |
|---------|---------|-------|
| `SMTP_HOST` | خادم البريد | اختياري |
| `SMTP_USER` | مستخدم البريد | اختياري |
| `SMTP_PASS` | كلمة مرور البريد | اختياري |

### 📱 التطبيق:
| المتغير | الوظيفة | مطلوب |
|---------|---------|-------|
| `VITE_SUPABASE_PRODUCT_IMAGES_BUCKET` | اسم حاوية الصور | اختياري |

---

## كيفية الإضافة في Freebuff:

1. افتح **Settings → Environment** (أو Keys/API keys)
2. اضغط **Add Key** أو **Add Variable**
3. أضف كل متغير بالاسم والقيمة
4. اضغط **Save**

> ⚠️ **مهم:** لا تحفظ المفاتيح في الكود المصدري — استخدم Environment فقط!

---

## الترتيب الأولي:

### الحد الأدنى للتشغيل:
```
VITE_ADMIN_BOOTSTRAP_PASSWORD = your_password_here
VITE_DEV_BOOTSTRAP_PASSWORD = your_password_here
```

### للتشغيل الكامل:
```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
VITE_ADMIN_BOOTSTRAP_PASSWORD = admin_pass
VITE_DEV_BOOTSTRAP_PASSWORD = dev_pass
AUTHENTICA_API_KEY = your-sms-key
GOOGLE_AI_API_KEY = your-ai-key
```
