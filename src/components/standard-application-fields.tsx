'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    Building,
    X,
    Download,
} from 'lucide-react';

// Import types from the shared types file
import {
    ApplicationFormData,
    Project,
    Guide,
    FileData,
} from '@/types/application-types';

// Types
interface StandardApplicationFieldsProps {
    category: 'student' | 'faculty' | 'institution';
    data: ApplicationFormData;
    onChange: (data: ApplicationFormData) => void;
    onAlert?: (
        type: 'success' | 'error' | 'warning' | 'info',
        title: string,
        message: string,
    ) => void;
}

// File Upload Component
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
    const [uploading, setUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
            onAlert?.('error', 'Invalid File Type', 'Please select a PDF file');
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
                            {uploading ? 'Uploading...' : 'Choose PDF File'}
                        </Button>
                        <p className="text-xs text-gray-500">
                            PDF files up to 10MB
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Component
function StandardApplicationFields({
    category,
    data,
    onChange,
    onAlert,
}: StandardApplicationFieldsProps) {
    // Ensure data.projects is always an array
    const projects = data.projects || [];

    // Ensure teachingExperience is always an object
    const teachingExperience = data.teachingExperience || { ug: '', pg: '' };

    const updateField = (field: keyof ApplicationFormData, value: any) => {
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
            benefits: ['', '', ''],
        };
        updateField('projects', [...projects, newProject]);
    };

    const updateProject = (
        projectIndex: number,
        field: keyof Project,
        value: any,
    ) => {
        const updatedProjects = projects.map((project, index) =>
            index === projectIndex ? { ...project, [field]: value } : project,
        );
        updateField('projects', updatedProjects);
    };

    const removeProject = (projectIndex: number) => {
        const updatedProjects = projects.filter(
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
        const updatedProjects = projects.map((project, index) =>
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
        const updatedProjects = projects.map((project, pIndex) =>
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
        const updatedProjects = projects.map((project, pIndex) =>
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
        const updatedProjects = projects.map((project, pIndex) =>
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
                                value={data.applicantName || ''}
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
                                value={data.designation || ''}
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
                            value={data.address || ''}
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
                                value={data.pincode || ''}
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
                                value={data.phoneNumber || ''}
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
                                value={data.dateOfBirth || ''}
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
                            value={data.academicQualification || ''}
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
                            value={data.fieldOfSpecialization || ''}
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
                            value={data.department || ''}
                            onChange={(e) =>
                                updateField('department', e.target.value)
                            }
                            placeholder="e.g., Computer Science & Engineering"
                        />
                    </div>

                    {category === 'student' && (
                        <div>
                            <Label htmlFor="semester-year">
                                Semester/Year *
                            </Label>
                            <Input
                                id="semester-year"
                                value={data.semesterYear || ''}
                                onChange={(e) =>
                                    updateField('semesterYear', e.target.value)
                                }
                                placeholder="e.g., 6th Semester, Final Year"
                            />
                        </div>
                    )}

                    {category === 'faculty' && (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-base font-medium">
                                    Teaching Experience
                                </Label>
                                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="ug-experience">
                                            UG Level (years)
                                        </Label>
                                        <Input
                                            id="ug-experience"
                                            type="number"
                                            value={teachingExperience.ug || ''}
                                            onChange={(e) =>
                                                updateField(
                                                    'teachingExperience',
                                                    {
                                                        ...teachingExperience,
                                                        ug: e.target.value,
                                                    },
                                                )
                                            }
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="pg-experience">
                                            PG Level (years)
                                        </Label>
                                        <Input
                                            id="pg-experience"
                                            type="number"
                                            value={teachingExperience.pg || ''}
                                            onChange={(e) =>
                                                updateField(
                                                    'teachingExperience',
                                                    {
                                                        ...teachingExperience,
                                                        pg: e.target.value,
                                                    },
                                                )
                                            }
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="industry-experience">
                                    Industry Experience
                                </Label>
                                <Textarea
                                    id="industry-experience"
                                    value={data.industryExperience || ''}
                                    onChange={(e) =>
                                        updateField(
                                            'industryExperience',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Describe your industry experience"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="other-experience">
                                    Other Experience
                                </Label>
                                <Textarea
                                    id="other-experience"
                                    value={data.otherExperience || ''}
                                    onChange={(e) =>
                                        updateField(
                                            'otherExperience',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Any other relevant experience"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="iste-member"
                            checked={data.isMember || false}
                            onChange={(e) =>
                                updateField('isMember', e.target.checked)
                            }
                        />
                        <Label htmlFor="iste-member">I am an ISTE Member</Label>
                    </div>

                    <div>
                        <Label htmlFor="institution-address">
                            Institution Address *
                        </Label>
                        <Textarea
                            id="institution-address"
                            value={data.institutionAddress || ''}
                            onChange={(e) =>
                                updateField(
                                    'institutionAddress',
                                    e.target.value,
                                )
                            }
                            placeholder="Enter your institution's complete address"
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
                <CardContent>
                    {projects.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="mb-4 text-gray-500">
                                No projects added yet
                            </p>
                            <Button onClick={addProject} variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Project
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {projects.map((project, projectIndex) => (
                                <Card
                                    key={projectIndex}
                                    className="border border-gray-200"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">
                                                Project {projectIndex + 1}
                                            </CardTitle>
                                            {projects.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeProject(
                                                            projectIndex,
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
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
                                                htmlFor={`work-area-${projectIndex}`}
                                            >
                                                Outstanding Work Area *
                                            </Label>
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
                                                    <SelectValue placeholder="Select work area" />
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

                                        {/* Brief Resume */}
                                        <div className="space-y-4">
                                            <Label className="text-base font-medium">
                                                Brief Resume of the Project *
                                            </Label>
                                            <p className="text-sm text-gray-600">
                                                Provide either text description
                                                (150-300 words) OR upload a PDF
                                                file
                                            </p>

                                            {/* Text Input */}
                                            <div>
                                                <Label
                                                    htmlFor={`brief-resume-text-${projectIndex}`}
                                                >
                                                    Text Description (150-300
                                                    words)
                                                </Label>
                                                <Textarea
                                                    id={`brief-resume-text-${projectIndex}`}
                                                    value={
                                                        project.briefResume ||
                                                        ''
                                                    }
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
}

export default StandardApplicationFields;
