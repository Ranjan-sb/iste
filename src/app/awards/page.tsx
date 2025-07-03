'use client';

import React from 'react';
import Link from 'next/link';
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
    Plus,
    Calendar,
    Users,
    Award,
    CheckCircle,
    Edit,
} from 'lucide-react';
import { formatDeadline } from '@/lib/date-utils';
import { trpc } from '@/providers/trpc-provider';

const AwardsPage = () => {
    const { data: awards, isLoading, error } = trpc.award.getAwards.useQuery();
    const { data: myApplications } =
        trpc.application.getMyApplications.useQuery();

    // Helper function to get application status for an award
    const getApplicationStatus = (awardId: number) => {
        if (!myApplications) return null;
        return myApplications.find((app) => app.awardId === awardId);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Trophy className="mx-auto h-12 w-12 animate-pulse text-gray-400" />
                    <p className="mt-2 text-gray-600">Loading awards...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mb-4 text-red-500">
                        <svg
                            className="mx-auto h-12 w-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Error loading awards
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
                            Awards
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Discover and apply for prestigious ISTE awards
                        </p>
                    </div>
                    <Link href="/awards/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Award
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Trophy className="h-8 w-8 text-yellow-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Awards
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        50+
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Applications
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        1,200+
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Award className="h-8 w-8 text-green-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Winners
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        300+
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-purple-500" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Open Awards
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        15
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Available Awards */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Available Awards
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {awards && awards.length > 0 ? (
                            awards.map((award) => {
                                const isOpen =
                                    new Date(award.submissionDeadline) >
                                    new Date();
                                const applicationStatus = getApplicationStatus(
                                    award.id,
                                );
                                return (
                                    <Card
                                        key={award.id}
                                        className="transition-shadow hover:shadow-lg"
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <Trophy className="h-8 w-8 text-yellow-500" />
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
                                                                    : 'outline'
                                                            }
                                                            className={
                                                                applicationStatus.status ===
                                                                'submitted'
                                                                    ? 'flex items-center gap-1 border-green-300 bg-green-100 text-green-800'
                                                                    : 'flex items-center gap-1 border-orange-300 bg-orange-100 text-orange-800'
                                                            }
                                                        >
                                                            {applicationStatus.status ===
                                                            'submitted' ? (
                                                                <>
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    Applied
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Edit className="h-3 w-3" />
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
                                                    <span className="text-gray-600">
                                                        Category:
                                                    </span>
                                                    <Badge variant="outline">
                                                        {award.category}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">
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
                                                            <span className="text-gray-600">
                                                                Applied on:
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
                                                    <Link
                                                        href={`/dashboard/applications/${applicationStatus.id}`}
                                                    >
                                                        <Button
                                                            className="w-full"
                                                            variant="outline"
                                                        >
                                                            View Application
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/awards/apply/${award.id}`}
                                                    >
                                                        <Button
                                                            className="w-full"
                                                            variant="outline"
                                                            disabled={!isOpen}
                                                        >
                                                            {!isOpen
                                                                ? 'Deadline Passed'
                                                                : applicationStatus?.status ===
                                                                    'draft'
                                                                  ? 'Continue Draft'
                                                                  : 'Apply Now'}
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-12 text-center">
                                <Trophy className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    No awards available
                                </h3>
                                <p className="mt-1 text-gray-500">
                                    Be the first to create an award!
                                </p>
                                <Link
                                    href="/awards/create"
                                    className="mt-4 inline-block"
                                >
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Award
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 rounded-lg bg-blue-600 p-8 text-center text-white">
                    <h3 className="text-2xl font-bold">Ready to Apply?</h3>
                    <p className="mt-2 text-blue-100">
                        Start your award application journey with our
                        streamlined process
                    </p>
                    <Link href="/awards/create">
                        <Button className="mt-4 bg-white text-blue-600 hover:bg-gray-100">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Application
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AwardsPage;
