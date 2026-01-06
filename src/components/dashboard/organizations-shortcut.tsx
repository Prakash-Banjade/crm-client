import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Button } from "../ui/button";
import { useFetch } from "@/hooks/useFetch";
import { QueryKey } from "@/lib/react-query/queryKeys";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export default function DashboardOrganizationsShortcut() {
    const { data, isLoading } = useFetch<{ organizationsCount: number }>({
        endpoint: `${QueryKey.DASHBOARD}/counts`,
        queryKey: [QueryKey.DASHBOARD, 'counts'],
    });

    return (
        <Card className="border-none shadow-sm bg-indigo-900 text-white">
            <CardHeader>
                <CardTitle className="text-lg">Organization Hub</CardTitle>
                <CardDescription className="text-indigo-200">Manage registered companies & partners</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg mb-4">
                    <Building2 className="w-8 h-8 text-indigo-300" />
                    <div>
                        {
                            isLoading ? (
                                <Skeleton className="w-20 h-5 bg-white/20" />
                            ) : (
                                <p className="font-bold">{data?.organizationsCount} Organizations</p>
                            )
                        }
                        <p className="text-xs text-indigo-200">Registered globally</p>
                    </div>
                </div>
                <Button className="w-full bg-white text-indigo-900 hover:bg-indigo-50" asChild disabled={isLoading}>
                    <Link href="/organizations">
                        View Organizations
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}