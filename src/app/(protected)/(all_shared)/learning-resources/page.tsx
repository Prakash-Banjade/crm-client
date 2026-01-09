"use client";

import ContainerLayout from "@/components/container-layout"
import SearchInput from "@/components/search-components/search-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetLearningResources } from "@/lib/data-access/learning-resources-data-hooks";
import { formatDate } from "date-fns";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LearningResources() {
    return (
        <ContainerLayout
            title="Learning Resources"
            description="Browse different learning resources"
        >
            <ResourcesList />
        </ContainerLayout>
    )
}

function ResourcesList() {
    const searchParams = useSearchParams();

    const { data, isLoading } = useGetLearningResources({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>

    if (!data) return null;

    return (
        <section className="@container space-y-6">
            <SearchInput className="w-fit" />

            <section className="grid @2xl:grid-cols-3 @md:grid-cols-2 grid-cols-1 gap-6">
                {
                    data.data.map(r => {
                        return (
                            <Card key={r.id}>
                                <CardHeader>
                                    <CardTitle>{r.title}</CardTitle>
                                    <CardDescription>{r.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <span>Created on {formatDate(new Date(r.createdAt), "PPP")}</span>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild>
                                        <Link href={`/learning-resources/${r.id}`}>
                                            View
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })
                }
            </section>
        </section>
    )
}