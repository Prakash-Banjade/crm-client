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
import { bookingDefaultValues, bookingSchema, CreateBookingInput, EBookingSubType, EBookingType } from '@/lib/schema/booking.schema'
import { useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { Input } from "../ui/input";
import { createBooking, updateBooking } from "@/lib/actions/bookings.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { useServerAction } from "@/hooks/use-server-action";
import { useConfirmExit } from "@/hooks/use-confirm-exit";
import { useConfirmExitAlert } from "@/context/confirm-exit-provider";
import ImageUpload from "../forms/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TSingleBooking } from "@/lib/types/booking.types";

type Props = {
    defaultValues?: TSingleBooking
}

export default function BookingForm({ defaultValues }: Props) {
    const isEditing = !!defaultValues;

    const router = useRouter();
    const { setExitLocation, setIsOpen } = useConfirmExitAlert();

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createBooking,
        invalidateTags: [QueryKey.BOOKINGS],
        onSuccess: () => {
            router.push(`/${Role.SUPER_ADMIN}/bookings`);
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateBooking,
        invalidateTags: [QueryKey.BOOKINGS],
        onSuccess: () => {
            router.push(`/${Role.SUPER_ADMIN}/bookings`);
        },
    });

    // const formattedDefaultValues = defaultValues ? {
    //     ...defaultValues,
    //     dob: defaultValues.dob ? format(new Date(defaultValues.dob), 'yyyy-MM-dd') : '',
    //     bookingDate: defaultValues.bookingDate ? format(new Date(defaultValues.bookingDate), 'yyyy-MM-dd') : ''
    // } : undefined;

    const form = useForm<CreateBookingInput>({
        resolver: zodResolver(bookingSchema),
        defaultValues: defaultValues ?? bookingDefaultValues
    });

    // useEffect(() => {
    //     if (defaultValues) {
    //         form.reset({
    //             ...defaultValues,
    //             dob: defaultValues.dob ? format(new Date(defaultValues.dob), 'yyyy-MM-dd') : '',
    //             bookingDate: defaultValues.bookingDate ? format(new Date(defaultValues.bookingDate), 'yyyy-MM-dd') : ''
    //         });
    //     }
    // }, [defaultValues]);

    function onSubmit(data: CreateBookingInput) {
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
                                {isEditing ? "Updating a booking" : "Creating new booking"}
                            </p>
                            <section className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant={'outline'}
                                    size={'lg'}
                                    onClick={() => {
                                        if (form.formState.isDirty) {
                                            setExitLocation(`/${Role.SUPER_ADMIN}/bookings`);
                                            setIsOpen(true);
                                        } else {
                                            router.push(`/${Role.SUPER_ADMIN}/bookings`);
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
                                <h4 className="text-lg font-semibold">Personal Details</h4>
                                <p className="text-sm text-muted-foreground">Fill in the personal details of the applicant</p>
                            </section>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Enter full name" {...field}

                                            />
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
                                            <Input type="email" placeholder="Enter email address" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="Enter phone number" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="date" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Location<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter address/location" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="passportAttachment"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 flex flex-col">
                                        <FormLabel>Passport Attachment<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <ImageUpload name="passportAttachment" value={field.value} onValueChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </section>

                        <section className="grid @4xl:grid-cols-2 grid-cols-1 gap-6">
                            <section className="@4xl:col-span-2 space-y-1">
                                <h4 className="text-lg font-semibold">Booking Details</h4>
                                <p className="text-sm text-muted-foreground">Fill in the booking specifications</p>
                            </section>

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Booking Type<span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select booking type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(EBookingType).map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Booking Sub-Type<span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select booking sub-type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(EBookingSubType).map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bookingDate"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Booking Date<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="date" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paymentProof"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 flex flex-col">
                                        <FormLabel>Payment Proof<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <ImageUpload name="paymentProof" value={field.value} onValueChange={field.onChange} />
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