import { useGetCounselors } from "@/lib/data-access/counselor-data-hooks"
import { createQueryString } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Spinner } from "../ui/spinner";

export default function QuickCounselorsView() {
    const { data, isLoading } = useGetCounselors({
        queryString: createQueryString({
            take: 5
        })
    });

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Quick view Counselors</CardTitle>
                    <Button asChild>
                        <Link href="/counselors">View All</Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                {
                    isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner />
                        </div>
                    ) : (
                        data?.data?.map((counselor) => (
                            <div key={counselor.id} className="p-2 py-4 border-b border-border last:border-b-0">
                                <p className="font-medium text-base">{counselor.account.firstName} {counselor.account.lastName}</p>
                                <p className="text-muted-foreground text-sm">
                                    <a href={`tel:${counselor.phoneNumber}`} className="hover:underline">{counselor.phoneNumber}</a>
                                    <span className="mx-1">•</span>
                                    <a href={`mailto:${counselor.account.email}`} className="hover:underline">{counselor.account.email}</a>
                                </p>
                            </div>
                        ))
                    )
                }
            </CardContent>
            <CardFooter className="flex justify-center">
                Total: {data?.meta.itemCount}
            </CardFooter>
        </Card>
    )
}