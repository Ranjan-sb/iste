'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSession, signOut } from '@/server/auth/client';
import { trpc } from '@/providers/trpc-provider';
import {
    User,
    Settings,
    GraduationCap,
    Building,
    Users,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';
import isteLogo from '@/logos/pngs/ISTE.png';

interface NavbarProps {
    variant?: 'landing' | 'dashboard';
}

export default function Navbar({ variant = 'landing' }: NavbarProps) {
    const { data: session } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Fetch user profile and roles for dashboard variant
    const { data: profile } = trpc.profile.getProfile.useQuery(undefined, {
        enabled: !!session?.user && variant === 'dashboard',
    });
    const { data: roles } = trpc.profile.getRoles.useQuery(undefined, {
        enabled: variant === 'dashboard',
    });

    const handleSignOut = async () => {
        await signOut();
        window.location.href = '/';
    };

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

    const userRole = roles?.find((role) => role.id === profile?.roleId);
    const roleName = userRole?.name || 'User';

    return (
        <header className="sticky top-0 z-50 bg-white/80 shadow-sm backdrop-blur-sm dark:bg-gray-900/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                                <img
                                    src={isteLogo.src}
                                    alt="ISTE Logo"
                                    className="h-8 w-8 object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                {variant === 'dashboard'
                                    ? 'ISTE Dashboard'
                                    : 'ISTE Platform'}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {variant === 'landing' ? (
                            // Landing page navigation
                            <>
                                <Link
                                    href="#features"
                                    className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                >
                                    Features
                                </Link>
                                <Link
                                    href="#awards"
                                    className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                >
                                    Awards
                                </Link>
                                <Link
                                    href="#about"
                                    className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                >
                                    About
                                </Link>
                                {session?.user ? (
                                    <div className="flex items-center space-x-4">
                                        <Link href="/dashboard">
                                            <Button
                                                variant="ghost"
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleSignOut}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Sign Out
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link href="/auth/login">
                                            <Button
                                                variant="ghost"
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                Sign-In
                                            </Button>
                                        </Link>
                                        <Link href="/auth/register">
                                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Dashboard navigation
                            <>
                                <div className="flex items-center space-x-2">
                                    <Badge className={getRoleColor(roleName)}>
                                        {getRoleIcon(roleName)}
                                        <span className="ml-1">{roleName}</span>
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSignOut}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="text-gray-600 hover:text-gray-900"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="mt-2 space-y-1 rounded-lg bg-white/95 px-2 pt-2 pb-3 shadow-lg dark:bg-gray-900/95">
                            {variant === 'landing' ? (
                                <>
                                    <Link
                                        href="#features"
                                        className="block px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        Features
                                    </Link>
                                    <Link
                                        href="#awards"
                                        className="block px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        Awards
                                    </Link>
                                    <Link
                                        href="#about"
                                        className="block px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        About
                                    </Link>
                                    {session?.user ? (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                className="block px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleSignOut();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="block w-full px-3 py-2 text-left text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href="/auth/login"
                                                className="block px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                            >
                                                Sign-In
                                            </Link>
                                            <Link
                                                href="/auth/register"
                                                className="block px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                            >
                                                Get Started
                                            </Link>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="px-3 py-2">
                                        <Badge
                                            className={getRoleColor(roleName)}
                                        >
                                            {getRoleIcon(roleName)}
                                            <span className="ml-1">
                                                {roleName}
                                            </span>
                                        </Badge>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full px-3 py-2 text-left text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
