import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navigation/navbar';
import {
    Award,
    Users,
    GraduationCap,
    Building,
    CheckCircle,
    Bell,
    FileText,
    Shield,
    Star,
    Trophy,
    UserCheck,
    Calendar,
    ArrowRight,
    Sparkles,
} from 'lucide-react';

const ISTELandingPage = () => {
    const features = [
        {
            icon: <Users className="h-8 w-8 text-blue-600" />,
            title: 'Multi-Role Profiles',
            description:
                'Create comprehensive profiles for teachers, students, and colleges from across India with role-specific fields and information.',
        },
        {
            icon: <Award className="h-8 w-8 text-purple-600" />,
            title: 'Award Nominations',
            description:
                'Nominate yourself or others for prestigious ISTE awards with streamlined submission processes and tracking.',
        },
        {
            icon: <CheckCircle className="h-8 w-8 text-green-600" />,
            title: 'Automated Evaluation',
            description:
                'Intelligent evaluation system that validates nominations and determines eligibility based on predefined criteria.',
        },
        {
            icon: <Bell className="h-8 w-8 text-orange-600" />,
            title: 'Smart Notifications',
            description:
                'Stay updated with real-time notifications about award opportunities, application deadlines, and results.',
        },
        {
            icon: <FileText className="h-8 w-8 text-indigo-600" />,
            title: 'Application Management',
            description:
                'Comprehensive application system for awards with document uploads, progress tracking, and status updates.',
        },
        {
            icon: <Shield className="h-8 w-8 text-red-600" />,
            title: 'Secure & Scalable',
            description:
                'Built with enterprise-grade security and designed to handle thousands of users across India.',
        },
    ];

    const userTypes = [
        {
            icon: <GraduationCap className="h-12 w-12 text-blue-600" />,
            title: 'Teachers & Faculty',
            description:
                'Showcase your academic achievements, research work, and teaching excellence.',
            features: [
                'Teaching Portfolio',
                'Research Publications',
                'Academic Awards',
                'Professional Development',
            ],
        },
        {
            icon: <Users className="h-12 w-12 text-green-600" />,
            title: 'Students',
            description:
                'Build your academic profile and apply for student-specific awards and recognitions.',
            features: [
                'Academic Records',
                'Project Showcase',
                'Extracurricular Activities',
                'Student Awards',
            ],
        },
        {
            icon: <Building className="h-12 w-12 text-purple-600" />,
            title: 'Colleges & Institutions',
            description:
                'Represent your institution and apply for institutional awards and recognitions.',
            features: [
                'Institution Profile',
                'Faculty Management',
                'Infrastructure Details',
                'Institutional Awards',
            ],
        },
    ];

    const awardCategories = [
        {
            name: 'Best Teacher Award',
            count: '150+ nominees',
            color: 'bg-blue-100 text-blue-800',
        },
        {
            name: 'Student Excellence',
            count: '300+ applications',
            color: 'bg-green-100 text-green-800',
        },
        {
            name: 'Research Innovation',
            count: '200+ submissions',
            color: 'bg-purple-100 text-purple-800',
        },
        {
            name: 'Institutional Excellence',
            count: '75+ institutions',
            color: 'bg-orange-100 text-orange-800',
        },
    ];

    const stats = [
        {
            value: '10,000+',
            label: 'Active Users',
            icon: <Users className="h-6 w-6" />,
        },
        {
            value: '500+',
            label: 'Colleges',
            icon: <Building className="h-6 w-6" />,
        },
        {
            value: '50+',
            label: 'Award Categories',
            icon: <Trophy className="h-6 w-6" />,
        },
        {
            value: '1,000+',
            label: 'Awards Processed',
            icon: <Star className="h-6 w-6" />,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Navigation */}
            <Navbar variant="landing" />

            {/* Hero Section */}
            <section className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center">
                        <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            Indian Society for Technical Education
                        </Badge>
                        <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-7xl dark:text-white">
                            Empowering India's
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {' '}
                                Educational Excellence
                            </span>
                        </h1>
                        <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
                            The comprehensive platform for teachers, students,
                            and institutions across India to showcase
                            achievements, apply for awards, and drive
                            educational innovation through ISTE's prestigious
                            recognition programs.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg hover:from-blue-700 hover:to-purple-700"
                            >
                                Create Your Profile
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-8 py-3 text-lg"
                            >
                                Explore Awards
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white/50 px-4 py-12 backdrop-blur-sm sm:px-6 lg:px-8 dark:bg-gray-800/50">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="mb-2 flex justify-center text-blue-600">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* User Types Section */}
            <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                            Built for Every Member of India's Educational
                            Community
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Whether you're a teacher, student, or institution,
                            our platform is designed for your success
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                        {userTypes.map((type, index) => (
                            <Card
                                key={index}
                                className="group bg-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-gray-800/80"
                            >
                                <CardHeader className="text-center">
                                    <div className="mb-4 flex justify-center transition-transform duration-300 group-hover:scale-110">
                                        {type.icon}
                                    </div>
                                    <CardTitle className="text-2xl">
                                        {type.title}
                                    </CardTitle>
                                    <CardDescription className="text-lg">
                                        {type.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {type.features.map(
                                            (feature, featureIndex) => (
                                                <li
                                                    key={featureIndex}
                                                    className="flex items-center text-gray-600 dark:text-gray-300"
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                                                    {feature}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-20 sm:px-6 lg:px-8 dark:from-gray-800 dark:to-gray-900">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                            Comprehensive Platform Features
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Everything you need to manage profiles, nominations,
                            and awards in one place
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="group bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:bg-gray-800/80"
                            >
                                <CardHeader>
                                    <div className="mb-4 flex items-center">
                                        <div className="rounded-lg bg-gray-50 p-3 transition-transform duration-300 group-hover:scale-110 dark:bg-gray-700">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl">
                                        {feature.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Award Categories Section */}
            <section id="awards" className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                            Award Categories & Applications
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Explore our diverse range of awards and recognition
                            programs
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {awardCategories.map((category, index) => (
                            <Card
                                key={index}
                                className="group bg-white/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800/80"
                            >
                                <CardHeader className="text-center">
                                    <div className="mb-4 flex justify-center">
                                        <Trophy className="h-12 w-12 text-yellow-500 transition-transform duration-300 group-hover:rotate-12" />
                                    </div>
                                    <CardTitle className="text-lg">
                                        {category.name}
                                    </CardTitle>
                                    <Badge className={`${category.color} mt-2`}>
                                        {category.count}
                                    </Badge>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 py-3 text-lg"
                        >
                            View All Awards
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-20 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
                            Simple 4-Step Process
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            From profile creation to award recognition
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-4">
                        {[
                            {
                                step: '1',
                                title: 'Create Profile',
                                description:
                                    'Build your comprehensive profile with all necessary details',
                                icon: <UserCheck className="h-8 w-8" />,
                            },
                            {
                                step: '2',
                                title: 'Explore Awards',
                                description:
                                    'Browse available awards and check eligibility criteria',
                                icon: <Award className="h-8 w-8" />,
                            },
                            {
                                step: '3',
                                title: 'Apply & Submit',
                                description:
                                    'Submit your application with required documents',
                                icon: <FileText className="h-8 w-8" />,
                            },
                            {
                                step: '4',
                                title: 'Get Recognized',
                                description:
                                    'Receive notifications and track your application status',
                                icon: <Star className="h-8 w-8" />,
                            },
                        ].map((process, index) => (
                            <div key={index} className="group text-center">
                                <div className="relative">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
                                        {process.step}
                                    </div>
                                    {index < 3 && (
                                        <div className="absolute top-8 left-full hidden h-0.5 w-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-30 md:block"></div>
                                    )}
                                </div>
                                <div className="mb-2 flex justify-center text-blue-600 transition-transform duration-300 group-hover:scale-110">
                                    {process.icon}
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                    {process.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {process.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="mb-6 text-4xl font-bold text-white">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="mb-8 text-xl text-blue-100">
                        Join thousands of educators and students across India
                        who are already using our platform to achieve
                        recognition and excellence.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button
                            size="lg"
                            className="bg-white px-8 py-3 text-lg text-blue-600 hover:bg-gray-100"
                        >
                            Create Your Profile Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white px-8 py-3 text-lg text-white hover:bg-white hover:text-blue-600"
                        >
                            Schedule a Demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer
                id="about"
                className="bg-gray-900 px-4 py-12 text-white sm:px-6 lg:px-8"
            >
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                                    <Award className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-lg font-bold">
                                    ISTE Platform
                                </span>
                            </div>
                            <p className="text-gray-400">
                                Empowering India's educational excellence
                                through technology and recognition.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-4 text-lg font-semibold">
                                Platform
                            </h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="#features"
                                        className="transition-colors hover:text-white"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#awards"
                                        className="transition-colors hover:text-white"
                                    >
                                        Awards
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-white"
                                    >
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-white"
                                    >
                                        API
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 text-lg font-semibold">
                                Support
                            </h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-white"
                                    >
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-white"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-white"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-white"
                                    >
                                        Community
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 text-lg font-semibold">
                                Legal
                            </h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-white"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-white"
                                    >
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="transition-colors hover:text-white"
                                    >
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
                        <p>
                            &copy; {new Date().getFullYear()} ISTE Platform. All
                            rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ISTELandingPage;
