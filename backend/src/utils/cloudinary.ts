import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(buffer: Buffer): Promise<string> {
  const cleanBuffer = await sharp(buffer)
    .rotate()
    .jpeg({ quality: 80 })
    .toBuffer();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'alertavecinal/incidents' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || '');
      }
    );
    stream.end(cleanBuffer);
  });
}