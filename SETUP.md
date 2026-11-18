# إعداد المشروع — خطوة بخطوة

المشروع ده لوحة إدارة لتقييمات عقارية (Next.js + Supabase). الفورم بيحفظ البيانات في عمود `jsonb` **بنفس شكل الـ JSON** المطلوب.

---

## 1) المتطلبات

- Node.js 20 أو أحدث (عندك 26 ✅)
- حساب على [supabase.com](https://supabase.com) (مجاني)

---

## 2) اعمل مشروع Supabase

1. افتح [supabase.com/dashboard](https://supabase.com/dashboard) واضغط **New project**.
2. اختار اسم، وباسورد للداتابيز (احفظه)، وأقرب **Region** ليك.
3. استنى دقيقة لحد ما المشروع يجهز.

### هات المفاتيح

روح **Settings → API Keys** وانسخ:

| الاسم | مكانه |
|---|---|
| `Project URL` | فوق خالص |
| `Publishable key` (`sb_publishable_...`) | في API Keys |

> لو عندك `anon key` القديم (`eyJ...`) بدل الـ publishable key، ينفع بردو — بس غيّر اسم المتغير لـ `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 3) شغّل الـ SQL

**SQL Editor → New query** → الصق الكود ده → **Run**:

```sql
-- جدول التقييمات: كل سجل = فورم كامل في jsonb
create table public.submissions (
  id          uuid primary key default gen_random_uuid(),
  folder_name text not null,
  data        jsonb not null,
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- منع تكرار نفس اسم الفولدر (بدون حساسية لحالة الحروف)
create unique index submissions_folder_name_key on public.submissions (lower(folder_name));

-- للترتيب والبحث
create index submissions_created_at_idx on public.submissions (created_at desc);

-- تأمين الجدول: بس المسجلين يدخلوا
alter table public.submissions enable row level security;

create policy "admin read"   on public.submissions for select to authenticated using (true);
create policy "admin insert" on public.submissions for insert to authenticated with check (true);
create policy "admin update" on public.submissions for update to authenticated using (true) with check (true);
create policy "admin delete" on public.submissions for delete to authenticated using (true);

-- تحديث تاريخ التعديل أوتوماتيك
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger submissions_touch
before update on public.submissions
for each row execute function public.touch_updated_at();
```

---

## 4) ظبط تسجيل الدخول

1. **Authentication → Providers → Email** ← اتأكد إنه **Enabled**.
2. **اقفل "Confirm email"** (أسهل للتجربة):
   `Authentication → Providers → Email → Confirm email` ← Off
3. اعمل يوزر الأدمن:
   **Authentication → Users → Add user → Create new user**
   - Email: الإيميل اللي هتدخل بيه
   - Password: كلمة السر
   - ✅ Auto Confirm User

---

## 5) ملف البيئة

في فولدر المشروع اعمل ملف اسمه `.env.local` (مش `.env.local.example`) وحط فيه:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_IDLE_MINUTES=2
```

> `.env.local` مستثنى من Git — مفاتيحك مش هتترفع.

---

## 6) شغّل الموقع

```bash
npm install
npm run dev
```

افتح: **http://localhost:3000**

هيوديك على صفحة اللوجين → ادخل بالإيميل والباسورد اللي عملتهم في خطوة 4.

---

## إزاي بيتحفظ في الداتابيز؟

كل سجل بيتحفظ كده:

| العمود | المحتوى |
|---|---|
| `id` | UUID تلقائي |
| `folder_name` | اسم الفولدر (للعمود + البحث + منع التكرار) |
| `data` | **الفورم كامل** بنفس الشكل اللي طلبته (بما فيه `folder_name`) |
| `created_by` | ID اليوزر اللي حفظ |
| `created_at` | وقت الحفظ |

زي ما قلت: `folder_name` موجود في عمود لوحده **وكمان** جوه `data` — عشان لما تصدّر الـ JSON يطلع مطابق للأصل 100%.

---

## تعديلات سريعة

### مدة الجلسة
في `.env.local`:
```env
NEXT_PUBLIC_IDLE_MINUTES=5
```
بعد كده أعد تشغيل السيرفر. (الافتراضي دقيقتين)

### القوايم (نوع الأصل، الغرض من التقييم...)
كلها في ملف واحد: `src/lib/form-config.ts` و `src/lib/options.ts`.
زوّد/امسح أي قيمة والتغيير هيظهر على طول.

### إضافة/ترتيب حقل
افتح `src/lib/form-config.ts` → ضيف في `fields` بتاع القسم اللي عايزه:
```ts
{ key: "new_field", label: "اسم الحقل", type: "text" }
```
بعدين ضيف نفس المفتاح في `src/lib/schema.ts` (في الـ Zod schema **و** في `makeEmptySubmission`) وشكرًا.

> ⚠️ مهم: لو ضفت حقل في الفورم ومش ضفته في `schema.ts`، مش هيتحفظ.

---

## النشر على Vercel (اختياري)

1. ارفع المشروع على GitHub.
2. Vercel → **New Project** → اختار الريبو.
3. **Environment Variables**: ضيف نفس الـ 3 متغيرات.
4. Deploy.

> ملاحظة: مفاتيح `NEXT_PUBLIC_*` بتتقرأ وقت الـ build، فلو غيّرتها بعد النشر لازم تعمل **Redeploy**.

---

## مشاكل شائعة

| المشكلة | الحل |
|---|---|
| "Supabase مش متظبط" | `.env.local` مش موجود أو لسه ما عملتش restart للسيرفر |
| "الإيميل أو كلمة السر غلط" | اتأكد من اليوزر في Authentication → Users |
| "الإيميل لسه مش متأكد" | فعّل Auto Confirm أو اقفل Confirm email |
| "اسم الفولدر مستخدم بالفعل" | غيّر اسم الفولدر — لازم يكون فريد |
| الأدمن بيسجّل خروج كل شوية | ده سلوك مقصود (idle timeout) — زوّد `NEXT_PUBLIC_IDLE_MINUTES` |
