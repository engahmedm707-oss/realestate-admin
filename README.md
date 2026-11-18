# لوحة إدارة التقييمات العقارية

نظام بسيط لإدخال تقارير التقييم العقاري وحفظها في Supabase.

- **Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Supabase (Postgres + Auth)
- **صفحة واحدة للأدمن** فيها فورم كبير + جدول سجلات + عرض/تصدير JSON
- **الجلسة:** تتقفل تلقائيًا بعد دقيقتين خمول (قابلة للتعديل)

## التشغيل السريع

```bash
npm install
```

1. اعمل مشروع Supabase (الخطوات كاملة في **[SETUP.md](./SETUP.md)**).
2. انسخ `.env.local.example` لـ `.env.local` وحط الـ URL والـ anon key.
3. شغّل:

```bash
npm run dev
```

افتح http://localhost:3000 وسجّل دخول باليوزر اللي عملته في Supabase.

## الملفات المهمة

| الملف | وظيفته |
|---|---|
| `SETUP.md` | إعداد Supabase والـ SQL خطوة بخطوة |
| `src/lib/schema.ts` | شكل البيانات (Zod) — أي حقل جديد لازم يتضاف هنا |
| `src/lib/form-config.ts` | ترتيب وتسمية الحقول في الفورم |
| `src/lib/options.ts` | قوايم الـ Select |
| `src/app/api/submissions/route.ts` | استقبال وحفظ الفورم |
| `src/proxy.ts` | حماية المسارات + فحص الخمول |
| `src/components/submission-form.tsx` | الفورم نفسه |

## طريقة التخزين

كل سجل بيتحفظ في جدول `submissions`:

- `folder_name` — اسم الفولدر (عمود مستقل للبحث ومنع التكرار)
- `data` — الفورم كامل كـ JSON (بنفس الشكل المطلوب، وفيه `folder_name` كمان)
- `created_by` / `created_at` / `updated_at`
