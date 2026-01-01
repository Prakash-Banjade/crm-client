import AddBdeButton from "@/components/bde/add-bde-btn";
import BdesDataTable from "@/components/bde/bdes-data-table";
import ContainerLayout from "@/components/container-layout";

export default function Page() {
    return (
        <ContainerLayout
            title="Business Development Executives"
            description="Manage BDEs"
            action={
                <AddBdeButton />
            }
        >
            <BdesDataTable />
        </ContainerLayout>
    )
}