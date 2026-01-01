'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            AEGIS <span className="text-blue-600">INCIDENTS</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/example">
                            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                Example Report
                            </Button>
                        </Link>
                        <Link href="#pricing">
                            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                Pricing
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-white border-t border-gray-100"
                >
                    <div className="px-4 py-4 space-y-2">
                        <Link href="/example" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                                Example Report
                            </Button>
                        </Link>
                        <Link href="#pricing" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                                Pricing
                            </Button>
                        </Link>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
