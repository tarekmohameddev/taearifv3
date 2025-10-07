# Trash Folder

هذا المجلد يحتوي على الملفات التي تم حذفها لحل مشكلة `clientModules` في Vercel.

## الملفات المحذوفة:

### `pages/page.js`

- كان يتضارب مع `app/page.tsx` في Next.js App Router
- تم حذفه لحل خطأ "Cannot read properties of undefined (reading 'clientModules')"

### `pages/_app.js`

- غير مطلوب في App Router
- تم حذفه لتجنب التضارب مع App Router

## السبب:

في Next.js 13+ مع App Router، لا يمكن استخدام Pages Router و App Router معاً في نفس المشروع. هذا التضارب يسبب خطأ `clientModules` عند البناء على Vercel.

## الحل:

- استخدام App Router فقط (`app/` directory)
- الاحتفاظ بـ API routes في `pages/api/` فقط
- حذف ملفات Pages Router المتضاربة

## تاريخ الحذف:

تم حذف هذه الملفات في: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
