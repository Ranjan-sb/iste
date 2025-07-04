import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { getServerEnv } from './env';

const env = getServerEnv();

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
    region: 'auto',
    endpoint: env.R2_ENDPOINT || 'https://r2.cloudflarestorage.com',
    credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
});

export interface FileUploadResult {
    key: string;
    url: string;
    publicUrl?: string;
}

export interface FileMetadata {
    filename: string;
    mimetype: string;
    size: number;
    key: string;
    uploadedBy: string;
    applicationId?: number;
    fieldId?: string;
}

/**
 * Upload a file to Cloudflare R2
 */
export async function uploadFile(
    file: Buffer | Uint8Array,
    filename: string,
    mimetype: string,
    options: {
        uploadedBy: string;
        applicationId?: number;
        fieldId?: string;
    },
): Promise<FileUploadResult> {
    // Generate unique key for the file
    const fileExtension = filename.split('.').pop() || '';
    const key = `uploads/${options.uploadedBy}/${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: mimetype,
        Metadata: {
            originalFilename: filename,
            uploadedBy: options.uploadedBy,
            applicationId: options.applicationId?.toString() || '',
            fieldId: options.fieldId || '',
        },
    });

    await s3Client.send(command);

    // Generate a signed URL for the uploaded file
    const url = await getFileDownloadUrl(key, 3600); // 1 hour expiry

    // Generate public URL if custom domain is configured
    const publicUrl = env.R2_PUBLIC_URL
        ? `${env.R2_PUBLIC_URL}/${key}`
        : undefined;

    return {
        key,
        url,
        publicUrl,
    };
}

/**
 * Get a signed URL for downloading a file from R2
 */
export async function getFileDownloadUrl(
    key: string,
    expiresIn: number = 3600,
): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete a file from R2
 */
export async function deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
}

/**
 * Check if a file exists in R2
 */
export async function fileExists(key: string): Promise<boolean> {
    try {
        const command = new HeadObjectCommand({
            Bucket: env.R2_BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get file metadata from R2
 */
export async function getFileMetadata(key: string): Promise<{
    size: number;
    mimetype: string;
    lastModified: Date;
    metadata: Record<string, string>;
} | null> {
    try {
        const command = new HeadObjectCommand({
            Bucket: env.R2_BUCKET_NAME,
            Key: key,
        });

        const response = await s3Client.send(command);

        return {
            size: response.ContentLength || 0,
            mimetype: response.ContentType || 'application/octet-stream',
            lastModified: response.LastModified || new Date(),
            metadata: response.Metadata || {},
        };
    } catch {
        return null;
    }
}

/**
 * Validate file type and size
 */
export function validateFile(
    file: File,
    options: {
        maxSize?: number; // in bytes
        allowedTypes?: string[];
    },
): { valid: boolean; error?: string } {
    const {
        maxSize = 10 * 1024 * 1024,
        allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
    } = options;

    // Check file size
    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`,
        };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        };
    }

    return { valid: true };
}
