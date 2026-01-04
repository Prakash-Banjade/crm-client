import { Activity, useEffect, useState } from 'react';
import { Plus, MoreVertical, Clock, GraduationCap, Building2, Trash, ChartLine, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn, createQueryString } from '@/lib/utils';
import { ResponsiveDialog } from '../../ui/responsive-dialog';
import NewApplicationForm from './new-application-form';
import { useParams } from 'next/navigation';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useGetApplications } from '@/lib/data-access/application-data-hooks';
import { EApplicationPriority, EApplicationStatus, TApplication } from '@/lib/types/application.type';
import { TSingleStudent } from '@/lib/types/student.types';
import { ResponsiveAlertDialog } from '../../ui/responsive-alert-dialog';
import { deleteApplication } from '@/lib/actions/application.action';
import { useServerAction } from '@/hooks/use-server-action';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { useAuth } from '@/context/auth-provider';
import { Role } from '@/lib/types';
import SelectedApplicationView from './selected-application-view';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function StudentApplicationView({ student }: { student: TSingleStudent }) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="flex flex-col h-full">
            {/* Header / Toolbar */}
            <header className="flex items-center justify-between p-4 pt-0 border-b">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
                    <Badge variant="secondary" className="ml-2">
                        {student.applicationsCount} Total
                    </Badge>
                </div>
                {
                    user?.role && user.role !== Role.SUPER_ADMIN && <>
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
                    </>
                }
            </header>

            <MainContent />
        </div>
    );
}

function MainContent() {
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

    useEffect(() => {
        setSelectedAppId(searchParams.get('applicationId'));
    }, [searchParams]);

    if (isLoading) return <div>Loading...</div>;

    if (!applications || applications.data.length === 0) return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="default">
                    <FileX className='size-20 text-muted-foreground' />
                </EmptyMedia>
                <EmptyTitle className='text-2xl'>No Applications Yet</EmptyTitle>
                <EmptyDescription className='text-base'>
                    No applications found for this student.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
            </EmptyContent>
        </Empty>
    );

    return (
        <div className="flex flex-1 overflow-hidden ">
            {/* Left Sidebar - Application List */}
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

            {/* Right Panel - Application Details */}
            <SelectedApplicationView />
        </div>
    );
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
                <div className="flex items-center gap-2 text-sm capitalize text-muted-foreground mb-3">
                    <ChartLine className="h-4 w-4" />
                    <Badge
                        variant={
                            app.priority === EApplicationPriority.High
                                ? "destructive"
                                : app.priority === EApplicationPriority.Medium
                                    ? "warning"
                                    : app.priority === EApplicationPriority.Low
                                        ? "success"
                                        : "outline"
                        }
                    >
                        {app.priority}
                    </Badge>
                </div>
                <div className="flex items-center justify-between">
                    <Badge
                        variant={app.status === EApplicationStatus.Application_In_Progress ? "info" : "warning"}
                        className='capitalize rounded-full'
                    >
                        {app.status.replace(/_/g, " ")}
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
