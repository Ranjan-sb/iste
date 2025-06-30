'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Edit,
    Plus,
    X,
    Trash2,
    Award,
    BookOpen,
    FileText,
    Lightbulb,
    Upload,
} from 'lucide-react';

// Type definitions
export type Skill = {
    id: string;
    name: string;
    category: string;
    level?: string;
};

export type Certification = {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    type: string;
};

export type Award = {
    id: string;
    name: string;
    awardFor: string;
    issuingOrganization: string;
    issueDate: string;
    description: string;
};

export type Project = {
    id: string;
    name: string;
    role: string;
    collaborators: string;
    publicationDate: string;
    abstract: string;
};

export type Journal = {
    id: string;
    title: string;
    status: string;
    publicationDate: string;
    collaborators: string;
    file?: File | null;
};

export type Patent = {
    id: string;
    name: string;
    patentFor: string;
    collaborators: string;
    awardedDate: string;
    awardingBody: string;
};

// Skills Form Component
export function SkillForm({
    onSubmit,
    onClose,
}: {
    onSubmit: (skill: Omit<Skill, 'id'>) => void;
    onClose?: () => void;
}) {
    const [skillData, setSkillData] = useState({
        name: '',
        category: '',
        level: '',
    });

    const handleSubmit = (addAnother = false) => {
        if (skillData.name && skillData.category) {
            onSubmit(skillData);
            setSkillData({ name: '', category: '', level: '' });

            if (!addAnother && onClose) {
                onClose();
            }
        }
    };

    const isFormValid = skillData.name && skillData.category;

    return (
        <div className="space-y-4">
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Skill Title
                </label>
                <Input
                    placeholder="Enter your skill title"
                    value={skillData.name}
                    onChange={(e) =>
                        setSkillData({ ...skillData, name: e.target.value })
                    }
                />
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Category
                </label>
                <Select
                    onValueChange={(value) =>
                        setSkillData({ ...skillData, category: value })
                    }
                    value={skillData.category}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="soft-skills">Soft Skills</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Proficiency Level
                </label>
                <Select
                    onValueChange={(value) =>
                        setSkillData({ ...skillData, level: value })
                    }
                    value={skillData.level}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Proficiency level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                            Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2 pt-4">
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleSubmit(true)}
                        disabled={!isFormValid}
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add & Continue
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={!isFormValid}
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                        Add & Close
                    </Button>
                </div>
                <Button variant="outline" onClick={onClose} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

// Skills Dialog Button Component
export function SkillsDialogButton({
    onAdd,
}: {
    onAdd: (skill: Omit<Skill, 'id'>) => void;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-black text-white hover:bg-gray-800 sm:w-auto">
                    <Edit className="mr-2 h-4 w-4" />
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add a new skill</DialogTitle>
                </DialogHeader>
                <SkillForm
                    onSubmit={onAdd}
                    onClose={() => setDialogOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

// Skills Section Component
export function SkillsSection({
    skills,
    onRemove,
}: {
    skills: Skill[];
    onRemove: (id: string) => void;
}) {
    const skillsByCategory = skills.reduce(
        (acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill);
            return acc;
        },
        {} as Record<string, Skill[]>,
    );

    const categoryNames = {
        technical: 'Technical',
        programming: 'Programming',
        research: 'Research',
        'soft-skills': 'Soft Skills',
    };

    return (
        <div className="space-y-6">
            {Object.entries(skillsByCategory).map(
                ([category, categorySkills]) => (
                    <div key={category}>
                        <h4 className="mb-3 font-medium">
                            {categoryNames[
                                category as keyof typeof categoryNames
                            ] || category}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {categorySkills.map((skill) => (
                                <Badge
                                    key={skill.id}
                                    className="flex items-center gap-1 bg-green-100 text-green-800"
                                >
                                    {skill.name}
                                    <button
                                        onClick={() => onRemove(skill.id)}
                                        className="ml-1 rounded hover:bg-green-200"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                ),
            )}
            {skills.length === 0 && (
                <p className="py-8 text-center text-gray-500">
                    No skills added yet. Click "Add" to get started.
                </p>
            )}
        </div>
    );
}

// Certifications Section Component
export function CertificationsSection({
    certifications,
    onAdd,
    onRemove,
}: {
    certifications: Certification[];
    onAdd: (cert: Omit<Certification, 'id'>) => void;
    onRemove: (id: string) => void;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Certifications</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Add certifications, faculty development programs, and
                        workshops you've attended
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-black text-white hover:bg-gray-800">
                            <Edit className="mr-2 h-4 w-4" />
                            Add Certification
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add a new certification</DialogTitle>
                        </DialogHeader>
                        <CertificationForm
                            onSubmit={onAdd}
                            onClose={() => setDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <CertificationsList
                certifications={certifications}
                onRemove={onRemove}
            />
        </div>
    );
}

// Additional form components would go here...
// For brevity, I'm including the main ones

export function CertificationForm({
    onSubmit,
    onClose,
}: {
    onSubmit: (cert: Omit<Certification, 'id'>) => void;
    onClose?: () => void;
}) {
    const [certData, setCertData] = useState({
        name: '',
        type: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
    });

    const handleSubmit = (addAnother = false) => {
        if (
            certData.name &&
            certData.type &&
            certData.issuer &&
            certData.issueDate
        ) {
            onSubmit({
                name: certData.name,
                type: certData.type,
                issuer: certData.issuer,
                issueDate: certData.issueDate,
                expiryDate: certData.expiryDate || undefined,
            });
            setCertData({
                name: '',
                type: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
            });

            if (!addAnother && onClose) {
                onClose();
            }
        }
    };

    const isFormValid =
        certData.name && certData.type && certData.issuer && certData.issueDate;

    return (
        <div className="space-y-4">
            <div className="mb-4 text-sm text-gray-600">
                Add details about your certification, FDP, or workshop
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">Name</label>
                <Input
                    placeholder="Eg., Machine learning"
                    value={certData.name}
                    onChange={(e) =>
                        setCertData({ ...certData, name: e.target.value })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">Type</label>
                <Select
                    onValueChange={(value) =>
                        setCertData({ ...certData, type: value })
                    }
                    value={certData.type}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Certification" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="certification">
                            Certification
                        </SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="fdp">FDP's</SelectItem>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Issuing Organization
                </label>
                <Input
                    placeholder="Eg., Stanford university"
                    value={certData.issuer}
                    onChange={(e) =>
                        setCertData({ ...certData, issuer: e.target.value })
                    }
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Issue Date
                    </label>
                    <Input
                        type="date"
                        placeholder="Pick a date"
                        value={certData.issueDate}
                        onChange={(e) =>
                            setCertData({
                                ...certData,
                                issueDate: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Expiry Date (Optional)
                    </label>
                    <Input
                        type="date"
                        placeholder="Pick a date"
                        value={certData.expiryDate}
                        onChange={(e) =>
                            setCertData({
                                ...certData,
                                expiryDate: e.target.value,
                            })
                        }
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleSubmit(true)}
                        disabled={!isFormValid}
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add & Continue
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={!isFormValid}
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                        Add & Close
                    </Button>
                </div>
                <Button variant="outline" onClick={onClose} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

export function CertificationsList({
    certifications,
    onRemove,
}: {
    certifications: Certification[];
    onRemove: (id: string) => void;
}) {
    if (certifications.length === 0) {
        return (
            <p className="py-8 text-center text-gray-500">
                No certifications added yet.
            </p>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-0">
            {/* Mobile view */}
            <div className="block space-y-4 sm:hidden">
                {certifications.map((cert) => (
                    <Card
                        key={cert.id}
                        className="transition-shadow hover:shadow-md"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="mb-2 font-medium text-gray-900">
                                        {cert.name}
                                    </h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p>
                                            <span className="font-medium">
                                                Issuer:
                                            </span>{' '}
                                            {cert.issuer}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Date:
                                            </span>{' '}
                                            {new Date(
                                                cert.issueDate,
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className="capitalize"
                                        >
                                            {cert.type}
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemove(cert.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop view */}
            <div className="hidden overflow-hidden rounded-lg border sm:block">
                <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 text-sm font-medium text-gray-600">
                    <div>Name</div>
                    <div>Issuer</div>
                    <div>Date</div>
                    <div>Type</div>
                    <div>Action</div>
                </div>
                <div className="divide-y">
                    {certifications.map((cert) => (
                        <div
                            key={cert.id}
                            className="grid grid-cols-5 items-center gap-4 p-4 hover:bg-gray-50"
                        >
                            <div className="font-medium">{cert.name}</div>
                            <div className="text-gray-600">{cert.issuer}</div>
                            <div className="text-gray-600">
                                {new Date(cert.issueDate).toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    },
                                )}
                            </div>
                            <div>
                                <Badge
                                    variant="secondary"
                                    className="capitalize"
                                >
                                    {cert.type}
                                </Badge>
                            </div>
                            <div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onRemove(cert.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Awards Section Component
export function AwardsSection({
    awards,
    onAdd,
    onRemove,
}: {
    awards: Award[];
    onAdd: (award: Omit<Award, 'id'>) => void;
    onRemove: (id: string) => void;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Awards</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Add awards you've applied for or won
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-black text-white hover:bg-gray-800">
                            <Edit className="mr-2 h-4 w-4" />
                            Add Award
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add a new award</DialogTitle>
                        </DialogHeader>
                        <AwardForm
                            onSubmit={onAdd}
                            onClose={() => setDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <AwardsList awards={awards} onRemove={onRemove} />
        </div>
    );
}

// Projects Section Component
export function ProjectsSection({
    projects,
    onAdd,
    onRemove,
}: {
    projects: Project[];
    onAdd: (project: Omit<Project, 'id'>) => void;
    onRemove: (id: string) => void;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Projects</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Add your projects to showcase your work
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-black text-white hover:bg-gray-800">
                            <Edit className="mr-2 h-4 w-4" />
                            Add Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add a Project</DialogTitle>
                        </DialogHeader>
                        <ProjectForm
                            onSubmit={onAdd}
                            onClose={() => setDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <ProjectsList projects={projects} onRemove={onRemove} />
        </div>
    );
}

// Journals Section Component
export function JournalsSection({
    journals,
    onAdd,
    onRemove,
}: {
    journals: Journal[];
    onAdd: (journal: Omit<Journal, 'id'>) => void;
    onRemove: (id: string) => void;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Journals</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Add your projects and research papers to showcase your
                        work
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-300">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload CSV file
                    </Button>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-black text-white hover:bg-gray-800">
                                <Edit className="mr-2 h-4 w-4" />
                                Add Journal
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add a Journal</DialogTitle>
                            </DialogHeader>
                            <JournalForm
                                onSubmit={onAdd}
                                onClose={() => setDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <JournalsList journals={journals} onRemove={onRemove} />
        </div>
    );
}

// Patents Section Component
export function PatentsSection({
    patents,
    onAdd,
    onRemove,
}: {
    patents: Patent[];
    onAdd: (patent: Omit<Patent, 'id'>) => void;
    onRemove: (id: string) => void;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Patents</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Add your patents and intellectual property
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-black text-white hover:bg-gray-800">
                            <Edit className="mr-2 h-4 w-4" />
                            Add Patent
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add a Patent</DialogTitle>
                        </DialogHeader>
                        <PatentForm
                            onSubmit={onAdd}
                            onClose={() => setDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <PatentsList patents={patents} onRemove={onRemove} />
        </div>
    );
}

// Award Form Component
export function AwardForm({
    onSubmit,
    onClose,
}: {
    onSubmit: (award: Omit<Award, 'id'>) => void;
    onClose?: () => void;
}) {
    const [awardData, setAwardData] = useState({
        name: '',
        awardFor: '',
        issuingOrganization: '',
        issueDate: '',
        description: '',
    });

    const handleSubmit = (addAnother = false) => {
        if (
            awardData.name &&
            awardData.awardFor &&
            awardData.issuingOrganization &&
            awardData.issueDate
        ) {
            onSubmit({
                name: awardData.name,
                awardFor: awardData.awardFor,
                issuingOrganization: awardData.issuingOrganization,
                issueDate: awardData.issueDate,
                description: awardData.description,
            });
            setAwardData({
                name: '',
                awardFor: '',
                issuingOrganization: '',
                issueDate: '',
                description: '',
            });

            if (!addAnother && onClose) {
                onClose();
            }
        }
    };

    const isFormValid =
        awardData.name &&
        awardData.awardFor &&
        awardData.issuingOrganization &&
        awardData.issueDate;

    return (
        <div className="space-y-4">
            <div className="mb-4 text-sm text-gray-600">
                Add details about awards you've applied for or won
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Award Name
                </label>
                <Input
                    placeholder="Eg., Excellence in Teaching"
                    value={awardData.name}
                    onChange={(e) =>
                        setAwardData({ ...awardData, name: e.target.value })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Award For
                </label>
                <Select
                    onValueChange={(value) =>
                        setAwardData({ ...awardData, awardFor: value })
                    }
                    value={awardData.awardFor}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Best Faculty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="best-faculty">
                            Best Faculty
                        </SelectItem>
                        <SelectItem value="best-teacher">
                            Best Teacher
                        </SelectItem>
                        <SelectItem value="research-excellence">
                            Research Excellence
                        </SelectItem>
                        <SelectItem value="innovation">Innovation</SelectItem>
                        <SelectItem value="student-mentoring">
                            Student Mentoring
                        </SelectItem>
                        <SelectItem value="community-service">
                            Community Service
                        </SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Issuing Organization
                </label>
                <Input
                    placeholder="Eg., Stanford University"
                    value={awardData.issuingOrganization}
                    onChange={(e) =>
                        setAwardData({
                            ...awardData,
                            issuingOrganization: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Issue Date
                </label>
                <Input
                    type="date"
                    value={awardData.issueDate}
                    onChange={(e) =>
                        setAwardData({
                            ...awardData,
                            issueDate: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Description
                </label>
                <Textarea
                    placeholder="Describe the award"
                    value={awardData.description}
                    onChange={(e) =>
                        setAwardData({
                            ...awardData,
                            description: e.target.value,
                        })
                    }
                    rows={4}
                />
            </div>

            <div className="flex flex-col gap-2 pt-4">
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleSubmit(true)}
                        disabled={!isFormValid}
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add & Continue
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={!isFormValid}
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                        Add & Close
                    </Button>
                </div>
                <Button variant="outline" onClick={onClose} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

// Awards List Component
export function AwardsList({
    awards,
    onRemove,
}: {
    awards: Award[];
    onRemove: (id: string) => void;
}) {
    if (awards.length === 0) {
        return (
            <p className="py-8 text-center text-gray-500">
                No awards added yet.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {awards.map((award) => (
                <div
                    key={award.id}
                    className="rounded-lg border p-4 hover:bg-gray-50"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                    <Award className="h-4 w-4 text-green-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                    {award.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                    {award.issuingOrganization}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {award.description}
                                </p>
                                <p className="mt-2 text-xs text-gray-400">
                                    {new Date(
                                        award.issueDate,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(award.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Project Form Component
export function ProjectForm({
    onSubmit,
    onClose,
}: {
    onSubmit: (project: Omit<Project, 'id'>) => void;
    onClose?: () => void;
}) {
    const [projectData, setProjectData] = useState({
        name: '',
        role: '',
        collaborators: '',
        publicationDate: '',
        abstract: '',
    });

    const handleSubmit = (addAnother = false) => {
        if (
            projectData.name &&
            projectData.role &&
            projectData.collaborators &&
            projectData.publicationDate
        ) {
            onSubmit({
                name: projectData.name,
                role: projectData.role,
                collaborators: projectData.collaborators,
                publicationDate: projectData.publicationDate,
                abstract: projectData.abstract,
            });
            setProjectData({
                name: '',
                role: '',
                collaborators: '',
                publicationDate: '',
                abstract: '',
            });

            if (!addAnother && onClose) {
                onClose();
            }
        }
    };

    const isFormValid =
        projectData.name &&
        projectData.role &&
        projectData.collaborators &&
        projectData.publicationDate;

    return (
        <div className="space-y-4">
            <div className="mb-4 text-sm text-gray-600">
                Add details about your projects
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Project Name
                </label>
                <Input
                    placeholder="Eg., Machine Learning Research"
                    value={projectData.name}
                    onChange={(e) =>
                        setProjectData({ ...projectData, name: e.target.value })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Role in Project
                </label>
                <Select
                    onValueChange={(value) =>
                        setProjectData({ ...projectData, role: value })
                    }
                    value={projectData.role}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Co Investigator" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="principal-investigator">
                            Principal Investigator
                        </SelectItem>
                        <SelectItem value="co-investigator">
                            Co Investigator
                        </SelectItem>
                        <SelectItem value="research-associate">
                            Research Associate
                        </SelectItem>
                        <SelectItem value="team-member">Team Member</SelectItem>
                        <SelectItem value="project-lead">
                            Project Lead
                        </SelectItem>
                        <SelectItem value="consultant">Consultant</SelectItem>
                        <SelectItem value="collaborator">
                            Collaborator
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Collaborators
                </label>
                <Input
                    placeholder="Eg., Dr. Smith, Prof. Johnson"
                    value={projectData.collaborators}
                    onChange={(e) =>
                        setProjectData({
                            ...projectData,
                            collaborators: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Date Of Publication
                </label>
                <Input
                    type="date"
                    value={projectData.publicationDate}
                    onChange={(e) =>
                        setProjectData({
                            ...projectData,
                            publicationDate: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Abstract
                </label>
                <Textarea
                    placeholder="Project abstract or description"
                    value={projectData.abstract}
                    onChange={(e) =>
                        setProjectData({
                            ...projectData,
                            abstract: e.target.value,
                        })
                    }
                    rows={4}
                />
            </div>

            <div className="flex flex-col gap-2 pt-4">
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleSubmit(true)}
                        disabled={!isFormValid}
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add & Continue
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={!isFormValid}
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                        Add & Close
                    </Button>
                </div>
                <Button variant="outline" onClick={onClose} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

// Projects List Component
export function ProjectsList({
    projects,
    onRemove,
}: {
    projects: Project[];
    onRemove: (id: string) => void;
}) {
    if (projects.length === 0) {
        return (
            <p className="py-8 text-center text-gray-500">
                No projects added yet.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className="rounded-lg border p-4 hover:bg-gray-50"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                    <BookOpen className="h-4 w-4 text-blue-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                    {project.name}
                                </h4>
                                <p className="text-sm text-gray-600 capitalize">
                                    {project.role.replace('-', ' ')}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {project.collaborators}
                                </p>
                                {project.abstract && (
                                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                                        {project.abstract}
                                    </p>
                                )}
                                <p className="mt-2 text-xs text-gray-400">
                                    Published:{' '}
                                    {new Date(
                                        project.publicationDate,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(project.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Journal Form Component
export function JournalForm({
    onSubmit,
    onClose,
}: {
    onSubmit: (journal: Omit<Journal, 'id'>) => void;
    onClose?: () => void;
}) {
    const [journalData, setJournalData] = useState({
        title: '',
        status: '',
        publicationDate: '',
        collaborators: '',
        file: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setJournalData({ ...journalData, file });
    };

    const handleSubmit = (addAnother = false) => {
        if (
            journalData.title &&
            journalData.status &&
            journalData.publicationDate &&
            journalData.collaborators
        ) {
            onSubmit({
                title: journalData.title,
                status: journalData.status,
                publicationDate: journalData.publicationDate,
                collaborators: journalData.collaborators,
                file: journalData.file || undefined,
            });
            setJournalData({
                title: '',
                status: '',
                publicationDate: '',
                collaborators: '',
                file: null,
            });

            if (!addAnother && onClose) {
                onClose();
            }
        }
    };

    const isFormValid =
        journalData.title &&
        journalData.status &&
        journalData.publicationDate &&
        journalData.collaborators;

    return (
        <div className="space-y-4">
            <div className="mb-4 text-sm text-gray-600">
                Add details about your Journal
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">Title</label>
                <Input
                    placeholder="Eg., Machine Learning Applications"
                    value={journalData.title}
                    onChange={(e) =>
                        setJournalData({
                            ...journalData,
                            title: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <Select
                    onValueChange={(value) =>
                        setJournalData({ ...journalData, status: value })
                    }
                    value={journalData.status}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="In progress" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="in-progress">In progress</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under-review">
                            Under Review
                        </SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Date of Publication
                </label>
                <Input
                    type="date"
                    value={journalData.publicationDate}
                    onChange={(e) =>
                        setJournalData({
                            ...journalData,
                            publicationDate: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Upload the File
                </label>
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <span className="text-gray-600">Upload Here*</span>
                        {journalData.file && (
                            <p className="mt-2 text-sm text-green-600">
                                Selected: {journalData.file.name}
                            </p>
                        )}
                    </label>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Collaboration
                </label>
                <Input
                    placeholder="Eg., Dr. Eleanor Vance, Dr. Jonas Klein"
                    value={journalData.collaborators}
                    onChange={(e) =>
                        setJournalData({
                            ...journalData,
                            collaborators: e.target.value,
                        })
                    }
                />
            </div>

            <div className="flex flex-col gap-2 pt-4">
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleSubmit(true)}
                        disabled={!isFormValid}
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add & Continue
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={!isFormValid}
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                        Add & Close
                    </Button>
                </div>
                <Button variant="outline" onClick={onClose} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

// Journals List Component
export function JournalsList({
    journals,
    onRemove,
}: {
    journals: Journal[];
    onRemove: (id: string) => void;
}) {
    if (journals.length === 0) {
        return (
            <p className="py-8 text-center text-gray-500">
                No journals added yet.
            </p>
        );
    }

    const formatStatus = (status: string) => {
        return status
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-4">
            {journals.map((journal) => (
                <Card
                    key={journal.id}
                    className="transition-shadow hover:shadow-md"
                >
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-blue-100 p-2">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="mb-1 font-semibold text-gray-900">
                                            {journal.title}
                                        </h4>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                    Status:
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2"
                                                >
                                                    {formatStatus(
                                                        journal.status,
                                                    )}
                                                </Badge>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                    Collaborators:
                                                </span>{' '}
                                                {journal.collaborators}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                    Publication Date:
                                                </span>{' '}
                                                {formatDate(
                                                    journal.publicationDate,
                                                )}
                                            </p>
                                            {journal.file && (
                                                <p className="text-sm text-green-600">
                                                    <span className="font-medium">
                                                        File:
                                                    </span>{' '}
                                                    {journal.file.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemove(journal.id)}
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Patent Form Component
export function PatentForm({
    onSubmit,
    onClose,
}: {
    onSubmit: (patent: Omit<Patent, 'id'>) => void;
    onClose?: () => void;
}) {
    const [patentData, setPatentData] = useState({
        name: '',
        patentFor: '',
        collaborators: '',
        awardedDate: '',
        awardingBody: '',
    });

    const handleSubmit = (addAnother = false) => {
        if (
            patentData.name &&
            patentData.patentFor &&
            patentData.collaborators &&
            patentData.awardedDate &&
            patentData.awardingBody
        ) {
            onSubmit({
                name: patentData.name,
                patentFor: patentData.patentFor,
                collaborators: patentData.collaborators,
                awardedDate: patentData.awardedDate,
                awardingBody: patentData.awardingBody,
            });
            setPatentData({
                name: '',
                patentFor: '',
                collaborators: '',
                awardedDate: '',
                awardingBody: '',
            });

            if (!addAnother && onClose) {
                onClose();
            }
        }
    };

    const isFormValid =
        patentData.name &&
        patentData.patentFor &&
        patentData.collaborators &&
        patentData.awardedDate &&
        patentData.awardingBody;

    return (
        <div className="space-y-4">
            <div className="mb-4 text-sm text-gray-600">
                Add details about your Patent
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Patent Name
                </label>
                <Input
                    placeholder="Eg., Machine Learning Algorithm"
                    value={patentData.name}
                    onChange={(e) =>
                        setPatentData({ ...patentData, name: e.target.value })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Patent For
                </label>
                <Select
                    onValueChange={(value) =>
                        setPatentData({ ...patentData, patentFor: value })
                    }
                    value={patentData.patentFor}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Technology" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="innovation">Innovation</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="process">Process</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Collaborators
                </label>
                <Input
                    placeholder="Eg., Dr. Smith, Prof. Johnson"
                    value={patentData.collaborators}
                    onChange={(e) =>
                        setPatentData({
                            ...patentData,
                            collaborators: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Awarded Date
                </label>
                <Input
                    type="date"
                    value={patentData.awardedDate}
                    onChange={(e) =>
                        setPatentData({
                            ...patentData,
                            awardedDate: e.target.value,
                        })
                    }
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    Awarding Body
                </label>
                <Input
                    placeholder="Patent Office Name"
                    value={patentData.awardingBody}
                    onChange={(e) =>
                        setPatentData({
                            ...patentData,
                            awardingBody: e.target.value,
                        })
                    }
                />
            </div>

            <div className="flex flex-col gap-2 pt-4">
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleSubmit(true)}
                        disabled={!isFormValid}
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add & Continue
                    </Button>
                    <Button
                        onClick={() => handleSubmit(false)}
                        disabled={!isFormValid}
                        className="flex-1 bg-black text-white hover:bg-gray-800"
                    >
                        Add & Close
                    </Button>
                </div>
                <Button variant="outline" onClick={onClose} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

// Patents List Component
export function PatentsList({
    patents,
    onRemove,
}: {
    patents: Patent[];
    onRemove: (id: string) => void;
}) {
    if (patents.length === 0) {
        return (
            <p className="py-8 text-center text-gray-500">
                No patents added yet.
            </p>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-4">
            {patents.map((patent) => (
                <Card
                    key={patent.id}
                    className="transition-shadow hover:shadow-md"
                >
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-purple-100 p-2">
                                <Lightbulb className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="mb-1 font-semibold text-gray-900">
                                            {patent.name}
                                        </h4>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                    Patent For:
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 capitalize"
                                                >
                                                    {patent.patentFor.replace(
                                                        '-',
                                                        ' ',
                                                    )}
                                                </Badge>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                    Collaborators:
                                                </span>{' '}
                                                {patent.collaborators}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                    Awarded Date:
                                                </span>{' '}
                                                {formatDate(patent.awardedDate)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">
                                                    Awarding Body:
                                                </span>{' '}
                                                {patent.awardingBody}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemove(patent.id)}
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
