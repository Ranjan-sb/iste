import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/server/auth/server';
import { db } from '@/server/db';
import { files } from '@/server/db/schema';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

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

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB.' },
                { status: 400 },
            );
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                {
                    error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.',
                },
                { status: 400 },
            );
        }

        // Create unique filename
        const fileExtension = file.name.split('.').pop();
        const storedFilename = `${randomUUID()}.${fileExtension}`;

        // Create upload directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'uploads');
        await mkdir(uploadDir, { recursive: true });

        // Save file to disk
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = join(uploadDir, storedFilename);
        await writeFile(filePath, buffer);

        // Save file metadata to database
        const [savedFile] = await db
            .insert(files)
            .values({
                filename: file.name,
                storedFilename,
                mimetype: file.type,
                size: file.size,
                uploadedBy: session.user.id,
                applicationId: applicationId ? parseInt(applicationId) : null,
                fieldId,
            })
            .returning();

        return NextResponse.json({
            id: savedFile.id,
            filename: savedFile.filename,
            size: savedFile.size,
            mimetype: savedFile.mimetype,
        });
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
