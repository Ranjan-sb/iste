'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Trophy,
    Calendar,
    Eye,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowRight,
    Plus,
} from 'lucide-react';
import { trpc } from '@/providers/trpc-provider';
import { formatDeadline } from '@/lib/date-utils';
import Link from 'next/link';

const ApplicationsPage = () => {
    const {
        data: applications,
        isLoading,
        error,
    } = trpc.application.getMyApplications.useQuery();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'submitted':
                return 'bg-blue-100 text-blue-800';
            case 'under_review':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'submitted':
                return <Clock className="h-4 w-4" />;
            case 'under_review':
                return <AlertCircle className="h-4 w-4" />;
            case 'accepted':
                return <CheckCircle className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            case 'draft':
                return <FileText className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const formatStatus = (status: string) => {
        return status
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Trophy className="mx-auto h-12 w-12 animate-pulse text-gray-400" />
                    <p className="mt-2 text-gray-600">
                        Loading your applications...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 text-red-500">
                        <AlertCircle className="mx-auto h-12 w-12" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Error loading applications
                    </h3>
                    <p className="mt-2 text-gray-600">{error.message}</p>
                    <Button
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Applications
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Track your award applications and their status
                        </p>
                    </div>
                    <Link href="/awards">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Apply to New Award
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <FileText className="h-8 w-8 text-blue-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Applications
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {applications?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-yellow-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Under Review
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {applications?.filter(
                                            (app) =>
                                                app.status === 'under_review',
                                        ).length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <CheckCircle className="h-8 w-8 text-green-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Accepted
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {applications?.filter(
                                            (app) => app.status === 'accepted',
                                        ).length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <FileText className="h-8 w-8 text-gray-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Drafts
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {applications?.filter(
                                            (app) => app.status === 'draft',
                                        ).length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Applications List */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Your Applications
                    </h2>

                    {applications && applications.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {applications.map((application) => {
                                const isDeadlinePassed =
                                    new Date() >
                                    new Date(application.submissionDeadline);

                                return (
                                    <Card
                                        key={application.id}
                                        className="transition-shadow hover:shadow-lg"
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Trophy className="h-6 w-6 text-yellow-500" />
                                                    <div>
                                                        <CardTitle className="text-lg">
                                                            {
                                                                application.awardName
                                                            }
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {
                                                                application.awardDescription
                                                            }
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <Badge
                                                    className={getStatusColor(
                                                        application.status,
                                                    )}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(
                                                            application.status,
                                                        )}
                                                        {formatStatus(
                                                            application.status,
                                                        )}
                                                    </div>
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                        <span className="text-gray-600">
                                                            Category:
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {
                                                                application.awardCategory
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-gray-500" />
                                                        <span className="text-gray-600">
                                                            Deadline:
                                                        </span>
                                                        <span
                                                            className={`font-medium ${isDeadlinePassed ? 'text-red-600' : 'text-gray-900'}`}
                                                        >
                                                            {formatDeadline(
                                                                application.submissionDeadline.toISOString(),
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                                                    <div>
                                                        <span className="text-gray-600">
                                                            Applied:
                                                        </span>
                                                        <span className="ml-2 font-medium">
                                                            {application.submittedAt
                                                                ? formatDeadline(
                                                                      application.submittedAt.toISOString(),
                                                                  )
                                                                : 'Draft'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">
                                                            Last Updated:
                                                        </span>
                                                        <span className="ml-2 font-medium">
                                                            {formatDeadline(
                                                                application.updatedAt.toISOString(),
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    <Link
                                                        href={`/dashboard/applications/${application.id}`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </Button>
                                                    </Link>

                                                    {application.status ===
                                                        'draft' &&
                                                        !isDeadlinePassed && (
                                                            <Link
                                                                href={`/awards/apply/${application.awardId}`}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-blue-600 hover:bg-blue-700"
                                                                >
                                                                    Continue
                                                                    Application
                                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Trophy className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">
                                No applications yet
                            </h3>
                            <p className="mt-1 text-gray-500">
                                Start applying to awards to see them here!
                            </p>
                            <Link href="/awards" className="mt-4 inline-block">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Browse Awards
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Call to Action */}
                <div className="mt-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
                    <h3 className="text-2xl font-bold">Keep Applying!</h3>
                    <p className="mt-2 text-blue-100">
                        Don't miss out on new award opportunities. Check back
                        regularly for new awards.
                    </p>
                    <Link href="/awards">
                        <Button className="mt-4 bg-white text-blue-600 hover:bg-gray-100">
                            <Trophy className="mr-2 h-4 w-4" />
                            Explore More Awards
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsPage;
