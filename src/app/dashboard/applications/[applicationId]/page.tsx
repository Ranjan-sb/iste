'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Trophy,
    Calendar,
    ArrowLeft,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    User,
    Edit,
    X,
} from 'lucide-react';
import { trpc } from '@/providers/trpc-provider';
import { formatDeadline } from '@/lib/date-utils';
import Link from 'next/link';

const ApplicationDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const applicationId = parseInt(params.applicationId as string);

    const [alerts, setAlerts] = useState<
        Array<{
            id: string;
            type: 'success' | 'error' | 'warning' | 'info';
            title: string;
            message: string;
        }>
    >([]);

    const addAlert = (
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string,
    ) => {
        const id = Date.now().toString();
        setAlerts((prev) => [...prev, { id, type, title, message }]);
        // Auto-remove after 5 seconds for success/info alerts
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                setAlerts((prev) => prev.filter((alert) => alert.id !== id));
            }, 5000);
        }
    };

    const removeAlert = (id: string) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    const {
        data: application,
        isLoading,
        error,
    } = trpc.application.getApplication.useQuery({ id: applicationId });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted':
                return 'bg-blue-100 text-blue-800';
            case 'under_review':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'submitted':
                return <Clock className="h-4 w-4" />;
            case 'under_review':
                return <AlertCircle className="h-4 w-4" />;
            case 'accepted':
                return <CheckCircle className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            case 'draft':
                return <FileText className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const formatStatus = (status: string) => {
        return status
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const renderFormField = (field: any, formData: any) => {
        const fieldId = `question_${field.order}`;
        const value = formData[fieldId];

        if (!value && value !== 0 && value !== false) {
            return null; // Don't render empty fields
        }

        return (
            <Card key={field.order} className="mb-4">
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">
                            {field.title}
                            {field.required && (
                                <span className="ml-1 text-sm text-red-500">
                                    *
                                </span>
                            )}
                        </h4>

                        <div className="text-gray-700">
                            {field.type === 'checkbox' &&
                            Array.isArray(value) ? (
                                <ul className="list-inside list-disc space-y-1">
                                    {value.map((item: string, idx: number) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            ) : field.type === 'file_upload' ? (
                                <div className="flex items-center gap-2">
                                    {typeof value === 'object' && value?.id ? (
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            <span className="text-blue-600">
                                                {value.filename}
                                            </span>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const response =
                                                            await fetch(
                                                                `/api/files/${value.id}`,
                                                            );
                                                        if (!response.ok)
                                                            throw new Error(
                                                                'Download failed',
                                                            );

                                                        const blob =
                                                            await response.blob();
                                                        const url =
                                                            URL.createObjectURL(
                                                                blob,
                                                            );
                                                        const a =
                                                            document.createElement(
                                                                'a',
                                                            );
                                                        a.href = url;
                                                        a.download =
                                                            value.filename;
                                                        document.body.appendChild(
                                                            a,
                                                        );
                                                        a.click();
                                                        document.body.removeChild(
                                                            a,
                                                        );
                                                        URL.revokeObjectURL(
                                                            url,
                                                        );
                                                    } catch (error) {
                                                        console.error(
                                                            'Download error:',
                                                            error,
                                                        );
                                                        addAlert(
                                                            'error',
                                                            'Download Failed',
                                                            'Failed to download file.',
                                                        );
                                                    }
                                                }}
                                                className="text-sm text-blue-600 underline hover:text-blue-800"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <FileText className="h-4 w-4" />
                                            <span>
                                                {typeof value === 'string'
                                                    ? value
                                                    : 'No file uploaded'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : field.type === 'paragraph' ? (
                                <div className="rounded-md bg-gray-50 p-3 whitespace-pre-wrap">
                                    {value}
                                </div>
                            ) : field.type === 'date' ? (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span>
                                        {new Date(value).toLocaleDateString()}
                                    </span>
                                </div>
                            ) : field.type === 'date_range' &&
                              value?.from &&
                              value?.to ? (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span>
                                        {new Date(
                                            value.from,
                                        ).toLocaleDateString()}{' '}
                                        -{' '}
                                        {new Date(
                                            value.to,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            ) : (
                                <span>{value}</span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Trophy className="mx-auto h-12 w-12 animate-pulse text-gray-400" />
                    <p className="mt-2 text-gray-600">
                        Loading application details...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 text-red-500">
                        <AlertCircle className="mx-auto h-12 w-12" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Application not found
                    </h3>
                    <p className="mt-2 text-gray-600">
                        {error?.message ||
                            "The application you're looking for doesn't exist or has been removed."}
                    </p>
                    <Link href="/dashboard/applications">
                        <Button className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Applications
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isDeadlinePassed =
        new Date() > new Date(application.submissionDeadline);
    const canEdit = application.status === 'draft' && !isDeadlinePassed;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Alerts */}
                {alerts.length > 0 && (
                    <div className="mb-6 space-y-3">
                        {alerts.map((alert) => (
                            <Alert
                                key={alert.id}
                                variant={
                                    alert.type === 'error'
                                        ? 'destructive'
                                        : 'default'
                                }
                                className="relative"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle className="flex items-center justify-between">
                                    {alert.title}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeAlert(alert.id)}
                                        className="h-auto p-0 hover:bg-transparent"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </AlertTitle>
                                <AlertDescription>
                                    {alert.message}
                                </AlertDescription>
                            </Alert>
                        ))}
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard/applications">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Applications
                        </Button>
                    </Link>

                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Trophy className="h-8 w-8 text-yellow-500" />
                                    <div>
                                        <CardTitle className="text-2xl">
                                            {application.awardName}
                                        </CardTitle>
                                        <CardDescription className="mt-1 text-base">
                                            {application.awardDescription}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge
                                    className={getStatusColor(
                                        application.status,
                                    )}
                                >
                                    <div className="flex items-center gap-1">
                                        {getStatusIcon(application.status)}
                                        {formatStatus(application.status)}
                                    </div>
                                </Badge>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">
                                        Category:
                                    </span>
                                    <Badge variant="outline">
                                        {application.awardCategory}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">
                                        Deadline:
                                    </span>
                                    <span
                                        className={`font-medium ${isDeadlinePassed ? 'text-red-600' : 'text-gray-900'}`}
                                    >
                                        {formatDeadline(
                                            application.submissionDeadline.toISOString(),
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">
                                        Applied:
                                    </span>
                                    <span className="font-medium">
                                        {application.submittedAt
                                            ? formatDeadline(
                                                  application.submittedAt.toISOString(),
                                              )
                                            : 'Draft'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">
                                        Updated:
                                    </span>
                                    <span className="font-medium">
                                        {formatDeadline(
                                            application.updatedAt.toISOString(),
                                        )}
                                    </span>
                                </div>
                            </div>

                            {canEdit && (
                                <div className="mt-4 border-t pt-4">
                                    <Link
                                        href={`/awards/apply/${application.awardId}`}
                                    >
                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Continue Editing
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardHeader>
                    </Card>
                </div>

                {/* Application Content */}
                <div className="space-y-6">
                    <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium">Application Details</p>
                            <p>
                                Below are the details you submitted for this
                                award application.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Responses
                        </h2>

                        {application.customFields &&
                        Array.isArray(application.customFields) &&
                        application.customFields.length > 0 ? (
                            <div className="space-y-4">
                                {application.customFields
                                    .sort((a: any, b: any) => a.order - b.order)
                                    .map((field: any) =>
                                        renderFormField(
                                            field,
                                            application.formData,
                                        ),
                                    )}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-center text-gray-500">
                                        No form fields were configured for this
                                        award.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Status Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {getStatusIcon(application.status)}
                                Application Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">
                                        Current Status:
                                    </span>
                                    <Badge
                                        className={getStatusColor(
                                            application.status,
                                        )}
                                    >
                                        {formatStatus(application.status)}
                                    </Badge>
                                </div>

                                {application.status === 'draft' && (
                                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
                                            <div className="text-sm text-yellow-800">
                                                <p className="font-medium">
                                                    Draft Application
                                                </p>
                                                <p>
                                                    This application is still in
                                                    draft mode. You need to
                                                    submit it before the
                                                    deadline.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {application.status === 'submitted' && (
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                                            <div className="text-sm text-blue-800">
                                                <p className="font-medium">
                                                    Application Submitted
                                                </p>
                                                <p>
                                                    Your application has been
                                                    successfully submitted and
                                                    is awaiting review.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {application.status === 'under_review' && (
                                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-600" />
                                            <div className="text-sm text-yellow-800">
                                                <p className="font-medium">
                                                    Under Review
                                                </p>
                                                <p>
                                                    Your application is
                                                    currently being reviewed by
                                                    the evaluation committee.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {application.status === 'accepted' && (
                                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                                            <div className="text-sm text-green-800">
                                                <p className="font-medium">
                                                    Congratulations!
                                                </p>
                                                <p>
                                                    Your application has been
                                                    accepted. You will receive
                                                    further details soon.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {application.status === 'rejected' && (
                                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                                        <div className="flex items-start gap-3">
                                            <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                                            <div className="text-sm text-red-800">
                                                <p className="font-medium">
                                                    Application Not Selected
                                                </p>
                                                <p>
                                                    Unfortunately, your
                                                    application was not selected
                                                    for this award. Keep
                                                    applying to other
                                                    opportunities!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6">
                        <Link href="/dashboard/applications">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Applications
                            </Button>
                        </Link>

                        {canEdit && (
                            <Link href={`/awards/apply/${application.awardId}`}>
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Continue Editing
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailPage;
