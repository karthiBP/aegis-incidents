import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900">
                                AEGIS <span className="text-blue-600">INCIDENTS</span>
                            </span>
                        </Link>
                        <p className="text-gray-600 max-w-md">
                            Generate professional incident postmortems in 10 minutes, not 10 hours.
                            Save engineering time and impress stakeholders.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Product</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <Link href="/example" className="hover:text-blue-600 transition-colors">
                                    Example Report
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="hover:text-blue-600 transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#features" className="hover:text-blue-600 transition-colors">
                                    Features
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Company</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>
                                <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-blue-600 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:support@aegisincidents.com" className="hover:text-blue-600 transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} AEGIS INCIDENTS. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
