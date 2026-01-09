import { Button } from "@/components/ui/button"
import { ResponsiveDialog } from "@/components/ui/responsive-dialog"
import { Separator } from "@/components/ui/separator"
import { TCourse } from "@/lib/types/course.types"
import { cn } from "@/lib/utils"
import { useState } from "react"
import CourseComaprisonTable from "./course-comparison-list-table"

export default function CourseCompareBtn({
    compareCourseList,
    setCompareList
}: {
    compareCourseList: TCourse[],
    setCompareList: (list: TCourse[]) => void
}) {
    const [open, setOpen] = useState(false)

    return (
        <section className={cn(
            "fixed transition-all duration-300 left-1/2 -translate-x-1/2 -translate-y-1/2",
            compareCourseList.length > 1 ? "top-[95%]" : "top-[150%]"
        )}>
            <div className="bg-foreground text-background p-4 rounded-full shadow-2xl flex items-center gap-6 z-50 px-8 animate-in slide-in-from-bottom-10">
                <div className="flex items-center gap-3">
                    <span className="bg-emerald-500 dark:bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">{compareCourseList.length}</span>
                    <span className="font-medium text-sm">Courses selected</span>
                </div>
                <Separator orientation="vertical" className="bg-background/30" />
                <div className="flex gap-3">
                    <Button size="sm" variant="ghost" onClick={() => setCompareList([])}>Clear</Button>
                    <Button size="sm" className="bg-background text-foreground hover:bg-background/90" onClick={() => setOpen(true)}>Compare Now</Button>
                </div>

                <ResponsiveDialog
                    isOpen={open}
                    setIsOpen={setOpen}
                    title="Compare Courses"
                    className="min-h-[95vh] sm:min-w-[80vw]"
                >
                    <CourseComaprisonTable compareCourseList={compareCourseList} />
                </ResponsiveDialog>

            </div>
        </section>
    )
}