'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from 'lucide-react';
import Link from 'next/link';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    contact: z.string().min(10, 'Please enter a valid contact number'),
    roleId: z.number().min(1, 'Please select a role'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function CreateProfilePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session } = useSession();

    const { data: roles } = trpc.profile.getRoles.useQuery();

    const createProfile = trpc.profile.createProfile.useMutation({
        onSuccess: () => {
            router.push('/dashboard');
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    const form = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: session?.user?.name || '',
            contact: '',
            roleId: 0,
        },
    });

    const onSubmit = async (data: ProfileForm) => {
        setIsLoading(true);
        setError(null);

        try {
            await createProfile.mutateAsync({
                fullName: data.fullName,
                contact: data.contact,
                roleId: data.roleId,
                extra: {},
            });
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-500"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Create Your Profile
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Complete your profile to start applying for ISTE awards.
                    </p>
                </div>

                <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            Profile Information
                        </CardTitle>
                        <CardDescription>
                            Provide your details to create your profile
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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

                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your full name"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
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
                                                Contact Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your contact number"
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
                                                onValueChange={(value) =>
                                                    field.onChange(
                                                        parseInt(value),
                                                    )
                                                }
                                                disabled={isLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select your role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {roles?.map((role) => (
                                                        <SelectItem
                                                            key={role.id}
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
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    role.name.slice(
                                                                        1,
                                                                    )}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-4 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            router.push('/dashboard')
                                        }
                                        disabled={isLoading}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        {isLoading
                                            ? 'Creating Profile...'
                                            : 'Create Profile'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
