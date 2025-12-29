import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from 'lucide-react';
import { useServerAction } from '@/hooks/use-server-action';
import { deleteOrganization } from '@/lib/actions/organization.action';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { Button, LoadingButton } from '../ui/button';

type Props = {
    setIsOpen: (value: boolean) => void;
    organizationId: string;
    organizationName: string;
}

const schema = z.object({
    organizationId: z.string().uuid(),
    organizationName: z.string().min(1, "Organization Name is required"),
    userGivenName: z.string().min(1, "Please type the organization name to confirm"),
})

export default function OrganizationDeleteForm({ setIsOpen, organizationId, organizationName }: Props) {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            organizationId,
            organizationName,
            userGivenName: "",
        },
    });

    const { isPending: deletePending, mutate: deleteMutate } = useServerAction({
        action: deleteOrganization,
        invalidateTags: [QueryKey.ORGANIZATIONS],
        onSuccess: () => {
            setIsOpen(false);
        }
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        if (data.userGivenName !== `delete ${organizationName}`) {
            form.setError("userGivenName", {
                type: "manual",
                message: `The value doesn't match with "delete ${organizationName}"`,
            });
            return;
        }

        deleteMutate(data.organizationId);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="userGivenName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel><span className='font-normal'>To confirm, type</span> "delete {organizationName}"</FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>Deleting {organizationName} cannot be undone.</AlertTitle>
                </Alert>

                <div className='flex justify-end'>
                    <div className='grid grid-cols-2 gap-2'>
                        <Button
                            type="button"
                            disabled={deletePending}
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            size={"lg"}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            type="submit"
                            variant="destructive"
                            isLoading={deletePending}
                            loadingText="Deleting..."
                            size={"lg"}
                        >
                            Delete
                        </LoadingButton>
                    </div>
                </div>
            </form>
        </Form>
    )
}