"use client";

import { Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import DashboardMetrics from '../../../../../components/dashboard/metrics';
import ApplicationPipeline from '@/components/dashboard/application-pipeline';
import { useAuth } from '@/context/auth-provider';
import { Role } from '@/lib/types';
import DashboardOrganizationsShortcut from '@/components/dashboard/organizations-shortcut';
import DashboardRecentQueries from '@/components/dashboard/recent-queries';
import DashboardAside from '@/components/dashboard/dashboard-aside';

export default function Page() {
    const { user } = useAuth();

    return (
        <div className="flex h-full font-sans">
            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-y-auto">

                {/* CRM Top Action Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Executive Overview</h1>
                        <p className="text-muted-foreground">Welcome back, {user?.firstName} {user?.lastName}. Here is what's happening with {user?.role === Role.SUPER_ADMIN ? "Abhyam CRM today" : user?.organizationName}.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <InputGroup>
                            <InputGroupInput
                                type="search"
                                placeholder={"Search..."}
                            />
                            <InputGroupAddon>
                                <Search />
                            </InputGroupAddon>
                            <InputGroupAddon align="inline-end">
                                <KbdGroup>
                                    <Kbd>/</Kbd>
                                </KbdGroup>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>

                {/* Core CRM Metrics */}
                <DashboardMetrics />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Student Application Pipeline */}
                    <ApplicationPipeline />

                    {/* Quick Management Shortcuts */}
                    <div className="flex flex-col gap-6">
                        <DashboardOrganizationsShortcut />
                        <div className='flex-1'>
                            <DashboardRecentQueries />
                        </div>
                    </div>
                </div>
            </main>

            {/* Side Profile & Regional In-Charge Highlight */}
            <DashboardAside />
        </div>
    );
}