import ContainerLayout from "@/components/container-layout";
import AddLeadBtn from "@/components/students/lead/add-lead-btn";
import LeadDataTable from "@/components/students/lead/lead-data-table";

export default function Page() {
    return (
        <ContainerLayout
            title="Manage Leads"
            description="The student leads are listed here."
            action={
                <AddLeadBtn />
            }
        >
            <LeadDataTable />
        </ContainerLayout>
    )
}
