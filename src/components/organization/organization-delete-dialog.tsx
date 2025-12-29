"use client";

import { ResponsiveDialog } from "../ui/responsive-dialog";
import OrganizationDeleteForm from "./organization-delete-form";

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    organizationId: string;
    organizationName: string;
}

export default function OrganizationDeleteDialog({ isOpen, setIsOpen, organizationId, organizationName }: Props) {
    return (
        <ResponsiveDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Remove Organization"
            description={`Are you sure you want to remove ${organizationName}? This action cannot be undone. This will permanently remove all the data related to this organization.`}
        >
            <OrganizationDeleteForm
                setIsOpen={setIsOpen}
                organizationId={organizationId}
                organizationName={organizationName}
            />
        </ResponsiveDialog>
    )
}