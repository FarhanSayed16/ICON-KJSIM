import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function ensureConfigured() {
  if (configured) return true;
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
  return true;
}

/**
 * Upload a File / Blob / Buffer to Cloudinary.
 * @returns {{ url: string, publicId: string } | { error: string }}
 */
export async function uploadImage(file, { folder = 'icon-kjsim', maxBytes = 2_500_000 } = {}) {
  if (!ensureConfigured()) {
    return { error: 'Cloudinary is not configured on the server.' };
  }

  try {
    let buffer;
    let mime = 'image/jpeg';

    if (Buffer.isBuffer(file)) {
      buffer = file;
    } else if (file && typeof file.arrayBuffer === 'function') {
      mime = file.type || mime;
      if (!String(mime).startsWith('image/')) {
        return { error: 'Only image files are allowed (JPG, PNG, WEBP).' };
      }
      if (file.size && file.size > maxBytes) {
        return { error: 'Image must be under 2.5 MB.' };
      }
      buffer = Buffer.from(await file.arrayBuffer());
    } else {
      return { error: 'Invalid file upload.' };
    }

    if (buffer.length > maxBytes) {
      return { error: 'Image must be under 2.5 MB.' };
    }

    const dataUri = `data:${mime};base64,${buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
    });

    return { url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    console.error('Cloudinary upload failed:', err.message);
    return { error: 'Failed to upload image. Please try again.' };
  }
}

export function isCloudinaryConfigured() {
  return ensureConfigured();
}
