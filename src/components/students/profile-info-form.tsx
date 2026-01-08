import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Activity, startTransition } from "react";
import { cn } from "@/lib/utils";
import StudentPersonalInfoForm from "./personal-info-form";
import StudentAcademicQualificationForm from "./academic-qualification-form";
import StudentWorkExperienceForm from "./work-experience-form";
import { TSingleStudent } from "@/lib/types/student.types";
import { profileTabs } from "./single-student-form";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";

type Props = {
    student: TSingleStudent;
    activeSubTab: string;
    setActiveSubTab: (subTab: string) => void;
}

export default function StudentProfileInfoForm({ student, activeSubTab, setActiveSubTab }: Props) {
    const { setSearchParams } = useCustomSearchParams();

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
                        {profileTabs.map((tab) => (
                            <Button
                                key={tab.value}
                                type="button"
                                variant={activeSubTab === tab.value ? "secondary" : "ghost"}
                                className={cn("w-full justify-start font-medium text-muted-foreground", activeSubTab === tab.value && "text-foreground border-l-2 border-l-primary")}
                                onClick={() => {
                                    startTransition(() => {
                                        setActiveSubTab(tab.value);
                                        setSearchParams({ subTab: tab.value });
                                    })
                                }}
                            >
                                <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Right Content Area: The Form */}
            <Activity mode={activeSubTab === profileTabs[0].value ? "visible" : "hidden"}>
                <StudentPersonalInfoForm student={student} />
            </Activity>
            <Activity mode={activeSubTab === profileTabs[1].value ? "visible" : "hidden"}>
                <StudentAcademicQualificationForm student={student} />
            </Activity>
            <Activity mode={activeSubTab === profileTabs[2].value ? "visible" : "hidden"}>
                <StudentWorkExperienceForm student={student} />
            </Activity>
        </div>
    )
}