import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardSidebar />
            <main className="pl-64 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
