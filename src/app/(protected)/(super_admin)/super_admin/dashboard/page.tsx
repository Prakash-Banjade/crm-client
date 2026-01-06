"use client";

import React from 'react';
import {
    Users,
    FileText,
    BookOpen,
    Search,
    Plus,
    Building2,
    TrendingUp,
    ArrowUpRight,
    UserCheck,
    Globe2,
    MoreHorizontal,
    Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Recent Queries</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium leading-none">Nursing Course Intake Question</p>
                                            <p className="text-xs text-slate-400 mt-1">2 mins ago • University of Sunderland</p>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
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

                <div className="bg-slate-900 rounded-2xl p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                    <p className="text-xs text-slate-400 mb-2">System Status</p>
                    <p className="text-sm font-medium mb-4">All services are operational</p>
                    <Button variant="secondary" size="sm" className="w-full text-xs">View API Logs</Button>
                </div>
            </aside>
        </div>
    );
}