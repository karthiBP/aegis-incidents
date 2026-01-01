'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle2, Users, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';

const exampleTimeline = [
    { time: '09:15', event: 'Monitoring alerts triggered for elevated API response times' },
    { time: '09:18', event: 'On-call engineer acknowledged alert and began investigation' },
    { time: '09:23', event: 'Database connection errors observed in application logs' },
    { time: '09:31', event: 'Customer reports began arriving via support channels' },
    { time: '09:35', event: 'Connection pool exhaustion identified as root cause' },
    { time: '09:42', event: 'Emergency pool limit increase deployed' },
    { time: '09:48', event: 'Query optimization patch prepared' },
    { time: '09:55', event: 'Patch deployed to production' },
    { time: '10:02', event: 'API response times normalized; incident resolved' },
];

const actionItems = [
    { action: 'Implement connection pool usage alerting (>80% threshold)', owner: 'DevOps', priority: 'P0', status: 'Todo' },
    { action: 'Add query execution time monitoring dashboard', owner: 'Platform Team', priority: 'P0', status: 'Todo' },
    { action: 'Document emergency connection pool procedures in runbook', owner: 'SRE Lead', priority: 'P1', status: 'Todo' },
    { action: 'Schedule quarterly capacity planning review', owner: 'Engineering Manager', priority: 'P1', status: 'Todo' },
    { action: 'Implement automatic query timeout for long-running queries', owner: 'Backend Team', priority: 'P2', status: 'Todo' },
];

export default function ExamplePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar />

            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back link */}
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
                            Example Postmortem
                        </Badge>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Database Connection Pool Exhaustion
                        </h1>
                        <p className="text-xl text-gray-600">
                            47-Minute API Outage – January 15, 2025
                        </p>
                    </motion.div>

                    {/* Meta info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    >
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center text-gray-600 mb-1">
                                <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                                Severity
                            </div>
                            <div className="font-semibold text-gray-900">Critical</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center text-gray-600 mb-1">
                                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                Duration
                            </div>
                            <div className="font-semibold text-gray-900">47 minutes</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center text-gray-600 mb-1">
                                <Users className="w-4 h-4 mr-2 text-purple-500" />
                                Affected Users
                            </div>
                            <div className="font-semibold text-gray-900">~2,400</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center text-gray-600 mb-1">
                                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                Status
                            </div>
                            <div className="font-semibold text-gray-900">Resolved</div>
                        </div>
                    </motion.div>

                    {/* Executive Summary */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 mb-8"
                    >
                        <h2 className="text-xl font-semibold text-blue-900 mb-3">Executive Summary</h2>
                        <p className="text-blue-800 leading-relaxed">
                            On January 15th, 2025, our primary API experienced a 47-minute outage beginning at 09:15 UTC.
                            The incident was caused by database connection pool exhaustion, triggered by a surge in traffic
                            combined with inefficient database queries introduced in a recent deployment. Approximately
                            2,400 customers experienced failed API requests during this period. The issue was resolved by
                            increasing connection pool limits and deploying query optimizations. No data loss occurred.
                        </p>
                    </motion.section>

                    {/* Incident Overview */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Incident Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Incident Type</h3>
                                <p className="text-gray-900">Service Outage</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Detection Method</h3>
                                <p className="text-gray-900">Automated monitoring alerts</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Start Time</h3>
                                <p className="text-gray-900">January 15, 2025 at 09:15 UTC</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">End Time</h3>
                                <p className="text-gray-900">January 15, 2025 at 10:02 UTC</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Timeline */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
                        <div className="space-y-4">
                            {exampleTimeline.map((item, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0 w-16 text-sm font-mono text-gray-500">
                                        {item.time}
                                    </div>
                                    <div className="flex-shrink-0 w-8 flex justify-center">
                                        <div className={`w-3 h-3 rounded-full mt-1.5 ${index === exampleTimeline.length - 1
                                                ? 'bg-green-500'
                                                : index === 0
                                                    ? 'bg-red-500'
                                                    : 'bg-blue-500'
                                            }`} />
                                    </div>
                                    <div className="text-gray-700">{item.event}</div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Root Cause */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Root Cause Analysis</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            The root cause was identified as database connection pool exhaustion. A deployment on January 14th
                            included a new feature that introduced several inefficient database queries. These queries held
                            connections longer than expected, particularly during peak load conditions.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            When traffic increased by 40% during the morning peak, the combination of slow query execution
                            times and increased request volume caused the connection pool to become exhausted. New requests
                            were unable to acquire database connections, resulting in API timeouts and failures.
                        </p>
                    </motion.section>

                    {/* Impact */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact Assessment</h2>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3">•</span>
                                Approximately 2,400 unique users experienced failed API requests
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3">•</span>
                                47 minutes of degraded service affecting all API endpoints
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3">•</span>
                                Estimated revenue impact: $3,200 in failed transactions
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-3">•</span>
                                23 support tickets opened during the incident window
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-3">•</span>
                                No data loss or security implications
                            </li>
                        </ul>
                    </motion.section>

                    {/* Resolution */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resolution</h2>
                        <ol className="list-decimal list-inside space-y-3 text-gray-700">
                            <li>Immediately increased database connection pool limit from 100 to 200</li>
                            <li>Deployed query optimizations to reduce execution time by 60%</li>
                            <li>Added database query indexes for the affected queries</li>
                            <li>Verified system stability through load testing</li>
                        </ol>
                    </motion.section>

                    {/* Action Items */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Action Items</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Owner</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actionItems.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-3 px-4 text-gray-700">{item.action}</td>
                                            <td className="py-3 px-4 text-gray-600">{item.owner}</td>
                                            <td className="py-3 px-4">
                                                <Badge className={
                                                    item.priority === 'P0'
                                                        ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                                        : item.priority === 'P1'
                                                            ? 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                                                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                                }>
                                                    {item.priority}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.section>

                    {/* Lessons Learned */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 mb-8"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Lessons Learned</h2>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-1">What went well</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Alert triggered within 3 minutes of degradation</li>
                                    <li>On-call engineer responded promptly</li>
                                    <li>Root cause identified within 20 minutes</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-1">What could be improved</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                    <li>Missing alerts for connection pool usage</li>
                                    <li>No pre-deployment load testing for database queries</li>
                                    <li>Runbook lacked specific connection pool procedures</li>
                                </ul>
                            </div>
                        </div>
                    </motion.section>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55 }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center"
                    >
                        <h2 className="text-2xl font-bold text-white mb-3">
                            Generate reports like this in minutes
                        </h2>
                        <p className="text-blue-100 mb-6">
                            This postmortem was generated by AEGIS INCIDENTS in under 10 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup">
                                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                                    Create Your First Postmortem
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                <Download className="w-4 h-4 mr-2" />
                                Download Markdown
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
