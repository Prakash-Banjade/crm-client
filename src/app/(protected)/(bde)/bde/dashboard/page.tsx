"use client";

import { Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import DashboardMetrics from '../../../../../components/dashboard/metrics';
import { useAuth } from '@/context/auth-provider';
import { Role } from '@/lib/types';
import DashboardAside from '@/components/dashboard/dashboard-aside';
import OrganizationDataTable from '@/components/organization/organization-data-table';

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
                <OrganizationDataTable />
            </main>

            {/* Side Profile & Regional In-Charge Highlight */}
            <DashboardAside />
        </div>
    );
}