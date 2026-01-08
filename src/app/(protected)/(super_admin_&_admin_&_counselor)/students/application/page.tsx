import ContainerLayout from "@/components/container-layout";
import AddStudentBtn from "@/components/students/add-student-btn";
import StudentsDataTable from "@/components/students/students-data-table";

export default function Page() {
    return (
        <ContainerLayout
            title="Manage Students"
            description="The registered application students are listed here."
            action={
                <AddStudentBtn />
            }
        >
            <StudentsDataTable />
        </ContainerLayout>
    )
}