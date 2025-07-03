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
import {
    ApplicationFormData,
    isApplicationFormData,
    getFormDataProperty,
} from '@/types/application-types';
import Link from 'next/link';

const ApplicationDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const applicationId = parseInt(params.applicationId as string);

    // Helper function to safely access form data
    const getFormData = (application: any): ApplicationFormData => {
        if (isApplicationFormData(application?.formData)) {
            return application.formData;
        }
        return {};
    };

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

                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(() => {
                                const formData = getFormData(application);
                                return (
                                    <>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">
                                                    Full Name
                                                </label>
                                                <p className="text-gray-900">
                                                    {formData.applicantName ||
                                                        'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">
                                                    Designation
                                                </label>
                                                <p className="text-gray-900">
                                                    {formData.designation ||
                                                        'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">
                                                    Phone Number
                                                </label>
                                                <p className="text-gray-900">
                                                    {formData.phoneNumber ||
                                                        'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">
                                                    Date of Birth
                                                </label>
                                                <p className="text-gray-900">
                                                    {formData.dateOfBirth
                                                        ? new Date(
                                                              formData.dateOfBirth,
                                                          ).toLocaleDateString()
                                                        : 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Address
                                            </label>
                                            <p className="whitespace-pre-wrap text-gray-900">
                                                {formData.address ||
                                                    'Not provided'}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">
                                                    Academic Qualification
                                                </label>
                                                <p className="text-gray-900">
                                                    {formData.academicQualification ||
                                                        'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600">
                                                    Field of Specialization
                                                </label>
                                                <p className="text-gray-900">
                                                    {formData.fieldOfSpecialization ||
                                                        'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5" />
                                Professional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Department
                                    </label>
                                    <p className="text-gray-900">
                                        {(application.formData as any)
                                            ?.department || 'Not provided'}
                                    </p>
                                </div>
                                {application.awardCategory === 'student' && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Semester/Year
                                        </label>
                                        <p className="text-gray-900">
                                            {(application.formData as any)
                                                ?.semesterYear ||
                                                'Not provided'}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        ISTE Member
                                    </label>
                                    <p className="text-gray-900">
                                        {(application.formData as any)?.isMember
                                            ? 'Yes'
                                            : 'No'}
                                    </p>
                                </div>
                            </div>

                            {application.awardCategory === 'faculty' &&
                                (application.formData as any)
                                    ?.teachingExperience && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Teaching Experience
                                        </label>
                                        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                                            <div className="rounded bg-gray-50 p-3">
                                                <p className="text-sm text-gray-600">
                                                    UG Level
                                                </p>
                                                <p className="font-medium">
                                                    {(
                                                        application.formData as any
                                                    ).teachingExperience.ug ||
                                                        '0'}{' '}
                                                    years
                                                </p>
                                            </div>
                                            <div className="rounded bg-gray-50 p-3">
                                                <p className="text-sm text-gray-600">
                                                    PG Level
                                                </p>
                                                <p className="font-medium">
                                                    {(
                                                        application.formData as any
                                                    ).teachingExperience.pg ||
                                                        '0'}{' '}
                                                    years
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {application.awardCategory === 'faculty' && (
                                <>
                                    {(application.formData as any)
                                        ?.industryExperience && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Industry Experience
                                            </label>
                                            <p className="text-gray-900">
                                                {
                                                    (
                                                        application.formData as any
                                                    ).industryExperience
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {(application.formData as any)
                                        ?.otherExperience && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">
                                                Other Experience
                                            </label>
                                            <p className="whitespace-pre-wrap text-gray-900">
                                                {
                                                    (
                                                        application.formData as any
                                                    ).otherExperience
                                                }
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            <div>
                                <label className="text-sm font-medium text-gray-600">
                                    Institution Address
                                </label>
                                <p className="whitespace-pre-wrap text-gray-900">
                                    {(application.formData as any)
                                        ?.institutionAddress || 'Not provided'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Information */}
                    {(application.formData as any)?.projects &&
                        Array.isArray((application.formData as any).projects) &&
                        (application.formData as any).projects.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Project Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {(application.formData as any).projects.map(
                                        (
                                            project: any,
                                            projectIndex: number,
                                        ) => (
                                            <div
                                                key={projectIndex}
                                                className="rounded-lg border border-gray-200 p-6"
                                            >
                                                <h4 className="mb-4 text-lg font-semibold">
                                                    Project {projectIndex + 1}
                                                </h4>

                                                {/* Project Title */}
                                                <div className="mb-4">
                                                    <label className="text-sm font-medium text-gray-600">
                                                        Project Title
                                                    </label>
                                                    <p className="text-gray-900">
                                                        {project.title ||
                                                            'Not provided'}
                                                    </p>
                                                </div>

                                                {/* Outstanding Work Area */}
                                                <div className="mb-4">
                                                    <label className="text-sm font-medium text-gray-600">
                                                        Outstanding Work Area
                                                    </label>
                                                    <p className="text-gray-900">
                                                        {project.outstandingWorkArea ===
                                                            'rural-development' &&
                                                            'Rural-oriented & society relevant development activity'}
                                                        {project.outstandingWorkArea ===
                                                            'industry-interaction' &&
                                                            'Interaction with industry'}
                                                        {project.outstandingWorkArea ===
                                                            'educational-technology' &&
                                                            'Educational Technology & Book Writing including Laboratory Manual'}
                                                        {!project.outstandingWorkArea &&
                                                            'Not provided'}
                                                    </p>
                                                </div>

                                                {/* Brief Resume */}
                                                <div className="mb-4">
                                                    <label className="text-sm font-medium text-gray-600">
                                                        Brief Resume of the
                                                        Project
                                                    </label>
                                                    {project.briefResume && (
                                                        <div className="mt-2 rounded bg-gray-50 p-3 whitespace-pre-wrap">
                                                            {
                                                                project.briefResume
                                                            }
                                                        </div>
                                                    )}
                                                    {project.briefResumeFile && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-blue-600" />
                                                            <span className="text-blue-600">
                                                                {
                                                                    project
                                                                        .briefResumeFile
                                                                        .filename
                                                                }
                                                            </span>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        const response =
                                                                            await fetch(
                                                                                `/api/files/${project.briefResumeFile.id}`,
                                                                            );
                                                                        if (
                                                                            !response.ok
                                                                        )
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
                                                                        a.href =
                                                                            url;
                                                                        a.download =
                                                                            project.briefResumeFile.filename;
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
                                                    )}
                                                    {!project.briefResume &&
                                                        !project.briefResumeFile && (
                                                            <p className="mt-2 text-gray-500">
                                                                Not provided
                                                            </p>
                                                        )}
                                                </div>

                                                {/* Institution Remarks */}
                                                {project.institutionRemarks && (
                                                    <div className="mb-4">
                                                        <label className="text-sm font-medium text-gray-600">
                                                            Institution Remarks
                                                        </label>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <FileText className="h-4 w-4 text-green-600" />
                                                            <span className="text-green-600">
                                                                {
                                                                    project
                                                                        .institutionRemarks
                                                                        .filename
                                                                }
                                                            </span>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        const response =
                                                                            await fetch(
                                                                                `/api/files/${project.institutionRemarks.id}`,
                                                                            );
                                                                        if (
                                                                            !response.ok
                                                                        )
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
                                                                        a.href =
                                                                            url;
                                                                        a.download =
                                                                            project.institutionRemarks.filename;
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
                                                                        addAlert(
                                                                            'error',
                                                                            'Download Failed',
                                                                            'Failed to download file.',
                                                                        );
                                                                    }
                                                                }}
                                                                className="text-sm text-green-600 underline hover:text-green-800"
                                                            >
                                                                Download
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Benefits */}
                                                {project.benefits &&
                                                    Array.isArray(
                                                        project.benefits,
                                                    ) &&
                                                    project.benefits.some(
                                                        (benefit: string) =>
                                                            benefit,
                                                    ) && (
                                                        <div className="mb-4">
                                                            <label className="text-sm font-medium text-gray-600">
                                                                Benefits/Contributions
                                                            </label>
                                                            <div className="mt-2 space-y-2">
                                                                {project.benefits.map(
                                                                    (
                                                                        benefit: string,
                                                                        benefitIndex: number,
                                                                    ) =>
                                                                        benefit && (
                                                                            <div
                                                                                key={
                                                                                    benefitIndex
                                                                                }
                                                                                className="rounded bg-gray-50 p-3"
                                                                            >
                                                                                <p className="text-sm text-gray-600">
                                                                                    Benefit{' '}
                                                                                    {benefitIndex +
                                                                                        1}
                                                                                </p>
                                                                                <p className="text-gray-900">
                                                                                    {
                                                                                        benefit
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                {/* Guides */}
                                                {project.guides &&
                                                    Array.isArray(
                                                        project.guides,
                                                    ) &&
                                                    project.guides.length >
                                                        0 && (
                                                        <div className="mb-4">
                                                            <label className="text-sm font-medium text-gray-600">
                                                                Guide(s)
                                                                Information
                                                            </label>
                                                            <div className="mt-2 space-y-3">
                                                                {project.guides.map(
                                                                    (
                                                                        guide: any,
                                                                        guideIndex: number,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                guideIndex
                                                                            }
                                                                            className="rounded border bg-gray-50 p-4"
                                                                        >
                                                                            <h5 className="mb-2 font-medium">
                                                                                Guide{' '}
                                                                                {guideIndex +
                                                                                    1}
                                                                            </h5>
                                                                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                                                <div>
                                                                                    <p className="text-xs text-gray-600">
                                                                                        Name
                                                                                    </p>
                                                                                    <p className="text-sm">
                                                                                        {guide.name ||
                                                                                            'Not provided'}
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-xs text-gray-600">
                                                                                        Email
                                                                                    </p>
                                                                                    <p className="text-sm">
                                                                                        {guide.email ||
                                                                                            'Not provided'}
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-xs text-gray-600">
                                                                                        Mobile
                                                                                    </p>
                                                                                    <p className="text-sm">
                                                                                        {guide.mobile ||
                                                                                            'Not provided'}
                                                                                    </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-xs text-gray-600">
                                                                                        Address
                                                                                    </p>
                                                                                    <p className="text-sm">
                                                                                        {guide.address ||
                                                                                            'Not provided'}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>
                                        ),
                                    )}
                                </CardContent>
                            </Card>
                        )}

                    {/* Custom Form Responses */}
                    {application.customFields &&
                        Array.isArray(application.customFields) &&
                        application.customFields.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Additional Questions & Responses
                                </h2>
                                <div className="space-y-4">
                                    {application.customFields
                                        .sort(
                                            (a: any, b: any) =>
                                                a.order - b.order,
                                        )
                                        .map((field: any) =>
                                            renderFormField(
                                                field,
                                                application.formData,
                                            ),
                                        )}
                                </div>
                            </div>
                        )}

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
