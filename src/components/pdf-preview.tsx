'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Eye,
    Download,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';

// Dynamically import PDF components to avoid SSR issues
const Document = dynamic(
    () => import('react-pdf').then((mod) => mod.Document),
    { ssr: false },
);

const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), {
    ssr: false,
});

interface PDFPreviewProps {
    fileId: number;
    filename: string;
    triggerButton?: React.ReactNode;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({
    fileId,
    filename,
    triggerButton,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(0.8);
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Memoize the options object to prevent unnecessary reloads
    const documentOptions = useMemo(
        () => ({
            httpHeaders: {},
            withCredentials: false,
        }),
        [],
    );

    // Ensure we're on the client side
    useEffect(() => {
        setIsClient(true);

        // Configure PDF.js worker only on client side
        if (typeof window !== 'undefined') {
            import('react-pdf')
                .then(({ pdfjs }) => {
                    // Use local worker file to avoid CORS issues
                    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
                })
                .catch((error) => {
                    console.error('Failed to load react-pdf:', error);
                });
        }
    }, []);

    const loadPDF = async () => {
        if (pdfData) return; // Already loaded

        setLoading(true);
        setError(null);

        try {
            // Fetch PDF through our API to avoid CORS issues
            const response = await fetch(`/api/files/${fileId}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/pdf',
                },
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to load PDF: ${response.status} ${response.statusText}`,
                );
            }

            // Convert response to blob and create object URL
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            setPdfData(blobUrl);
        } catch (err) {
            console.error('PDF loading error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load PDF');
        } finally {
            setLoading(false);
        }
    };

    // Clean up blob URL when component unmounts or dialog closes
    useEffect(() => {
        return () => {
            if (
                pdfData &&
                typeof pdfData === 'string' &&
                pdfData.startsWith('blob:')
            ) {
                URL.revokeObjectURL(pdfData);
            }
        };
    }, [pdfData]);

    const handleOpenDialog = () => {
        setIsOpen(true);
        loadPDF();
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
        // Reset scale to fit width when document loads
        setScale(0.8);
    };

    const onDocumentLoadError = (error: Error) => {
        console.error('PDF document load error:', error);
        setError(
            'Failed to load PDF document. The file may be corrupted or invalid.',
        );
    };

    const downloadFile = async () => {
        try {
            const response = await fetch(`/api/files/${fileId}`);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    const goToPrevPage = () => {
        setPageNumber((prev) => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setPageNumber((prev) => Math.min(numPages || 1, prev + 1));
    };

    const fitToWidth = () => {
        setScale(0.8);
    };

    const zoomIn = () => {
        setScale((prev) => Math.min(2.0, prev + 0.2));
    };

    const zoomOut = () => {
        setScale((prev) => Math.max(0.3, prev - 0.2));
    };

    const handleCloseDialog = (open: boolean) => {
        setIsOpen(open);
        // Clean up blob URL when dialog closes
        if (
            !open &&
            pdfData &&
            typeof pdfData === 'string' &&
            pdfData.startsWith('blob:')
        ) {
            URL.revokeObjectURL(pdfData);
            setPdfData(null);
        }
    };

    // Don't render PDF components on server side
    if (!isClient) {
        return (
            <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild onClick={handleOpenDialog}>
                    {triggerButton || (
                        <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="flex h-[95vh] w-[95vw] max-w-6xl flex-col">
                    <DialogHeader className="flex-shrink-0">
                        <DialogTitle>Loading PDF Preview...</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-1 items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                            <p className="text-sm text-gray-600">
                                Initializing PDF viewer...
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
            <DialogTrigger asChild onClick={handleOpenDialog}>
                {triggerButton || (
                    <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="flex h-[95vh] w-[95vw] max-w-6xl flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center justify-between">
                        <span className="truncate">{filename}</span>
                        <div className="flex items-center gap-2">
                            {numPages && (
                                <span className="text-sm text-gray-500">
                                    Page {pageNumber} of {numPages}
                                </span>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={downloadFile}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Controls */}
                <div className="flex flex-shrink-0 items-center justify-between border-b p-4">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToPrevPage}
                            disabled={pageNumber <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            {pageNumber} / {numPages || '?'}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToNextPage}
                            disabled={pageNumber >= (numPages || 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fitToWidth}
                        >
                            Fit Width
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={zoomOut}
                            disabled={scale <= 0.3}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">
                            {Math.round(scale * 100)}%
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={zoomIn}
                            disabled={scale >= 2.0}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 overflow-auto bg-gray-50 p-4">
                    <div className="flex min-h-full items-start justify-center">
                        {loading && (
                            <div className="flex h-64 items-center justify-center">
                                <div className="text-center">
                                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                    <p className="text-sm text-gray-600">
                                        Loading PDF...
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex h-64 items-center justify-center">
                                <div className="text-center">
                                    <p className="mb-2 text-red-600">
                                        Error loading PDF
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {error}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={loadPDF}
                                        className="mt-2"
                                    >
                                        Retry
                                    </Button>
                                </div>
                            </div>
                        )}

                        {pdfData && !loading && !error && (
                            <Document
                                file={pdfData}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={onDocumentLoadError}
                                loading={
                                    <div className="flex h-64 items-center justify-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                    </div>
                                }
                                options={documentOptions}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    loading={
                                        <div className="flex h-64 items-center justify-center">
                                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                                        </div>
                                    }
                                    className="border border-gray-300 bg-white shadow-lg"
                                />
                            </Document>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PDFPreview;
