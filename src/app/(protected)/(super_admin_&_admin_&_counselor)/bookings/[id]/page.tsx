"use client";

import BookingForm from '@/components/booking/booking-form';
import { useGetBookingById } from '@/lib/data-access/bookings-data-hooks';
import { notFound } from 'next/navigation';
import { use } from 'react';

type Props = {
    params: Promise<{
        id: string;
    }>
}

export default function EditBookingPage({ params }: Props) {
    const { id } = use(params);

    const { data: booking, isLoading } = useGetBookingById({ id })

    if (isLoading) return <div>Loading...</div>

    if (!booking) notFound();

    return (
        <BookingForm defaultValues={booking} />
    )
}