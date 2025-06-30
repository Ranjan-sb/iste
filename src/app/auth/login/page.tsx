'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { signIn } from '@/server/auth/client';
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import isteLogo from '@/logos/pngs/ISTE.png';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn.email({
                email: data.email,
                password: data.password,
                callbackURL: '/dashboard',
            });

            if (result?.data?.user) {
                router.push('/dashboard');
            } else {
                setTimeout(() => {
                    router.push('/dashboard');
                }, 100);
            }
        } catch (error: any) {
            if (
                error?.message?.includes('Invalid') ||
                error?.message?.includes('credentials')
            ) {
                setError('Invalid email or password. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                        Welcome back to ISTE
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Login Card */}
                <Card className="bg-white/80 shadow-xl backdrop-blur-sm dark:bg-gray-800/80">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-center text-2xl">
                            Sign In
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your account
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
                                                        placeholder="Enter your password"
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

                                <div className="flex items-center justify-between">
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </form>
                        </Form>

                        <Separator />

                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Don't have an account?{' '}
                                <Link
                                    href="/auth/register"
                                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        By signing in, you agree to our{' '}
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
