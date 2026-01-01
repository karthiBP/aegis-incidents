'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Mail, User, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgName, setOrgName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // Password validation
    const passwordMinLength = 6;
    const isPasswordValid = password.length >= passwordMinLength;

    // Check if user is already logged in
    useEffect(() => {
        const checkSession = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                router.push('/dashboard');
            } else {
                setIsCheckingSession(false);
            }
        };

        checkSession();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !orgName || !isPasswordValid) return;

        setIsLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        org_name: orgName,
                    },
                },
            });

            if (authError) {
                throw authError;
            }

            // Show success message
            setIsSuccess(true);
        } catch (err: unknown) {
            const error = err as { message?: string };
            setError(error.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking session
    if (isCheckingSession) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                        AEGIS <span className="text-blue-600">INCIDENTS</span>
                    </span>
                </Link>

                <Card className="border-gray-200 shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Create your account</CardTitle>
                        <CardDescription>
                            Start generating professional postmortems in minutes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isSuccess ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="org">Organization name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="org"
                                            type="text"
                                            value={orgName}
                                            onChange={(e) => setOrgName(e.target.value)}
                                            placeholder="Acme Inc."
                                            className="pl-10 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Work email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            className="pl-10 h-12"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Create a password (min 6 characters)"
                                            className="pl-10 pr-10 h-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {password && !isPasswordValid && (
                                        <p className="text-sm text-amber-600">Password must be at least {passwordMinLength} characters</p>
                                    )}
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600">{error}</p>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    disabled={isLoading || !isPasswordValid}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-center text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Check your email
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    We sent a confirmation link to <strong>{email}</strong>
                                </p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Click the link in the email to activate your account.
                                </p>
                                <Link href="/login">
                                    <Button variant="outline">
                                        Go to Sign In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        🎉 Start with 1 free incident. No credit card required.
                    </p>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                    By signing up, you agree to our{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </p>
            </motion.div>
        </div>
    );
}
