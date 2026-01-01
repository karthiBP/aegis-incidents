'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Building2, CreditCard, User, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function SettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [orgName, setOrgName] = useState('');
    const [incidentCount, setIncidentCount] = useState(0);

    useEffect(() => {
        const loadUserData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                setUserEmail(user.email || '');
                // Get org name from user metadata
                setOrgName(user.user_metadata?.org_name || 'My Organization');
            }

            setIsLoading(false);
        };

        loadUserData();
    }, []);

    const handleSaveOrg = async () => {
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                data: { org_name: orgName }
            });

            if (error) throw error;
            toast.success('Organization name updated');
        } catch (error) {
            toast.error('Failed to update organization name');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        // In production, you would call an API to delete the user
        toast.error('Account deletion is not available in demo mode');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardSidebar />
            <main className="pl-64 transition-all duration-300">
                <DashboardHeader title="Settings" />

                <div className="p-6 max-w-4xl">
                    {/* Organization Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="border-gray-200 mb-6">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle>Organization</CardTitle>
                                        <CardDescription>Manage your organization settings</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="org-name">Organization Name</Label>
                                    <Input
                                        id="org-name"
                                        value={orgName}
                                        onChange={(e) => setOrgName(e.target.value)}
                                        className="max-w-md"
                                    />
                                </div>
                                <Button onClick={handleSaveOrg} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Save Changes
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Profile Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-gray-200 mb-6">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <User className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <CardTitle>Profile</CardTitle>
                                        <CardDescription>Manage your account settings</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={userEmail}
                                        disabled
                                        className="max-w-md"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Contact support to change your email address.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Billing */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-gray-200 mb-6">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <CardTitle>Billing</CardTitle>
                                        <CardDescription>Manage your subscription and payments</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 rounded-xl p-6 mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Current Plan</h3>
                                            <p className="text-gray-600">Free Trial</p>
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                            Free
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-4">
                                        <p>• 1 demo-quality incident</p>
                                        <p>• Full AI generation</p>
                                        <p>• Markdown export</p>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Usage</span>
                                        <span className="font-medium">{incidentCount} / 1 incidents</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                                        <h4 className="font-semibold text-gray-900 mb-1">Pay Per Incident</h4>
                                        <p className="text-2xl font-bold text-gray-900">$49<span className="text-sm font-normal text-gray-600">/incident</span></p>
                                        <p className="text-sm text-gray-600 mt-2">Perfect for occasional incidents</p>
                                        <Button variant="outline" className="w-full mt-4">
                                            Buy Credits
                                        </Button>
                                    </div>
                                    <div className="border-2 border-blue-500 rounded-xl p-4 relative">
                                        <div className="absolute -top-3 left-4">
                                            <Badge className="bg-blue-600 text-white">Popular</Badge>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Unlimited</h4>
                                        <p className="text-2xl font-bold text-gray-900">$199<span className="text-sm font-normal text-gray-600">/month</span></p>
                                        <p className="text-sm text-gray-600 mt-2">For teams with frequent incidents</p>
                                        <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                                            Upgrade
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Danger Zone */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-red-200">
                            <CardHeader>
                                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                <CardDescription>Irreversible actions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Delete Organization</h4>
                                        <p className="text-sm text-gray-600">
                                            Permanently delete your organization and all data.
                                        </p>
                                    </div>
                                    <Button variant="destructive" onClick={handleDeleteAccount}>Delete</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
