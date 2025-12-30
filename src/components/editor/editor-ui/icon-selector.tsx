import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export function IconSelector({ onSelect }: { onSelect: (name: string) => void }) {
    const [search, setSearch] = useState("");

    const icons = Object.keys(LucideIcons)
        .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 60); // limit for performance

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" title="Icon"><LucideIcons.Puzzle /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 max-h-80 overflow-auto">
                <Input
                    placeholder="Search icons..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2"
                />
                <div className="grid grid-cols-6 gap-2">
                    {icons.map((name) => {
                        const Icon = (LucideIcons as any)[name];
                        return (
                            <button
                                key={name}
                                className="p-2 hover:bg-muted rounded"
                                onClick={() => onSelect(name)}
                            >
                                <Icon size={18} />
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}
