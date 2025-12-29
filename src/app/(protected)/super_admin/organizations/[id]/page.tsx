import { serverFetch } from "@/lib/server-fetch";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{
        id: string;
    }>
}

export default async function SingleOrganizationPage({ params }: Props) {
    const { id } = await params;

    const res = await serverFetch(`/organizations/${id}`, {
        next: { revalidate: 60 }
    });

    if (!res.ok) return notFound();

    const organization = await res.json();

    console.log(organization);

    return (
        <div>SingleOrganizationPage</div>
    )
}