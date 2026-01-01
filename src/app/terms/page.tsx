import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms of Service - AEGIS INCIDENTS',
    description: 'Terms of Service for AEGIS INCIDENTS platform.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            AEGIS <span className="text-blue-600">INCIDENTS</span>
                        </span>
                    </Link>
                    <Link
                        href="/"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: January 2, 2026</p>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            By accessing or using AEGIS INCIDENTS (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            AEGIS INCIDENTS is an AI-powered platform that helps organizations create professional incident
                            postmortem documentation. The Service includes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li>AI-generated incident postmortem reports</li>
                            <li>Incident timeline and documentation tools</li>
                            <li>PDF export and sharing capabilities</li>
                            <li>Draft saving and management features</li>
                            <li>Analytics and incident tracking</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            To use certain features of the Service, you must register for an account. You agree to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li>Provide accurate and complete registration information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Notify us immediately of any unauthorized access</li>
                            <li>Accept responsibility for all activities under your account</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. Acceptable Use</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            You agree not to use the Service to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Upload malicious code or attempt to breach security</li>
                            <li>Share false or misleading incident information</li>
                            <li>Infringe on intellectual property rights of others</li>
                            <li>Harass, abuse, or harm other users</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Intellectual Property</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            The Service and its original content, features, and functionality are owned by AEGIS INCIDENTS
                            and are protected by international copyright, trademark, and other intellectual property laws.
                            Your incident data and generated reports remain your property.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. AI-Generated Content</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Our Service uses artificial intelligence to generate postmortem reports. You acknowledge that:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li>AI-generated content should be reviewed before publication</li>
                            <li>You are responsible for the accuracy of final reports</li>
                            <li>AI outputs may contain errors or require human editing</li>
                            <li>We do not guarantee specific outcomes from AI features</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Limitation of Liability</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            AEGIS INCIDENTS shall not be liable for any indirect, incidental, special, consequential, or
                            punitive damages resulting from your use of the Service. The Service is provided &quot;as is&quot;
                            without warranties of any kind.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Termination</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            We reserve the right to suspend or terminate your account at our sole discretion, without
                            notice, for conduct that we believe violates these Terms or is harmful to other users,
                            us, or third parties, or for any other reason.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Changes to Terms</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            We may modify these Terms at any time. We will notify users of significant changes via
                            email or through the Service. Continued use after changes constitutes acceptance of the
                            new Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            If you have questions about these Terms, please contact us at:
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            Email: <a href="mailto:legal@aegis-incidents.com" className="text-blue-600 hover:underline">legal@aegis-incidents.com</a>
                        </p>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-wrap gap-6 text-sm">
                        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Home</Link>
                        <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Login</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
