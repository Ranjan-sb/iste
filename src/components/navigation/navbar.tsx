'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    Trophy,
    FileText,
    Home,
    Mail,
    Phone,
    ChevronDown,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import isteLogo from '@/logos/pngs/ISTE.png';

interface NavbarProps {
    variant?: 'landing' | 'dashboard' | 'auto';
}

export default function Navbar({ variant = 'auto' }: NavbarProps) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Auto-detect variant based on authentication status
    const effectiveVariant =
        variant === 'auto'
            ? session?.user
                ? 'dashboard'
                : 'landing'
            : variant;

    // Fetch user profile and roles for dashboard variant
    const { data: profile } = trpc.profile.getProfile.useQuery(undefined, {
        enabled: !!session?.user && effectiveVariant === 'dashboard',
    });
    const { data: roles } = trpc.profile.getRoles.useQuery(undefined, {
        enabled: effectiveVariant === 'dashboard',
    });

    // Hide navbar on auth pages
    if (pathname?.startsWith('/auth/')) {
        return null;
    }

    // Helper function to check if a path is active
    const isActivePath = (path: string) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname?.startsWith(path);
    };

    // Helper function to get active link classes
    const getLinkClasses = (path: string, baseClasses: string) => {
        const isActive = isActivePath(path);
        const isMobile = baseClasses.includes('block');

        if (isMobile) {
            return `${baseClasses} ${
                isActive
                    ? 'text-blue-600 font-medium bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 rounded-md'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md'
            }`;
        } else {
            return `${baseClasses} relative ${
                isActive
                    ? 'text-blue-600 font-medium dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:dark:bg-blue-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
            }`;
        }
    };

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

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Generate user initials
    const getUserInitials = (name: string | undefined) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    // Helper function to close all menus
    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 shadow-sm backdrop-blur-sm dark:bg-gray-900/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo, Brand and Navigation */}
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-1">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                                <img
                                    src={isteLogo.src}
                                    alt="ISTE Logo"
                                    className="h-8 w-8 object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                {effectiveVariant === 'dashboard'
                                    ? 'ISTE'
                                    : 'ISTE Platform'}
                            </span>
                        </Link>

                        {/* Dashboard Navigation Links */}
                        {effectiveVariant === 'dashboard' && (
                            <nav className="hidden md:flex md:items-center md:space-x-4">
                                <Link
                                    href="/dashboard"
                                    className={getLinkClasses(
                                        '/dashboard',
                                        'px-3 py-2 text-sm font-medium transition-colors',
                                    )}
                                >
                                    <Home className="mr-1 inline h-4 w-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/awards"
                                    className={getLinkClasses(
                                        '/awards',
                                        'px-3 py-2 text-sm font-medium transition-colors',
                                    )}
                                >
                                    <Trophy className="mr-1 inline h-4 w-4" />
                                    Awards
                                </Link>
                                <Link
                                    href="/dashboard/applications"
                                    className={getLinkClasses(
                                        '/dashboard/applications',
                                        'px-3 py-2 text-sm font-medium transition-colors',
                                    )}
                                >
                                    <FileText className="mr-1 inline h-4 w-4" />
                                    My Applications
                                </Link>
                            </nav>
                        )}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {effectiveVariant === 'landing' ? (
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
                            // Dashboard navigation - User Profile Only
                            <>
                                {/* User Profile Dropdown */}
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => {
                                            setIsUserMenuOpen(!isUserMenuOpen);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-2 rounded-full p-1 text-gray-600 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:text-gray-300 dark:hover:text-white"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                                            {getUserInitials(
                                                profile?.fullName ||
                                                    session?.user?.name,
                                            )}
                                        </div>
                                        <ChevronDown className="h-4 w-4" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                            {/* User Info Header */}
                                            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-medium text-white">
                                                        {getUserInitials(
                                                            profile?.fullName ||
                                                                session?.user
                                                                    ?.name,
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                            {profile?.fullName ||
                                                                session?.user
                                                                    ?.name ||
                                                                'User'}
                                                        </p>
                                                        <div className="mt-1 flex items-center">
                                                            <Badge
                                                                className={`${getRoleColor(roleName)} text-xs`}
                                                            >
                                                                {getRoleIcon(
                                                                    roleName,
                                                                )}
                                                                <span className="ml-1">
                                                                    {roleName}
                                                                </span>
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* User Details */}
                                            <div className="space-y-2 px-4 py-3">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                                    <Mail className="h-4 w-4 flex-shrink-0" />
                                                    <span className="truncate">
                                                        {session?.user?.email}
                                                    </span>
                                                </div>
                                                {profile?.contact && (
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <Phone className="h-4 w-4 flex-shrink-0" />
                                                        <span>
                                                            {profile.contact}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                >
                                                    <User className="mr-2 h-4 w-4" />
                                                    View Profile
                                                </Link>
                                                <Link
                                                    href="/profile/edit"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    onClick={() =>
                                                        setIsUserMenuOpen(false)
                                                    }
                                                >
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    Edit Profile
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        handleSignOut();
                                                        setIsUserMenuOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                                setIsUserMenuOpen(false);
                            }}
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
                            {effectiveVariant === 'landing' ? (
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
                                    <Link
                                        href="/dashboard"
                                        className={getLinkClasses(
                                            '/dashboard',
                                            'block px-3 py-2 transition-colors',
                                        )}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Home className="mr-2 inline h-4 w-4" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/awards"
                                        className={getLinkClasses(
                                            '/awards',
                                            'block px-3 py-2 transition-colors',
                                        )}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Trophy className="mr-2 inline h-4 w-4" />
                                        Awards
                                    </Link>
                                    <Link
                                        href="/dashboard/applications"
                                        className={getLinkClasses(
                                            '/dashboard/applications',
                                            'block px-3 py-2 transition-colors',
                                        )}
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <FileText className="mr-2 inline h-4 w-4" />
                                        My Applications
                                    </Link>

                                    {/* Mobile User Info */}
                                    <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
                                        <div className="px-3 py-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                                                    {getUserInitials(
                                                        profile?.fullName ||
                                                            session?.user?.name,
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                        {profile?.fullName ||
                                                            session?.user
                                                                ?.name ||
                                                            'User'}
                                                    </p>
                                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                        {session?.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center">
                                                <Badge
                                                    className={`${getRoleColor(roleName)} text-xs`}
                                                >
                                                    {getRoleIcon(roleName)}
                                                    <span className="ml-1">
                                                        {roleName}
                                                    </span>
                                                </Badge>
                                            </div>
                                            {profile?.contact && (
                                                <div className="mt-2 flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                                                    <Phone className="h-3 w-3" />
                                                    <span>
                                                        {profile.contact}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            href="/profile"
                                            className="block px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            <User className="mr-2 inline h-4 w-4" />
                                            View Profile
                                        </Link>
                                        <Link
                                            href="/profile/edit"
                                            className="block px-3 py-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            <Settings className="mr-2 inline h-4 w-4" />
                                            Edit Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="block w-full px-3 py-2 text-left text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <LogOut className="mr-2 inline h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
