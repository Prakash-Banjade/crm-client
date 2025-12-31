import ContainerLayout from "@/components/container-layout";
import AddCounselorButton from "@/components/counselor/add-counselor-btn";
import CounselorsDataTable from "@/components/counselor/counselors-data-table";

export default function CounselorsPage() {
    return (
        <ContainerLayout
            title="Counselors"
            description="Manage counselors"
            action={
                <AddCounselorButton />
            }
        >
            <CounselorsDataTable />
        </ContainerLayout>
    )
}