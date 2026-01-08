"use client";

import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import OrganizationUserDeleteForm from "./organization-user-delete-form";

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userId: string;
    userName: string;
}

export default function OrganizationUserDeleteDialog({ isOpen, setIsOpen, userId, userName }: Props) {
    return (
        <ResponsiveDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Remove User"
            description={`Are you sure you want to remove ${userName}? This action cannot be undone. This will permanently remove all the data related to this user.`}
        >
            <OrganizationUserDeleteForm
                setIsOpen={setIsOpen}
                userId={userId}
                userName={userName}
            />
        </ResponsiveDialog>
    )
}