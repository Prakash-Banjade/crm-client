import { Button, LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useServerAction } from "@/hooks/use-server-action";
import { createAdminUser, updateUser } from "@/lib/actions/user.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { adminUserFormDefaultValues, adminUserFormSchema, TAdminUserFormSchema } from "@/lib/schema/users.schema";
import { TUser } from "@/lib/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Props = {
    setIsOpen: (value: boolean) => void;
    organizationId: string;
    defaultValues?: TUser
}

export default function AdminUserForm({ setIsOpen, organizationId, defaultValues }: Props) {
    const isEditing = !!defaultValues?.userId;

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createAdminUser,
        invalidateTags: [QueryKey.USERS],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateUser,
        invalidateTags: [QueryKey.USERS],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const form = useForm<TAdminUserFormSchema>({
        resolver: zodResolver(adminUserFormSchema),
        defaultValues: {
            ...(defaultValues || adminUserFormDefaultValues),
            organizationId,
        },
    });

    const onSubmit = (data: TAdminUserFormSchema) => {
        if (isEditing) {
            update({ userId: defaultValues.userId, formData: data });
        } else {
            create(data);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="email" required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant={'outline'}
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            isLoading={isCreating || isUpdating}
                            type="submit"
                            loadingText={isEditing ? "Updating..." : "Creating..."}
                        >
                            {isEditing ? "Save Changes" : "Add"}
                        </LoadingButton>
                    </div>

                </div>
            </form>
        </Form>
    )
}