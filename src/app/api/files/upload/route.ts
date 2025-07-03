import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/server/auth/server';
import { db } from '@/server/db';
import { files } from '@/server/db/schema';
import { uploadFile, validateFile } from '@/lib/file-storage';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const headers = new Headers(request.headers);
        const session = await getUserSession(headers);
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const applicationId = formData.get('applicationId') as string;
        const fieldId = formData.get('fieldId') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 },
            );
        }

        // Validate file
        const validation = validateFile(file, {
            maxSize: 10 * 1024 * 1024, // 10MB
            allowedTypes: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ],
        });
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 },
            );
        }

        // Convert file to buffer
        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);

        // Upload to R2
        const uploadResult = await uploadFile(
            fileBuffer,
            file.name,
            file.type,
            {
                uploadedBy: session.user.id,
                applicationId: applicationId
                    ? parseInt(applicationId)
                    : undefined,
                fieldId: fieldId || undefined,
            },
        );

        // Store file metadata in database
        const [dbFile] = await db
            .insert(files)
            .values({
                filename: file.name,
                mimetype: file.type,
                size: file.size,
                r2Key: uploadResult.key,
                r2Url: uploadResult.url,
                publicUrl: uploadResult.publicUrl,
                uploadedBy: session.user.id,
                applicationId: applicationId
                    ? parseInt(applicationId)
                    : undefined,
                fieldId: fieldId || undefined,
            })
            .returning();

        return NextResponse.json({
            success: true,
            file: {
                id: dbFile.id,
                filename: dbFile.filename,
                size: dbFile.size,
                url: dbFile.r2Url,
                publicUrl: dbFile.publicUrl,
            },
        });
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
