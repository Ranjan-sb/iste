'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/providers/trpc-provider';
import { useSession } from '@/server/auth/client';
import {
    AlertCircle,
    User,
    GraduationCap,
    Users,
    Building,
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    University,
    Award,
    BookOpen,
    FileText,
    Lightbulb,
    Briefcase,
    Calendar,
    ExternalLink,
    MapPin,
    Clock,
    Target,
    CheckCircle,
    Star,
    Zap,
    Code,
    Database,
    Globe,
    Brain,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const { data: session } = useSession();

    const { data: roles } = trpc.profile.getRoles.useQuery();
    const { data: profile, isLoading: profileLoading } =
        trpc.profile.getProfile.useQuery();

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

    if (!profile) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        Profile Not Found
                    </h1>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                        You need to create a profile first.
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

    const userRole = roles?.find((role) => role.id === profile.roleId);
    const roleName = userRole?.name || 'User';
    const meta_data = (profile.meta_data as any) || {};

    // Debug logging to check data structure
    if (process.env.NODE_ENV === 'development') {
        console.log('=== PROFILE DEBUG ===');
        console.log('Full profile object:', profile);
        console.log('Meta data object:', meta_data);
        console.log('Skills array:', meta_data.skills);
        console.log('Certifications array:', meta_data.certifications);
        console.log('Awards array:', meta_data.awards);
        console.log('Projects array:', meta_data.projects);
        console.log('Journals array:', meta_data.journals);
        console.log('Patents array:', meta_data.patents);
        console.log('===================');
    }

    const getRoleIcon = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'student':
                return <GraduationCap className="h-5 w-5" />;
            case 'faculty':
                return <Users className="h-5 w-5" />;
            case 'admin':
                return <User className="h-5 w-5" />;
            case 'institution':
                return <Building className="h-5 w-5" />;
            default:
                return <User className="h-5 w-5" />;
        }
    };

    const getRoleColor = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'student':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'faculty':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            case 'institution':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const formatDate = (dateInput: string | Date) => {
        const date =
            typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getSkillIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'programming':
                return <Code className="h-4 w-4" />;
            case 'database':
                return <Database className="h-4 w-4" />;
            case 'web-development':
                return <Globe className="h-4 w-4" />;
            case 'soft-skills':
                return <Brain className="h-4 w-4" />;
            default:
                return <Zap className="h-4 w-4" />;
        }
    };

    const getSkillCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'programming':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
            case 'database':
                return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
            case 'web-development':
                return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
            case 'soft-skills':
                return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-6 sm:px-6 sm:py-12 lg:px-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 sm:mb-8">
                    <Link
                        href="/dashboard"
                        className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-500"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                                Profile
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 sm:text-base dark:text-gray-300">
                                Your professional profile information
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push('/profile/edit')}
                            className="flex w-full items-center gap-2 sm:w-auto"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Main Content - 3 columns */}
                    <div className="space-y-6 lg:col-span-3">
                        {/* Main Profile Info */}
                        <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader>
                                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 sm:h-20 sm:w-20 dark:from-blue-900/20 dark:to-indigo-900/20">
                                        <User className="h-8 w-8 text-blue-600 sm:h-10 sm:w-10 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <CardTitle className="text-xl sm:text-2xl">
                                            {profile.fullName}
                                        </CardTitle>
                                        <div className="mt-2 flex flex-col items-center gap-2 sm:flex-row">
                                            <Badge
                                                className={`${getRoleColor(roleName)} flex items-center gap-1`}
                                            >
                                                {getRoleIcon(roleName)}
                                                {roleName
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    roleName.slice(1)}
                                            </Badge>
                                            {meta_data.university && (
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    at {meta_data.university}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {meta_data.email && (
                                        <div className="flex items-center space-x-3">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Email
                                                </p>
                                                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-300">
                                                    {meta_data.email}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {profile.contact && (
                                        <div className="flex items-center space-x-3">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Phone
                                                </p>
                                                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-300">
                                                    {profile.contact}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {meta_data.department && (
                                        <div className="flex items-center space-x-3">
                                            <Briefcase className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    Department
                                                </p>
                                                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-300">
                                                    {meta_data.department}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {meta_data.university && (
                                        <div className="flex items-center space-x-3">
                                            <University className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    University
                                                </p>
                                                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-300">
                                                    {meta_data.university}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {meta_data.bio && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                                                <User className="h-5 w-5" />
                                                About
                                            </h3>
                                            <p className="text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300">
                                                {meta_data.bio}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Skills Section */}
                        {meta_data.skills && meta_data.skills.length > 0 && (
                            <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5" />
                                        Skills & Expertise
                                        <Badge
                                            variant="secondary"
                                            className="ml-2"
                                        >
                                            {meta_data.skills.length}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {Object.entries(
                                            meta_data.skills.reduce(
                                                (acc: any, skill: any) => {
                                                    if (!acc[skill.category])
                                                        acc[skill.category] =
                                                            [];
                                                    acc[skill.category].push(
                                                        skill,
                                                    );
                                                    return acc;
                                                },
                                                {},
                                            ),
                                        ).map(
                                            ([category, categorySkills]: [
                                                string,
                                                any,
                                            ]) => (
                                                <div
                                                    key={category}
                                                    className="space-y-3"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {getSkillIcon(category)}
                                                        <h4 className="font-semibold text-gray-900 capitalize dark:text-white">
                                                            {category.replace(
                                                                '-',
                                                                ' ',
                                                            )}
                                                        </h4>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {
                                                                categorySkills.length
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {categorySkills.map(
                                                            (skill: any) => (
                                                                <Badge
                                                                    key={
                                                                        skill.id
                                                                    }
                                                                    className={`${getSkillCategoryColor(category)} border text-xs sm:text-sm`}
                                                                >
                                                                    {skill.name}
                                                                    {skill.level && (
                                                                        <span className="ml-1 opacity-75">
                                                                            •{' '}
                                                                            {
                                                                                skill.level
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </Badge>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Certifications Section */}
                        {meta_data.certifications &&
                            meta_data.certifications.length > 0 && (
                                <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Certifications
                                            <Badge
                                                variant="secondary"
                                                className="ml-2"
                                            >
                                                {
                                                    meta_data.certifications
                                                        .length
                                                }
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {meta_data.certifications.map(
                                                (cert: any) => (
                                                    <div
                                                        key={cert.id}
                                                        className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/50"
                                                    >
                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                    {cert.name}
                                                                </h4>
                                                                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                                                    {
                                                                        cert.issuer
                                                                    }
                                                                </p>
                                                                <div className="mt-2 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        Issued:{' '}
                                                                        {formatDate(
                                                                            cert.issueDate,
                                                                        )}
                                                                    </div>
                                                                    {cert.expiryDate && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Clock className="h-3 w-3" />
                                                                            Expires:{' '}
                                                                            {formatDate(
                                                                                cert.expiryDate,
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                            >
                                                                {cert.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Awards Section */}
                        {meta_data.awards && meta_data.awards.length > 0 && (
                            <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Awards & Recognition
                                        <Badge
                                            variant="secondary"
                                            className="ml-2"
                                        >
                                            {meta_data.awards.length}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {meta_data.awards.map((award: any) => (
                                            <div
                                                key={award.id}
                                                className="rounded-lg border border-yellow-200 bg-yellow-50/50 p-4 dark:border-yellow-700 dark:bg-yellow-900/20"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                                        <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                            {award.name}
                                                        </h4>
                                                        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                                            {
                                                                award.issuingOrganization
                                                            }
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                            <strong>
                                                                For:
                                                            </strong>{' '}
                                                            {award.awardFor}
                                                        </p>
                                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                            {award.description}
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(
                                                                award.issueDate,
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Projects Section */}
                        {meta_data.projects &&
                            meta_data.projects.length > 0 && (
                                <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Lightbulb className="h-5 w-5" />
                                            Projects
                                            <Badge
                                                variant="secondary"
                                                className="ml-2"
                                            >
                                                {meta_data.projects.length}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {meta_data.projects.map(
                                                (project: any) => (
                                                    <div
                                                        key={project.id}
                                                        className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-700 dark:bg-blue-900/20"
                                                    >
                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                    {
                                                                        project.name
                                                                    }
                                                                </h4>
                                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                                    {
                                                                        project.abstract
                                                                    }
                                                                </p>
                                                                <div className="mt-3 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        Published:{' '}
                                                                        {formatDate(
                                                                            project.publicationDate,
                                                                        )}
                                                                    </div>
                                                                    {project.role && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Target className="h-3 w-3" />
                                                                            Role:{' '}
                                                                            {
                                                                                project.role
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {project.collaborators && (
                                                                    <div className="mt-2">
                                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                            <strong>
                                                                                Collaborators:
                                                                            </strong>{' '}
                                                                            {
                                                                                project.collaborators
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Journals Section */}
                        {meta_data.journals &&
                            meta_data.journals.length > 0 && (
                                <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BookOpen className="h-5 w-5" />
                                            Journal Publications
                                            <Badge
                                                variant="secondary"
                                                className="ml-2"
                                            >
                                                {meta_data.journals.length}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {meta_data.journals.map(
                                                (journal: any) => (
                                                    <div
                                                        key={journal.id}
                                                        className="rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-700 dark:bg-purple-900/20"
                                                    >
                                                        <div className="space-y-3">
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                    {
                                                                        journal.title
                                                                    }
                                                                </h4>
                                                                <div className="mt-2 flex items-center gap-4">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className={`text-xs ${
                                                                            journal.status ===
                                                                            'published'
                                                                                ? 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                                                : journal.status ===
                                                                                    'under-review'
                                                                                  ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                                                  : 'border-gray-200 bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                                                                        }`}
                                                                    >
                                                                        {
                                                                            journal.status
                                                                        }
                                                                    </Badge>
                                                                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                                                        <Calendar className="h-3 w-3" />
                                                                        {formatDate(
                                                                            journal.publicationDate,
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {journal.collaborators && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                                    <strong>
                                                                        Collaborators:
                                                                    </strong>{' '}
                                                                    {
                                                                        journal.collaborators
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Patents Section */}
                        {meta_data.patents && meta_data.patents.length > 0 && (
                            <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Patents & Intellectual Property
                                        <Badge
                                            variant="secondary"
                                            className="ml-2"
                                        >
                                            {meta_data.patents.length}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {meta_data.patents.map(
                                            (patent: any) => (
                                                <div
                                                    key={patent.id}
                                                    className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-700 dark:bg-emerald-900/20"
                                                >
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                                {patent.name}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
                                                                {
                                                                    patent.patentFor
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                Awarded:{' '}
                                                                {formatDate(
                                                                    patent.awardedDate,
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <CheckCircle className="h-3 w-3 text-green-600" />
                                                                {
                                                                    patent.awardingBody
                                                                }
                                                            </div>
                                                        </div>
                                                        {patent.collaborators && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                                <strong>
                                                                    Collaborators:
                                                                </strong>{' '}
                                                                {
                                                                    patent.collaborators
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Profile Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Skills
                                        </span>
                                    </div>
                                    <span className="font-semibold text-blue-600">
                                        {meta_data.skills?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Certifications
                                        </span>
                                    </div>
                                    <span className="font-semibold text-green-600">
                                        {meta_data.certifications?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Award className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Awards
                                        </span>
                                    </div>
                                    <span className="font-semibold text-yellow-600">
                                        {meta_data.awards?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-purple-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Projects
                                        </span>
                                    </div>
                                    <span className="font-semibold text-purple-600">
                                        {meta_data.projects?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4 text-indigo-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Journals
                                        </span>
                                    </div>
                                    <span className="font-semibold text-indigo-600">
                                        {meta_data.journals?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-emerald-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Patents
                                        </span>
                                    </div>
                                    <span className="font-semibold text-emerald-600">
                                        {meta_data.patents?.length || 0}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Profile Completeness */}
                        <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Profile Completeness
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {(() => {
                                    const totalSections = 7; // Basic + Skills + Certifications + Awards + Projects + Journals + Patents
                                    let completedSections = 1; // Basic info is always there

                                    if (meta_data.skills?.length > 0)
                                        completedSections++;
                                    if (meta_data.certifications?.length > 0)
                                        completedSections++;
                                    if (meta_data.awards?.length > 0)
                                        completedSections++;
                                    if (meta_data.projects?.length > 0)
                                        completedSections++;
                                    if (meta_data.journals?.length > 0)
                                        completedSections++;
                                    if (meta_data.patents?.length > 0)
                                        completedSections++;

                                    const percentage =
                                        (completedSections / totalSections) *
                                        100;

                                    // Debug logging
                                    if (
                                        process.env.NODE_ENV === 'development'
                                    ) {
                                        console.log(
                                            'Profile completion debug:',
                                            {
                                                totalSections,
                                                completedSections,
                                                percentage,
                                                skillsCount:
                                                    meta_data.skills?.length ||
                                                    0,
                                                certificationsCount:
                                                    meta_data.certifications
                                                        ?.length || 0,
                                                awardsCount:
                                                    meta_data.awards?.length ||
                                                    0,
                                                projectsCount:
                                                    meta_data.projects
                                                        ?.length || 0,
                                                journalsCount:
                                                    meta_data.journals
                                                        ?.length || 0,
                                                patentsCount:
                                                    meta_data.patents?.length ||
                                                    0,
                                            },
                                        );
                                    }

                                    return (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    Completion
                                                </span>
                                                <span className="font-semibold">
                                                    {Math.round(percentage)}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                                <div
                                                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {completedSections} of{' '}
                                                {totalSections} sections
                                                completed
                                            </div>
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Activity Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Profile created on{' '}
                                            {formatDate(profile.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Last updated on{' '}
                                            {formatDate(profile.updatedAt)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
