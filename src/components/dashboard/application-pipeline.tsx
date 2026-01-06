"use client";

import { useFetch } from '@/hooks/useFetch';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';

type ApplicationPipelineResponse = {
    totalActiveApplicationsCount: number,
    applicationsUnderReview: number,
    applicationsInVisaProcess: number,
    applicationsVisaReceived: number,
    applicationsVisaRejected: number,
    applicationsInClosure: number
}

export default function ApplicationPipeline() {
    const { data, isLoading } = useFetch<ApplicationPipelineResponse>({
        endpoint: `${QueryKey.DASHBOARD}/application-pipeline`,
        queryKey: [QueryKey.DASHBOARD, 'application-pipeline'],
    });

    if (isLoading) return <Loading />;

    if (!data) return null;

    const underReviewPercentage = Math.round((data.applicationsUnderReview / data.totalActiveApplicationsCount) * 100);
    const visaProcessPercentage = Math.round((data.applicationsInVisaProcess / data.totalActiveApplicationsCount) * 100);
    const finalEnrollmentPercentage = Math.round((data.applicationsInClosure / data.totalActiveApplicationsCount) * 100);

    return (
        <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                <div>
                    <CardTitle>Application Pipeline</CardTitle>
                    <CardDescription>Visual tracking of current application stages</CardDescription>
                </div>
                <Select defaultValue="2026">
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2026">Year 2026</SelectItem>
                        <SelectItem value="2025">Year 2025</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Under Review (Lopho)</span>
                        <span className="text-muted-foreground">{underReviewPercentage}%</span>
                    </div>
                    <Progress value={underReviewPercentage} className="h-2" />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Visa Processing</span>
                        <span className="text-muted-foreground">{visaProcessPercentage}%</span>
                    </div>
                    <Progress value={visaProcessPercentage} className="h-2" />
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Final Enrollment</span>
                        <span className="text-muted-foreground">{finalEnrollmentPercentage}%</span>
                    </div>
                    <Progress value={finalEnrollmentPercentage} className="h-2" />
                </div>

                <div className="pt-4 grid grid-cols-3 gap-4 border-t">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Visa Received</p>
                        <p className="text-xl font-bold text-green-500 dark:text-green-600">{data?.applicationsVisaReceived?.toLocaleString()}</p>
                    </div>
                    <div className="text-center border-x">
                        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Visa Rejected</p>
                        <p className="text-xl font-bold text-destructive">{data?.applicationsVisaRejected?.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Pending</p>
                        <p className="text-xl font-bold text-muted-foreground">{data?.applicationsVisaReceived?.toLocaleString()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function Loading() {
    return (
        <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-10 w-32" />
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                    </div>
                ))}

                <div className="pt-4 grid grid-cols-3 gap-4 border-t">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`text-center space-y-2 ${i === 2 ? 'border-x' : ''}`}>
                            <Skeleton className="h-3 w-24 mx-auto" />
                            <Skeleton className="h-7 w-16 mx-auto" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}