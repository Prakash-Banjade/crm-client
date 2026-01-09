'use client';

import { notFound, useParams } from "next/navigation";
import { useGetLearningResource } from "@/lib/data-access/learning-resources-data-hooks";
import { LearningResourceSinglePage } from "@/components/learning-resources/learing-resouce-singlepage";

export default function Page() {
    const { subId } = useParams();
    const { data, isLoading, isError } = useGetLearningResource({ id: subId as string });

    if (isLoading) return <div>Loading...</div>

    if (!data || isError) notFound();

    return (
        <LearningResourceSinglePage resource={data} />
    );
}

