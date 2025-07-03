'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Trophy,
    Save,
    Send,
    ArrowLeft,
    Calendar,
    User,
    AlertCircle,
    CheckCircle,
    Upload,
    FileText,
    Download,
    X,
} from 'lucide-react';
import { trpc } from '@/providers/trpc-provider';
import { formatDeadline } from '@/lib/date-utils';
import {
    ApplicationFormData,
    FileData,
    Guide,
    Project,
} from '@/types/application-types';
import StandardApplicationFields from '@/components/standard-application-fields';
import Link from 'next/link';

interface FileUploadFieldProps {
    value?: FileData;
    onChange: (fileData: FileData | undefined) => void;
    fieldId: string;
    awardId: number;
    onAlert: (
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string,
    ) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
    value,
    onChange,
    fieldId,
    awardId,
    onAlert,
}) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            onAlert(
                'error',
                'File Too Large',
                'File size must be less than 10MB',
            );
            return;
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedTypes.includes(file.type)) {
            onAlert(
                'error',
                'Invalid File Type',
                'Please select a valid file type: PDF, DOC, or DOCX',
            );
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fieldId', fieldId);
            // Note: We don't have applicationId yet during creation, will be updated when saving

            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const result = await response.json();
            onChange({
                id: result.id,
                filename: result.filename,
                size: result.size,
                mimetype: result.mimetype,
            });
        } catch (error) {
            console.error('Upload error:', error);
            onAlert(
                'error',
                'Upload Failed',
                'Failed to upload file. Please try again.',
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async () => {
        if (!value?.id) return;

        try {
            const response = await fetch(`/api/files/${value.id}`);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = value.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            onAlert('error', 'Download Failed', 'Failed to download file.');
        }
    };

    return (
        <div className="space-y-3">
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                />

                {value ? (
                    <div className="space-y-2">
                        <FileText className="mx-auto h-12 w-12 text-green-500" />
                        <p className="text-sm font-medium">{value.filename}</p>
                        <p className="text-xs text-gray-500">
                            {(value.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <div className="flex justify-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                            >
                                <Download className="mr-1 h-4 w-4" />
                                Download
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                Replace File
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onChange(undefined)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading...' : 'Choose File'}
                        </Button>
                        <p className="text-xs text-gray-500">
                            PDF, DOC, DOCX up to 10MB
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const AwardApplicationPage = () => {
    const router = useRouter();
    const params = useParams();
    const awardId = parseInt(params.awardId as string);

    const [formData, setFormData] = useState<Record<string, any>>({});
    const [standardData, setStandardData] = useState<ApplicationFormData>({
        // Personal Information
        applicantName: '',
        designation: '',
        address: '',
        pincode: '',
        phoneNumber: '',
        dateOfBirth: '',
        academicQualification: '',
        fieldOfSpecialization: '',
        // Professional Information
        department: '',
        semesterYear: '',
        teachingExperience: { ug: '', pg: '' },
        industryExperience: '',
        otherExperience: '',
        isMember: false,
        institutionAddress: '',
        // Project Information
        projects: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        // Auto-remove after 8 seconds for success/info alerts
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                setAlerts((prev) => prev.filter((alert) => alert.id !== id));
            }, 8000);
        }
    };

    const removeAlert = (id: string) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    const {
        data: award,
        isLoading: awardLoading,
        error: awardError,
    } = trpc.award.getAward.useQuery({ id: awardId });
    const { data: applicationStatus, isLoading: statusLoading } =
        trpc.application.hasUserApplied.useQuery({ awardId });

    const updateFormData = (fieldId: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const validateForm = (): boolean => {
        // Validate standard fields
        const requiredStandardFields = [
            standardData.applicantName,
            standardData.designation,
            standardData.address,
            standardData.pincode,
            standardData.phoneNumber,
            standardData.dateOfBirth,
            standardData.academicQualification,
            standardData.fieldOfSpecialization,
            standardData.department,
            standardData.institutionAddress,
        ];

        // Add category-specific validation
        if (award?.category === 'student' && !standardData.semesterYear) {
            return false;
        }

        if (award?.category === 'faculty') {
            const teachingExp = standardData.teachingExperience;
            if (!teachingExp || (!teachingExp.ug && !teachingExp.pg)) {
                return false;
            }
        }

        // Check if any required standard field is empty
        if (
            requiredStandardFields.some(
                (field) => !field || field.trim() === '',
            )
        ) {
            return false;
        }

        // Validate projects (at least one project required)
        const projects = standardData.projects || [];
        if (projects.length === 0) {
            return false;
        }

        // Validate each project
        for (const project of projects) {
            if (!project.title || !project.outstandingWorkArea) {
                return false;
            }

            // Brief resume validation: either text OR file must be provided
            if (!project.briefResume && !project.briefResumeFile) {
                return false;
            }

            // Institution remarks are required
            if (!project.institutionRemarks) {
                return false;
            }

            if (
                project.benefits.some(
                    (benefit) => !benefit || benefit.trim() === '',
                )
            ) {
                return false;
            }
            if (project.guides.length === 0) {
                return false;
            }
            for (const guide of project.guides) {
                if (
                    !guide.name ||
                    !guide.address ||
                    !guide.email ||
                    !guide.mobile
                ) {
                    return false;
                }
            }
        }

        // Validate custom fields
        if (award?.customFields && Array.isArray(award.customFields)) {
            for (const field of award.customFields) {
                if (field.required && !formData[`question_${field.order}`]) {
                    return false;
                }
            }
        }

        return true;
    };

    const submitApplicationMutation =
        trpc.application.submitApplication.useMutation();

    const handleSubmit = async () => {
        if (!validateForm()) {
            addAlert(
                'error',
                'Validation Error',
                'Please fill in all required fields',
            );
            return;
        }

        setIsSubmitting(true);
        try {
            await submitApplicationMutation.mutateAsync({
                awardId,
                formData: {
                    ...formData,
                    ...standardData,
                },
            });

            // Clear localStorage draft
            localStorage.removeItem(`award-application-${awardId}`);

            addAlert(
                'success',
                'Success',
                'Application submitted successfully!',
            );
            setTimeout(() => router.push('/dashboard/applications'), 1500);
        } catch (error: any) {
            console.error('Error submitting application:', error);
            if (error.message.includes('already submitted')) {
                addAlert(
                    'error',
                    'Duplicate Application',
                    'You have already submitted an application for this award. Multiple applications are not allowed.',
                );
                setTimeout(() => router.push('/dashboard/applications'), 2000);
            } else {
                addAlert(
                    'error',
                    'Submission Failed',
                    error.message ||
                        'Error submitting application. Please try again.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveDraftMutation = trpc.application.saveDraft.useMutation();

    const saveDraft = async () => {
        try {
            const combinedData = {
                ...formData,
                ...standardData,
            };

            await saveDraftMutation.mutateAsync({
                awardId,
                formData: combinedData,
            });

            // Also save to localStorage as backup
            localStorage.setItem(
                `award-application-${awardId}`,
                JSON.stringify(combinedData),
            );
            addAlert('success', 'Draft Saved', 'Draft saved successfully!');
        } catch (error: any) {
            console.error('Error saving draft:', error);
            // Fallback to localStorage only
            const combinedData = {
                ...formData,
                ...standardData,
            };
            localStorage.setItem(
                `award-application-${awardId}`,
                JSON.stringify(combinedData),
            );
            addAlert(
                'info',
                'Draft Saved Locally',
                'Draft saved to your browser storage!',
            );
        }
    };

    // Load draft on component mount
    React.useEffect(() => {
        const savedDraft = localStorage.getItem(`award-application-${awardId}`);
        if (savedDraft) {
            const draftData = JSON.parse(savedDraft);

            // Separate standard fields from custom fields
            const standardFields = {
                applicantName: draftData.applicantName || '',
                designation: draftData.designation || '',
                address: draftData.address || '',
                pincode: draftData.pincode || '',
                phoneNumber: draftData.phoneNumber || '',
                dateOfBirth: draftData.dateOfBirth || '',
                academicQualification: draftData.academicQualification || '',
                fieldOfSpecialization: draftData.fieldOfSpecialization || '',
                department: draftData.department || '',
                semesterYear: draftData.semesterYear || '',
                teachingExperience: draftData.teachingExperience || {
                    ug: '',
                    pg: '',
                },
                industryExperience: draftData.industryExperience || '',
                otherExperience: draftData.otherExperience || '',
                isMember: draftData.isMember || false,
                institutionAddress: draftData.institutionAddress || '',
                projects: draftData.projects || [],
            };

            // Extract custom fields (anything that starts with 'question_')
            const customFields: Record<string, any> = {};
            Object.keys(draftData).forEach((key) => {
                if (key.startsWith('question_')) {
                    customFields[key] = draftData[key];
                }
            });

            setStandardData(standardFields);
            setFormData(customFields);
        }
    }, [awardId]);

    if (awardLoading || statusLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Trophy className="mx-auto h-12 w-12 animate-pulse text-gray-400" />
                    <p className="mt-2 text-gray-600">
                        Loading award details...
                    </p>
                </div>
            </div>
        );
    }

    if (awardError || !award) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 text-red-500">
                        <AlertCircle className="mx-auto h-12 w-12" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Award not found
                    </h3>
                    <p className="mt-2 text-gray-600">
                        The award you're looking for doesn't exist or has been
                        removed.
                    </p>
                    <Link href="/awards">
                        <Button className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Awards
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isOpen = new Date(award.submissionDeadline) > new Date();

    if (!isOpen) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 text-orange-500">
                        <Calendar className="mx-auto h-12 w-12" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Application Deadline Passed
                    </h3>
                    <p className="mt-2 text-gray-600">
                        The deadline for this award was{' '}
                        {formatDeadline(award.submissionDeadline.toISOString())}
                    </p>
                    <Link href="/awards">
                        <Button className="mt-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Awards
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Check if user has already submitted an application
    if (
        applicationStatus?.hasApplied &&
        applicationStatus?.status === 'submitted'
    ) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 text-green-500">
                        <CheckCircle className="mx-auto h-12 w-12" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Application Already Submitted
                    </h3>
                    <p className="mt-2 text-gray-600">
                        You have already submitted an application for this award
                        on{' '}
                        {applicationStatus.submittedAt &&
                            formatDeadline(
                                applicationStatus.submittedAt.toISOString(),
                            )}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Multiple applications for the same award are not
                        allowed.
                    </p>
                    <div className="mt-6 flex justify-center gap-4">
                        <Link href="/awards">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Awards
                            </Button>
                        </Link>
                        {applicationStatus.applicationId && (
                            <Link
                                href={`/dashboard/applications/${applicationStatus.applicationId}`}
                            >
                                <Button>View Application</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const renderFormField = (field: any, index: number) => {
        const fieldId = `question_${field.order}`;
        const value = formData[fieldId];

        return (
            <Card key={index}>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <Label className="text-base font-medium">
                                {field.title}
                                {field.required && (
                                    <span className="ml-1 text-red-500">*</span>
                                )}
                            </Label>
                        </div>

                        {field.type === 'multiple_choice' && (
                            <RadioGroup
                                value={value || ''}
                                onValueChange={(val) =>
                                    updateFormData(fieldId, val)
                                }
                            >
                                {field.options?.map(
                                    (option: any, oIdx: number) => (
                                        <div
                                            key={oIdx}
                                            className="flex items-center space-x-2"
                                        >
                                            <RadioGroupItem
                                                value={option.value}
                                                id={`${fieldId}_${oIdx}`}
                                            />
                                            <Label
                                                htmlFor={`${fieldId}_${oIdx}`}
                                            >
                                                {option.value}
                                            </Label>
                                        </div>
                                    ),
                                )}
                            </RadioGroup>
                        )}

                        {field.type === 'checkbox' && (
                            <div className="space-y-2">
                                {field.options?.map(
                                    (option: any, oIdx: number) => (
                                        <div
                                            key={oIdx}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={`${fieldId}_${oIdx}`}
                                                checked={(value || []).includes(
                                                    option.value,
                                                )}
                                                onCheckedChange={(checked) => {
                                                    const currentValues =
                                                        value || [];
                                                    if (checked) {
                                                        updateFormData(
                                                            fieldId,
                                                            [
                                                                ...currentValues,
                                                                option.value,
                                                            ],
                                                        );
                                                    } else {
                                                        updateFormData(
                                                            fieldId,
                                                            currentValues.filter(
                                                                (v: string) =>
                                                                    v !==
                                                                    option.value,
                                                            ),
                                                        );
                                                    }
                                                }}
                                            />
                                            <Label
                                                htmlFor={`${fieldId}_${oIdx}`}
                                            >
                                                {option.value}
                                            </Label>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}

                        {field.type === 'dropdown' && (
                            <Select
                                value={value || ''}
                                onValueChange={(val) =>
                                    updateFormData(fieldId, val)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map(
                                        (option: any, oIdx: number) => (
                                            <SelectItem
                                                key={oIdx}
                                                value={option.value}
                                            >
                                                {option.value}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                        )}

                        {field.type === 'short_answer' && (
                            <Input
                                placeholder="Your answer"
                                value={value || ''}
                                onChange={(e) =>
                                    updateFormData(fieldId, e.target.value)
                                }
                            />
                        )}

                        {field.type === 'paragraph' && (
                            <Textarea
                                placeholder="Your answer"
                                className="min-h-[100px]"
                                value={value || ''}
                                onChange={(e) =>
                                    updateFormData(fieldId, e.target.value)
                                }
                            />
                        )}

                        {field.type === 'file_upload' && (
                            <FileUploadField
                                value={value}
                                onChange={(fileData) =>
                                    updateFormData(fieldId, fileData)
                                }
                                fieldId={fieldId}
                                awardId={awardId}
                                onAlert={addAlert}
                            />
                        )}

                        {field.type === 'date' && (
                            <Input
                                type="date"
                                value={value || ''}
                                onChange={(e) =>
                                    updateFormData(fieldId, e.target.value)
                                }
                            />
                        )}

                        {field.type === 'date_range' && (
                            <div className="space-y-2">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <Label className="text-sm text-gray-600">
                                            From Date
                                        </Label>
                                        <Input
                                            type="date"
                                            value={value?.from || ''}
                                            onChange={(e) =>
                                                updateFormData(fieldId, {
                                                    ...value,
                                                    from: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm text-gray-600">
                                            To Date
                                        </Label>
                                        <Input
                                            type="date"
                                            value={value?.to || ''}
                                            onChange={(e) =>
                                                updateFormData(fieldId, {
                                                    ...value,
                                                    to: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/awards">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Awards
                        </Button>
                    </Link>

                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Trophy className="h-8 w-8 text-yellow-500" />
                                    <div>
                                        <CardTitle className="text-2xl">
                                            {award.name}
                                        </CardTitle>
                                        <CardDescription className="mt-1 text-base">
                                            {award.description}
                                        </CardDescription>
                                    </div>
                                </div>
                                <Badge variant="default">Open</Badge>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">
                                        Category:
                                    </span>
                                    <Badge variant="outline">
                                        {award.category}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">
                                        Deadline:
                                    </span>
                                    <span className="font-medium">
                                        {formatDeadline(
                                            award.submissionDeadline.toISOString(),
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="font-medium text-green-600">
                                        Applications Open
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Alerts */}
                {alerts.length > 0 && (
                    <div className="space-y-3">
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

                {/* Application Form */}
                <div className="space-y-6">
                    <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                        <p className="text-sm text-blue-800">
                            Please fill in all required fields marked with an
                            asterisk (*). Your application will be reviewed
                            according to the award criteria.
                        </p>
                    </div>

                    {/* Standard Application Fields */}
                    {
                        StandardApplicationFields({
                            category: award.category as
                                | 'student'
                                | 'faculty'
                                | 'institution',
                            data: standardData,
                            onChange: setStandardData,
                            onAlert: addAlert,
                        }) as any
                    }

                    {/* Custom Fields Section */}
                    {award.customFields &&
                        Array.isArray(award.customFields) &&
                        award.customFields.length > 0 && (
                            <div className="space-y-6">
                                <div className="border-t pt-6">
                                    <h3 className="mb-4 text-lg font-semibold">
                                        Additional Questions
                                    </h3>
                                    <div className="space-y-6">
                                        {award.customFields
                                            .sort(
                                                (a: any, b: any) =>
                                                    a.order - b.order,
                                            )
                                            .map((field: any, index: number) =>
                                                renderFormField(field, index),
                                            )}
                                    </div>
                                </div>
                            </div>
                        )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6">
                        <Link href="/awards">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </Link>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={saveDraft}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Draft
                            </Button>

                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !validateForm()}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting ? (
                                    'Submitting...'
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Submit Application
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AwardApplicationPage;
