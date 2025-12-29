"use client";

import { TSingleOrganization } from '@/lib/types/organization.type';
import { useState } from 'react'
import OrganizationBlockAlertDialog from './organization-block-alert-dialog';
import OrganizationDeleteDialog from './organization-delete-dialog';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Lock, Pencil, Trash, Unlock } from 'lucide-react';

type Props = {
    organization: TSingleOrganization
}

export default function SingleOrganizationActionBtns({ organization }: Props) {
    const isBlacklisted = organization.blacklistedAt !== null;

    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
    const [isBlockOpen, setIsBlockOpen] = useState(false);

    return (
        <>
            <OrganizationBlockAlertDialog
                isOpen={isBlockOpen}
                setIsOpen={setIsBlockOpen}
                organizationId={organization.id}
                organizationName={organization.name}
                isBlacklisted={isBlacklisted}
            />

            <OrganizationDeleteDialog
                isOpen={isDeleteConfirmDialogOpen}
                setIsOpen={setIsDeleteConfirmDialogOpen}
                organizationId={organization.id}
                organizationName={organization.name}
            />

            <div className='grid grid-cols-3 gap-4'>
                <Button size={"lg"} variant={"outline"} asChild>
                    <Link href={`${organization.id}/edit`}>
                        <Pencil />
                        Edit
                    </Link>
                </Button>
                <Button size={"lg"} variant={"outline"} onClick={() => setIsBlockOpen(true)}>
                    {isBlacklisted ? <Unlock /> : <Lock />}
                    {isBlacklisted ? "Unblock" : "Block"}
                </Button>
                <Button size={"lg"} variant={"destructive"} onClick={() => setIsDeleteConfirmDialogOpen(true)}>
                    <Trash />
                    Remove
                </Button>
            </div>

        </>
    )
}