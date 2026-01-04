import React, { useState } from 'react';
import {
    Search,
    Plus,
    MoreVertical,
    Send,
    CheckCircle2,
    Clock,
    FileText,
    GraduationCap,
    Building2,
    CalendarDays,
    Hash,
    CreditCard,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mock Data
const applications = [
    {
        id: 'ACK-001',
        program: 'Nursing',
        university: 'University of Sunderland',
        status: 'received_application_at_lopho',
        priority: 'None',
        date: '03/01/2026, 09:48:09',
        intake: 'Sep-2026',
        feeStatus: 'No application fee',
    },
    {
        id: 'ACK-002',
        program: 'Software Engineering',
        university: 'University of Sunderland',
        status: 'pending_review',
        priority: 'High',
        date: '03/01/2026, 10:15:00',
        intake: 'Jan-2027',
        feeStatus: 'Fee Pending',
    },
];

const statusColors = {
    received_application_at_lopho: 'bg-blue-100 text-blue-800',
    pending_review: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

const statusLabels = {
    received_application_at_lopho: 'Received at Lopho',
    pending_review: 'Pending Review',
    accepted: 'Accepted',
    rejected: 'Rejected',
};

export default function StudentApplicationView() {
    const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const selectedApp = applications.find((app) => app.id === selectedAppId);

    return (
        <div className="flex flex-col h-full">
            {/* Header / Toolbar */}
            <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
                    <Badge variant="secondary" className="ml-2">
                        {applications.length} Total
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> New Application
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Quick Add Program</DialogTitle>
                                <DialogDescription>
                                    Select the details to add a new program application.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="year">Year</Label>
                                    <Select>
                                        <SelectTrigger id="year">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2026">2026</SelectItem>
                                            <SelectItem value="2027">2027</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="intake">Intake</Label>
                                    <Select>
                                        <SelectTrigger id="intake">
                                            <SelectValue placeholder="Select Intake" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sep">September</SelectItem>
                                            <SelectItem value="jan">January</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="university">University</Label>
                                    <Select>
                                        <SelectTrigger id="university">
                                            <SelectValue placeholder="Select University" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sunderland">University of Sunderland</SelectItem>
                                            <SelectItem value="other">Other University</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="course">Course</Label>
                                    <Select>
                                        <SelectTrigger id="course">
                                            <SelectValue placeholder="Select Course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nursing">Nursing</SelectItem>
                                            <SelectItem value="se">Software Engineering</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" onClick={() => setIsAddDialogOpen(false)}>
                                    Add Program
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Main Content - Split View */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Application List */}
                <aside className="w-[400px] border-r flex flex-col">
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-3">
                            {applications.map((app) => (
                                <Card
                                    key={app.id}
                                    className={cn("cursor-pointer transition-colors", selectedAppId === app.id ? 'outline-1 outline-primary bg-card' : 'bg-background hover:bg-card')}
                                    onClick={() => setSelectedAppId(app.id)}
                                >
                                    <CardContent>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-5 w-5 text-primary" />
                                                <h3 className="font-semibold text-lg">{app.program}</h3>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className='w-fit'>
                                                    <DropdownMenuItem variant='destructive'>
                                                        Withdraw Application
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <Building2 className="h-4 w-4" />
                                            {app.university}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge
                                                variant="secondary"
                                                className={statusColors[app.status]}
                                            >
                                                {statusLabels[app.status]}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(app.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </aside>

                {/* Right Panel - Application Details */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    {selectedApp ? (
                        <div className="flex-1 flex flex-col h-full">
                            {/* Details Header */}
                            <div className="p-6 border-b">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            {selectedApp.program}
                                            <Badge variant="outline">{selectedApp.id}</Badge>
                                        </h2>
                                        <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
                                            <Building2 className="h-5 w-5" />
                                            {selectedApp.university}
                                        </p>
                                    </div>
                                    <Button variant="link" className="text-primary" asChild>
                                        <Link href={`/universities`}>
                                            View Course Details
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-6 space-y-6">
                                    {/* Info Cards */}
                                    <div className="grid grid-cols-3 gap-6">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <Hash className="h-4 w-4" /> Application ID
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{selectedApp.id}</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <CalendarDays className="h-4 w-4" /> Intake
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{selectedApp.intake}</div>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4" /> Status
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Badge
                                                    className={`${statusColors[selectedApp.status]} text-sm px-3 py-1`}
                                                >
                                                    {statusLabels[selectedApp.status]}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Alerts & Actions */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader className='flex gap-4'>
                                                <CreditCard className='text-blue-500' />
                                                <div>
                                                    <CardTitle>
                                                        Fee Status
                                                    </CardTitle>
                                                    <CardDescription>{selectedApp.feeStatus}</CardDescription>
                                                </div>
                                            </CardHeader>
                                        </Card>

                                        <Card className="flex flex-col justify-center">
                                            <CardContent className="p-4 flex items-center gap-4">
                                                <Label htmlFor="priority" className="whitespace-nowrap font-medium">Update Priority:</Label>
                                                <Select defaultValue={selectedApp.priority.toLowerCase()}>
                                                    <SelectTrigger id="priority" className="w-full">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">None</SelectItem>
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <Separator />

                                    {/* Comments Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Comments & Activity</h3>
                                        <Tabs defaultValue="team" className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger value="team">Amphlo Team</TabsTrigger>
                                                <TabsTrigger value="student">Student</TabsTrigger>
                                            </TabsList>
                                            <div className="mt-4 border rounded-lg">
                                                <ScrollArea className="h-[300px] p-4">
                                                    <TabsContent value="team" className="mt-0 space-y-4">
                                                        <div className="flex items-start gap-3">
                                                            <Avatar>
                                                                <AvatarFallback>AT</AvatarFallback>
                                                            </Avatar>
                                                            <Card className="p-3 bg-secondary w-3/4">
                                                                <p className="text-sm font-semibold">Amphlo Team <span className="text-xs text-muted-foreground font-normal ml-2">Yesterday at 2:30 PM</span></p>
                                                                <p className="text-sm mt-1">Your application has been received and is currently under review by our admissions team.</p>
                                                            </Card>
                                                        </div>
                                                    </TabsContent>
                                                    <TabsContent value="student" className="mt-0">
                                                        <div className="text-center text-muted-foreground py-8">
                                                            No comments from student yet.
                                                        </div>
                                                    </TabsContent>
                                                </ScrollArea>
                                                {/* Comment Input */}
                                                <div className="p-4 border-t bg-secondary flex gap-3 items-end">
                                                    <Avatar>
                                                        <AvatarFallback className="bg-pink-200 text-pink-700">HK</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 relative">
                                                        <Textarea
                                                            placeholder="Write a comment..."
                                                            className="min-h-[80px] pr-12 bg-white"
                                                        />
                                                        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-muted-foreground">
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-primary">
                                                                <FileText className="h-5 w-5" />
                                                            </Button>
                                                            <Button size="icon" className="h-8 w-8 rounded-full">
                                                                <Send className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tabs>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Select an application to view details
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}