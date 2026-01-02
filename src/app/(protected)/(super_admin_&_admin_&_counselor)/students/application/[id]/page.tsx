"use client";

import { useGetStudent } from '@/lib/data-access/student-data-hooks';
import { notFound } from 'next/navigation';
import { use } from 'react'
import SingleStudentForm from '@/components/students/single-student-form';

type Props = {
    params: Promise<{
        id: string;
    }>
}

export default function Page({ params }: Props) {
    const { id } = use(params);

    const { data: student, isLoading } = useGetStudent({
        id,
    })

    if (isLoading) return <div>Loading...</div>

    if (!student) notFound();

    return (
        <SingleStudentForm student={student} />
    )
}