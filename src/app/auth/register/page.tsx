'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
import { signUp } from '@/server/auth/client';
import {
    AlertCircle,
    Mail,
    Lock,
    Eye,
    EyeOff,
    User,
    CheckCircle,
} from 'lucide-react';
import isteLogo from '@/logos/pngs/ISTE.png';

const registerSchema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Please enter a valid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const form = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
            });

            if (result?.error) {
                setError(result.error.message || 'Failed to create account');
            } else {
                setSuccess(true);
                // Redirect to login after a short delay
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="w-full max-w-md">
                    <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                    Account Created Successfully!
                                </h2>
                                <p className="mb-6 text-gray-600 dark:text-gray-300">
                                    Please check your email to verify your
                                    account before signing in.
                                </p>
                                <Button
                                    onClick={() => router.push('/auth/login')}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    Go to Sign In
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-lg">
                            <img
                                src={isteLogo.src}
                                alt="ISTE Logo"
                                className="h-12 w-12 object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Join ISTE Platform
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Create your account to get started
                    </p>
                </div>

                {/* Registration Card */}
                <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-center text-2xl">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-center">
                            Fill in your details to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                {error && (
                                    <div className="flex items-center space-x-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="Enter your full name"
                                                        className="pl-10"
                                                        disabled={isLoading}
                                                    />
                                                </div>
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
                                                <div className="relative">
                                                    <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        {...field}
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        className="pl-10"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        {...field}
                                                        type={
                                                            showPassword
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        placeholder="Create a password"
                                                        className="pr-10 pl-10"
                                                        disabled={isLoading}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                                        disabled={isLoading}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        {...field}
                                                        type={
                                                            showConfirmPassword
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        placeholder="Confirm your password"
                                                        className="pr-10 pl-10"
                                                        disabled={isLoading}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword,
                                                            )
                                                        }
                                                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                                                        disabled={isLoading}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? 'Creating Account...'
                                        : 'Create Account'}
                                </Button>
                            </form>
                        </Form>

                        <Separator />

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Already have an account?{' '}
                                <Link
                                    href="/auth/login"
                                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        By creating an account, you agree to our{' '}
                        <Link
                            href="/terms"
                            className="text-blue-600 hover:text-blue-500"
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            href="/privacy"
                            className="text-blue-600 hover:text-blue-500"
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
