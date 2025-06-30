'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { trpc } from '@/providers/trpc-provider';
import { useSession } from '@/server/auth/client';
import {
    AlertCircle,
    User,
    GraduationCap,
    Users,
    Building,
    ArrowLeft,
    Plus,
    X,
    Edit,
    Trash2,
    Award,
    BookOpen,
    FileText,
    Lightbulb,
    Upload,
    CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import {
    SkillForm,
    SkillsSection,
    CertificationsSection,
    AwardsSection,
    ProjectsSection,
    JournalsSection,
    PatentsSection,
} from '@/components/profile/profile-form-components';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    contact: z.string().min(10, 'Please enter a valid contact number'),
    roleId: z.number().min(1, 'Please select a role'),
    university: z.string().min(2, 'Please enter your university'),
    department: z.string().min(2, 'Please enter your department'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
});

type ProfileForm = z.infer<typeof profileSchema>;

type Skill = {
    id: string;
    name: string;
    category: string;
    level?: string;
};

type Certification = {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    type: string;
};

type Award = {
    id: string;
    name: string;
    awardFor: string;
    issuingOrganization: string;
    issueDate: string;
    description: string;
};

type Project = {
    id: string;
    name: string;
    role: string;
    collaborators: string;
    publicationDate: string;
    abstract: string;
};

type Journal = {
    id: string;
    title: string;
    status: string;
    publicationDate: string;
    collaborators: string;
    file?: File | null;
};

type Patent = {
    id: string;
    name: string;
    patentFor: string;
    collaborators: string;
    awardedDate: string;
    awardingBody: string;
};

export default function EditProfilePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('basic');
    const [skills, setSkills] = useState<Skill[]>([]);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [awards, setAwards] = useState<Award[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [journals, setJournals] = useState<Journal[]>([]);
    const [patents, setPatents] = useState<Patent[]>([]);
    const router = useRouter();
    const { data: session } = useSession();

    const { data: roles } = trpc.profile.getRoles.useQuery();
    const { data: existingProfile, isLoading: profileLoading } =
        trpc.profile.getProfile.useQuery();

    const updateProfile = trpc.profile.updateProfile.useMutation({
        onSuccess: () => {
            setSuccessMessage('Profile updated successfully!');
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    // Auto-clear success messages after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const form = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: '',
            email: '',
            contact: '',
            roleId: 0,
            university: '',
            department: '',
            bio: '',
        },
    });

    // Load existing profile data when available
    useEffect(() => {
        if (existingProfile) {
            // Type-safe access to meta_data
            const metaData = existingProfile.meta_data as Record<
                string,
                any
            > | null;

            // Update form with existing basic profile data
            form.reset({
                fullName: existingProfile.fullName || '',
                email: metaData?.email || session?.user?.email || '',
                contact: existingProfile.contact || '',
                roleId: existingProfile.roleId || 0,
                university: metaData?.university || '',
                department: metaData?.department || '',
                bio: metaData?.bio || '',
            });

            // Load existing complex data
            if (metaData) {
                setSkills(metaData.skills || []);
                setCertifications(metaData.certifications || []);
                setAwards(metaData.awards || []);
                setProjects(metaData.projects || []);
                setJournals(metaData.journals || []);
                setPatents(metaData.patents || []);
            }
        }
    }, [existingProfile, form, session?.user?.email]);

    // Helper functions for managing sections
    const addSkill = (skill: Omit<Skill, 'id'>) => {
        const newSkill = { ...skill, id: Date.now().toString() };
        setSkills([...skills, newSkill]);
    };

    const removeSkill = (id: string) => {
        setSkills(skills.filter((skill) => skill.id !== id));
    };

    const addCertification = (cert: Omit<Certification, 'id'>) => {
        const newCert = { ...cert, id: Date.now().toString() };
        setCertifications([...certifications, newCert]);
    };

    const removeCertification = (id: string) => {
        setCertifications(certifications.filter((cert) => cert.id !== id));
    };

    const addAward = (award: Omit<Award, 'id'>) => {
        const newAward = { ...award, id: Date.now().toString() };
        setAwards([...awards, newAward]);
    };

    const removeAward = (id: string) => {
        setAwards(awards.filter((award) => award.id !== id));
    };

    const addProject = (project: Omit<Project, 'id'>) => {
        const newProject = { ...project, id: Date.now().toString() };
        setProjects([...projects, newProject]);
    };

    const removeProject = (id: string) => {
        setProjects(projects.filter((project) => project.id !== id));
    };

    const addJournal = (journal: Omit<Journal, 'id'>) => {
        const newJournal = { ...journal, id: Date.now().toString() };
        setJournals([...journals, newJournal]);
    };

    const removeJournal = (id: string) => {
        setJournals(journals.filter((journal) => journal.id !== id));
    };

    const addPatent = (patent: Omit<Patent, 'id'>) => {
        const newPatent = { ...patent, id: Date.now().toString() };
        setPatents([...patents, newPatent]);
    };

    const removePatent = (id: string) => {
        setPatents(patents.filter((patent) => patent.id !== id));
    };

    const onSubmit = async (data: ProfileForm) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        const profileData = {
            fullName: data.fullName,
            contact: data.contact,
            roleId: data.roleId,
            meta_data: {
                email: data.email,
                university: data.university,
                department: data.department,
                bio: data.bio,
                skills,
                certifications,
                awards,
                projects,
                journals,
                patents,
            },
        };

        try {
            await updateProfile.mutateAsync(profileData);
            setSuccessMessage('Profile updated successfully!');
        } catch (err) {
            // Error handled by mutation onError
        } finally {
            setIsLoading(false);
        }
    };

    if (!session?.user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (profileLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    if (!existingProfile) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        Profile Not Found
                    </h1>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        You need to create a profile first before you can edit
                        it.
                    </p>
                    <Link href="/profile/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Create Profile
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-500"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Profile
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Update your professional profile to showcase your latest
                        expertise
                    </p>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={(value) => {
                        setActiveTab(value);
                        setError(null);
                        setSuccessMessage(null);
                    }}
                    className="space-y-6"
                >
                    <div className="overflow-x-auto">
                        <TabsList className="inline-flex w-max min-w-full">
                            <TabsTrigger
                                value="basic"
                                className="whitespace-nowrap"
                            >
                                Basic profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="skills"
                                className="whitespace-nowrap"
                            >
                                Skills & Expertise
                            </TabsTrigger>
                            <TabsTrigger
                                value="certifications"
                                className="whitespace-nowrap"
                            >
                                Certifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="awards"
                                className="whitespace-nowrap"
                            >
                                Awards
                            </TabsTrigger>
                            <TabsTrigger
                                value="projects"
                                className="whitespace-nowrap"
                            >
                                Projects
                            </TabsTrigger>
                            <TabsTrigger
                                value="journals"
                                className="whitespace-nowrap"
                            >
                                Journals
                            </TabsTrigger>
                            <TabsTrigger
                                value="patents"
                                className="whitespace-nowrap"
                            >
                                Patents
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                {error && (
                                    <div className="flex items-center space-x-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="flex items-center space-x-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>{successMessage}</span>
                                    </div>
                                )}

                                <TabsContent
                                    value="basic"
                                    className="space-y-6"
                                >
                                    <div className="flex items-center space-x-4 p-6">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                                            <User className="h-10 w-10 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <Edit className="h-4 w-4 text-gray-400" />
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Update your profile
                                                    information to help others
                                                    discover you
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Full Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Your Full Name"
                                                            disabled={isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="your.email@example.com"
                                                            disabled={isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="roleId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Role</FormLabel>
                                                    <Select
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            field.onChange(
                                                                parseInt(value),
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                        value={field.value?.toString()}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your role" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {roles?.map(
                                                                (role) => (
                                                                    <SelectItem
                                                                        key={
                                                                            role.id
                                                                        }
                                                                        value={role.id.toString()}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            {role.name ===
                                                                                'student' && (
                                                                                <GraduationCap className="mr-2 h-4 w-4" />
                                                                            )}
                                                                            {role.name ===
                                                                                'faculty' && (
                                                                                <Users className="mr-2 h-4 w-4" />
                                                                            )}
                                                                            {role.name ===
                                                                                'admin' && (
                                                                                <User className="mr-2 h-4 w-4" />
                                                                            )}
                                                                            {role.name ===
                                                                                'institution' && (
                                                                                <Building className="mr-2 h-4 w-4" />
                                                                            )}
                                                                            {role.name
                                                                                .charAt(
                                                                                    0,
                                                                                )
                                                                                .toUpperCase() +
                                                                                role.name.slice(
                                                                                    1,
                                                                                )}
                                                                        </div>
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                    <p className="text-xs text-gray-500">
                                                        Your role determines
                                                        what features you can
                                                        access
                                                    </p>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="university"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        University
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        disabled={isLoading}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your university" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="atria">
                                                                Atria Institute
                                                                of Technology
                                                            </SelectItem>
                                                            <SelectItem value="iit-bangalore">
                                                                IIT Bangalore
                                                            </SelectItem>
                                                            <SelectItem value="iisc">
                                                                Indian Institute
                                                                of Science
                                                            </SelectItem>
                                                            <SelectItem value="nit-karnataka">
                                                                NIT Karnataka
                                                            </SelectItem>
                                                            <SelectItem value="rv-institute">
                                                                RV Institute of
                                                                Technology
                                                            </SelectItem>
                                                            <SelectItem value="iit-madras">
                                                                IIT Madras
                                                            </SelectItem>
                                                            <SelectItem value="iit-delhi">
                                                                IIT Delhi
                                                            </SelectItem>
                                                            <SelectItem value="pes-university">
                                                                PES University
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="department"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Department
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        disabled={isLoading}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select your department" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="computer-science">
                                                                Computer Science
                                                            </SelectItem>
                                                            <SelectItem value="electronics">
                                                                Electronics
                                                            </SelectItem>
                                                            <SelectItem value="mechanical">
                                                                Mechanical
                                                            </SelectItem>
                                                            <SelectItem value="civil">
                                                                Civil
                                                            </SelectItem>
                                                            <SelectItem value="information-science">
                                                                Information
                                                                Science
                                                            </SelectItem>
                                                            <SelectItem value="mathematics">
                                                                Mathematics
                                                            </SelectItem>
                                                            <SelectItem value="electricals">
                                                                Electricals
                                                            </SelectItem>
                                                            <SelectItem value="business-administration">
                                                                Business
                                                                Administration
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="contact"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Phone number
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Your phone number"
                                                            disabled={isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="p-6">
                                        <FormField
                                            control={form.control}
                                            name="bio"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bio</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="Tell us about yourself"
                                                            disabled={isLoading}
                                                            rows={4}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex justify-center border-t p-4 sm:justify-end sm:p-6">
                                        <Button
                                            type="button"
                                            onClick={async () => {
                                                // Clear any existing messages
                                                setError(null);
                                                setSuccessMessage(null);

                                                // Validate basic profile fields
                                                const isValid =
                                                    await form.trigger();
                                                if (isValid) {
                                                    // Submit the form with current data
                                                    const formData =
                                                        form.getValues();
                                                    await onSubmit(formData);
                                                } else {
                                                    setError(
                                                        'Please fill in all required fields correctly.',
                                                    );
                                                }
                                            }}
                                            className="w-full bg-black text-white hover:bg-gray-800 sm:w-auto"
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? 'Saving...'
                                                : 'Save Changes'}
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Skills & Expertise Tab */}
                                <TabsContent
                                    value="skills"
                                    className="space-y-6"
                                >
                                    <div className="p-6">
                                        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    Skills & Expertise
                                                </h3>
                                                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-300">
                                                    Add your skills and
                                                    expertise to showcase your
                                                    capabilities
                                                </p>
                                            </div>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="w-full bg-black text-white hover:bg-gray-800 sm:w-auto">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Add
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Add a new skill
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <SkillForm
                                                        onSubmit={addSkill}
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        </div>

                                        <SkillsSection
                                            skills={skills}
                                            onRemove={removeSkill}
                                        />
                                    </div>
                                </TabsContent>

                                {/* Other tabs */}
                                <TabsContent value="certifications">
                                    <CertificationsSection
                                        certifications={certifications}
                                        onAdd={addCertification}
                                        onRemove={removeCertification}
                                    />
                                </TabsContent>

                                <TabsContent value="awards">
                                    <AwardsSection
                                        awards={awards}
                                        onAdd={addAward}
                                        onRemove={removeAward}
                                    />
                                </TabsContent>

                                <TabsContent value="projects">
                                    <ProjectsSection
                                        projects={projects}
                                        onAdd={addProject}
                                        onRemove={removeProject}
                                    />
                                </TabsContent>

                                <TabsContent value="journals">
                                    <JournalsSection
                                        journals={journals}
                                        onAdd={addJournal}
                                        onRemove={removeJournal}
                                    />
                                </TabsContent>

                                <TabsContent value="patents">
                                    <PatentsSection
                                        patents={patents}
                                        onAdd={addPatent}
                                        onRemove={removePatent}
                                    />
                                </TabsContent>

                                <div className="flex flex-col gap-4 border-t p-4 sm:flex-row sm:p-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            router.push('/dashboard')
                                        }
                                        disabled={isLoading}
                                        className="order-2 flex-1 sm:order-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        onClick={() => {
                                            setError(null);
                                            setSuccessMessage(null);
                                        }}
                                        className="order-1 flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 sm:order-2"
                                    >
                                        {isLoading
                                            ? 'Updating Profile...'
                                            : 'Update Profile'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </Card>
                </Tabs>
            </div>
        </div>
    );
}
