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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

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
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Profile
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">
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

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Profile Info */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader>
                                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                                        <User className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <CardTitle className="text-2xl">
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
                                                <p className="text-gray-600 dark:text-gray-300">
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
                                                <p className="text-gray-600 dark:text-gray-300">
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
                                                <p className="text-gray-600 dark:text-gray-300">
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
                                                <p className="text-gray-600 dark:text-gray-300">
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
                                            <h3 className="mb-2 text-lg font-semibold">
                                                About
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
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
                                        <Briefcase className="h-5 w-5" />
                                        Skills & Expertise
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
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
                                                <div key={category}>
                                                    <h4 className="mb-2 font-medium capitalize">
                                                        {category.replace(
                                                            '-',
                                                            ' ',
                                                        )}
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {categorySkills.map(
                                                            (skill: any) => (
                                                                <Badge
                                                                    key={
                                                                        skill.id
                                                                    }
                                                                    variant="secondary"
                                                                >
                                                                    {skill.name}
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
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader>
                                <CardTitle>Profile Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        Skills
                                    </span>
                                    <span className="font-semibold">
                                        {meta_data.skills?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        Certifications
                                    </span>
                                    <span className="font-semibold">
                                        {meta_data.certifications?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        Awards
                                    </span>
                                    <span className="font-semibold">
                                        {meta_data.awards?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        Projects
                                    </span>
                                    <span className="font-semibold">
                                        {meta_data.projects?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        Journals
                                    </span>
                                    <span className="font-semibold">
                                        {meta_data.journals?.length || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        Patents
                                    </span>
                                    <span className="font-semibold">
                                        {meta_data.patents?.length || 0}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Profile created on{' '}
                                            {new Date(
                                                profile.createdAt,
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="h-2 w-2 rounded-full bg-green-600"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Last updated on{' '}
                                            {new Date(
                                                profile.updatedAt,
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
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
