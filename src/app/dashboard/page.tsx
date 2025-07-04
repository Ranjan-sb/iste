'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/server/auth/client';
import { trpc } from '@/providers/trpc-provider';
import { formatDeadline } from '@/lib/date-utils';

import {
    User,
    Settings,
    Award,
    FileText,
    Bell,
    GraduationCap,
    Building,
    Users,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

export default function DashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const { data: profile, error: profileError } =
        trpc.profile.getProfile.useQuery(undefined, {
            enabled: !!session?.user,
            retry: false,
        });
    const { data: roles } = trpc.profile.getRoles.useQuery();
    const { data: awards } = trpc.award.getAwards.useQuery();
    const { data: myApplications } =
        trpc.application.getMyApplications.useQuery();

    // Helper function to get application status for an award
    const getApplicationStatus = (awardId: number) => {
        if (!myApplications) return null;
        return myApplications.find((app) => app.awardId === awardId);
    };

    // Pagination logic for awards
    const totalPages = Math.ceil((awards?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentAwards = awards?.slice(startIndex, endIndex) || [];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    // Reset to first page when switching to awards tab
    useEffect(() => {
        if (activeTab === 'awards') {
            setCurrentPage(1);
        }
    }, [activeTab]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!session?.user) {
                router.push('/auth/login');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [session, router]);

    if (session === undefined) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                        Loading session...
                    </p>
                </div>
            </div>
        );
    }

    if (!session?.user) {
        return null;
    }

    const userRole = roles?.find((role) => role.id === profile?.roleId);
    const roleName = userRole?.name || session?.user?.role || 'User';

    const getRoleIcon = (roleName: string) => {
        switch (roleName.toLowerCase()) {
            case 'student':
                return <GraduationCap className="h-5 w-5" />;
            case 'faculty':
            case 'teacher':
                return <Users className="h-5 w-5" />;
            case 'admin':
                return <Settings className="h-5 w-5" />;
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
            case 'teacher':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            case 'institution':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {session.user.name}!
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Manage your profile, explore awards, and track your
                        applications.
                    </p>
                    {!profile && !profileError && (
                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                            <p className="text-blue-800 dark:text-blue-200">
                                👋 Welcome to ISTE! Complete your profile to get
                                started with award applications.
                            </p>
                            <Button
                                className="mt-2 bg-blue-600 hover:bg-blue-700"
                                onClick={() => router.push('/profile/create')}
                            >
                                Complete Profile
                            </Button>
                        </div>
                    )}
                    {profile && (
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/profile')}
                                className="flex w-full items-center gap-2 sm:w-auto"
                            >
                                <User className="h-4 w-4" />
                                View Profile
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/profile/edit')}
                                className="flex w-full items-center gap-2 sm:w-auto"
                            >
                                <Settings className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        </div>
                    )}
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <div className="overflow-x-auto">
                        <TabsList className="inline-flex w-max min-w-full">
                            <TabsTrigger
                                value="overview"
                                className="whitespace-nowrap"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="profile"
                                className="whitespace-nowrap"
                            >
                                Profile
                            </TabsTrigger>
                            <TabsTrigger
                                value="awards"
                                className="whitespace-nowrap"
                            >
                                Awards
                            </TabsTrigger>
                            <TabsTrigger
                                value="applications"
                                className="whitespace-nowrap"
                            >
                                Applications
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Profile Status
                                    </CardTitle>
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        Complete
                                    </div>
                                    <p className="text-muted-foreground text-xs">
                                        Your profile is ready for applications
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Active Applications
                                    </CardTitle>
                                    <FileText className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3</div>
                                    <p className="text-muted-foreground text-xs">
                                        Applications in progress
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Awards Won
                                    </CardTitle>
                                    <Award className="h-4 w-4 text-yellow-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1</div>
                                    <p className="text-muted-foreground text-xs">
                                        Recognition received
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Notifications
                                    </CardTitle>
                                    <Bell className="h-4 w-4 text-orange-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">2</div>
                                    <p className="text-muted-foreground text-xs">
                                        Unread notifications
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>
                                        Your latest activities and updates
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Profile Updated
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                2 hours ago
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Application Submitted
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                1 day ago
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                                            <Award className="h-4 w-4 text-yellow-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Award Received
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                1 week ago
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Upcoming Deadlines</CardTitle>
                                    <CardDescription>
                                        Important dates to remember
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                                            <Clock className="h-4 w-4 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Best Teacher Award
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Due in 5 days
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                                            <Calendar className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                Research Innovation
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Due in 2 weeks
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Manage your personal and professional
                                    information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {profile ? (
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Full Name
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                    {profile.fullName}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Email
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                    {session.user.email}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Contact
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                    {profile.contact ||
                                                        'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Role
                                                </label>
                                                <div className="mt-1 flex items-center">
                                                    <Badge
                                                        className={getRoleColor(
                                                            roleName,
                                                        )}
                                                    >
                                                        {getRoleIcon(roleName)}
                                                        <span className="ml-1">
                                                            {roleName}
                                                        </span>
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Profile Created
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                    {new Date(
                                                        profile.createdAt,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Last Updated
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                                    {new Date(
                                                        profile.updatedAt,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center">
                                        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                                            Profile Not Found
                                        </h3>
                                        <p className="mb-4 text-gray-600 dark:text-gray-300">
                                            You need to create your profile to
                                            continue.
                                        </p>
                                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                            Create Profile
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Awards Tab */}
                    <TabsContent value="awards" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Available Awards</CardTitle>
                                <CardDescription>
                                    Explore awards you can apply for based on
                                    your role
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {awards && awards.length > 0 ? (
                                        currentAwards.map((award) => {
                                            const isOpen =
                                                new Date(
                                                    award.submissionDeadline,
                                                ) > new Date();
                                            const applicationStatus =
                                                getApplicationStatus(award.id);
                                            return (
                                                <Card
                                                    key={award.id}
                                                    className="transition-shadow hover:shadow-lg"
                                                >
                                                    <CardHeader>
                                                        <div className="flex items-start justify-between">
                                                            <Award className="h-8 w-8 text-yellow-500" />
                                                            <div className="flex flex-col gap-2">
                                                                <Badge
                                                                    variant={
                                                                        isOpen
                                                                            ? 'default'
                                                                            : 'secondary'
                                                                    }
                                                                >
                                                                    {isOpen
                                                                        ? 'Open'
                                                                        : 'Closed'}
                                                                </Badge>
                                                                {applicationStatus && (
                                                                    <Badge
                                                                        variant={
                                                                            applicationStatus.status ===
                                                                            'submitted'
                                                                                ? 'default'
                                                                                : 'secondary'
                                                                        }
                                                                        className="text-xs"
                                                                    >
                                                                        {applicationStatus.status ===
                                                                        'submitted' ? (
                                                                            <>
                                                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                                                Applied
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Clock className="mr-1 h-3 w-3" />
                                                                                Draft
                                                                            </>
                                                                        )}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <CardTitle className="text-lg">
                                                            {award.name}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {award.description}
                                                        </CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">
                                                                    Category:
                                                                </span>
                                                                <Badge variant="outline">
                                                                    {
                                                                        award.category
                                                                    }
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-600 dark:text-gray-400">
                                                                    Deadline:
                                                                </span>
                                                                <span className="font-medium">
                                                                    {formatDeadline(
                                                                        award.submissionDeadline.toISOString(),
                                                                    )}
                                                                </span>
                                                            </div>
                                                            {applicationStatus?.status ===
                                                                'submitted' &&
                                                                applicationStatus.submittedAt && (
                                                                    <div className="flex items-center justify-between text-sm">
                                                                        <span className="text-gray-600 dark:text-gray-400">
                                                                            Applied
                                                                            on:
                                                                        </span>
                                                                        <span className="font-medium text-green-600">
                                                                            {formatDeadline(
                                                                                applicationStatus.submittedAt.toISOString(),
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            {applicationStatus?.status ===
                                                            'submitted' ? (
                                                                <Button
                                                                    size="sm"
                                                                    className="w-full"
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        router.push(
                                                                            `/dashboard/applications/${applicationStatus.id}`,
                                                                        )
                                                                    }
                                                                >
                                                                    View
                                                                    Application
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="sm"
                                                                    className="w-full"
                                                                    disabled={
                                                                        !isOpen
                                                                    }
                                                                    onClick={() =>
                                                                        router.push(
                                                                            `/awards/apply/${award.id}`,
                                                                        )
                                                                    }
                                                                >
                                                                    {!isOpen
                                                                        ? 'Deadline Passed'
                                                                        : applicationStatus?.status ===
                                                                            'draft'
                                                                          ? 'Continue Draft'
                                                                          : 'Apply Now'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full py-12 text-center">
                                            <Award className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                                                No awards available
                                            </h3>
                                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                                Check back later for new award
                                                opportunities!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {awards && awards.length > itemsPerPage && (
                                    <div className="flex flex-col items-center justify-between space-y-3 pt-6 sm:flex-row sm:space-y-0">
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                Showing {startIndex + 1} to{' '}
                                                {Math.min(
                                                    endIndex,
                                                    awards.length,
                                                )}{' '}
                                                of {awards.length} awards
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 1}
                                                className="hidden sm:flex"
                                            >
                                                <ChevronLeft className="mr-1 h-4 w-4" />
                                                Previous
                                            </Button>

                                            {/* Mobile Previous Button */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 1}
                                                className="sm:hidden"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>

                                            {/* Page Numbers */}
                                            <div className="flex items-center space-x-1">
                                                {totalPages <= 7 ? (
                                                    // Show all pages if 7 or fewer
                                                    [...Array(totalPages)].map(
                                                        (_, index) => {
                                                            const pageNumber =
                                                                index + 1;
                                                            return (
                                                                <Button
                                                                    key={
                                                                        pageNumber
                                                                    }
                                                                    variant={
                                                                        currentPage ===
                                                                        pageNumber
                                                                            ? 'default'
                                                                            : 'outline'
                                                                    }
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handlePageChange(
                                                                            pageNumber,
                                                                        )
                                                                    }
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    {pageNumber}
                                                                </Button>
                                                            );
                                                        },
                                                    )
                                                ) : (
                                                    // Show truncated pagination for many pages
                                                    <>
                                                        {/* First page */}
                                                        <Button
                                                            variant={
                                                                currentPage ===
                                                                1
                                                                    ? 'default'
                                                                    : 'outline'
                                                            }
                                                            size="sm"
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    1,
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            1
                                                        </Button>

                                                        {/* Left ellipsis */}
                                                        {currentPage > 3 && (
                                                            <span className="px-2 text-gray-500">
                                                                ...
                                                            </span>
                                                        )}

                                                        {/* Current page and neighbors */}
                                                        {[...Array(3)].map(
                                                            (_, index) => {
                                                                const pageNumber =
                                                                    Math.max(
                                                                        2,
                                                                        Math.min(
                                                                            totalPages -
                                                                                1,
                                                                            currentPage -
                                                                                1 +
                                                                                index,
                                                                        ),
                                                                    );
                                                                if (
                                                                    pageNumber ===
                                                                        1 ||
                                                                    pageNumber ===
                                                                        totalPages
                                                                )
                                                                    return null;
                                                                return (
                                                                    <Button
                                                                        key={
                                                                            pageNumber
                                                                        }
                                                                        variant={
                                                                            currentPage ===
                                                                            pageNumber
                                                                                ? 'default'
                                                                                : 'outline'
                                                                        }
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handlePageChange(
                                                                                pageNumber,
                                                                            )
                                                                        }
                                                                        className="h-8 w-8 p-0"
                                                                    >
                                                                        {
                                                                            pageNumber
                                                                        }
                                                                    </Button>
                                                                );
                                                            },
                                                        )}

                                                        {/* Right ellipsis */}
                                                        {currentPage <
                                                            totalPages - 2 && (
                                                            <span className="px-2 text-gray-500">
                                                                ...
                                                            </span>
                                                        )}

                                                        {/* Last page */}
                                                        {totalPages > 1 && (
                                                            <Button
                                                                variant={
                                                                    currentPage ===
                                                                    totalPages
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                size="sm"
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        totalPages,
                                                                    )
                                                                }
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                {totalPages}
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleNextPage}
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                className="hidden sm:flex"
                                            >
                                                Next
                                                <ChevronRight className="ml-1 h-4 w-4" />
                                            </Button>

                                            {/* Mobile Next Button */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleNextPage}
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                className="sm:hidden"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>My Applications</CardTitle>
                                <CardDescription>
                                    Track the status of your award applications
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {myApplications &&
                                    myApplications.length > 0 ? (
                                        myApplications.map((application) => (
                                            <div
                                                key={application.id}
                                                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <Award className="h-5 w-5 text-yellow-500" />
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                                {
                                                                    application.awardName
                                                                }
                                                            </h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {application.status ===
                                                                    'submitted' &&
                                                                application.submittedAt
                                                                    ? `Submitted on ${formatDeadline(application.submittedAt.toISOString())}`
                                                                    : application.status ===
                                                                        'draft'
                                                                      ? `Draft saved on ${formatDeadline(application.updatedAt.toISOString())}`
                                                                      : `Updated on ${formatDeadline(application.updatedAt.toISOString())}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {
                                                                application.awardCategory
                                                            }
                                                        </Badge>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            Deadline:{' '}
                                                            {formatDeadline(
                                                                application.submissionDeadline.toISOString(),
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge
                                                        variant={
                                                            application.status ===
                                                            'submitted'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className={
                                                            application.status ===
                                                            'submitted'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                                        }
                                                    >
                                                        {application.status ===
                                                        'submitted' ? (
                                                            <>
                                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                                Submitted
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="mr-1 h-3 w-3" />
                                                                Draft
                                                            </>
                                                        )}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            application.status ===
                                                            'submitted'
                                                                ? router.push(
                                                                      `/dashboard/applications/${application.id}`,
                                                                  )
                                                                : router.push(
                                                                      `/awards/apply/${application.awardId}`,
                                                                  )
                                                        }
                                                    >
                                                        {application.status ===
                                                        'submitted' ? (
                                                            <>
                                                                <FileText className="mr-1 h-3 w-3" />
                                                                View
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Settings className="mr-1 h-3 w-3" />
                                                                Continue
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center">
                                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                                                No applications yet
                                            </h3>
                                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                                Start by applying for an award!
                                            </p>
                                            <Button
                                                className="mt-4"
                                                onClick={() =>
                                                    router.push('/awards')
                                                }
                                            >
                                                Browse Awards
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
