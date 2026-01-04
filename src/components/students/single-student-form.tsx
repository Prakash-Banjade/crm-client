import { studentStatusMessages, TSingleStudent } from '@/lib/types/student.types';
import StudentProfileInfoForm from './profile-info-form';
import StudentDocumentsForm from './documents-form';
import { AlertCircleIcon, Briefcase, CheckCircle, FileText, Mail, Phone, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle } from '../ui/alert';
import StudentApplicationView from './applications-view';
import { ProfileAvatar } from '../ui/avatar';
import { useState } from 'react';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import z from 'zod';

export const enum StudentTabs {
    Profile = "profile",
    Documents = "documents",
    Applications = "applications",
}

export const profileTabs = [
    { value: "personal-info", label: "Personal Info", icon: User },
    { value: "academic-qualification", label: "Academic Qualification", icon: FileText },
    { value: "work-experience", label: "Work Experience", icon: Briefcase },
];

const tabsSchema = z.enum([StudentTabs.Profile, StudentTabs.Documents, StudentTabs.Applications]);
const subTabsSchema = z.enum([profileTabs[0].value, profileTabs[1].value, profileTabs[2].value]);

export const enum ProfileSubTabs {
    PersonalInfo = "personal-info",
    AcademicQualification = "academic-qualification",
    WorkExperience = "work-experience",
}

type Props = {
    student: TSingleStudent;
}

export default function SingleStudentForm({ student }: Props) {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const [activeTab, setActiveTab] = useState<StudentTabs>(() => {
        const tab = tabsSchema.safeParse(searchParams.get("tab"));
        if (tab.success) {
            return tab.data;
        } else {
            return StudentTabs.Profile;
        }
    });

    const [activeSubTab, setActiveSubTab] = useState<string>(() => {
        const tab = subTabsSchema.safeParse(searchParams.get("subTab"));
        if (tab.success) {
            return tab.data;
        } else {
            return profileTabs[0].value;
        }
    });

    return (
        <div className="container space-y-6 @container">
            {/* Top Header / Profile Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-xl border shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <ProfileAvatar
                        name={student.fullName}
                        src={undefined}
                        className='size-16'
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{student.fullName}</h1>
                        <div className="flex gap-4 text-sm mt-1">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {student.phoneNumber}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {student.email}</span>
                        </div>
                    </div>
                </div>
                {
                    !student.statusMessage && (
                        <Alert className='w-fit text-green-600'>
                            <CheckCircle />
                            <AlertTitle>Application Active</AlertTitle>
                        </Alert>
                    )
                }
                {
                    student.statusMessage.length > 0 && (
                        <Alert variant="destructive" className='w-fit'>
                            <AlertCircleIcon />
                            <AlertTitle>{student.statusMessage}</AlertTitle>
                        </Alert>
                    )
                }
            </div>

            {/* Main Navigation Tabs */}
            <Tabs
                defaultValue={activeTab}
                onValueChange={val => {
                    setActiveTab(val as StudentTabs);
                    setSearchParams({ tab: val });
                }}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-6 border">
                    <TabsTrigger value="profile">Profile Information</TabsTrigger>
                    <TabsTrigger
                        value="documents"
                        disabled={
                            student.statusMessage === studentStatusMessages.personalInfo
                            || student.statusMessage === studentStatusMessages.academicQualification
                        }
                    >
                        Documents
                    </TabsTrigger>
                    <TabsTrigger value="applications" disabled={student.statusMessage.length > 0}>Applications</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0">
                    <StudentProfileInfoForm
                        activeSubTab={activeSubTab}
                        setActiveSubTab={setActiveSubTab}
                        student={student}
                    />
                </TabsContent>
                <TabsContent value="documents">
                    <StudentDocumentsForm student={student} />
                </TabsContent>
                <TabsContent value="applications">
                    <StudentApplicationView student={student} />
                </TabsContent>
            </Tabs>
        </div>
    )
}