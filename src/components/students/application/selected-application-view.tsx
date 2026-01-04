import { useGetApplication } from "@/lib/data-access/application-data-hooks";
import { useSearchParams } from "next/navigation";
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CalendarDays, CheckCircle2, Hash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EApplicationStatus } from "@/lib/types/application.type";
import { Badge } from "@/components/ui/badge";
import ApplicationAlertAndAction from "./application-alert-and-action";
import ApplicationConversation from "./application-conversation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function SelectedApplicationView() {
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

    if (isLoading) return <Loading />;

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
                                {application.course.university.name}, {application.course.university.state}, {application.course.university.country.name}
                            </p>
                        </div>
                        <Button variant="link" className="text-primary" asChild>
                            <Link href={application.course.courseUrl} target="_blank">
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
                                        variant={application.status === EApplicationStatus.Application_In_Progress ? "info" : "warning"}
                                        className="text-sm px-3 py-1 capitalize rounded-full"
                                    >
                                        {application.status.split('_').join(' ')}
                                    </Badge>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Alerts & Actions */}
                        <ApplicationAlertAndAction application={application} />

                        <Separator />

                        <ApplicationConversation application={application} />
                    </div>
                </ScrollArea>
            </div>
        </main>
    )
}

function Loading() {
    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col h-full">
                {/* Header Skeleton */}
                <div className="p-6 border-b">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-64" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-5 w-48" />
                            </div>
                        </div>
                        <Skeleton className="h-5 w-32" />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        {/* Info Cards Skeleton */}
                        <div className="grid grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-4 rounded" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-8 w-24" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Alerts & Actions Skeleton */}
                        <div className="space-y-3">
                            <Skeleton className="h-24 w-full rounded-lg" />
                        </div>

                        <Separator />

                        {/* Conversation Skeleton */}
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-40" />
                            <div className="space-y-3">
                                <Skeleton className="h-16 w-full rounded-lg" />
                                <Skeleton className="h-16 w-3/4 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </main>
    )
}