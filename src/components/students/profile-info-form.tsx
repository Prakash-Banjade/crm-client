import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, LoadingButton } from "../ui/button";
import { Briefcase, FileText, Save, User } from "lucide-react";
import { Activity, useState } from "react";
import { cn } from "@/lib/utils";
import StudentPersonalInfoForm from "./personal-info-form";
import StudentAcademicQualificationForm from "./academic-qualificatino-form";
import StudentWorkExperienceForm from "./work-experience-form";
import { TSingleStudent } from "@/lib/types/student.types";

type Props = {
    student: TSingleStudent;
}

const tabs = [
    { value: "personal-info", label: "Personal Info", icon: User },
    { value: "academic-qualification", label: "Academic Qualification", icon: FileText },
    { value: "work-experience", label: "Work Experience", icon: Briefcase },
];

export default function StudentProfileInfoForm({ student }: Props) {
    const [activeTab, setActiveTab] = useState(tabs[0].value);

    return (
        <div className="flex flex-col @4xl:flex-row gap-6">
            {/* Left Sidebar for Sub-Tabs */}
            <div className="w-full @4xl:w-64 shrink-0">
                <Card className="sticky top-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Sections</CardTitle>
                        <CardDescription>Manage student profile</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-1">
                        {tabs.map((tab) => (
                            <Button
                                key={tab.value}
                                type="button"
                                variant={activeTab === tab.value ? "secondary" : "ghost"}
                                className={cn("w-full justify-start font-medium text-muted-foreground", activeTab === tab.value && "text-foreground border-l-2 border-l-primary")}
                                onClick={() => setActiveTab(tab.value)}
                            >
                                <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Right Content Area: The Form */}
            <Activity mode={activeTab === tabs[0].value ? "visible" : "hidden"}>
                <StudentPersonalInfoForm student={student} />
            </Activity>
            <Activity mode={activeTab === tabs[1].value ? "visible" : "hidden"}>
                <StudentAcademicQualificationForm student={student} />
            </Activity>
            <Activity mode={activeTab === tabs[2].value ? "visible" : "hidden"}>
                <StudentWorkExperienceForm student={student} />
            </Activity>
        </div>
    )
}