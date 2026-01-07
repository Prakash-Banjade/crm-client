"use client";

import { Search } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import DashboardMetrics from '../../../../../components/dashboard/metrics';
import ApplicationPipeline from '@/components/dashboard/application-pipeline';
import { useAuth } from '@/context/auth-provider';
import { Role } from '@/lib/types';
import DashboardOrganizationsShortcut from '@/components/dashboard/organizations-shortcut';
import DashboardChatBox from '@/components/dashboard/chat-box';
import DashboardRecentQueries from '@/components/dashboard/recent-queries';

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
                    <div className="space-y-6">
                        <DashboardOrganizationsShortcut />
                        <DashboardRecentQueries />
                    </div>
                </div>
            </main>

            {/* Side Profile & Regional In-Charge Highlight */}
            <aside className="w-80 border-l bg-sidebar p-6 hidden xl:flex flex-col gap-8">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Regional In-Charge</h2>
                    <Card className="border shadow-none">
                        <CardContent className="flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <Avatar className="h-24 w-24 border-4 shadow-lg">
                                    <AvatarImage src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200" />
                                    <AvatarFallback>SG</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-white w-5 h-5 rounded-full" />
                            </div>
                            <h3 className="font-bold text-lg">Sadhana Gautam</h3>
                            <p className="text-sm text-primary font-medium">Senior Partnership Officer</p>

                            <div className="w-full mt-6 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Region Assigned</span>
                                    <span className="font-bold">South Asia</span>
                                </div>
                                <Separator className="bg-indigo-100" />
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Team Size</span>
                                    <span className="font-bold">12 Coordinators</span>
                                </div>
                            </div>
                            <Button size="sm" className="w-full mt-6 variant-outline border-primary text-primary bg-white hover:bg-primary/10">
                                Contact Lead
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                <div className="flex-1">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Regional Performance</h2>
                    <div className="space-y-6">
                        {[
                            { name: "Ritisha Ghimire", role: "Admission Coordinator", target: 80 },
                            { name: "Rahul Ghimire", role: "Managing Director", target: 95 },
                            { name: "Kisan Mahat", role: "IT Support Specialist", target: 100 }
                        ].map((lead, i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">{lead.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{lead.role}</p>
                                    <Progress value={lead.target} className="h-1 mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DashboardChatBox />
            </aside>
        </div>
    );
}