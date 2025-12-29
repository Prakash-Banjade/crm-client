"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function useCustomSearchParams() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair or object
    const createQueryString = useCallback(
        (paramsObj: Record<string, string | number | null | undefined>) => {
            const params = new URLSearchParams(searchParams.toString())

            Object.entries(paramsObj).forEach(([name, value]) => {
                if (value === null || value === undefined || value === "") {
                    params.delete(name)
                } else {
                    params.set(name, String(value))
                }
            })

            return params.toString()
        },
        [searchParams]
    )

    function setSearchParams(
        nameOrParams: string | Record<string, string | number | null | undefined>,
        value?: string | number | null
    ) {
        let queryString: string;

        if (typeof nameOrParams === 'string') {
            queryString = createQueryString({ [nameOrParams]: value });
        } else {
            queryString = createQueryString(nameOrParams);
        }

        router.push(
            queryString.length > 0
                ? `${pathname}?${queryString}`
                : pathname
        );
    }

    return { searchParams, setSearchParams }
}