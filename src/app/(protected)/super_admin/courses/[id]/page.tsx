"use client";

import { use } from 'react'
import { useGetCourseById } from '@/lib/data-access/courses-data-hooks'
import { notFound } from 'next/navigation';
import CourseForm from '@/components/courses/course-form';

type Props = {
    params: Promise<{
        id: string;
    }>
}

export default function EditCoursePage({ params }: Props) {
    const { id } = use(params);

    const { data: course, isLoading } = useGetCourseById({ id })

    if (isLoading) return <div>Loading...</div>

    console.log(course)

    if (!course) notFound();

    return (
        <CourseForm
            defaultValues={{
                ...course,
                category: {
                    label: course.category.name,
                    value: course.category.id
                },
                university: {
                    label: course.university.name,
                    value: course.university.id
                }
            }}
        />
    )
}