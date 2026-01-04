import ContainerLayout from "@/components/container-layout"
import ApplicationsDataTable from "@/components/students/application/applications-data-table"

export default function Page() {
    return (
        <ContainerLayout
            title="Manage Applications"
        >
            <ApplicationsDataTable />
        </ContainerLayout>
    )
}