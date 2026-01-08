"use client";

import React from 'react'
import { ResponsiveAlertDialog } from '../ui/responsive-alert-dialog';
import { useServerAction } from '@/hooks/use-server-action';
import { blockOrganization } from '@/lib/actions/organization.action';
import { QueryKey } from '@/lib/react-query/queryKeys';

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    organizationId: string;
    organizationName: string;
    isBlacklisted: boolean;
}

export default function OrganizationBlockAlertDialog({ isOpen, setIsOpen, organizationId, organizationName, isBlacklisted }: Props) {
    const { isPending: blockPending, mutate: blockMutate } = useServerAction({
        action: blockOrganization,
        invalidateTags: [QueryKey.ORGANIZATIONS],
        onSuccess: () => {
            setIsOpen(false);
        }
    });

    return (
        <ResponsiveAlertDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isBlacklisted ? "Unblock Organization" : "Block Organization"}
            description={`Are you sure you want to ${isBlacklisted ? "unblock" : "block"} ${organizationName}?` + (isBlacklisted ? " Unblocking will allow the users of this organization to access the platform." : " Blocking will prevent the users of this organization from accessing the platform.")}
            action={() => blockMutate(organizationId)}
            actionLabel={isBlacklisted ? "Yes, unblock" : "Yes, block"}
            isLoading={blockPending}
            loadingText={isBlacklisted ? "Unblocking..." : "Blocking..."}
        />
    )
}