'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    Trash2,
    Upload,
    FileText,
    User,
    Mail,
    Phone,
    Building,
    MapPin,
    Users,
    GraduationCap,
    X,
} from 'lucide-react';
import {
    AwardQuestion,
    StudentNominee,
    GuideInfo,
    InstitutionInfo,
    AwardQuestionType,
} from '@/types/award-types';

interface AwardFieldRendererProps {
    question: AwardQuestion;
    value?: any;
    onChange?: (value: any) => void;
    disabled?: boolean;
    onAlert?: (
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string,
    ) => void;
}

// Student Nominee Field Component
const StudentNomineeField: React.FC<{
    maxStudents: number;
    minStudents: number;
    value: StudentNominee[];
    onChange: (nominees: StudentNominee[]) => void;
    disabled?: boolean;
}> = ({ maxStudents, minStudents, value = [], onChange, disabled }) => {
    const addNominee = () => {
        if (value.length < maxStudents) {
            onChange([
                ...value,
                {
                    name: '',
                    branch: '',
                    semester: '',
                    year: '',
                    email: '',
                    mobile: '',
                    membership: '',
                },
            ]);
        }
    };

    const removeNominee = (index: number) => {
        if (value.length > minStudents) {
            onChange(value.filter((_, i) => i !== index));
        }
    };

    const updateNominee = (
        index: number,
        field: keyof StudentNominee,
        newValue: string,
    ) => {
        const updated = [...value];
        updated[index] = { ...updated[index], [field]: newValue };
        onChange(updated);
    };

    return (
        <div className="space-y-4">
            {value.map((nominee, index) => (
                <Card key={index} className="relative">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5" />
                                Student Nominee {index + 1}
                            </CardTitle>
                            {value.length > minStudents && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeNominee(index)}
                                    disabled={disabled}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor={`nominee-${index}-name`}>
                                    Full Name *
                                </Label>
                                <Input
                                    id={`nominee-${index}-name`}
                                    value={nominee.name}
                                    onChange={(e) =>
                                        updateNominee(
                                            index,
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`nominee-${index}-branch`}>
                                    Branch *
                                </Label>
                                <Input
                                    id={`nominee-${index}-branch`}
                                    value={nominee.branch}
                                    onChange={(e) =>
                                        updateNominee(
                                            index,
                                            'branch',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="e.g., Computer Science"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`nominee-${index}-semester`}>
                                    Semester *
                                </Label>
                                <Input
                                    id={`nominee-${index}-semester`}
                                    value={nominee.semester}
                                    onChange={(e) =>
                                        updateNominee(
                                            index,
                                            'semester',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="e.g., 6th Semester"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`nominee-${index}-year`}>
                                    Year *
                                </Label>
                                <Input
                                    id={`nominee-${index}-year`}
                                    value={nominee.year}
                                    onChange={(e) =>
                                        updateNominee(
                                            index,
                                            'year',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="e.g., 2024"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`nominee-${index}-email`}>
                                    Email *
                                </Label>
                                <Input
                                    id={`nominee-${index}-email`}
                                    type="email"
                                    value={nominee.email}
                                    onChange={(e) =>
                                        updateNominee(
                                            index,
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="student@example.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`nominee-${index}-mobile`}>
                                    Mobile Number *
                                </Label>
                                <Input
                                    id={`nominee-${index}-mobile`}
                                    value={nominee.mobile}
                                    onChange={(e) =>
                                        updateNominee(
                                            index,
                                            'mobile',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor={`nominee-${index}-membership`}>
                                    Professional Society Membership
                                </Label>
                                <Input
                                    id={`nominee-${index}-membership`}
                                    value={nominee.membership || ''}
                                    onChange={(e) =>
                                        updateNominee(
                                            index,
                                            'membership',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="e.g., ISTE Student Member"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {value.length < maxStudents && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={addNominee}
                    disabled={disabled}
                    className="w-full"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student Nominee ({value.length}/{maxStudents})
                </Button>
            )}
        </div>
    );
};

// File Upload Field Component
const FileUploadField: React.FC<{
    fileConfig: any;
    value?: File;
    onChange: (file: File | undefined) => void;
    disabled?: boolean;
    onAlert?: (
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string,
    ) => void;
}> = ({ fileConfig, value, onChange, disabled, onAlert }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size
            if (file.size > fileConfig.maxSize * 1024 * 1024) {
                if (onAlert) {
                    onAlert(
                        'error',
                        'File Too Large',
                        `File size must be less than ${fileConfig.maxSize}MB`,
                    );
                }
                return;
            }

            // Validate file type
            if (!fileConfig.allowedTypes.includes(file.type)) {
                if (onAlert) {
                    onAlert(
                        'error',
                        'Invalid File Type',
                        `Please select a valid file type: ${fileConfig.allowedTypes.join(', ')}`,
                    );
                }
                return;
            }

            onChange(file);
        }
    };

    return (
        <div className="space-y-3">
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={fileConfig.allowedTypes.join(',')}
                    onChange={handleFileSelect}
                    disabled={disabled}
                    className="hidden"
                />

                {value ? (
                    <div className="space-y-2">
                        <FileText className="mx-auto h-12 w-12 text-green-500" />
                        <p className="text-sm font-medium">{value.name}</p>
                        <p className="text-xs text-gray-500">
                            {(value.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <div className="flex justify-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={disabled}
                            >
                                Replace File
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onChange(undefined)}
                                disabled={disabled}
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
                            disabled={disabled}
                        >
                            Choose File
                        </Button>
                        <p className="text-xs text-gray-500">
                            {fileConfig.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Guide Details Field Component
const GuideDetailsField: React.FC<{
    value: GuideInfo[];
    onChange: (guides: GuideInfo[]) => void;
    disabled?: boolean;
}> = ({ value = [], onChange, disabled }) => {
    const addGuide = () => {
        onChange([
            ...value,
            {
                name: '',
                designation: '',
                department: '',
                email: '',
                mobile: '',
                address: '',
            },
        ]);
    };

    const removeGuide = (index: number) => {
        if (value.length > 1) {
            onChange(value.filter((_, i) => i !== index));
        }
    };

    const updateGuide = (
        index: number,
        field: keyof GuideInfo,
        newValue: string,
    ) => {
        const updated = [...value];
        updated[index] = { ...updated[index], [field]: newValue };
        onChange(updated);
    };

    // Initialize with one guide if empty
    if (value.length === 0) {
        onChange([
            {
                name: '',
                designation: '',
                department: '',
                email: '',
                mobile: '',
                address: '',
            },
        ]);
    }

    return (
        <div className="space-y-4">
            {value.map((guide, index) => (
                <Card key={index}>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <GraduationCap className="h-5 w-5" />
                                Guide {index + 1}
                            </CardTitle>
                            {value.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeGuide(index)}
                                    disabled={disabled}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor={`guide-${index}-name`}>
                                    Name *
                                </Label>
                                <Input
                                    id={`guide-${index}-name`}
                                    value={guide.name}
                                    onChange={(e) =>
                                        updateGuide(
                                            index,
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="Dr. John Doe"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`guide-${index}-designation`}>
                                    Designation *
                                </Label>
                                <Input
                                    id={`guide-${index}-designation`}
                                    value={guide.designation}
                                    onChange={(e) =>
                                        updateGuide(
                                            index,
                                            'designation',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="Professor"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`guide-${index}-department`}>
                                    Department *
                                </Label>
                                <Input
                                    id={`guide-${index}-department`}
                                    value={guide.department}
                                    onChange={(e) =>
                                        updateGuide(
                                            index,
                                            'department',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="Computer Science & Engineering"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`guide-${index}-email`}>
                                    Email
                                </Label>
                                <Input
                                    id={`guide-${index}-email`}
                                    type="email"
                                    value={guide.email || ''}
                                    onChange={(e) =>
                                        updateGuide(
                                            index,
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="guide@institution.edu"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`guide-${index}-mobile`}>
                                    Mobile
                                </Label>
                                <Input
                                    id={`guide-${index}-mobile`}
                                    value={guide.mobile || ''}
                                    onChange={(e) =>
                                        updateGuide(
                                            index,
                                            'mobile',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor={`guide-${index}-address`}>
                                    Address *
                                </Label>
                                <Textarea
                                    id={`guide-${index}-address`}
                                    value={guide.address}
                                    onChange={(e) =>
                                        updateGuide(
                                            index,
                                            'address',
                                            e.target.value,
                                        )
                                    }
                                    disabled={disabled}
                                    placeholder="Complete address with department and institution"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Button
                type="button"
                variant="outline"
                onClick={addGuide}
                disabled={disabled}
                className="w-full"
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Guide
            </Button>
        </div>
    );
};

// Institution Address Field Component
const InstitutionAddressField: React.FC<{
    value: InstitutionInfo;
    onChange: (info: InstitutionInfo) => void;
    disabled?: boolean;
}> = ({ value = {} as InstitutionInfo, onChange, disabled }) => {
    const updateField = (field: keyof InstitutionInfo, newValue: string) => {
        onChange({ ...value, [field]: newValue });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Institution Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="institution-name">Institution Name *</Label>
                    <Input
                        id="institution-name"
                        value={value.name || ''}
                        onChange={(e) => updateField('name', e.target.value)}
                        disabled={disabled}
                        placeholder="Name of the institution"
                    />
                </div>

                <div>
                    <Label htmlFor="institution-address">Address *</Label>
                    <Textarea
                        id="institution-address"
                        value={value.address || ''}
                        onChange={(e) => updateField('address', e.target.value)}
                        disabled={disabled}
                        placeholder="Complete institutional address"
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="institution-city">City *</Label>
                        <Input
                            id="institution-city"
                            value={value.city || ''}
                            onChange={(e) =>
                                updateField('city', e.target.value)
                            }
                            disabled={disabled}
                            placeholder="City"
                        />
                    </div>
                    <div>
                        <Label htmlFor="institution-state">State *</Label>
                        <Input
                            id="institution-state"
                            value={value.state || ''}
                            onChange={(e) =>
                                updateField('state', e.target.value)
                            }
                            disabled={disabled}
                            placeholder="State"
                        />
                    </div>
                    <div>
                        <Label htmlFor="institution-pincode">Pincode *</Label>
                        <Input
                            id="institution-pincode"
                            value={value.pincode || ''}
                            onChange={(e) =>
                                updateField('pincode', e.target.value)
                            }
                            disabled={disabled}
                            placeholder="123456"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="hoi-name">
                            Head of Institution Name *
                        </Label>
                        <Input
                            id="hoi-name"
                            value={value.hoiName || ''}
                            onChange={(e) =>
                                updateField('hoiName', e.target.value)
                            }
                            disabled={disabled}
                            placeholder="Dr. Principal Name"
                        />
                    </div>
                    <div>
                        <Label htmlFor="hoi-designation">
                            HOI Designation *
                        </Label>
                        <Input
                            id="hoi-designation"
                            value={value.hoiDesignation || ''}
                            onChange={(e) =>
                                updateField('hoiDesignation', e.target.value)
                            }
                            disabled={disabled}
                            placeholder="Principal / Director"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Project Resume Field with Word Count
const ProjectResumeField: React.FC<{
    value: string;
    onChange: (value: string) => void;
    wordLimit?: { min?: number; max?: number };
    disabled?: boolean;
}> = ({ value = '', onChange, wordLimit, disabled }) => {
    const wordCount = value
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
    const isWithinLimit =
        !wordLimit ||
        ((!wordLimit.min || wordCount >= wordLimit.min) &&
            (!wordLimit.max || wordCount <= wordLimit.max));

    return (
        <div className="space-y-2">
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder="Provide a brief resume of your project including objectives, methodology, results, and impact..."
                rows={8}
                className={!isWithinLimit ? 'border-red-500' : ''}
            />
            <div className="flex items-center justify-between text-sm">
                <span
                    className={`${!isWithinLimit ? 'text-red-500' : 'text-gray-500'}`}
                >
                    Word count: {wordCount}
                    {wordLimit && (
                        <span className="ml-2">
                            (Required: {wordLimit.min || 0} -{' '}
                            {wordLimit.max || '∞'} words)
                        </span>
                    )}
                </span>
                {!isWithinLimit && (
                    <Badge variant="destructive" className="text-xs">
                        {wordLimit?.min && wordCount < wordLimit.min
                            ? 'Too short'
                            : 'Too long'}
                    </Badge>
                )}
            </div>
        </div>
    );
};

// Main Award Field Renderer Component
const AwardFieldRenderer: React.FC<AwardFieldRendererProps> = ({
    question,
    value,
    onChange,
    disabled = false,
    onAlert,
}) => {
    switch (question.type) {
        case 'student_nominee':
            return (
                <StudentNomineeField
                    maxStudents={question.maxStudents || 2}
                    minStudents={question.minStudents || 1}
                    value={value || []}
                    onChange={onChange || (() => {})}
                    disabled={disabled}
                />
            );

        case 'file_upload':
            return (
                <FileUploadField
                    fileConfig={question.fileConfig}
                    value={value}
                    onChange={onChange || (() => {})}
                    disabled={disabled}
                    onAlert={onAlert}
                />
            );

        case 'guide_details':
            return (
                <GuideDetailsField
                    value={value || []}
                    onChange={onChange || (() => {})}
                    disabled={disabled}
                />
            );

        case 'institution_address':
            return (
                <InstitutionAddressField
                    value={value || {}}
                    onChange={onChange || (() => {})}
                    disabled={disabled}
                />
            );

        case 'project_resume':
            return (
                <ProjectResumeField
                    value={value || ''}
                    onChange={onChange || (() => {})}
                    wordLimit={question.wordLimit}
                    disabled={disabled}
                />
            );

        case 'contact_info':
            return (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="contact-email">Email Address *</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            value={value?.email || ''}
                            onChange={(e) =>
                                onChange?.({ ...value, email: e.target.value })
                            }
                            disabled={disabled}
                            placeholder="your.email@example.com"
                        />
                    </div>
                    <div>
                        <Label htmlFor="contact-mobile">Mobile Number *</Label>
                        <Input
                            id="contact-mobile"
                            value={value?.mobile || ''}
                            onChange={(e) =>
                                onChange?.({ ...value, mobile: e.target.value })
                            }
                            disabled={disabled}
                            placeholder="+91 9876543210"
                        />
                    </div>
                </div>
            );

        case 'discipline_selector':
            return (
                <Select
                    value={value || ''}
                    onValueChange={(newValue) => onChange?.(newValue)}
                    disabled={disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select your discipline/branch" />
                    </SelectTrigger>
                    <SelectContent>
                        {question.disciplines?.map((discipline) => (
                            <SelectItem key={discipline} value={discipline}>
                                {discipline}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        case 'signature_section':
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>Head of Institution Signature</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            This section will be completed by the Head of
                            Institution with their signature and official seal.
                        </p>
                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                            <p className="text-gray-500">
                                Signature and Seal Area
                            </p>
                            <p className="mt-2 text-xs text-gray-400">
                                To be completed by HOI before submission
                            </p>
                        </div>
                    </CardContent>
                </Card>
            );

        // Fallback to basic field types
        case 'short_answer':
            return (
                <Input
                    value={value || ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    placeholder="Enter your answer"
                />
            );

        case 'paragraph':
            return (
                <Textarea
                    value={value || ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    placeholder="Enter your detailed answer"
                    rows={4}
                />
            );

        case 'dropdown':
            return (
                <Select
                    value={value || ''}
                    onValueChange={(newValue) => onChange?.(newValue)}
                    disabled={disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        {question.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label || option.value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );

        case 'date':
            return (
                <Input
                    type="date"
                    value={value || ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                />
            );

        case 'date_range':
            return (
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
                                    onChange?.({
                                        ...value,
                                        from: e.target.value,
                                    })
                                }
                                disabled={disabled}
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
                                    onChange?.({ ...value, to: e.target.value })
                                }
                                disabled={disabled}
                            />
                        </div>
                    </div>
                </div>
            );

        default:
            return (
                <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">
                        Field type "{question.type}" not yet implemented
                    </p>
                </div>
            );
    }
};

interface Guide {
    name: string;
    address: string;
    email: string;
    mobile: string;
}

interface FileData {
    id: number;
    filename: string;
    size: number;
    mimetype: string;
}

interface Project {
    title: string;
    guides: Guide[];
    outstandingWorkArea: string;
    briefResume: string;
    briefResumeFile?: FileData; // Optional PDF upload for brief resume
    institutionRemarks?: FileData; // Required PDF upload for institution remarks
    benefits: string[];
}

interface StandardApplicationData {
    // Personal Information
    applicantName: string;
    designation: string;
    address: string;
    pincode: string;
    phoneNumber: string;
    dateOfBirth: string;
    academicQualification: string;
    fieldOfSpecialization: string;

    // Professional Information
    department: string;
    semesterYear: string; // For students
    teachingExperience: {
        ug: string;
        pg: string;
    };
    industryExperience: string;
    otherExperience: string;
    isMember: boolean;
    institutionAddress: string;

    // Project Information
    projects: Project[];
}

interface StandardApplicationFieldsProps {
    category: 'student' | 'faculty' | 'institution';
    data: StandardApplicationData;
    onChange: (data: StandardApplicationData) => void;
    onAlert?: (
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string,
    ) => void;
}

// PDF Upload Component for Project Files
interface ProjectFileUploadProps {
    value?: FileData;
    onChange: (fileData: FileData | undefined) => void;
    fieldId: string;
    onAlert?: (
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string,
    ) => void;
}

const ProjectFileUpload: React.FC<ProjectFileUploadProps> = ({
    value,
    onChange,
    fieldId,
    onAlert,
}) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            onAlert?.(
                'error',
                'File Too Large',
                'File size must be less than 10MB',
            );
            return;
        }

        // Validate file type (PDF only)
        if (file.type !== 'application/pdf') {
            onAlert?.(
                'error',
                'Invalid File Type',
                'Please select a PDF file only',
            );
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fieldId', fieldId);

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
            onAlert?.(
                'success',
                'Upload Successful',
                'File uploaded successfully',
            );
        } catch (error) {
            console.error('Upload error:', error);
            onAlert?.(
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
            onAlert?.('error', 'Download Failed', 'Failed to download file.');
        }
    };

    return (
        <div className="space-y-3">
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
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
                            {uploading ? 'Uploading...' : 'Choose PDF File'}
                        </Button>
                        <p className="text-xs text-gray-500">
                            PDF files only, up to 10MB
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const StandardApplicationFields: React.FC<StandardApplicationFieldsProps> = ({
    category,
    data,
    onChange,
    onAlert,
}) => {
    const updateField = (field: keyof StandardApplicationData, value: any) => {
        onChange({
            ...data,
            [field]: value,
        });
    };

    const addProject = () => {
        const newProject: Project = {
            title: '',
            guides: [{ name: '', address: '', email: '', mobile: '' }],
            outstandingWorkArea: '',
            briefResume: '',
            briefResumeFile: undefined,
            institutionRemarks: undefined,
            benefits: ['', '', ''],
        };
        updateField('projects', [...data.projects, newProject]);
    };

    const updateProject = (
        projectIndex: number,
        field: keyof Project,
        value: any,
    ) => {
        const updatedProjects = data.projects.map((project, index) =>
            index === projectIndex ? { ...project, [field]: value } : project,
        );
        updateField('projects', updatedProjects);
    };

    const removeProject = (projectIndex: number) => {
        const updatedProjects = data.projects.filter(
            (_, index) => index !== projectIndex,
        );
        updateField('projects', updatedProjects);
    };

    const addGuide = (projectIndex: number) => {
        const newGuide: Guide = {
            name: '',
            address: '',
            email: '',
            mobile: '',
        };
        const updatedProjects = data.projects.map((project, index) =>
            index === projectIndex
                ? { ...project, guides: [...project.guides, newGuide] }
                : project,
        );
        updateField('projects', updatedProjects);
    };

    const updateGuide = (
        projectIndex: number,
        guideIndex: number,
        field: keyof Guide,
        value: string,
    ) => {
        const updatedProjects = data.projects.map((project, pIndex) =>
            pIndex === projectIndex
                ? {
                      ...project,
                      guides: project.guides.map((guide, gIndex) =>
                          gIndex === guideIndex
                              ? { ...guide, [field]: value }
                              : guide,
                      ),
                  }
                : project,
        );
        updateField('projects', updatedProjects);
    };

    const removeGuide = (projectIndex: number, guideIndex: number) => {
        const updatedProjects = data.projects.map((project, pIndex) =>
            pIndex === projectIndex
                ? {
                      ...project,
                      guides: project.guides.filter(
                          (_, gIndex) => gIndex !== guideIndex,
                      ),
                  }
                : project,
        );
        updateField('projects', updatedProjects);
    };

    const updateBenefit = (
        projectIndex: number,
        benefitIndex: number,
        value: string,
    ) => {
        const updatedProjects = data.projects.map((project, pIndex) =>
            pIndex === projectIndex
                ? {
                      ...project,
                      benefits: project.benefits.map((benefit, bIndex) =>
                          bIndex === benefitIndex ? value : benefit,
                      ),
                  }
                : project,
        );
        updateField('projects', updatedProjects);
    };

    return (
        <div className="space-y-6">
            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="applicant-name">Full Name *</Label>
                            <Input
                                id="applicant-name"
                                value={data.applicantName}
                                onChange={(e) =>
                                    updateField('applicantName', e.target.value)
                                }
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="designation">Designation *</Label>
                            <Input
                                id="designation"
                                value={data.designation}
                                onChange={(e) =>
                                    updateField('designation', e.target.value)
                                }
                                placeholder="e.g., Professor, Student, Assistant Professor"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="address">Address *</Label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) =>
                                updateField('address', e.target.value)
                            }
                            placeholder="Enter your complete address"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label htmlFor="pincode">Pincode *</Label>
                            <Input
                                id="pincode"
                                value={data.pincode}
                                onChange={(e) =>
                                    updateField('pincode', e.target.value)
                                }
                                placeholder="6-digit pincode"
                                maxLength={6}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone-number">Phone Number *</Label>
                            <Input
                                id="phone-number"
                                type="tel"
                                value={data.phoneNumber}
                                onChange={(e) =>
                                    updateField('phoneNumber', e.target.value)
                                }
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div>
                            <Label htmlFor="date-of-birth">
                                Date of Birth *
                            </Label>
                            <Input
                                id="date-of-birth"
                                type="date"
                                value={data.dateOfBirth}
                                onChange={(e) =>
                                    updateField('dateOfBirth', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="academic-qualification">
                            Academic Qualification *
                        </Label>
                        <Input
                            id="academic-qualification"
                            value={data.academicQualification}
                            onChange={(e) =>
                                updateField(
                                    'academicQualification',
                                    e.target.value,
                                )
                            }
                            placeholder="e.g., B.Tech, M.Tech, PhD in Computer Science"
                        />
                    </div>

                    <div>
                        <Label htmlFor="field-of-specialization">
                            Field of Specialization *
                        </Label>
                        <Input
                            id="field-of-specialization"
                            value={data.fieldOfSpecialization}
                            onChange={(e) =>
                                updateField(
                                    'fieldOfSpecialization',
                                    e.target.value,
                                )
                            }
                            placeholder="e.g., Artificial Intelligence, Machine Learning"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Professional Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="department">Department *</Label>
                        <Input
                            id="department"
                            value={data.department}
                            onChange={(e) =>
                                updateField('department', e.target.value)
                            }
                            placeholder="e.g., Computer Science, Mechanical Engineering"
                        />
                    </div>

                    {category === 'student' && (
                        <div>
                            <Label htmlFor="semester-year">
                                Semester/Year *
                            </Label>
                            <Input
                                id="semester-year"
                                value={data.semesterYear}
                                onChange={(e) =>
                                    updateField('semesterYear', e.target.value)
                                }
                                placeholder="e.g., 3rd Semester, 2nd Year"
                            />
                        </div>
                    )}

                    {category === 'faculty' && (
                        <>
                            <div>
                                <Label className="text-base font-medium">
                                    Teaching Experience (in years) *
                                </Label>
                                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="ug-experience">
                                            UG Level Teaching
                                        </Label>
                                        <Input
                                            id="ug-experience"
                                            type="number"
                                            value={data.teachingExperience.ug}
                                            onChange={(e) =>
                                                updateField(
                                                    'teachingExperience',
                                                    {
                                                        ...data.teachingExperience,
                                                        ug: e.target.value,
                                                    },
                                                )
                                            }
                                            placeholder="Years of UG teaching"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="pg-experience">
                                            PG Level Teaching
                                        </Label>
                                        <Input
                                            id="pg-experience"
                                            type="number"
                                            value={data.teachingExperience.pg}
                                            onChange={(e) =>
                                                updateField(
                                                    'teachingExperience',
                                                    {
                                                        ...data.teachingExperience,
                                                        pg: e.target.value,
                                                    },
                                                )
                                            }
                                            placeholder="Years of PG teaching"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="industry-experience">
                                    Industry Experience
                                </Label>
                                <Input
                                    id="industry-experience"
                                    value={data.industryExperience}
                                    onChange={(e) =>
                                        updateField(
                                            'industryExperience',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Mention industry experience details"
                                />
                            </div>

                            <div>
                                <Label htmlFor="other-experience">
                                    Other Experience
                                </Label>
                                <Textarea
                                    id="other-experience"
                                    value={data.otherExperience}
                                    onChange={(e) =>
                                        updateField(
                                            'otherExperience',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Mention any other relevant experience or achievements"
                                    rows={3}
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <Label htmlFor="is-member">ISTE Member *</Label>
                        <Select
                            value={data.isMember ? 'yes' : 'no'}
                            onValueChange={(value) =>
                                updateField('isMember', value === 'yes')
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select membership status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="institution-address">
                            Institution Address *
                        </Label>
                        <Textarea
                            id="institution-address"
                            value={data.institutionAddress}
                            onChange={(e) =>
                                updateField(
                                    'institutionAddress',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter complete address of the institution"
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Project Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Project Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {data.projects.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="mb-4 text-gray-500">
                                No projects added yet
                            </p>
                            <Button onClick={addProject} variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add First Project
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {data.projects.map((project, projectIndex) => (
                                <Card key={projectIndex} className="border-2">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-lg font-semibold">
                                                Project {projectIndex + 1}
                                            </h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    removeProject(projectIndex)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Project Title */}
                                        <div>
                                            <Label
                                                htmlFor={`project-title-${projectIndex}`}
                                            >
                                                Project Title *
                                            </Label>
                                            <Input
                                                id={`project-title-${projectIndex}`}
                                                value={project.title}
                                                onChange={(e) =>
                                                    updateProject(
                                                        projectIndex,
                                                        'title',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter project title"
                                            />
                                        </div>

                                        {/* Outstanding Work Area */}
                                        <div>
                                            <Label
                                                htmlFor={`outstanding-work-${projectIndex}`}
                                            >
                                                Outstanding Work Area *
                                            </Label>
                                            <p className="mb-2 text-sm text-gray-600">
                                                (Select only one - Multiple
                                                selections will disqualify the
                                                application)
                                            </p>
                                            <Select
                                                value={
                                                    project.outstandingWorkArea
                                                }
                                                onValueChange={(value) =>
                                                    updateProject(
                                                        projectIndex,
                                                        'outstandingWorkArea',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select area of outstanding work" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="rural-development">
                                                        Rural-oriented & society
                                                        relevant development
                                                        activity
                                                    </SelectItem>
                                                    <SelectItem value="industry-interaction">
                                                        Interaction with
                                                        industry
                                                    </SelectItem>
                                                    <SelectItem value="educational-technology">
                                                        Educational Technology &
                                                        Book Writing including
                                                        Laboratory Manual
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Brief Resume - Text or PDF */}
                                        <div>
                                            <Label className="text-base font-medium">
                                                Brief Resume of the Project
                                                (150-300 words) *
                                            </Label>
                                            <p className="mb-3 text-sm text-gray-600">
                                                You can either write the brief
                                                resume below OR upload a PDF
                                                file
                                            </p>

                                            {/* Text Input */}
                                            <div className="mb-4">
                                                <Label
                                                    htmlFor={`brief-resume-text-${projectIndex}`}
                                                >
                                                    Write Brief Resume
                                                </Label>
                                                <Textarea
                                                    id={`brief-resume-text-${projectIndex}`}
                                                    value={project.briefResume}
                                                    onChange={(e) =>
                                                        updateProject(
                                                            projectIndex,
                                                            'briefResume',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Provide a brief resume of your project (150-300 words)"
                                                    rows={4}
                                                />
                                            </div>

                                            {/* OR Divider */}
                                            <div className="my-4 flex items-center">
                                                <div className="flex-1 border-t border-gray-300"></div>
                                                <span className="bg-white px-3 text-sm text-gray-500">
                                                    OR
                                                </span>
                                                <div className="flex-1 border-t border-gray-300"></div>
                                            </div>

                                            {/* PDF Upload */}
                                            <div>
                                                <Label>
                                                    Upload Brief Resume (PDF)
                                                </Label>
                                                <div className="mt-2">
                                                    <ProjectFileUpload
                                                        value={
                                                            project.briefResumeFile
                                                        }
                                                        onChange={(fileData) =>
                                                            updateProject(
                                                                projectIndex,
                                                                'briefResumeFile',
                                                                fileData,
                                                            )
                                                        }
                                                        fieldId={`brief-resume-file-${projectIndex}`}
                                                        onAlert={onAlert}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Benefits */}
                                        <div>
                                            <Label className="text-base font-medium">
                                                List three benefits
                                                derived/contribution
                                                made/changes brought about *
                                            </Label>
                                            <div className="mt-2 space-y-3">
                                                {project.benefits.map(
                                                    (benefit, benefitIndex) => (
                                                        <div key={benefitIndex}>
                                                            <Label
                                                                htmlFor={`benefit-${projectIndex}-${benefitIndex}`}
                                                            >
                                                                Benefit{' '}
                                                                {benefitIndex +
                                                                    1}{' '}
                                                                *
                                                            </Label>
                                                            <Textarea
                                                                id={`benefit-${projectIndex}-${benefitIndex}`}
                                                                value={benefit}
                                                                onChange={(e) =>
                                                                    updateBenefit(
                                                                        projectIndex,
                                                                        benefitIndex,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder={`Describe benefit ${benefitIndex + 1}`}
                                                                rows={2}
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        {/* Guides Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-base font-medium">
                                                    Guide(s) Information *
                                                </Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        addGuide(projectIndex)
                                                    }
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Guide
                                                </Button>
                                            </div>

                                            {project.guides.map(
                                                (guide, guideIndex) => (
                                                    <Card
                                                        key={guideIndex}
                                                        className="border border-gray-200"
                                                    >
                                                        <CardContent className="pt-4">
                                                            <div className="mb-4 flex items-center justify-between">
                                                                <h5 className="font-medium">
                                                                    Guide{' '}
                                                                    {guideIndex +
                                                                        1}
                                                                </h5>
                                                                {project.guides
                                                                    .length >
                                                                    1 && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            removeGuide(
                                                                                projectIndex,
                                                                                guideIndex,
                                                                            )
                                                                        }
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`guide-name-${projectIndex}-${guideIndex}`}
                                                                    >
                                                                        Guide
                                                                        Name *
                                                                    </Label>
                                                                    <Input
                                                                        id={`guide-name-${projectIndex}-${guideIndex}`}
                                                                        value={
                                                                            guide.name
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateGuide(
                                                                                projectIndex,
                                                                                guideIndex,
                                                                                'name',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="Enter guide's full name"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`guide-email-${projectIndex}-${guideIndex}`}
                                                                    >
                                                                        Guide
                                                                        Email *
                                                                    </Label>
                                                                    <Input
                                                                        id={`guide-email-${projectIndex}-${guideIndex}`}
                                                                        type="email"
                                                                        value={
                                                                            guide.email
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateGuide(
                                                                                projectIndex,
                                                                                guideIndex,
                                                                                'email',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="guide@example.com"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`guide-mobile-${projectIndex}-${guideIndex}`}
                                                                    >
                                                                        Guide
                                                                        Mobile *
                                                                    </Label>
                                                                    <Input
                                                                        id={`guide-mobile-${projectIndex}-${guideIndex}`}
                                                                        type="tel"
                                                                        value={
                                                                            guide.mobile
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateGuide(
                                                                                projectIndex,
                                                                                guideIndex,
                                                                                'mobile',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="+91 98765 43210"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`guide-address-${projectIndex}-${guideIndex}`}
                                                                    >
                                                                        Guide
                                                                        Address
                                                                        *
                                                                    </Label>
                                                                    <Textarea
                                                                        id={`guide-address-${projectIndex}-${guideIndex}`}
                                                                        value={
                                                                            guide.address
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateGuide(
                                                                                projectIndex,
                                                                                guideIndex,
                                                                                'address',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="Enter guide's address"
                                                                        rows={2}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ),
                                            )}
                                        </div>

                                        {/* Institution Remarks */}
                                        <div className="border-t pt-6">
                                            <Label className="text-base font-medium">
                                                Remarks of the Head of the
                                                Institution or competent
                                                controlling officer, justifying
                                                the nomination *
                                            </Label>
                                            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                                <p className="text-sm text-amber-800">
                                                    <strong>Important:</strong>{' '}
                                                    These remarks from your
                                                    institution's head or
                                                    controlling officer will be
                                                    valuable in deciding the
                                                    award winner. Please ensure
                                                    the document is properly
                                                    signed and on official
                                                    letterhead.
                                                </p>
                                            </div>
                                            <div className="mt-4">
                                                <ProjectFileUpload
                                                    value={
                                                        project.institutionRemarks
                                                    }
                                                    onChange={(fileData) =>
                                                        updateProject(
                                                            projectIndex,
                                                            'institutionRemarks',
                                                            fileData,
                                                        )
                                                    }
                                                    fieldId={`institution-remarks-${projectIndex}`}
                                                    onAlert={onAlert}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <div className="text-center">
                                <Button onClick={addProject} variant="outline">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Another Project
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export { StandardApplicationFields };
export default StandardApplicationFields;
