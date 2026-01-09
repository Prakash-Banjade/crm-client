import { useEffect, useMemo } from 'react'
import { StudentsWithQualificationSearch } from './student-search'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import { EGradingSystem, ELevelOfEducation } from '@/lib/types/student.types'

export default function EligibilityForm() {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const formDefaultValues = useMemo(() => {
        return {
            grade12: searchParams.get("grade12") || "",
            ug: searchParams.get("ug") || "",
            ielts: searchParams.get("ielts") || "",
            pte: searchParams.get("pte") || "",
        }
    }, [searchParams])

    const form = useForm({
        defaultValues: formDefaultValues
    });

    // useEffect(() => {
    //     form.reset(formDefaultValues);
    // }, [searchParams])

    const onSubmit = (data: any) => {
        setSearchParams(data);
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div className='col-span-2'>
                    <StudentsWithQualificationSearch
                        onSelect={val => {
                            const grade12 = val.levelOfStudies[ELevelOfEducation.Grade12]
                            const grade12Percentage = grade12 && grade12.gradingSystem === EGradingSystem.Percentage ? grade12.score : ""
                            const ug = val.levelOfStudies[ELevelOfEducation.Undergraduate]
                            const ugPercentage = ug && ug.gradingSystem === EGradingSystem.Percentage ? ug.score : ""

                            form.setValue("grade12", grade12Percentage.toString())
                            form.setValue("ug", ugPercentage.toString())
                        }}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px]">Grade 12 %</Label>
                    <Input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        className="h-8"
                        placeholder="e.g. 75"
                        {...form.register("grade12")}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px]">UG Score %</Label>
                    <Input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        className="h-8"
                        placeholder="e.g. 60"
                        {...form.register("ug")}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px]">IELTS Overall</Label>
                    <Input
                        type="number"
                        min={0}
                        max={9}
                        step={0.5}
                        className="h-8"
                        placeholder="e.g. 7"
                        {...form.register("ielts")}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px]">PTE Overall</Label>
                    <Input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        className="h-8"
                        placeholder="e.g. 42"
                        {...form.register("pte")}
                    />
                </div>
            </div>
            <Button size="sm" variant="secondary" className="w-full text-xs h-8">
                Apply Eligibility
            </Button>
        </form>
    )
}