import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Cloudflare R2 client configuration
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

/**
 * Generate a pre-signed URL for downloading a file from R2
 * @param key - The object key in R2 bucket
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Pre-signed URL
 */
export async function generateR2DownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME || '',
    Key: key,
  })

  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn })
  return signedUrl
}

/**
 * Get the direct public URL for an R2 object (if bucket is public or has custom domain)
 * @param key - The object key in R2 bucket
 * @returns Public URL
 */
export function getR2PublicUrl(key: string): string {
  const publicUrl = process.env.R2_PUBLIC_URL
  if (!publicUrl) {
    throw new Error('R2_PUBLIC_URL environment variable is not set')
  }
  return `${publicUrl}/${key}`
}

export { r2Client }
