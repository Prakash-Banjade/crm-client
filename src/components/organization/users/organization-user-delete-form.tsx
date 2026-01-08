import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Input } from '../../ui/input';
import {
    Alert,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from 'lucide-react';
import { useServerAction } from '@/hooks/use-server-action';
import { deleteUser } from '@/lib/actions/user.action';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { Button, LoadingButton } from '../../ui/button';

type Props = {
    setIsOpen: (value: boolean) => void;
    userId: string;
    userName: string;
}

const schema = z.object({
    userId: z.string().uuid(),
    userName: z.string().min(1, "User Name is required"),
    userGivenName: z.string().min(1, "Please type the user name to confirm"),
})

export default function OrganizationUserDeleteForm({ setIsOpen, userId, userName }: Props) {

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            userId,
            userName,
            userGivenName: "",
        },
    });

    const { isPending: deletePending, mutate: deleteMutate } = useServerAction({
        action: deleteUser,
        invalidateTags: [QueryKey.USERS],
        onSuccess: () => {
            setIsOpen(false);
        }
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        if (data.userGivenName !== `delete ${userName}`) {
            form.setError("userGivenName", {
                type: "manual",
                message: `The value doesn't match with "delete ${userName}"`,
            });
            return;
        }

        deleteMutate(data.userId);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="userGivenName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel><span className='font-normal'>To confirm, type</span> "delete {userName}"</FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>Deleting {userName} cannot be undone.</AlertTitle>
                </Alert>
                <Alert variant="destructive">
                    <AlertCircleIcon />
                    <AlertTitle>This will result in permanent loss of students, applications and bookings created by {userName}.</AlertTitle>
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
