import { getOrganizationById } from '@/lib/data-access/org-data-access';

type Props = {
    params: Promise<{
        id: string;
    }>
}

export default async function SingleOrganizationPage({ params }: Props) {
    const { id } = await params;

    const organization = await getOrganizationById(id);

    console.log(organization);

    return (
        <div>SingleOrganizationPage</div>
    )
}