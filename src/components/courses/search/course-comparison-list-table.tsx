import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ECourseRequirement, EProgramLevel } from "@/lib/schema/course.schema"
import { TCourse } from "@/lib/types/course.types"
import { getKeyByValue, sortMonths } from "@/lib/utils"
import { Link } from "lucide-react"

type Props = {
    compareCourseList: TCourse[]
}

export default function CourseComaprisonTable({ compareCourseList }: Props) {
    return (
        <Table className="mt-5">
            <TableCaption>Course comaprison</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold">Program Name</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableHead key={i} className="py-4">{course.name}</TableHead>
                        ))
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableHead className="font-bold">University</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">{course.university?.name}</TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Category</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">{course.category?.name}</TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Course Url</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell className="wrap-break-word max-w-[150px] py-4" key={i}>
                                <a href={course.courseUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center">
                                    <Link className="mr-2 size-4" /> Click to view
                                </a>
                            </TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Location</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">{course.university?.state}, {course.university?.country?.name}</TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Program Level</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">
                                {getKeyByValue(EProgramLevel, course.programLevel)}
                            </TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Duration</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">{course.duration} months</TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Intakes</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4 capitalize">
                                {sortMonths(course.intakes).map(val => val).join(', ')}
                            </TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Requirements</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">
                                <ul className="flex flex-col gap-1 ml-4">
                                    {course.requirements.map(val => (
                                        <li key={val} className="list-disc">
                                            {getKeyByValue(ECourseRequirement, val)}
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Course Fee</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">{course.currency?.toUpperCase()} {course.fee?.toLocaleString()} <span className="text-xs text-muted-foreground">/yr</span></TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Application Fee</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">{course.currency?.toUpperCase()} {course.applicationFee?.toLocaleString()}</TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">IELTS</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">
                                <div className="flex flex-col gap-1">
                                    <span>Min: {course.ieltsMinScore}</span>
                                    <span>Overall: {course.ieltsOverall}</span>
                                </div>
                            </TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">PTE</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">
                                <div className="flex flex-col gap-1">
                                    <span>Min: {course.pteMinScore}</span>
                                    <span>Overall: {course.pteOverall}</span>
                                </div>
                            </TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Min Work Experience</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">
                                {course.minWorkExperience} Year(s)
                            </TableCell>
                        ))
                    }
                </TableRow>
                <TableRow>
                    <TableHead className="font-bold">Scholarship</TableHead>
                    {
                        compareCourseList.map((course, i) => (
                            <TableCell key={i} className="py-4">
                                {course.hasScholarship ? "Yes" : "No"}
                            </TableCell>
                        ))
                    }
                </TableRow>
            </TableBody>
        </Table>

    )
}