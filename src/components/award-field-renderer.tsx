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

export default AwardFieldRenderer;
