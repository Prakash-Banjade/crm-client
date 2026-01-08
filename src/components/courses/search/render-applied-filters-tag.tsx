import { Badge } from '@/components/ui/badge';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const filtersToConsider = [
    "intakes",
    "grade12",
    "ug",
    "ielts",
    "pte",
    "country",
    "university",
    "level",
    "requirement",
    "min_fee",
    "max_fee",
    "min_duration",
    "max_duration"
]

export default function RenderAppliedFiltersTag() {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const [filters, setFilters] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const newFilters: { [key: string]: string } = {};
        filtersToConsider.forEach(key => {
            if (searchParams.get(key)) {
                newFilters[key] = searchParams.get(key) || "";
            }
        });
        setFilters(newFilters);
    }, [searchParams]);

    console.log(filters)

    return (
        <div className="flex gap-2">
            {Object.entries(filters).map(([filterKey, filterValue]) => (
                <RenderFilterTags key={filterKey} filterKey={filterKey} filterValue={filterValue} />
            ))}
        </div>
    )
}

function RenderFilterTags({ filterKey, filterValue }: { filterKey: string, filterValue: string }) {
    const { setSearchParams } = useCustomSearchParams();

    switch (filterKey) {
        case "intakes":
            return filterValue.split(",").map((intake) => (
                <Badge key={intake} variant="secondary" className="h-6 gap-1 px-2 font-normal">
                    {intake}
                    <X
                        role='button'
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => {
                            setSearchParams({ [filterKey]: filterValue.split(",").filter((item) => item !== intake).join(",") });
                        }}
                    />
                </Badge>
            ))
        default:
            return null
    }
}