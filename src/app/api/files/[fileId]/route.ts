import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/server/auth/server';
import { db } from '@/server/db';
import { files } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { getFileDownloadUrl } from '@/lib/file-storage';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ fileId: string }> },
) {
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

        const { fileId: fileIdParam } = await params;
        const fileId = parseInt(fileIdParam);
        if (isNaN(fileId)) {
            return NextResponse.json(
                { error: 'Invalid file ID' },
                { status: 400 },
            );
        }

        // Get file metadata from database
        const [file] = await db
            .select()
            .from(files)
            .where(eq(files.id, fileId))
            .limit(1);

        if (!file) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 },
            );
        }

        // Check if this is a preview request (for PDF viewer)
        const acceptHeader = request.headers.get('accept');
        const isPreviewRequest = acceptHeader?.includes('application/pdf');

        if (isPreviewRequest) {
            // For preview requests, fetch the file content and return it directly
            const downloadUrl = await getFileDownloadUrl(file.r2Key, 3600);

            // Fetch the file content from R2
            const fileResponse = await fetch(downloadUrl);
            if (!fileResponse.ok) {
                throw new Error(
                    `Failed to fetch file from R2: ${fileResponse.status}`,
                );
            }

            const fileBuffer = await fileResponse.arrayBuffer();

            // Return the file content with proper headers
            return new NextResponse(fileBuffer, {
                headers: {
                    'Content-Type': file.mimetype || 'application/octet-stream',
                    'Content-Length': fileBuffer.byteLength.toString(),
                    'Cache-Control': 'private, max-age=3600',
                    // CORS headers
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET',
                    'Access-Control-Allow-Headers':
                        'Content-Type, Authorization',
                },
            });
        } else {
            // For regular download requests, redirect to signed URL
            const downloadUrl = await getFileDownloadUrl(file.r2Key, 3600);
            return NextResponse.redirect(downloadUrl);
        }
    } catch (error) {
        console.error('File download error:', error);
        return NextResponse.json({ error: 'Download failed' }, { status: 500 });
    }
}
