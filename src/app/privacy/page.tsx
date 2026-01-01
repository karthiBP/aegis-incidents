import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy - AEGIS INCIDENTS',
    description: 'Privacy Policy for AEGIS INCIDENTS platform.',
};

export default function PrivacyPage() {
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: January 2, 2026</p>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            AEGIS INCIDENTS (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                            when you use our incident postmortem platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Personal Information</h3>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                            <li>Email address (for account registration and communication)</li>
                            <li>Organization name (for account identification)</li>
                            <li>Password (stored securely with encryption)</li>
                        </ul>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Incident Data</h3>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                            <li>Incident titles, descriptions, and timelines</li>
                            <li>Root cause analysis and resolution details</li>
                            <li>Impact assessments and action items</li>
                            <li>Optional context: logs, commits, Slack messages</li>
                            <li>Generated postmortem reports</li>
                        </ul>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Usage Data</h3>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li>Browser type and version</li>
                            <li>Pages visited and features used</li>
                            <li>Time spent on the platform</li>
                            <li>IP address and general location</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">We use the collected information to:</p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li>Provide, operate, and maintain the Service</li>
                            <li>Generate AI-powered postmortem reports</li>
                            <li>Process and store your incident documentation</li>
                            <li>Send important notifications about your account</li>
                            <li>Improve our Service and develop new features</li>
                            <li>Ensure security and prevent fraud</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4. AI Processing</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Our Service uses third-party AI providers to generate postmortem content. When you use
                            AI features:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li>Your incident data is sent to AI providers for processing</li>
                            <li>AI providers may process data according to their privacy policies</li>
                            <li>We do not use your data to train AI models</li>
                            <li>Generated content is stored within your account</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5. Data Storage and Security</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            We implement industry-standard security measures to protect your data:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li>Data encryption in transit (TLS/SSL) and at rest</li>
                            <li>Secure authentication via Supabase Auth</li>
                            <li>Regular security audits and monitoring</li>
                            <li>Access controls and role-based permissions</li>
                            <li>Data stored in secure cloud infrastructure</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6. Data Sharing</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            We do not sell your personal data. We may share information with:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li><strong>Service Providers:</strong> Cloud hosting, AI processing, analytics</li>
                            <li><strong>Legal Requirements:</strong> When required by law or court order</li>
                            <li><strong>Business Transfers:</strong> In case of merger or acquisition</li>
                            <li><strong>With Your Consent:</strong> When you explicitly share reports</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7. Your Rights</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Depending on your location, you may have the right to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate information</li>
                            <li>Delete your account and data</li>
                            <li>Export your data in a portable format</li>
                            <li>Object to certain processing activities</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8. Cookies and Tracking</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            We use essential cookies to maintain your session and preferences. We may also use
                            analytics cookies to understand how users interact with our Service. You can control
                            cookie settings through your browser.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">9. Data Retention</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            We retain your data for as long as your account is active or as needed to provide the
                            Service. You can request deletion of your data at any time. Some data may be retained
                            for legal compliance purposes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">10. Children&apos;s Privacy</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Our Service is not intended for users under 18 years of age. We do not knowingly collect
                            personal information from children. If we discover such data, we will delete it promptly.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">11. International Transfers</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Your data may be transferred to and processed in countries other than your own. We ensure
                            appropriate safeguards are in place to protect your data in accordance with applicable laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">12. Changes to This Policy</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            We may update this Privacy Policy periodically. We will notify you of significant changes
                            via email or through the Service. Please review this policy regularly.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">13. Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            For questions about this Privacy Policy or to exercise your rights, contact us at:
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            Email: <a href="mailto:privacy@aegis-incidents.com" className="text-blue-600 hover:underline">privacy@aegis-incidents.com</a>
                        </p>
                    </section>
                </div>

                {/* Footer Links */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-wrap gap-6 text-sm">
                        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                        <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Home</Link>
                        <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Login</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
