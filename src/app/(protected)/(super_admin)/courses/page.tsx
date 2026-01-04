import ContainerLayout from "@/components/container-layout";
import CoursesDataTable from "@/components/courses/courses-data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <ContainerLayout
            title="Manage Courses"
            description="All the courses listed here"
            action={
                <Button asChild>
                    <Link href={"courses/new"}>
                        <Plus />
                        Add Course
                    </Link>
                </Button>
            }
        >
            <CoursesDataTable />
        </ContainerLayout>
    )
}