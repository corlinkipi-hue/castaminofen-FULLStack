# Content Experience Audit + Content Architecture Roadmap

## Executive Summary

این سند بر اساس بررسی مستقیم کد، API، UI، مستندات و فایل‌های مرتبط در این مخزن تهیه شده است. هدف آن ثبت وضعیت فعلی سیستم محتوا و ارائه یک نقشه معماری برای پلتفرم خلاقانه‌ای است که در آینده بتواند انواع مختلف محتوا را منتشر و نمایش دهد.

### نتیجهٔ اصلی

سیستم فعلی در سطح فعلی تنها یک مدل ساده و محدود از محتوا را پشتیبانی می‌کند:
- یک Content دارد
- Content چند Episode دارد
- Episode یک فایل اصلی رسانه دارد
- UI برای نمایش و پخش این مدل طراحی شده است

این ساختار برای Podcast و Video Episode کافی است، اما برای محصولی که در آینده باید Podcast، VideoCast، Hybrid Channel، Educational Channel، Book Publisher، Course، Ebook، PDF، Image Gallery و موارد مشابه را پشتیبانی کند، هنوز کافی نیست.

### جمع‌بندی کوتاه

- وضعیت فعلی: قابل‌استفاده برای تجربهٔ سادهٔ پادکست/ویدیو/کتاب صوتی
- محدودیت اصلی: نبود لایهٔ Publication و Media Asset به‌صورت جداگانه
- بزرگ‌ترین شکاف معماری: مدل فعلی بر اساس ContentType طراحی شده، نه بر اساس Channel + Publication + Media Asset

---

## Current Architecture

### مدل فعلی که از کد قابل مشاهده است

بر اساس کدهای موجود در مخزن، ساختار فعلی به‌صورت زیر است:

- CreatorProfile مالک محتواست
- Content یک محفظهٔ اصلی برای یک مجموعهٔ منتشرشده است
- Episode یک آیتم فرزند درون Content است
- Episode یک فایل رسانه اصلی دارد
- Content یک کاور دارد
- Content می‌تواند Premium باشد
- پخش و استریم بر اساس Episode انجام می‌شود

### مؤلفه‌های اصلی در کد

- Backend content service: [services/api-gateway/src/modules/content/content.service.ts](services/api-gateway/src/modules/content/content.service.ts)
- Backend content controller: [services/api-gateway/src/modules/content/content.controller.ts](services/api-gateway/src/modules/content/content.controller.ts)
- Media service: [services/api-gateway/src/modules/media/media.service.ts](services/api-gateway/src/modules/media/media.service.ts)
- Web content detail: [apps/web/src/app/(main)/content/[id]/page.tsx](apps/web/src/app/(main)/content/[id]/page.tsx)
- Mobile content detail: [apps/mobile/app/content/[id].tsx](apps/mobile/app/content/[id].tsx)
- Search experience: [apps/web/src/app/(main)/search/SearchClient.tsx](apps/web/src/app/(main)/search/SearchClient.tsx)

### نکتهٔ مهم

در این مخزن فایل Prisma schema و seed file فعلاً در مسیرهای مورد اشاره (مثلاً packages/database/prisma/schema.prisma) وجود ندارند. بنابراین بخش‌های مربوط به schema و seed بر اساس کد و مستندات موجود مستندسازی شده‌اند، نه بر اساس یک فایل schema‌ی در دسترس.

---

## Content Taxonomy

### Taxonomy فعلی که در کد مشاهده می‌شود

نوع‌های فعلی که در UI و DTOها دیده می‌شوند:
- PODCAST
- AUDIOBOOK
- VIDEO

### فیلدهای اصلی که در UI و API استفاده می‌شوند

- title
- description
- coverUrl
- isPremium
- episodeCount
- type
- creator
- episodes

### فیلدهای مربوط به پخش و رسانه

- duration
- mediaUrl
- mediaKey
- isVideo

### محدودیت‌های Taxonomy فعلی

Taxonomy فعلی برای این محصول خیلی محدود است. موارد زیر در حال حاضر در کد قابل مشاهده نیست:
- Channel
- Season
- Category
- Tag
- PDF
- Ebook
- Image Gallery
- Course
- Attachment Pack
- Live Recording

---

## Channel Taxonomy

### وضعیت فعلی

در کد فعلی، مفهومی به‌صورت روشن به نام Channel مشاهده نمی‌شود. جایگزین فعلی، مفهوم CreatorProfile و Content است.

### نتیجه

مدل فعلی بیشتر به این شکل است:
- یک Creator دارد
- Creator چند Content دارد
- هر Content چند Episode دارد

اما این مدل برای ساختار محصولی که قرار است چند Channel و چند نوع publication را پشتیبانی کند، هنوز کامل نیست.

### Channel Taxonomy پیشنهادی (بدون اعمال)

- Podcast Channel
- VideoCast Channel
- Hybrid Channel
- Educational Channel
- Book Publisher
- Media Creator

---

## Publication Model

### مدل فعلی

مدل فعلی را می‌توان این‌گونه خلاصه کرد:

Content
  ↓
Episode

این مدل برای یک پادکست یا سریال ساده مناسب است، اما برای محصول آینده محدود است.

### مدل پیشنهادی برای آینده

Publication باید واحد اصلی انتشار باشد، نه صرفاً Content.

مثال‌ها:
- Podcast Episode
- Video Episode
- Season
- Audiobook
- Ebook
- PDF Document
- Course
- Image Gallery
- Live Recording

### تحلیل معماری

برای آینده، بهتر است مدل به‌صورت سه لایه طراحی شود:

Channel
  ↓
Publication
  ↓
Media Asset

این مدل انعطاف بیشتری نسبت به مدل فعلی ارائه می‌دهد، چون هر Publication می‌تواند چند Asset داشته باشد.

مثال:
- یک Video Episode
  - Video Asset
  - Thumbnail Asset
  - Subtitle Asset
  - Audio Asset (اگر نسخه صوتی هم وجود داشته باشد)

مثال:
- یک Book
  - PDF Asset
  - Cover Asset
  - Image Asset
  - Attachment Asset

---

## Media Asset Model

### وضعیت فعلی

مدل فعلی رسانه بسیار ساده است:
- Episode → mediaUrl
- Episode → duration
- Content → coverUrl

### Missing Asset Types

در کد فعلی هیچ مدل جداگانه‌ای برای Asset دیده نمی‌شود. موارد زیر در حال حاضر پشتیبانی نمی‌شوند:
- PDF Asset
- Image Asset
- Subtitle Asset
- Thumbnail Asset
- Attachment Asset
- Cover Asset (به‌صورت جداگانه و چندتایی)
- Poster Asset
- Transcript Asset
- Chapter Metadata

### نتیجه

برای پلتفرم آینده، باید یک مدل Asset-first در نظر گرفته شود که به‌جای محدود کردن هر publication به یک رسانهٔ اصلی، امکان چند رسانه را برای یک publication فراهم کند.

---

## Schema Changes (پیشنهادی)

این بخش فقط پیشنهادی است و در این مرحله هیچ تغییری در schema اعمال نشده است.

### پیشنهاد معماری

1. Channel
   - id
   - ownerId
   - type
   - title
   - slug
   - description
   - status
   - visibility

2. Publication
   - id
   - channelId
   - type
   - title
   - subtitle
   - description
   - status
   - visibility
   - isPremium
   - releaseDate
   - language
   - duration
   - coverUrl
   - posterUrl
   - thumbnailUrl

3. MediaAsset
   - id
   - publicationId
   - type
   - mimeType
   - url
   - fileSize
   - width
   - height
   - duration
   - language
   - isDefault
   - isDownloadable

4. PublicationMetadata
   - author
   - narrator
   - publisher
   - pages
   - bitrate
   - transcript
   - captions
   - chapters

### پیشنهاد مهم معماری

با توجه به چشم‌انداز محصول، بهتر است از تمرکز روی یک ContentType ساده فاصله گرفته شود. مدل زیر برای آینده بسیار منعطف‌تر است:

Channel Type → Publication Type → Media Asset Type

در این مدل، یک publication می‌تواند چند Asset داشته باشد؛ برای مثال:
- یک ویدیو
- نسخهٔ صوتی
- زیرنویس
- PDF خلاصه
- تصاویر ضمیمه

این ساختار هم نیازهای فعلی و هم توسعه‌های آینده را بدون انفجار تعداد ContentTypeها پوشش می‌دهد.

---

## API Changes

### APIهای فعلی

- /trending
- /explore
- /search
- /contents/:id
- /contents/:id/related
- /episodes/:id
- /creator/contents
- /creator/contents/:id/episodes
- /creator/contents/:id/publish

### فیلترهای فعلی

در DTOها فقط نوع محتوا به‌صورت محدود قابل فیلتر است:
- PODCAST
- AUDIOBOOK
- VIDEO

### فیلترهای وجود ندارد

- Duration
- Premium
- Language
- Category
- Creator
- Season
- Series
- Media Type
- Publication Type
- Asset Type

### نتیجه

API فعلی برای یک پلتفرم چندفرمت مناسب نیست و باید برای taxonomy جدید توسعه یابد.

---

## Explore Experience

### وضعیت فعلی

صفحهٔ Explore در وب و موبایل به‌صورت ساده‌ای لیست محتوا را نمایش می‌دهد.

### تجربهٔ فعلی شامل این‌هاست

- لیست محتوا
- ادامهٔ گوش دادن
- Trending
- Related content

### محدودیت‌ها

- کارت‌های محتوا برای همهٔ انواع یکسان‌اند
- هیچ تفاوتی برای Book / PDF / Course / Gallery دیده نمی‌شود
- هیچ badgeٔ اختصاصی برای publication type وجود ندارد
- هیچ cover ratio یا layout اختصاصی برای انواع مختلف وجود ندارد

---

## Search Experience

### وضعیت فعلی

Search بر اساس متن روی Content، Episode و Creator انجام می‌شود.

### محدودیت‌ها

- جست‌وجو فقط روی مدل فعلی کار می‌کند
- فیلترهای محدود است
- برای PDF و Gallery و Course و Book هنوز لایهٔ جست‌وجوی تخصصی وجود ندارد

---

## Channel Experience

### وضعیت فعلی

هیچ صفحهٔ Channel مستقل در UI دیده نمی‌شود.

### نتیجه

بخش‌های زیر فعلاً وجود ندارند:
- Channel landing page
- Channel branding
- Channel-level content organization
- Channel type-specific experience

---

## Content Detail Experience

### وضعیت فعلی

صفحهٔ Content Detail شامل این موارد است:
- عنوان
- سازنده
- توضیحات
- لیست Episode
- Related Content
- Follow / Library / Premium

### محدودیت‌ها

- فرض می‌کند هر content یک مجموعه از Episode است
- برای Book، PDF، Course، Gallery و موارد مشابه مناسب نیست
- امکان نمایش چند asset به‌صورت هم‌زمان وجود ندارد

---

## Multi-format Content Cards

### وضعیت فعلی

کارت‌های فعلی تنها بر اساس cover + title + creator + episodeCount ساخته شده‌اند.

### پیش‌نیاز برای آینده

برای هر publication type باید یک variant کارت وجود داشته باشد:
- Audio Episode
- Video Episode
- Audiobook
- Ebook
- PDF Document
- Course
- Image Gallery
- Single Image
- Live Recording
- Attachment Pack

### عناصر پیشنهادی برای کارت

- Badge نوع publication
- Badge Premium / Free
- Cover یا Thumbnail
- Metadata کوتاه
- CTA متفاوت بر اساس نوع

---

## Player Strategy

### وضعیت فعلی

Player فعلی برای Audio و Video طراحی شده است.

### محدودیت‌ها

- PDF Reader وجود ندارد
- Image Viewer وجود ندارد
- تجربهٔ چندasset وجود ندارد
- هیچ استراتژی یکپارچه برای نمایش انواع مختلف محتوا در یک experience واحد وجود ندارد

### پیشنهاد کلی

برای آینده، Player باید بر اساس نوع publication یا asset تصمیم بگیرد:
- Audio player برای Audio و Audiobook
- Video player برای Video و Short Video
- PDF reader برای PDF و Ebook
- Image viewer برای Gallery و Single Image
- Attachment hub برای فایل‌های ضمیمه

---

## Audio Player

### وضعیت فعلی

پخش صوتی برای Episode فعلاً پشتیبانی می‌شود.

### شکاف‌ها

- Chapter navigation وجود ندارد
- Transcript viewer وجود ندارد
- Narrator / author metadata به‌صورت تخصصی نمایش داده نمی‌شود
- تجربهٔ کتاب صوتی از پادکست متمایز نیست

---

## Video Player

### وضعیت فعلی

یک player ساده برای ویدیو وجود دارد.

### شکاف‌ها

- Transcript / captions به‌صورت rich نمایش داده نمی‌شود
- Experience برای Short Video و Live Recording متمایز نیست
- امکان ارائهٔ چند asset برای یک publication وجود ندارد

---

## PDF Reader

### وضعیت فعلی

در مخزن هیچ Evidence‌ای از PDF Reader یا PDF Viewer وجود ندارد.

### نتیجه

PDF Document و Ebook فعلاً در معماری فعلی جای ندارند.

---

## Image Viewer

### وضعیت فعلی

در مخزن هیچ Viewer یا route‌ای برای Image Gallery یا Single Image وجود ندارد.

### نتیجه

نمایش تصویر و گالری در ساختار فعلی پشتیبانی نمی‌شود.

---

## Design System

### وضعیت فعلی

Design system فعلی شامل tokenها و سبک‌های پایه است، اما برای انواع مختلف media هنوز تخصصی نیست.

### شکاف‌های مهم

- برای Audio / Video / PDF / Image / Book / Premium / Live / Series / Season رنگ یا badge اختصاصی وجود ندارد
- Card variant برای انواع مختلف وجود ندارد
- Cover ratio و thumbnail pattern برای publication type‌ها تعریف نشده‌اند
- Icon و badge برای asset typeها متمرکز نیست

### پیشنهاد ساختار Design System

برای هر Publication Type و Media Asset Type باید این موارد تعریف شود:
- Color
- Badge
- Icon
- Cover ratio
- Thumbnail style
- Card variant
- Interaction pattern

---

## Seed Strategy

### وضعیت فعلی

در این مخزن فایل seed فعلی در دسترس نیست، بنابراین کیفیت داده‌های نمونه در این مرحله قابل‌تأیید نیست.

### پیشنهاد

برای هر نوع publication حداقل 8 تا 12 sample data واقعی و فارسی با تنوع Free/Premium و metadata کامل تولید شود.

### نمونه‌های مورد نیاز

- Podcast Episode
- Video Episode
- Audiobook
- Ebook
- PDF Document
- Course
- Image Gallery
- Single Image
- Live Recording
- Attachment Pack

---

## Implementation Phases

### Phase 0 — Product Decisions and Taxonomy Lock
- Priority: High
- Effort: Low
- Dependency: تصمیم Product
- Risk: Medium

#### گام‌های مرحله
1. تصمیم‌گیری دربارهٔ Channel Type پایه
2. تصمیم‌گیری دربارهٔ Publication Type پایه
3. تصمیم‌گیری دربارهٔ Asset Type پایه
4. تعیین اینکه آیا در نسخهٔ اول PDF و Image Gallery جزو MVP هستند یا نه
5. تعیین اینکه Premium در سطح Publication یا Asset اعمال می‌شود

#### خروجی مرحله
- یک taxonomy نهایی و قابل‌فهم برای Product و Engineering
- لیست enums و مدل‌های پایهٔ مورد تأیید
- تعریف MVP و vNext

#### معیار پذیرش
- همهٔ تیم‌ها یک تعریف مشترک از Channel / Publication / Asset داشته باشند
- حداقل یک مدل برای Audio/Video و حداقل یک مدل برای Book/PDF/Image در مستندات مشخص شده باشد

---

### Phase 1 — Foundation and Data Model Definition
- Priority: High
- Effort: Medium
- Dependency: Phase 0
- Risk: Medium

#### گام‌های مرحله
1. تعریف مدل‌های پایۀ دیتابیس برای Channel, Publication, MediaAsset
2. تعریف enum‌های مربوط به نوع publication و نوع asset
3. تعریف فیلدهای metadata مشترک برای همهٔ publicationها
4. تعریف status و visibility برای publication و asset
5. تعریف rules برای premium, downloadable, releaseDate و language

#### خروجی مرحله
- schema draft
- مدل‌های API draft
- مستندات data contract

#### معیار پذیرش
- یک publication می‌تواند metadata‌ی مشترک داشته باشد
- یک publication می‌تواند چند asset داشته باشد
- همهٔ attribute‌های اصلی برای Audio/Video/Book/PDF/Image قابل تعریف باشند

---

### Phase 2 — Backend Backbone for Publication + Asset
- Priority: High
- Effort: High
- Dependency: Phase 1
- Risk: High

#### گام‌های مرحله
1. اضافه‌کردن endpointهای Channel CRUD
2. اضافه‌کردن endpointهای Publication CRUD
3. اضافه‌کردن endpointهای MediaAsset CRUD
4. پشتیبانی از چند Asset برای یک Publication
5. اصلاح Explore/Search برای استفاده از Publication و Asset
6. اضافه‌کردن فیلترهای جدید: type, media type, premium, language, creator, season

#### خروجی مرحله
- backend برای publication و asset
- API برای create/update/publish/list/show
- support برای چند فایل در یک publication

#### معیار پذیرش
- یک publication می‌تواند هم‌زمان چند asset داشته باشد
- API برای Audio/Video/PDF/Image قابل استفاده باشد
- Search و Explore بر اساس publication type و media type جواب بدهند

---

### Phase 3 — Content Experience Layer
- Priority: High
- Effort: High
- Dependency: Phase 2
- Risk: High

#### گام‌های مرحله
1. بازطراحی صفحهٔ Content Detail برای نمایش publication‌های چندفرمت
2. ایجاد صفحهٔ Channel Detail
3. ایجاد صفحهٔ Publication Detail با CTA‌های متفاوت بر اساس نوع
4. اضافه‌کردن experience برای Season و Series
5. اضافه‌کردن experience برای Book/PDF/Image Gallery
6. اصلاح کارت‌های محتوا برای variant‌های مختلف

#### خروجی مرحله
- experience‌ی جدید برای publicationها
- تجربهٔ متفاوت برای audio/video/book/pdf/image
- جریان discovery بهتر برای چند نوع publication

#### معیار پذیرش
- کاربر بتواند publicationی را باز کند و assetهای مربوط را ببیند
- برای هر نوع publication، UI مناسب و متفاوت ارائه شود
- کاربر بتواند از یک publication به asset مرتبط دسترسی پیدا کند

---

### Phase 4 — Player and Viewer Strategy
- Priority: High
- Effort: High
- Dependency: Phase 3
- Risk: High

#### گام‌های مرحله
1. ایجاد strategy برای Audio Player
2. ایجاد strategy برای Video Player
3. ایجاد PDF Reader برای PDF و Ebook
4. ایجاد Image Viewer برای Single Image و Gallery
5. ایجاد Attachment Hub برای فایل‌های ضمیمه
6. تعریف experience برای Live Recording و Short Video

#### خروجی مرحله
- viewerهای اختصاصی برای هر نوع asset
- تجربهٔ پخش و خواندن چندفرمت

#### معیار پذیرش
- کاربر بتواند Audio/Video/PDF/Image را بدون ورود به flow‌های متفاوت مشاهده کند
- برای هر نوع asset، viewer مناسب وجود داشته باشد

---

### Phase 5 — Design System Expansion
- Priority: Medium
- Effort: Medium
- Dependency: Phase 3
- Risk: Medium

#### گام‌های مرحله
1. تعریف color system برای هر publication type و asset type
2. تعریف badge و icon برای Audio/Video/PDF/Image/Book/Premium/Live/Series/Season
3. تعریف cover ratio و thumbnail rules
4. طراحی card variants برای publicationها
5. تعریف interaction patterns برای play/read/view/download

#### خروجی مرحله
- design system چندفرمت
- token و component rules برای انواع محتوا

#### معیار پذیرش
- در UI، هر نوع publication به‌صورت بصری متمایز باشد
- کاربر بتواند بدون توضیح، type محتوا را تشخیص دهد

---

### Phase 6 — Seed Data and Editorial Samples
- Priority: Medium
- Effort: Low
- Dependency: Phase 3
- Risk: Low

#### گام‌های مرحله
1. ایجاد dataset نمونه برای هر publication type
2. ساخت داده‌های فارسی و واقعی با تنوع Free/Premium
3. تکمیل metadata برای هر sample
4. پر کردن state‌های loading/empty/error با دادهٔ واقعی
5. فراهم‌کردن نمونه برای demos و QA

#### خروجی مرحله
- seed content برای توسعه و تست
- نمونه‌های واقعی برای تجربهٔ کاربری

#### معیار پذیرش
- حداقل 8 تا 12 نمونه برای هر publication type وجود داشته باشد
- داده‌ها برای UI، search و explore کافی باشند

---

### Phase 7 — Rollout and Validation
- Priority: Medium
- Effort: Medium
- Dependency: Phase 4, Phase 5, Phase 6
- Risk: Medium

#### گام‌های مرحله
1. تست تجربه در web و mobile
2. تست flow‌های creator و publisher
3. ارزیابی UX برای publicationهای جدید
4. جمع‌آوری بازخورد و تنظیم taxonomy
5. آماده‌سازی برای rollout مرحله‌ای

#### خروجی مرحله
- نسخهٔ آزمایشی برای یک زیرمجموعه از publication types
- فهرست issues و بهبودهای بعدی

#### معیار پذیرش
- حداقل یک flow end-to-end برای Audio/Video و یک flow برای Book/PDF/Image موفق عمل کند

---

## Final Checklist

- [x] وضعیت فعلی UI و API بررسی شد
- [x] مدل فعلی Content → Episode تأیید شد
- [x] شکاف‌های PDF / Image / Gallery / Channel / Season شناسایی شدند
- [x] محدودیت‌های API و UX برای پلتفرم چندفرمت روشن شد
- [x] معماری پیشنهادی Channel → Publication → Media Asset مستندسازی شد

---

## Open Questions

- آیا Channel باید به‌عنوان entity اصلی در نسخهٔ بعدی اضافه شود؟
- آیا Publication باید واحد اصلی انتشار باشد یا Content هنوز به‌عنوان container باقی بماند؟
- در نسخهٔ اولیه، آیا PDF و Image Gallery باید همراه با Audio/Video ارائه شوند؟
- آیا Season باید قبل از Course و Ebook پیاده‌سازی شود؟
- آیا Premium باید در سطح Publication، Asset یا هر دو اعمال شود؟
- آیا برای نسخهٔ اول باید فقط یک taxonomy ساده و محدود انتخاب شود یا یک معماری آینده‌نگر اما پیچیده‌تر؟

---

## Recommended Direction

برای آیندۀ این محصول، تمرکز بر روی یک ContentType ساده کافی نیست. مدل مناسب‌تر برای این پلتفرم این است که از سه لایهٔ زیر استفاده شود:

- Channel Type
- Publication Type
- Media Asset Type

این مدل باعث می‌شود یک publication بتواند چند asset داشته باشد و پلتفرم در آینده بدون نیاز به افزودن بی‌نهایت ContentType، انواع مختلف محتوا را پشتیبانی کند.
