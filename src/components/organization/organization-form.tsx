"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button, LoadingButton } from '../ui/button'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { organizationDefaultValues, organizationSchema, TOrganizationSchema } from '@/lib/schema/organization.schema'
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { Input } from "../ui/input";
import { ColorPicker } from "../ui/color-picker";
import { createOrganization, updateOrganization } from "@/lib/actions/organization.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { useServerAction } from "@/hooks/use-server-action";
import { TSingleOrganization } from "@/lib/types/organization.type";
import { useConfirmExit } from "@/hooks/use-confirm-exit";
import { useConfirmExitAlert } from "@/context/confirm-exit-provider";
import ImageUpload from "../forms/image-upload";

type Props = {
    defaultValues?: TSingleOrganization
}

export default function OrganizationForm({ defaultValues }: Props) {
    const isEditing = !!defaultValues;

    const router = useRouter();
    const { setExitLocation, setIsOpen } = useConfirmExitAlert();

    const form = useForm<TOrganizationSchema>({
        resolver: zodResolver(organizationSchema),
        defaultValues: defaultValues || organizationDefaultValues
    });

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createOrganization,
        invalidateTags: [QueryKey.ORGANIZATIONS],
        onSuccess: () => {
            router.push(`/${Role.SUPER_ADMIN}/organizations`);
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateOrganization,
        invalidateTags: [QueryKey.ORGANIZATIONS],
    });


    function onSubmit(data: TOrganizationSchema) {
        if (isEditing) {
            update({ formData: data, id: defaultValues?.id! });
        } else {
            create(data);
        }
    }

    useConfirmExit(form.formState.isDirty);

    const name = useWatch({
        control: form.control,
        name: "name",
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="@container">
                <section className="space-y-6 pb-40">
                    <header className="container">
                        <h3 className="text-3xl font-bold capitalize max-w-[50ch] wrap-break-words">
                            {name || "N/A"}
                        </h3>
                    </header>
                    <section className="border-y sticky z-1 backdrop-blur-3xl top-0">
                        <section className="container flex justify-between items-center py-3">
                            <p className="text-sm text-muted-foreground">
                                {isEditing ? "Updating an organization" : "Creating new organization"}
                            </p>
                            <section className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant={'outline'}
                                    size={'lg'}
                                    onClick={() => {
                                        if (form.formState.isDirty) {
                                            setExitLocation(`/${Role.SUPER_ADMIN}/organizations`);
                                            setIsOpen(true);
                                        } else {
                                            router.push(`/${Role.SUPER_ADMIN}/organizations`);
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>

                                <LoadingButton
                                    type="submit"
                                    size={"lg"}
                                    isLoading={isCreating || isUpdating}
                                    loadingText="Saving..."
                                >
                                    Save
                                </LoadingButton>
                            </section>
                        </section>
                    </section>

                    <section className="container space-y-10">
                        <section className="grid @4xl:grid-cols-2 grid-cols-1 gap-6">
                            <section className="@4xl:col-span-2 space-y-1">
                                <h4 className="text-lg font-semibold">Basic Details</h4>
                                <p className="text-sm text-muted-foreground">Fill in the basic details of the organization</p>
                            </section>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address<span className="text-destructive">*</span></FormLabel>
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
                            <FormField
                                control={form.control}
                                name="contactNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="tel" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="concerningPersonName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Concerning Person Name<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vatNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>VAT Number<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="panNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PAN Number<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="websiteUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website URL</FormLabel>
                                        <FormControl>
                                            <Input type="url" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brandColorPrimary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand Color Primary</FormLabel>
                                        <FormControl>
                                            <ColorPicker
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brandColorSecondary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Brand Color Secondary</FormLabel>
                                        <FormControl>
                                            <ColorPicker
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="logo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Logo</FormLabel>
                                        <FormControl>
                                            <ImageUpload name="logo" value={field.value} onValueChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="panCertificate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>PAN Certificate</FormLabel>
                                        <FormControl>
                                            <ImageUpload name="panCertificate" value={field.value} onValueChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="registrationDocument"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Registration Document</FormLabel>
                                        <FormControl>
                                            <ImageUpload name="registrationDocument" value={field.value} onValueChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </section>
                        <section className="grid @4xl:grid-cols-2 grid-cols-1 gap-6">
                            <section className="@4xl:col-span-2 space-y-1">
                                <h4 className="text-lg font-semibold">Banking Details</h4>
                                <p className="text-sm text-muted-foreground">Fill in the banking details of the organization</p>
                            </section>

                            <FormField
                                control={form.control}
                                name="bankingDetails.bankName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Name<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bankingDetails.bankLocation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Location<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bankingDetails.bankState"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank State<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bankingDetails.bankCity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank City<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bankingDetails.accountNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Number<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bankingDetails.benificiaryName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Benificiary Name<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bankingDetails.swiftCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Swift Code</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </section>
                    </section>
                </section>
            </form>
        </Form>
    )
}