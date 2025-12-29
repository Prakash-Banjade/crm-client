"use client";

import { useEffect, useState } from "react";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { Label } from "../ui/label";
import { Search } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"

type Props = {
    label?: string;
    placeholder?: string;
    searchKey?: string;
}

export const SEARCH_KEY = "q" as const;

export default function SearchInput({ label, placeholder, searchKey = SEARCH_KEY }: Props) {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>(searchParams.get(searchKey) || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchParams(searchKey, searchTerm?.trim());
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return !!label ? (
        <div className="space-y-2">
            <Label htmlFor="search">{label ?? "Search"}</Label>
            <InputGroup>
                <InputGroupInput
                    type="search"
                    placeholder={placeholder ?? "Search..."}
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
            </InputGroup>
        </div>
    ) : (
        <InputGroup>
            <InputGroupInput
                type="search"
                placeholder={placeholder ?? "Search..."}
                value={searchTerm}
                onChange={handleInputChange}
            />
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
        </InputGroup>
    )
}