"use client";

import React from 'react'
import { useServerAction } from '@/hooks/use-server-action';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { blockUser } from '@/lib/actions/user.action';
import { ResponsiveAlertDialog } from '@/components/ui/responsive-alert-dialog';

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userId: string;
    userName: string;
    isBlacklisted: boolean;
}

export default function OrganizationUserBlockAlertDialog({ isOpen, setIsOpen, userId, userName, isBlacklisted }: Props) {
    const { isPending: blockPending, mutate: blockMutate } = useServerAction({
        action: blockUser,
        invalidateTags: [QueryKey.USERS],
        onSuccess: () => {
            setIsOpen(false);
        }
    });

    return (
        <ResponsiveAlertDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={isBlacklisted ? "Unblock User" : "Block User"}
            description={`Are you sure you want to ${isBlacklisted ? "unblock" : "block"} ${userName}?` + (isBlacklisted ? " Unblocking will allow the user to access the platform." : " Blocking will prevent the user from accessing the platform.")}
            action={() => blockMutate(userId)}
            actionLabel={isBlacklisted ? "Yes, unblock" : "Yes, block"}
            isLoading={blockPending}
            loadingText={isBlacklisted ? "Unblocking..." : "Blocking..."}
        />
    )
}