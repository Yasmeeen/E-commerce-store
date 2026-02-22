import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: string,
  folder = 'ecommerce-products'
): Promise<{ secure_url: string; public_id: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: 'image',
  });
  return { secure_url: result.secure_url, public_id: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
