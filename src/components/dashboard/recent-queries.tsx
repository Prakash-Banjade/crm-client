"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { Role } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type RecentQuery = {
    id: string;
    createdAt: string;
    sender: string;
    senderRole: Role;
    organizationName: string;
    supportChatId: string;
}

export default function DashboardRecentQueries() {
    const { data, isLoading } = useFetch<RecentQuery[]>({
        endpoint: `${QueryKey.DASHBOARD}/support-chat-messages`,
        queryKey: [QueryKey.DASHBOARD, 'support-chat-messages'],
    });

    if (isLoading) return <RecentQueriesSkeleton />;

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">New Support Queries</CardTitle>
                    <Button asChild>
                        <Link href="/support-chat">View All</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {
                    !data?.length ? (
                        <p className="text-center text-muted-foreground">No recent queries</p>
                    ) : (
                        data?.map((query) => (
                            <Link href={`/support-chat/${query.supportChatId}`} key={query.id} className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium leading-none capitalize">By {query.sender} ({query.senderRole})</p>
                                    <p className="text-xs text-slate-400 mt-1">{formatDistanceToNow(query.createdAt)} ago • {query.organizationName}</p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:rotate-45 origin-center transition-all" />
                            </Link>
                        ))
                    )}
            </CardContent>
        </Card>
    )
}

function RecentQueriesSkeleton() {
    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-[180px]" />
                    <Skeleton className="h-9 w-[80px]" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-2 h-2 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-3 w-[150px]" />
                        </div>
                        <Skeleton className="w-4 h-4" />
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}