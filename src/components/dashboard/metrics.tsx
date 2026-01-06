"use client";

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import { useFetch } from '@/hooks/useFetch'
import { QueryKey } from '@/lib/react-query/queryKeys';
import { BookOpen, Building2, FileText, Users } from 'lucide-react'

type CountResponse = {
    applicationsGrowth: number,
    applicationsCount: number,
    coursesCount: number,
    universitiesCount: number,
    studentsGrowth: number;
    studentsCount: number,
    organizationsCount: number
}

export default function DashboardMetrics() {
    const { data, isLoading } = useFetch<CountResponse>({
        endpoint: `${QueryKey.DASHBOARD}/counts`,
        queryKey: [QueryKey.DASHBOARD, 'counts'],
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="border-none shadow-sm overflow-hidden group">
                <CardContent className="py-2">
                    <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-xl text-blue-600 bg-blue-50 transition-colors group-hover:bg-opacity-80`}>
                            <Users className="w-6 h-6" />
                        </div>
                        <Badge variant="success" title='Compared to last month'>+{data?.studentsGrowth}%</Badge>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                        <h3 className="text-2xl font-bold">
                            {
                                isLoading ? <Skeleton className="w-20 h-8" /> : data?.studentsCount?.toLocaleString()
                            }
                        </h3>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm overflow-hidden group">
                <CardContent className="py-2">
                    <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-xl text-amber-600 bg-amber-50 transition-colors group-hover:bg-opacity-80`}>
                            <FileText className="w-6 h-6" />
                        </div>
                        <Badge variant="success" title='Compared to last month'>+{data?.applicationsGrowth}%</Badge>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                        <h3 className="text-2xl font-bold">
                            {
                                isLoading ? <Skeleton className="w-20 h-8" /> : data?.applicationsCount?.toLocaleString()
                            }
                        </h3>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm overflow-hidden group">
                <CardContent className="py-2">
                    <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-xl text-indigo-600 bg-indigo-50 transition-colors group-hover:bg-opacity-80`}>
                            <Building2 className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">Partner Universities</p>
                        <h3 className="text-2xl font-bold">
                            {
                                isLoading ? <Skeleton className="w-20 h-8" /> : data?.universitiesCount?.toLocaleString()
                            }
                        </h3>
                    </div>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm overflow-hidden group">
                <CardContent className="py-2">
                    <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-xl text-emerald-600 bg-emerald-50 transition-colors group-hover:bg-opacity-80`}>
                            <BookOpen className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">Total Programs</p>
                        <h3 className="text-2xl font-bold">
                            {
                                isLoading ? <Skeleton className="w-20 h-8" /> : data?.coursesCount?.toLocaleString()
                            }
                        </h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}