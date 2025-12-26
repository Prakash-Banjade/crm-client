import { Command, Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
    SIDEBAR_SEARCH_KEYBOARD_SHORTCUT,
    SidebarGroup,
    SidebarGroupContent,
    SidebarInput,
    useSidebar,
} from "@/components/ui/sidebar"
import { useEffect, useRef, useState } from "react";

export function SidebarSearchForm() {
    const { search, setSearch } = useSidebar();
    const [inputVal, setInputVal] = useState(search);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(inputVal?.trim());
        }, 500);

        return () => clearTimeout(handler);
    }, [inputVal]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputVal(event.target.value);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === SIDEBAR_SEARCH_KEYBOARD_SHORTCUT &&
                (event.metaKey || event.ctrlKey)
            ) {
                event.preventDefault()
                inputRef.current?.focus()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [inputRef]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setSearch('');
            setInputVal('');
            inputRef.current?.blur()
        }
    }

    return (
        <SidebarGroup className="p-0">
            <SidebarGroupContent className="relative">
                <Label htmlFor="search" className="sr-only">
                    Search
                </Label>
                <SidebarInput
                    ref={inputRef}
                    value={inputVal}
                    onChange={handleInputChange}
                    id="search"
                    placeholder="Search menu..."
                    className="peer pl-8"
                    onKeyDown={handleKeyDown}
                />
                <div className="peer-focus-visible:hidden pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none opacity-50 flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-secondary border">
                    <Command size={14} />
                    <span className="text-sm capitalize">{SIDEBAR_SEARCH_KEYBOARD_SHORTCUT}</span>
                </div>
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

