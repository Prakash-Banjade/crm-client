import ContainerLayout from "@/components/container-layout";
import CoursesDataTable from "@/components/courses/courses-data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <ContainerLayout
            title="Courses"
            description="Manage courses"
            action={
                <Button variant={'outline'} asChild>
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