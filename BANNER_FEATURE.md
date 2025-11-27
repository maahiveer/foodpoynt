# Banner Feature Setup

## Overview
The article banner feature allows you to display vertical banners (9:16 aspect ratio) on the left and right sides of your articles. These banners can contain HTML code (like affiliate ads, images with links, etc.).

## Database Migration

Run this SQL in your Supabase SQL Editor to add the banner columns:

```sql
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS left_banner TEXT,
ADD COLUMN IF NOT EXISTS right_banner TEXT;
```

Or use the migration file at: `migrations/add_banners.sql`

## How to Add Banners

1. Go to the admin panel: `/admin/articles`
2. Create a new article or edit an existing one
3. Scroll to the "Left Banner" and "Right Banner" fields
4. Enter your HTML code or image with link

### Example Banner Code

**Simple Image with Link:**
```html
<a href="https://example.com" target="_blank" rel="noopener">
  <img src="https://example.com/banner.jpg" alt="Advertisement" style="width:100%; height:100%; object-fit:cover;" />
</a>
```

**Affiliate Ad Script:**
```html
<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXX"
     data-ad-slot="XXXXXXX"
     data-ad-format="vertical"></ins>
<script>
(adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## Banner Display

- **Aspect Ratio:** 9:16 (vertical banners)
- **Width:** 256px (w-64 in Tailwind)
- **Visibility:** Hidden on screens smaller than XL (1280px+)
- **Position:** Sticky, stays visible while scrolling
- **Styling:** Rounded corners with shadow

## Notes

- Banners only show when content is added
- Both banners are optional
- Recommended image size: 360x640px or 720x1280px (9:16 ratio)
- Banners are hidden on mobile/tablet for better readability
