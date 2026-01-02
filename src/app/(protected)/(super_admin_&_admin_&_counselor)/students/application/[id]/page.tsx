"use client";

import { useGetStudent } from '@/lib/data-access/student-data-hooks';
import { notFound } from 'next/navigation';
import { use } from 'react'
import {
    User, FileText, Briefcase, MapPin,
    Globe, AlertCircle, Phone, Mail,
    Calendar as Save
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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