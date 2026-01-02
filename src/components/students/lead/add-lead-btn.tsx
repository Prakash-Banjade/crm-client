"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import AddLeadForm from "./lead-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";

export default function () {
    const searchParams = useSearchParams();

    const [isOpen, setIsOpen] = useState(searchParams.get("add") === "true");
    const [isFormDirty, setIsFormDirty] = useState(false);

    return (
        <>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Register New Lead"
                confirmOnExit={isFormDirty}
                className='sm:min-w-2xl'
            >
                <AddLeadForm setIsOpen={setIsOpen} setIsFormDirty={setIsFormDirty} />
            </ResponsiveDialog>

            <Button
                onClick={() => setIsOpen(true)}
            >
                <Plus />
                Register New Lead
            </Button>
        </>
    )
}