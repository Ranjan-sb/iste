import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/server/auth/server';
import { db } from '@/server/db';
import { files } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> },
) {
    try {
        const headers = new Headers(request.headers);
        const session = await getUserSession(headers);
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const { fileId: fileIdParam } = await params;
        const fileId = parseInt(fileIdParam);

        if (isNaN(fileId)) {
            return NextResponse.json(
                { error: 'Invalid file ID' },
                { status: 400 },
            );
        }

        // Get file metadata from database
        const [fileRecord] = await db
            .select({
                id: files.id,
                filename: files.filename,
                storedFilename: files.storedFilename,
                mimetype: files.mimetype,
                size: files.size,
                uploadedBy: files.uploadedBy,
                applicationId: files.applicationId,
            })
            .from(files)
            .where(eq(files.id, fileId));

        if (!fileRecord) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 },
            );
        }

        // For now, allow anyone to download files (as requested)
        // Later we can add more sophisticated access control

        // Read file from disk
        const filePath = join(
            process.cwd(),
            'uploads',
            fileRecord.storedFilename,
        );

        try {
            const fileBuffer = await readFile(filePath);

            // Return file with proper headers
            return new NextResponse(fileBuffer, {
                headers: {
                    'Content-Type': fileRecord.mimetype,
                    'Content-Disposition': `attachment; filename="${encodeURIComponent(fileRecord.filename)}"`,
                    'Content-Length': fileRecord.size.toString(),
                    'Cache-Control': 'private, no-cache',
                },
            });
        } catch (fileError) {
            console.error('Error reading file from disk:', fileError);
            return NextResponse.json(
                { error: 'File not found on disk' },
                { status: 404 },
            );
        }
    } catch (error) {
        console.error('File download error:', error);
        return NextResponse.json({ error: 'Download failed' }, { status: 500 });
    }
}
