import ContainerLayout from "@/components/container-layout";
import AddUniversityButton from "@/components/universities/add-university-btn";
import UniversitiesDataTable from "@/components/universities/universities-data-table";

export default function Page() {
    return (
        <ContainerLayout
            title="Universities"
            description="Manage universities"
            action={
                <AddUniversityButton />
            }
        >
            <UniversitiesDataTable />
        </ContainerLayout>
    )
}