'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Bell, Home, Settings, LogOut, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';

export function DashboardHeader({ title }: { title: string }) {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userInitials, setUserInitials] = useState('U');

    useEffect(() => {
        setMounted(true);
        const getUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setUserEmail(user.email);
                setUserInitials(user.email.charAt(0).toUpperCase());
            }
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <Home className="w-5 h-5" />
                </Link>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
            </div>

            <div className="flex items-center space-x-3">
                {/* Dark Mode Toggle */}
                {mounted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </Button>
                )}

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="p-4 text-center text-sm text-gray-500">
                            No new notifications
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">My Account</p>
                                {userEmail && (
                                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                                )}
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings" className="flex items-center cursor-pointer">
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings" className="flex items-center cursor-pointer">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onClick={handleSignOut}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
