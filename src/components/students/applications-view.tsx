import { useState } from 'react';
import {
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
    Trash,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn, createQueryString } from '@/lib/utils';
import Link from 'next/link';
import { ResponsiveDialog } from '../ui/responsive-dialog';
import NewApplicationForm from './application/new-application-form';
import { useParams, useSearchParams } from 'next/navigation';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useGetApplication, useGetApplications } from '@/lib/data-access/application-data-hooks';
import { EApplicationPriority, TApplication } from '@/lib/types/application.type';
import { TSingleStudent } from '@/lib/types/student.types';
import { ResponsiveAlertDialog } from '../ui/responsive-alert-dialog';
import { deleteApplication } from '@/lib/actions/application.action';
import { useServerAction } from '@/hooks/use-server-action';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { useAuth } from '@/context/auth-provider';
import { Role } from '@/lib/types';

export default function StudentApplicationView({ student }: { student: TSingleStudent }) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    return (
        <div className="flex flex-col h-full">
            {/* Header / Toolbar */}
            <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
                    <Badge variant="secondary" className="ml-2">
                        {student.applicationsCount} Total
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <ResponsiveDialog
                        isOpen={isAddDialogOpen}
                        setIsOpen={setIsAddDialogOpen}
                        title='Quick Add Application'
                        description='Select the details to add a new application.'
                        className='sm:max-w-3xl'
                    >
                        <NewApplicationForm setIsOpen={setIsAddDialogOpen} />
                    </ResponsiveDialog>

                    <Button type="button" onClick={() => setIsAddDialogOpen(true)}>
                        <Plus /> New Application
                    </Button>

                </div>
            </header>

            {/* Main Content - Split View */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Application List */}
                <ApplicationList />

                {/* Right Panel - Application Details */}
                <SelectedApplicationView />
            </div>
        </div>
    );
}

function ApplicationList() {
    const { studentId } = useParams();
    const { searchParams } = useCustomSearchParams();
    const [selectedAppId, setSelectedAppId] = useState(() => searchParams.get('applicationId'));

    const { data: applications, isLoading } = useGetApplications({
        queryString: createQueryString({
            studentId,
            take: 50, // large enough so that no pagination is needed
        }),
        options: {
            enabled: !!studentId
        }
    });

    if (isLoading) return <div>Loading...</div>;

    if (!applications) return <div>No applications found</div>;

    return (
        <aside className="w-[400px] border-r flex flex-col">
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                    {applications.data.map((app) => (
                        <ApplicationCard
                            key={app.id}
                            app={app}
                            selectedAppId={selectedAppId}
                            setSelectedAppId={setSelectedAppId}
                        />
                    ))}
                </div>
            </ScrollArea>
        </aside>
    )
}

function ApplicationCard({
    app,
    selectedAppId,
    setSelectedAppId
}: {
    app: TApplication,
    selectedAppId: string | null
    setSelectedAppId: (id: string | null) => void
}) {
    const { studentId } = useParams();
    const { setSearchParams } = useCustomSearchParams();
    const { user } = useAuth();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { isPending: deletePending, mutate: deleteMutate } = useServerAction({
        action: deleteApplication,
        invalidateTags: [
            QueryKey.APPLICATIONS,
            // same query string as in <ApplicationList />
            createQueryString({
                studentId,
                take: 50,
            })
        ],
        onSuccess: () => {
            if (selectedAppId === app.id) { // if the application was selected, remove it from selection
                setSearchParams({ applicationId: null });
                setSelectedAppId(null);
            }
            setIsDeleteOpen(false);
        },
    });

    return (
        <Card
            className={cn("cursor-pointer transition-colors", selectedAppId === app.id ? 'outline-1 outline-primary bg-card' : 'bg-background hover:bg-card')}
            onClick={() => {
                setSelectedAppId(app.id)
                setSearchParams({ applicationId: app.id })
            }}
        >
            <CardContent>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{app.course.name}</h3>
                    </div>
                    {
                        user?.role === Role.SUPER_ADMIN && (
                            <>
                                <ResponsiveAlertDialog
                                    isOpen={isDeleteOpen}
                                    setIsOpen={setIsDeleteOpen}
                                    title="Withdraw Application"
                                    description="Are you sure you want to withdraw this application?"
                                    action={() => deleteMutate(app.id)}
                                    isLoading={deletePending}
                                    actionLabel='Yes, Withdraw'
                                    cancelLabel='No, Cancel'
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className='w-fit'>
                                        <DropdownMenuItem variant='destructive' onClick={() => setIsDeleteOpen(true)}>
                                            <Trash />
                                            Withdraw Application
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )
                    }
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Building2 className="h-4 w-4" />
                    {app.course.university.name}
                </div>
                <div className="flex items-center justify-between">
                    <Badge
                        variant="info"
                        className='capitalize'
                    >
                        {app.status.split('_').join(' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

function SelectedApplicationView() {
    const searchParams = useSearchParams();
    const applicationId = searchParams.get('applicationId');

    const { data: application, isLoading } = useGetApplication({
        id: applicationId!,
        options: {
            enabled: !!applicationId
        }
    });

    if (!applicationId) return (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select an application to view details
        </div>
    )

    if (isLoading) return (
        <div>Loading...</div>
    )

    if (!application) return (
        <div>Application not found</div>
    )

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col h-full">
                {/* Details Header */}
                <div className="p-6 border-b">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                {application.course.name}
                                <Badge variant="outline">{application.ackNo}</Badge>
                            </h2>
                            <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
                                <Building2 className="h-5 w-5" />
                                {application.course.university.name}
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
                                        <Hash className="h-4 w-4" /> Acknowledgement Number
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{application.ackNo}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4" /> Intake
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold capitalize">{application.intake} - {application.year}</div>
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
                                        variant={"info"}
                                        className="text-sm px-3 py-1 capitalize"
                                    >
                                        {application.status.split('_').join(' ')}
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
                                        <CardDescription>Not payed yet</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>

                            <Card className="flex flex-col justify-center">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Label htmlFor="priority" className="whitespace-nowrap font-medium">Update Priority:</Label>
                                    <Select defaultValue={application.priority}>
                                        <SelectTrigger id="priority" className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                Object.entries(EApplicationPriority).map(([key, value]) => (
                                                    <SelectItem key={key} value={value}>
                                                        {key}
                                                    </SelectItem>
                                                ))
                                            }
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
        </main>
    )
}