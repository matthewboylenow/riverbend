# 11 — Image Migration & Blob Storage

## Overview
Migrate all images from `cdn.campriverbend.com` to Vercel Blob. Set up the `/assets/*` rewrite so all public-facing URLs are on the campriverbend.com domain. Also set up the client-side upload flow for admin image management.

## Step 1: Crawl & Download All Images

Write a Node.js script (`scripts/migrate-images.ts`) that:

1. **Fetches each page** from the existing site (all 25 content pages + 24 product pages)
2. **Extracts all image URLs** matching `cdn.campriverbend.com`
3. **Deduplicates** the list
4. **Downloads each image** to a local `./tmp/images/` directory
5. **Logs a manifest** mapping old URL → local filename

### Known Image Sources

**Logos & Branding:**
```
https://cdn.campriverbend.com/wp-content/uploads/2018/07/15190010/Camp-Riverbend-Logo-white-1.png
https://cdn.campriverbend.com/wp-content/uploads/2018/07/15190012/ACA-logo-white.png
```

**Homepage Images:**
```
https://cdn.campriverbend.com/wp-content/uploads/2019/04/15185957/Fallback-Image-300x175.jpeg
https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185925/ADV06620.jpg-marketing-scaled.jpg
https://cdn.campriverbend.com/wp-content/uploads/2019/04/15185958/Canoe-768x512.jpg
https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185921/ADV07104-768x512.jpg
https://cdn.campriverbend.com/wp-content/uploads/2018/07/15190040/ADV01169-768x512.jpg
https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185922/DSC06927-768x512.jpg
https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185906/IMG_370.jpg
https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185926/ADV06446-scaled.jpg
https://cdn.campriverbend.com/wp-content/uploads/2020/01/15185924/ADV07400.jpg-marketing-scaled.jpg
```

**About Page:**
```
https://cdn.campriverbend.com/wp-content/uploads/2018/07/15190025/ADV01122-1024x682.jpg
https://campriverbend.com/wp-content/uploads/2018/07/ADV01134.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/06/13143521/2022-Camp-Map-JPG-scaled.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/06/13143533/2022-Camp-Map-1.pdf
```

**Staff Photos (18):**
```
https://cdn.campriverbend.com/wp-content/uploads/2023/11/21111636/ROGER-1-scaled-e1700583441427.jpg
https://cdn.campriverbend.com/wp-content/uploads/2023/11/21111308/JILL-2-scaled-e1700583298834.jpg
https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185931/Paul.jpg
https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185931/Robin.jpg
https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185931/Miriam.jpg
https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185932/Katie.jpg
https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185933/Jenni.jpg
https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185932/Mike.jpg
https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185930/Brian.jpg
https://cdn.campriverbend.com/wp-content/uploads/2019/11/15185929/Jeff.jpg
https://cdn.campriverbend.com/wp-content/uploads/2023/11/21111829/DEBBIE-1-scaled-e1700583556726.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/04102033/Emily-Koprowski-2021-scaled.jpg
https://cdn.campriverbend.com/wp-content/uploads/2023/11/21112004/SAMIRA-2-scaled-e1700583646185.jpg
https://cdn.campriverbend.com/wp-content/uploads/2023/11/21112157/GOLDIE-scaled-e1700583751565.jpg
https://cdn.campriverbend.com/2024/05/01145618/IMG_9867-scaled.jpg
https://cdn.campriverbend.com/2024/05/01150635/IMG_9873-scaled.jpg
https://cdn.campriverbend.com/wp-content/uploads/2018/06/15190100/Harold-Breene-LR.jpg
https://cdn.campriverbend.com/wp-content/uploads/2018/06/15190059/Marianne-Breene-LR.jpg
```

**Product Images (24):**
All product images follow patterns:
```
https://cdn.campriverbend.com/2024/05/01194619/Adult-Dri-Fit-Long-Sleeve-Hoodie-300x300.jpg
https://cdn.campriverbend.com/2024/05/01194626/Camp-Riverbend-Embroidered-Backpack-300x300.jpg
https://cdn.campriverbend.com/2024/05/01194647/Camp-Riverbend-Performance-Grey-Hat-Adult-300x300.jpg
https://cdn.campriverbend.com/2024/05/01194612/Camp-Riverbend-White-Hat-Adult-300x300.jpg
https://cdn.campriverbend.com/2024/05/01194633/Girls-Ribbed-Tank-Top-300x300.jpg
https://cdn.campriverbend.com/2024/05/01194641/Kids-Dri-Fit-Hoodie-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2021/12/03101335/Camper-T-Shirt-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101319/Camper-Tank-Top-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101258/Crewneck-Sweatshirt-Grey-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101309/Crewneck-Sweatshirt-red-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101254/Hooded-Sweatshirt-Red-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101243/Hooded-Sweatshirt-Grey-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/04150704/Boys-Shorts-scaled-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101221/Girls-or-Womens-Shorts-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101228/Rash-Guard-300x300.png
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101101/Socks-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101159/Baseball-Cap-Red-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101128/Beanie-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/03101032/Gaga-Gloves-1-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/01/21095812/Gaiter-scaled-300x300.jpg
https://cdn.campriverbend.com/wp-content/uploads/2022/06/03100827/Backpack-2-300x300.jpg
```

**Note:** For product images, also try to find the full-size versions (remove the `-300x300` suffix from filenames and try fetching the full-size originals).

## Step 2: Upload to Vercel Blob

Write a script (`scripts/upload-to-blob.ts`) that:

1. Reads the downloaded images from `./tmp/images/`
2. Organizes into folders: `site/`, `staff/`, `products/`, `documents/`
3. Uploads each to Vercel Blob using the server-side `put` function
4. Records the mapping: `{ originalUrl, blobUrl, publicPath }` in a JSON manifest

```typescript
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

async function uploadImage(localPath: string, blobPath: string) {
  const file = fs.readFileSync(localPath);
  const blob = await put(blobPath, file, {
    access: 'public',
    contentType: getMimeType(localPath),
  });
  return blob.url;
}

// Upload structure:
// site/logo-white.png
// site/aca-badge.png
// site/hero-fallback.jpg
// site/homepage/programs-card.jpg
// site/about/philosophy.jpg
// site/about/camp-map.jpg
// staff/roger-breene.jpg
// staff/jill-breene-cheng.jpg
// products/adult-dri-fit-hoodie.jpg
// documents/camp-map-2022.pdf
```

## Step 3: Update DB Records

After uploading:
1. Update `staff_members.photo_url` with new Blob URLs
2. Update `products.images` arrays with new Blob URLs
3. Save the manifest for reference

## Step 4: Vercel Blob Rewrite Config

Already configured in `next.config.ts` (see `01_PROJECT_SETUP.md`):

```javascript
async rewrites() {
  return [{
    source: '/assets/:path*',
    destination: `https://${process.env.BLOB_STORE_ID}.public.blob.vercel-storage.com/:path*`,
  }];
}
```

**Usage in components:**
```tsx
// Instead of raw Blob URLs, use the rewrite path
<Image src="/assets/staff/roger-breene.jpg" alt="Roger Breene" ... />
```

The `BLOB_STORE_ID` is the unique identifier for your Vercel Blob store. Get it from the Vercel dashboard after creating the Blob store.

## Step 5: Client-Side Upload (Admin)

For admin photo/image uploads, use the client-side upload pattern:

**Upload API route** (`src/app/api/upload/route.ts`):
```typescript
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (pathname) => {
      return {
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        maximumSizeInBytes: 10 * 1024 * 1024, // 10MB max
        tokenPayload: JSON.stringify({ userId: session.user.id }),
      };
    },
    onUploadCompleted: async ({ blob, tokenPayload }) => {
      // Optional: log upload, create thumbnail, etc.
      console.log('Upload completed:', blob.url);
    },
  });

  return Response.json(jsonResponse);
}
```

**Client-side upload component** (`components/admin/ImageUpload.tsx`):
```typescript
import { upload } from '@vercel/blob/client';

async function handleUpload(file: File) {
  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
  });
  return blob.url; // Store this URL in DB
}
```

## Step 6: Image Optimization

For images used on the public site, use `next/image` which handles:
- Automatic WebP/AVIF conversion
- Responsive srcset generation
- Lazy loading
- Blur placeholder

```tsx
import Image from 'next/image';

<Image
  src="/assets/staff/roger-breene.jpg"
  alt="Roger Breene — Director"
  width={400}
  height={533}
  className="rounded-xl object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
/>
```

## Completion Criteria
- [ ] Migration script downloads all images from cdn.campriverbend.com
- [ ] All images uploaded to Vercel Blob with organized paths
- [ ] URL manifest generated (old URL → new Blob URL → public path)
- [ ] DB records updated with new Blob URLs (staff photos, product images)
- [ ] Rewrite in next.config.ts working
- [ ] All public pages use `/assets/*` paths for images
- [ ] Client-side upload working for admin (staff photos, product images)
- [ ] next/image used throughout for optimization
- [ ] Camp map PDF accessible via /assets/documents/camp-map-2022.pdf
