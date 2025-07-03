'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    Eye,
    Settings,
    Plus,
    CheckCircle,
    AlertCircle,
    X,
} from 'lucide-react';
import CustomFieldFormBuilder, {
    Question,
} from '@/components/custom-field-builder';
import CustomFieldFormBuilderPreview from '@/components/custom-field-form-preview';
import { trpc } from '@/providers/trpc-provider';

interface AwardFormData {
    // Basic Award Information
    name: string;
    description: string;
    category: 'student' | 'faculty' | 'institution';

    // Deadlines
    submissionDeadline: string;
    evaluationDeadline: string;
    resultDeadline: string;

    // Eligibility Criteria
    eligibilityLevel: string[];
    eligibilityStates: string[];
    eligibilityBranches: string[];
    maxAge?: number;

    // Special Requirements
    specialRequirements: string[];

    // Custom Form Fields
    customFields: Question[];
}

const CreateAwardPage = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<
        'basic' | 'form' | 'preview'
    >('basic');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [dateErrors, setDateErrors] = useState<{
        submissionDeadline?: string;
        evaluationDeadline?: string;
        resultDeadline?: string;
    }>({});
    const [alerts, setAlerts] = useState<
        Array<{
            id: string;
            type: 'success' | 'error' | 'warning' | 'info';
            title: string;
            message: string;
        }>
    >([]);
    const [showClearDraftDialog, setShowClearDraftDialog] = useState(false);

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

    const [formData, setFormData] = useState<AwardFormData>({
        name: '',
        description: '',
        category: 'student',
        submissionDeadline: '',
        evaluationDeadline: '',
        resultDeadline: '',
        eligibilityLevel: [],
        eligibilityStates: [],
        eligibilityBranches: [],
        specialRequirements: [],
        customFields: [],
    });

    // Function to ensure all form fields have proper default values
    const normalizeFormData = (data: Partial<AwardFormData>): AwardFormData => {
        return {
            name: data.name || '',
            description: data.description || '',
            category: data.category || 'student',
            submissionDeadline: data.submissionDeadline || '',
            evaluationDeadline: data.evaluationDeadline || '',
            resultDeadline: data.resultDeadline || '',
            eligibilityLevel: data.eligibilityLevel || [],
            eligibilityStates: data.eligibilityStates || [],
            eligibilityBranches: data.eligibilityBranches || [],
            maxAge: data.maxAge,
            specialRequirements: data.specialRequirements || [],
            customFields: data.customFields || [],
        };
    };

    // Load draft on component mount
    React.useEffect(() => {
        const savedDraft = localStorage.getItem('award-draft');
        if (savedDraft) {
            try {
                const parsedDraft = JSON.parse(savedDraft);
                const normalizedData = normalizeFormData(parsedDraft);
                setFormData(normalizedData);
                setDraftLoaded(true);
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, []);

    const validateDates = (updatedFormData: AwardFormData) => {
        const errors: typeof dateErrors = {};
        const today = new Date().toISOString().split('T')[0];

        // Check if submission deadline is in the past
        if (
            updatedFormData.submissionDeadline &&
            updatedFormData.submissionDeadline < today
        ) {
            errors.submissionDeadline =
                'Submission deadline cannot be in the past';
        }

        // Check if evaluation deadline is before submission deadline
        if (
            updatedFormData.submissionDeadline &&
            updatedFormData.evaluationDeadline
        ) {
            if (
                updatedFormData.evaluationDeadline <=
                updatedFormData.submissionDeadline
            ) {
                errors.evaluationDeadline =
                    'Evaluation deadline must be after submission deadline';
            }
        }

        // Check if result deadline is before evaluation deadline
        if (
            updatedFormData.evaluationDeadline &&
            updatedFormData.resultDeadline
        ) {
            if (
                updatedFormData.resultDeadline <=
                updatedFormData.evaluationDeadline
            ) {
                errors.resultDeadline =
                    'Result announcement date must be after evaluation deadline';
            }
        }

        // If no evaluation deadline but has result deadline, check against submission deadline
        if (
            !updatedFormData.evaluationDeadline &&
            updatedFormData.submissionDeadline &&
            updatedFormData.resultDeadline
        ) {
            if (
                updatedFormData.resultDeadline <=
                updatedFormData.submissionDeadline
            ) {
                errors.resultDeadline =
                    'Result announcement date must be after submission deadline';
            }
        }

        setDateErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const updateFormData = (field: keyof AwardFormData, value: any) => {
        const updatedFormData = {
            ...formData,
            [field]: value,
        };

        setFormData(updatedFormData);

        // Validate dates if any date field is updated
        if (
            [
                'submissionDeadline',
                'evaluationDeadline',
                'resultDeadline',
            ].includes(field)
        ) {
            validateDates(updatedFormData);
        }
    };

    // Auto-save draft every 30 seconds
    React.useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (formData.name || formData.description) {
                localStorage.setItem('award-draft', JSON.stringify(formData));
            }
        }, 30000); // 30 seconds

        return () => clearInterval(autoSaveInterval);
    }, [formData]);

    const addSpecialRequirement = () => {
        setFormData((prev) => ({
            ...prev,
            specialRequirements: [...prev.specialRequirements, ''],
        }));
    };

    const updateSpecialRequirement = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            specialRequirements: prev.specialRequirements.map((req, i) =>
                i === index ? value : req,
            ),
        }));
    };

    const removeSpecialRequirement = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            specialRequirements: prev.specialRequirements.filter(
                (_, i) => i !== index,
            ),
        }));
    };

    const utils = trpc.useUtils();
    const createAwardMutation = trpc.award.createAward.useMutation({
        onSuccess: () => {
            // Invalidate and refetch awards list
            utils.award.getAwards.invalidate();
        },
    });

    const handleSubmit = async () => {
        // Validate dates before submission
        const isValidDates = validateDates(formData);
        if (!isValidDates) {
            addAlert(
                'error',
                'Validation Error',
                'Please fix the date validation errors before submitting.',
            );
            return;
        }

        // Check required fields
        const requiredFields = [
            { field: formData.name, name: 'Award Name' },
            { field: formData.description, name: 'Description' },
            { field: formData.submissionDeadline, name: 'Submission Deadline' },
        ];

        const missingFields = requiredFields
            .filter(({ field }) => !field)
            .map(({ name }) => name);

        if (missingFields.length > 0) {
            addAlert(
                'error',
                'Required Fields Missing',
                `Please fill in the following required fields: ${missingFields.join(', ')}.`,
            );
            return;
        }

        setIsSubmitting(true);
        try {
            await createAwardMutation.mutateAsync({
                name: formData.name,
                description: formData.description,
                category: formData.category,
                eligibilityLevel: formData.eligibilityLevel,
                eligibilityStates: formData.eligibilityStates,
                eligibilityBranches: formData.eligibilityBranches,
                maxAge: formData.maxAge,
                specialRequirements: formData.specialRequirements.filter(
                    (req) => req.trim() !== '',
                ),
                submissionDeadline: formData.submissionDeadline,
                evaluationDeadline: formData.evaluationDeadline || undefined,
                resultDeadline: formData.resultDeadline || undefined,
                customFields: formData.customFields,
            });

            // Clear draft after successful creation
            localStorage.removeItem('award-draft');
            addAlert('success', 'Award Created', 'Award created successfully!');
            router.push('/awards');
        } catch (error) {
            console.error('Error creating award:', error);
            addAlert(
                'error',
                'Creation Failed',
                'Error creating award. Please try again.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveDraft = async () => {
        setIsSavingDraft(true);
        try {
            localStorage.setItem('award-draft', JSON.stringify(formData));
            addAlert('success', 'Draft Saved', 'Draft saved successfully!');
        } catch (error) {
            console.error('Error saving draft:', error);
            addAlert(
                'error',
                'Save Failed',
                'Error saving draft. Please try again.',
            );
        } finally {
            setIsSavingDraft(false);
        }
    };

    const clearDraft = () => {
        setShowClearDraftDialog(true);
    };

    const confirmClearDraft = () => {
        localStorage.removeItem('award-draft');
        const initialData = normalizeFormData({});
        setFormData(initialData);
        setDraftLoaded(false);
        setCurrentStep('basic');
        setShowClearDraftDialog(false);
        addAlert('success', 'Draft Cleared', 'Draft cleared successfully!');
    };

    // Basic Award Information Step
    const renderBasicStep = () => (
        <div className="space-y-6">
            {/* Award Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Award Configuration
                    </CardTitle>
                    <CardDescription>
                        Configure the basic details and requirements for this
                        award
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="award-name">Award Name *</Label>
                        <Input
                            id="award-name"
                            value={formData.name}
                            onChange={(e) =>
                                updateFormData('name', e.target.value)
                            }
                            placeholder="e.g., Best Innovation Award 2024"
                        />
                    </div>

                    <div>
                        <Label htmlFor="award-description">Description *</Label>
                        <Textarea
                            id="award-description"
                            value={formData.description}
                            onChange={(e) =>
                                updateFormData('description', e.target.value)
                            }
                            placeholder="Describe the purpose and scope of this award"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="award-category">Category *</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) =>
                                updateFormData('category', value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select award category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="student">
                                    Student Award
                                </SelectItem>
                                <SelectItem value="faculty">
                                    Faculty Award
                                </SelectItem>
                                <SelectItem value="institution">
                                    Institution Award
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor="submission-deadline">
                                Submission Deadline *
                            </Label>
                            <Input
                                id="submission-deadline"
                                type="date"
                                value={formData.submissionDeadline}
                                onChange={(e) =>
                                    updateFormData(
                                        'submissionDeadline',
                                        e.target.value,
                                    )
                                }
                                className={
                                    dateErrors.submissionDeadline
                                        ? 'border-red-500'
                                        : ''
                                }
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {dateErrors.submissionDeadline && (
                                <p className="mt-1 text-sm text-red-500">
                                    {dateErrors.submissionDeadline}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="evaluation-deadline">
                                Evaluation Deadline
                            </Label>
                            <Input
                                id="evaluation-deadline"
                                type="date"
                                value={formData.evaluationDeadline}
                                onChange={(e) =>
                                    updateFormData(
                                        'evaluationDeadline',
                                        e.target.value,
                                    )
                                }
                                className={
                                    dateErrors.evaluationDeadline
                                        ? 'border-red-500'
                                        : ''
                                }
                                min={formData.submissionDeadline || undefined}
                            />
                            {dateErrors.evaluationDeadline && (
                                <p className="mt-1 text-sm text-red-500">
                                    {dateErrors.evaluationDeadline}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Must be after submission deadline
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="result-deadline">
                                Result Announcement
                            </Label>
                            <Input
                                id="result-deadline"
                                type="date"
                                value={formData.resultDeadline}
                                onChange={(e) =>
                                    updateFormData(
                                        'resultDeadline',
                                        e.target.value,
                                    )
                                }
                                className={
                                    dateErrors.resultDeadline
                                        ? 'border-red-500'
                                        : ''
                                }
                                min={
                                    formData.evaluationDeadline ||
                                    formData.submissionDeadline ||
                                    undefined
                                }
                            />
                            {dateErrors.resultDeadline && (
                                <p className="mt-1 text-sm text-red-500">
                                    {dateErrors.resultDeadline}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Must be after{' '}
                                {formData.evaluationDeadline
                                    ? 'evaluation'
                                    : 'submission'}{' '}
                                deadline
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Eligibility Criteria */}
            <Card>
                <CardHeader>
                    <CardTitle>Eligibility Criteria</CardTitle>
                    <CardDescription>
                        Define who can apply for this award
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Education Level</Label>
                        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
                            {['UG', 'PG', 'Diploma', 'PhD'].map((level) => (
                                <label
                                    key={level}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.eligibilityLevel.includes(
                                            level,
                                        )}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                updateFormData(
                                                    'eligibilityLevel',
                                                    [
                                                        ...formData.eligibilityLevel,
                                                        level,
                                                    ],
                                                );
                                            } else {
                                                updateFormData(
                                                    'eligibilityLevel',
                                                    formData.eligibilityLevel.filter(
                                                        (l) => l !== level,
                                                    ),
                                                );
                                            }
                                        }}
                                    />
                                    <span className="text-sm">{level}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="max-age">Maximum Age (optional)</Label>
                        <Input
                            id="max-age"
                            type="number"
                            value={formData.maxAge?.toString() || ''}
                            onChange={(e) =>
                                updateFormData(
                                    'maxAge',
                                    e.target.value
                                        ? parseInt(e.target.value)
                                        : undefined,
                                )
                            }
                            placeholder="e.g., 25"
                        />
                    </div>

                    <div>
                        <Label>Special Requirements</Label>
                        <div className="mt-2 space-y-2">
                            {formData.specialRequirements.map((req, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={req || ''}
                                        onChange={(e) =>
                                            updateSpecialRequirement(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter a special requirement"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            removeSpecialRequirement(index)
                                        }
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addSpecialRequirement}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Requirement
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Standard Application Fields Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Standard Application Fields</CardTitle>
                    <CardDescription>
                        These fields will automatically be included in the
                        application form
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <h5 className="mb-3 font-medium text-blue-800">
                            Applicants will be required to provide:
                        </h5>
                        <ul className="space-y-2 text-sm text-blue-700">
                            <li>
                                • Personal Information (Name, Address, Contact
                                Details, Date of Birth)
                            </li>
                            <li>
                                • Academic Qualifications and Field of
                                Specialization
                            </li>
                            <li>
                                • Professional Details (Department, Designation,
                                Institution Address)
                            </li>
                            <li>
                                • Project Information (Title, Guide Details,
                                Brief Resume, Benefits)
                            </li>
                            <li>
                                • Required Documents (Project Reports,
                                Institution Remarks)
                            </li>
                            <li>• ISTE Membership Status</li>
                            {formData.category === 'student' && (
                                <li>• Semester/Year Information</li>
                            )}
                            {formData.category === 'faculty' && (
                                <li>• Teaching Experience (UG/PG levels)</li>
                            )}
                            {formData.category === 'faculty' && (
                                <li>
                                    • Industry Experience and Other Achievements
                                </li>
                            )}
                        </ul>
                        <p className="mt-3 text-xs text-blue-600">
                            Note: Use the Form Builder to add any additional
                            custom questions specific to this award
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // Form Builder Step
    const renderFormStep = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Custom Application Form Builder
                    </CardTitle>
                    <CardDescription>
                        Add custom questions specific to this award (in addition
                        to the standard fields)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CustomFieldFormBuilder
                        value={formData.customFields}
                        onChange={(fields) =>
                            updateFormData('customFields', fields)
                        }
                    />
                </CardContent>
            </Card>
        </div>
    );

    // Preview Step
    const renderPreviewStep = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5" />
                        Award Preview
                    </CardTitle>
                    <CardDescription>
                        Review your award configuration before publishing
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Award Summary */}
                    <div className="rounded-lg bg-gray-50 p-6">
                        <h3 className="mb-2 text-xl font-semibold">
                            {formData.name}
                        </h3>
                        <p className="mb-6 text-gray-600">
                            {formData.description}
                        </p>

                        {/* Award Details */}
                        <div className="mb-6">
                            <h4 className="mb-3 text-lg font-medium">
                                Award Details
                            </h4>
                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <span className="font-medium">
                                        Category:
                                    </span>
                                    <Badge variant="outline" className="ml-2">
                                        {formData.category}
                                    </Badge>
                                </div>
                                <div>
                                    <span className="font-medium">
                                        Submission Deadline:
                                    </span>
                                    <span className="ml-2">
                                        {formData.submissionDeadline}
                                    </span>
                                </div>
                                {formData.evaluationDeadline && (
                                    <div>
                                        <span className="font-medium">
                                            Evaluation Deadline:
                                        </span>
                                        <span className="ml-2">
                                            {formData.evaluationDeadline}
                                        </span>
                                    </div>
                                )}
                                {formData.resultDeadline && (
                                    <div>
                                        <span className="font-medium">
                                            Result Announcement:
                                        </span>
                                        <span className="ml-2">
                                            {formData.resultDeadline}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <span className="font-medium">
                                        Eligibility Levels:
                                    </span>
                                    <span className="ml-2">
                                        {formData.eligibilityLevel.join(', ') ||
                                            'All'}
                                    </span>
                                </div>
                                {formData.maxAge && (
                                    <div>
                                        <span className="font-medium">
                                            Maximum Age:
                                        </span>
                                        <span className="ml-2">
                                            {formData.maxAge} years
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Special Requirements */}
                        {formData.specialRequirements.length > 0 && (
                            <div className="mb-6">
                                <h4 className="mb-3 text-lg font-medium">
                                    Special Requirements
                                </h4>
                                <ul className="list-inside list-disc text-sm text-gray-600">
                                    {formData.specialRequirements.map(
                                        (req, index) => (
                                            <li key={index}>{req}</li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Standard Fields Info */}
                        <div className="mb-6">
                            <h4 className="mb-3 text-lg font-medium">
                                Standard Application Fields
                            </h4>
                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <p className="mb-2 text-sm text-blue-700">
                                    All applicants will be required to provide:
                                </p>
                                <ul className="space-y-1 text-sm text-blue-700">
                                    <li>
                                        • Personal Information & Contact Details
                                    </li>
                                    <li>
                                        • Academic Qualifications &
                                        Specialization
                                    </li>
                                    <li>
                                        • Professional Details & Institution
                                        Information
                                    </li>
                                    <li>
                                        • Project Information & Documentation
                                    </li>
                                    <li>• ISTE Membership Status</li>
                                    {formData.category === 'student' && (
                                        <li>• Academic Year/Semester</li>
                                    )}
                                    {formData.category === 'faculty' && (
                                        <li>
                                            • Teaching & Industry Experience
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Custom Form Preview */}
                    <CustomFieldFormBuilderPreview
                        form={{ questions: formData.customFields }}
                    />
                </CardContent>
            </Card>
        </div>
    );

    const steps = [
        { id: 'basic', label: 'Award Info', icon: Trophy },
        { id: 'form', label: 'Form Builder', icon: Settings },
        { id: 'preview', label: 'Preview', icon: Eye },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create New Award
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Configure a new award with custom application form and
                        eligibility criteria
                    </p>

                    {/* Draft loaded notification */}
                    {draftLoaded && (
                        <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-blue-800">
                                        Draft Loaded
                                    </p>
                                    <p className="text-xs text-blue-600">
                                        Your previously saved draft has been
                                        loaded. You can continue editing or
                                        clear it to start fresh.
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearDraft}
                                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                            >
                                Clear Draft
                            </Button>
                        </div>
                    )}
                </div>

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

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted =
                                steps.findIndex((s) => s.id === currentStep) >
                                index;

                            return (
                                <div
                                    key={step.id}
                                    className="flex items-center"
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                            isActive
                                                ? 'border-blue-600 bg-blue-600 text-white'
                                                : isCompleted
                                                  ? 'border-green-600 bg-green-600 text-white'
                                                  : 'border-gray-300 bg-white text-gray-500'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : (
                                            <Icon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <span
                                        className={`ml-2 text-sm font-medium ${
                                            isActive
                                                ? 'text-blue-600'
                                                : isCompleted
                                                  ? 'text-green-600'
                                                  : 'text-gray-500'
                                        }`}
                                    >
                                        {step.label}
                                    </span>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`mx-4 h-0.5 w-16 ${
                                                isCompleted
                                                    ? 'bg-green-600'
                                                    : 'bg-gray-300'
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <div className="mb-8">
                    {currentStep === 'basic' && renderBasicStep()}
                    {currentStep === 'form' && renderFormStep()}
                    {currentStep === 'preview' && renderPreviewStep()}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => {
                            const currentIndex = steps.findIndex(
                                (s) => s.id === currentStep,
                            );
                            if (currentIndex > 0) {
                                setCurrentStep(
                                    steps[currentIndex - 1].id as any,
                                );
                            }
                        }}
                        disabled={currentStep === 'basic'}
                    >
                        Previous
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={saveDraft}
                            disabled={isSavingDraft}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isSavingDraft ? 'Saving...' : 'Save Draft'}
                        </Button>

                        {currentStep === 'preview' ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={
                                    isSubmitting ||
                                    Object.keys(dateErrors).length > 0
                                }
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Award'}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    // Validate current step before proceeding
                                    if (currentStep === 'basic') {
                                        const requiredFields = [
                                            {
                                                field: formData.name,
                                                name: 'Award Name',
                                            },
                                            {
                                                field: formData.description,
                                                name: 'Description',
                                            },
                                            {
                                                field: formData.submissionDeadline,
                                                name: 'Submission Deadline',
                                            },
                                        ];

                                        const missingFields = requiredFields
                                            .filter(({ field }) => !field)
                                            .map(({ name }) => name);

                                        if (missingFields.length > 0) {
                                            addAlert(
                                                'error',
                                                'Required Fields Missing',
                                                `Please fill in the following required fields: ${missingFields.join(', ')}.`,
                                            );
                                            return;
                                        }
                                        if (
                                            Object.keys(dateErrors).length > 0
                                        ) {
                                            addAlert(
                                                'error',
                                                'Validation Error',
                                                'Please fix the date validation errors before proceeding.',
                                            );
                                            return;
                                        }
                                    }

                                    const currentIndex = steps.findIndex(
                                        (s) => s.id === currentStep,
                                    );
                                    if (currentIndex < steps.length - 1) {
                                        setCurrentStep(
                                            steps[currentIndex + 1].id as any,
                                        );
                                    }
                                }}
                                disabled={
                                    currentStep === 'basic' &&
                                    Object.keys(dateErrors).length > 0
                                }
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Clear Draft Confirmation Dialog */}
            <Dialog
                open={showClearDraftDialog}
                onOpenChange={setShowClearDraftDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Clear Draft</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to clear the saved draft? This
                            action cannot be undone and all your progress will
                            be lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowClearDraftDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmClearDraft}
                        >
                            Clear Draft
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreateAwardPage;
