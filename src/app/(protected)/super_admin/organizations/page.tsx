import ContainerLayout from "@/components/container-layout"
import OrganizationDataTable from "@/components/organization/organization-data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function OrganizationsPage() {
    return (
        <ContainerLayout
            title="Organizations"
            description="Manage organizations"
            action={
                <Button asChild>
                    <Link href="organizations/new">
                        <Plus />
                        Add Organization
                    </Link>
                </Button>
            }
        >
            <OrganizationDataTable />
        </ContainerLayout>
    )
}