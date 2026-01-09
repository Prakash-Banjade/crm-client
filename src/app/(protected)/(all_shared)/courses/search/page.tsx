"use client";

import { Filter, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { InfiniteMultiSelect } from '@/components/forms/infinite-multi-select';
import { QueryKey } from '@/lib/react-query/queryKeys';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { usePathname, useRouter } from 'next/navigation';
import { ECourseRequirement, EProgramLevel } from '@/lib/schema/course.schema';
import { EMonth } from '@/lib/types';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { useGetCourses } from '@/lib/data-access/courses-data-hooks';
import RenderCoursesList from '@/components/courses/search/render-courses-list';
import SearchInput from '@/components/search-components/search-input';
import { Skeleton } from '@/components/ui/skeleton';
import { createQueryString } from '@/lib/utils';
import { StudentsWithQualificationSearch } from '@/components/courses/search/student-search';
import EligibilityForm from '@/components/courses/search/eligibility-form';


export default function CourseSearchPage() {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { data, isLoading } = useGetCourses({
        queryString: searchParams.toString()
    });

    // Helper to safely parse comma-separated search params
    const getParamValues = (key: string): string[] => {
        const value = searchParams.get(key);
        if (!value) return [];
        return value.split(",").filter(Boolean); // filter(Boolean) removes empty strings
    };

    const handleInputChange = useDebouncedCallback((key: string, value: string) => {
        setSearchParams({ [key]: value || null });
    }, 500);

    return (
        <div className="flex flex-col h-screen font-sans">

            {/* 1. Top Search Header */}
            <header className="border-b px-6 py-4 sticky top-0 z-30 shadow-sm">
                <div className="container mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-emerald-600" />
                            Course Finder
                        </h1>
                        <p className="text-xs text-muted-foreground">Searching across 8,356+ verified programs</p>
                    </div>

                    <div className="flex-1 max-w-3xl w-full flex gap-2">
                        <div className="relative flex-1">
                            <SearchInput
                                placeholder="Search by course, university, or category..."
                                className="border-none px-1"
                            />
                        </div>
                        <MultiSelect
                            onValuesChange={(values: string[]) => {
                                setSearchParams({
                                    intakes: values.join(","),
                                });
                            }}
                            values={searchParams.get("intakes")?.split(",") || []}
                        >
                            <MultiSelectTrigger className="border-none w-[300px]">
                                <MultiSelectValue
                                    overflowBehavior="cutoff"
                                    placeholder="Select intake month"
                                />
                            </MultiSelectTrigger>
                            <MultiSelectContent>
                                <MultiSelectGroup>
                                    {
                                        Object.entries(EMonth).map(([key, value]) => (
                                            <MultiSelectItem key={key} value={value}>{key}</MultiSelectItem>
                                        ))
                                    }
                                </MultiSelectGroup>
                            </MultiSelectContent>
                        </MultiSelect>
                        <Button className="bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-800 shadow-md">
                            Search
                        </Button>
                    </div>
                </div>
            </header>

            {/* 2. Main Content Area */}
            <div className="flex-1 flex overflow-hidden container w-full">

                {/* LEFT SIDEBAR: Filters */}
                <aside className="w-80 bg-sidebar border-r hidden lg:block">
                    <ScrollArea className='h-full px-6 space-y-6'>
                        <div className="flex items-center justify-between mt-4 mb-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Filters
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-muted-foreground hover:text-destructive"
                                onClick={() => router.push(pathname)}
                            >
                                Reset All
                            </Button>
                        </div>

                        {/* Student Eligibility Profile */}
                        <div className="bg-sidebar rounded-xl p-4 border">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Check Eligibility</h4>
                            <EligibilityForm />
                        </div>

                        {/* Filter Accordion */}
                        <Accordion type="multiple" defaultValue={["programLevels", "country", "fees"]} className="w-full">

                            <AccordionItem value="country" className="border-none">
                                <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">Destination</AccordionTrigger>
                                <AccordionContent className='p-1'>
                                    <div className="space-y-2">
                                        <InfiniteMultiSelect
                                            endpoint={`${QueryKey.COUNTRIES}/${QueryKey.OPTIONS}`}
                                            selected={JSON.parse(decodeURIComponent(searchParams.get("country") || "[]"))}
                                            onSelectionChange={(values) => {
                                                setSearchParams({
                                                    ["country"]: values.length > 0
                                                        ? encodeURIComponent(JSON.stringify(values.map(val => ({ label: val.label, value: val.value }))))
                                                        : undefined
                                                })
                                            }}
                                            placeholder='Select Country'
                                        />
                                        <InfiniteMultiSelect
                                            endpoint={`${QueryKey.UNIVERSITIES}/${QueryKey.OPTIONS}`}
                                            queryString={createQueryString({ withCourseCount: true })}
                                            selected={JSON.parse(decodeURIComponent(searchParams.get("university") || "[]"))}
                                            onSelectionChange={(values) => {
                                                setSearchParams({ ["university"]: values.length > 0 ? encodeURIComponent(JSON.stringify(values)) : undefined })
                                            }}
                                            placeholder='Select University'
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="programLevels" className="border-none">
                                <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">Program Level</AccordionTrigger>
                                <AccordionContent className='h-fit p-1'>
                                    <div className="space-y-3 pl-1">
                                        {
                                            Object.entries(EProgramLevel).map(([key, value]) => {
                                                const currentValues = getParamValues("programLevels");
                                                const isChecked = currentValues.includes(value);
                                                return (
                                                    <div key={key} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => {
                                                                const newValues = checked
                                                                    ? [...currentValues, value]
                                                                    : currentValues.filter((item) => item !== value);
                                                                setSearchParams({
                                                                    programLevels: newValues.length > 0 ? newValues.join(",") : undefined
                                                                });
                                                            }}
                                                            id={value}
                                                        />
                                                        <Label
                                                            htmlFor={value}
                                                            title={value.replaceAll("_", " ")}
                                                            className="text-sm capitalize line-clamp-1 font-normal text-slate-600 dark:text-slate-200 cursor-pointer"
                                                        >
                                                            {value.replaceAll("_", " ")}
                                                        </Label>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="requirements" className="border-none">
                                <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">Requirements</AccordionTrigger>
                                <AccordionContent className='h-fit p-1'>
                                    <div className="space-y-3 pl-1">
                                        {
                                            Object.entries(ECourseRequirement).map(([key, value]) => {
                                                const currentValues = getParamValues("requirements");
                                                const isChecked = currentValues.includes(value);
                                                return (
                                                    <div key={key} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => {
                                                                const newValues = checked
                                                                    ? [...currentValues, value]
                                                                    : currentValues.filter((item) => item !== value);
                                                                setSearchParams({
                                                                    requirements: newValues.length > 0 ? newValues.join(",") : undefined
                                                                });
                                                            }}
                                                            id={value}
                                                        />
                                                        <Label
                                                            htmlFor={value}
                                                            title={key.replaceAll("_", " ")}
                                                            className="text-sm capitalize line-clamp-1 font-normal text-slate-600 dark:text-slate-200 cursor-pointer"
                                                        >
                                                            {key.replaceAll("_", " ")}
                                                        </Label>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="fees" className="border-none">
                                <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">Course Fees</AccordionTrigger>
                                <AccordionContent className='h-fit p-1'>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="number"
                                            min={0}
                                            step={1}
                                            defaultValue={searchParams.get('min_fee') || ""}
                                            placeholder="Min"
                                            className="h-8 text-xs"
                                            onChange={(e) => handleInputChange('min_fee', e.target.value)}
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={1}
                                            defaultValue={searchParams.get('max_fee') || ""}
                                            placeholder="Max"
                                            className="h-8 text-xs"
                                            onChange={(e) => handleInputChange('max_fee', e.target.value)}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="duration" className="border-none">
                                <AccordionTrigger className="hover:no-underline py-3 text-sm font-medium">Course Duration</AccordionTrigger>
                                <AccordionContent className='h-fit p-1'>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="number"
                                            min={0}
                                            step={1}
                                            placeholder="Min (month)"
                                            defaultValue={searchParams.get('min_duration') || ""}
                                            onChange={(e) => handleInputChange('min_duration', e.target.value)}
                                            className="h-8 text-xs" />
                                        <span className="text-muted-foreground">-</span>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={1}
                                            placeholder="Max (month)"
                                            defaultValue={searchParams.get('max_duration') || ""}
                                            onChange={(e) => handleInputChange('max_duration', e.target.value)}
                                            className="h-8 text-xs" />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className='h-40' />
                    </ScrollArea>
                </aside>

                {/* RIGHT CONTENT: Results */}
                <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-accent/20">

                    {/* Results Toolbar */}
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-sidebar border-b">
                        <div className="flex items-center gap-3">
                            {
                                isLoading ? (
                                    <Skeleton className="w-32 h-4" />
                                ) : (
                                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        {data?.meta.itemCount?.toLocaleString()} Programs Found
                                    </h2>
                                )
                            }
                        </div>

                        {
                            isLoading ? (
                                <Skeleton className="w-32 h-4" />
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Page: {data?.meta.page} of {data?.meta.pageCount}
                                </div>
                            )
                        }
                    </div>

                    {/* Course List Area */}
                    <RenderCoursesList data={data} isLoading={isLoading} />

                </main>
            </div>
        </div>
    );
}