"use client";

import { useSearchParams } from "next/navigation";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import { useState } from "react";
import AddStudentForm from "./add-student-form";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { Role } from "@/lib/types";

export default function AddStudentBtn() {
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const [isOpen, setIsOpen] = useState(searchParams.get("add") === "true");
    const [isFormDirty, setIsFormDirty] = useState(false);

    if (user?.role === Role.SUPER_ADMIN) return null; // super admin cannot add students

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