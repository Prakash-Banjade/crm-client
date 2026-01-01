"use client";

import { useSearchParams } from "next/navigation";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import { useState } from "react";
import AddStudentForm from "./add-student-form";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function AddStudentBtn() {
    const searchParams = useSearchParams();

    const [isOpen, setIsOpen] = useState(searchParams.get("add") === "true");
    const [isFormDirty, setIsFormDirty] = useState(false);

    return (
        <>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Register New Student"
                confirmOnExit={isFormDirty}
                className='sm:min-w-2xl'
            >
                <AddStudentForm setIsOpen={setIsOpen} setIsFormDirty={setIsFormDirty} />
            </ResponsiveDialog>

            <Button
                onClick={() => setIsOpen(true)}
            >
                <Plus />
                Register New Student
            </Button>
        </>
    )
}