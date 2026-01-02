import { TSingleStudent } from '@/lib/types/student.types';
import StudentProfileInfoForm from './profile-info-form';
import StudentDocumentsForm from './documents-form';
import StudentWorkExperienceForm from './work-experience-form';
import { AlertCircleIcon, CheckCircle, Mail, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle } from '../ui/alert';

type Props = {
    student: TSingleStudent;
}

export default function SingleStudentForm({ student }: Props) {

    return (
        <div className="container space-y-6 @container">
            {/* Top Header / Profile Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-xl border shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold">
                        {student.fullName.charAt(0).toUpperCase()}
                    </div>
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
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-6 border">
                    <TabsTrigger value="profile">Profile Information</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-0">
                    <StudentProfileInfoForm student={student} />
                </TabsContent>
                <TabsContent value="documents">
                    <StudentDocumentsForm student={student} />
                </TabsContent>
                <TabsContent value="applications">
                    <StudentWorkExperienceForm student={student} />
                </TabsContent>
            </Tabs>
        </div>
    )
}