import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { EProgramLevel } from '@/lib/schema/course.schema';
import { TCoursesResponse } from '@/lib/types/course.types';
import { getKeyByValue } from '@/lib/utils';
import { ArrowRight, Calendar, Clock, GraduationCap, MapPin } from 'lucide-react';
import Link from 'next/link';

type Props = {
    data: TCoursesResponse | undefined;
    isLoading: boolean;
}

export default function RenderCoursesList({ data, isLoading }: Props) {
    if (isLoading) return <div>Loading...</div>;

    if (!data?.data.length) return <div className="p-6 h-full grid place-items-center">No course found</div>;

    return (
        <ScrollArea
            className="flex-1"
            style={{
                height: 'calc(100vh - 200px)'
            }}
        >
            <div className='p-6'>
                <div className="space-y-4">

                    {data?.data.map((course) => (
                        <Card key={course.id} className="p-6 group hover:shadow-md transition-all grid grid-cols-2">

                            {/* Header / Main Info */}
                            <div className="flex-1 border-r pr-6">
                                <div className="mb-2 text-muted-foreground w-fit p-1.5 bg-secondary">
                                    <GraduationCap className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-emerald-700 transition-colors">
                                    {course.name}
                                </h3>
                                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-3">
                                    {course.university.name}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" /> {course.university.state}, {course.university.country.name}
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Badge variant={"warning"} className="rounded-none">
                                        {course.category.name}
                                    </Badge>
                                    <Badge variant="info" className="rounded-none">
                                        {getKeyByValue(EProgramLevel, course.programLevel)?.replaceAll("_", " ")}
                                    </Badge>
                                    <Badge variant={course.hasScholarship ? "success" : "destructive"}>
                                        {course.hasScholarship ? "Scholarship" : "No Scholarship"}
                                    </Badge>
                                </div>
                            </div>

                            {/* Details / Metrics */}
                            <div className="flex justify-between gap-4">

                                <section className='flex flex-col justify-between gap-6'>
                                    <section className='flex gap-6'>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Course Fee</p>
                                            <p className="font-bold">{course.currency} {course.fee.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/yr</span></p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Application Fee</p>
                                            <p className="font-bold">{course.currency} {course.applicationFee.toLocaleString()}</p>
                                        </div>

                                    </section>

                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
                                        <p className="font-medium text-muted-foreground flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-muted-foreground" /> {course.duration} months
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Intakes</p>
                                        <div className="font-medium text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                                            <div className="flex flex-wrap gap-1 capitalize">
                                                {course.intakes.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Action Area */}
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center space-x-2 mb-auto">
                                        <Label htmlFor={`compare-${course.id}`} className="text-xs text-muted-foreground">Compare</Label>
                                        <Switch
                                            id={`compare-${course.id}`}
                                        />
                                    </div>
                                    <Button size="sm" className="w-full md:w-auto gap-2" asChild>
                                        <Link href={`/courses/${course.id}`} target='_blank' rel="noopener noreferrer">
                                            Details <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                        </Card>
                    ))}

                </div>

                {/* Pagination */}
                {
                    data?.meta && (
                        <DataTablePagination meta={data.meta} />
                    )
                }
            </div>

        </ScrollArea>
    )
}