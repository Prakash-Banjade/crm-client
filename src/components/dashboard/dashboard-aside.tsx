import { Card, CardContent } from "@/components/ui/card";
import { ProfileAvatar } from "../ui/avatar";
import { Separator } from "../ui/separator";
import DashboardChatBox from "./chat-box";
import { useGetRegionalIncharges } from "@/lib/data-access/regional-incharge-data-hooks";
import { getObjectUrl, cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { TRegionalIncharge } from "@/lib/types/regional-incharge.types";

export default function DashboardAside() {
    const { data, isLoading } = useGetRegionalIncharges({});

    return (
        <aside className="w-80 border-l bg-sidebar p-6 hidden xl:flex flex-col gap-8">
            <DashboardRegionalIncharge
                isLoading={isLoading}
                regionalIncharges={data?.data || []}
            />

            <DashboardChatBox />
        </aside>
    )
}

function DashboardRegionalIncharge({
    isLoading,
    regionalIncharges: ri
}: {
    regionalIncharges: TRegionalIncharge[]
    isLoading: boolean
}) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-rotate carousel every 5 seconds (pause on hover)
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setSelectedIndex((prev) => (prev + 1) % ri.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [ri.length, isPaused]);

    if (isLoading) return <div> Loading...</div>

    const selectedPerson = ri[selectedIndex];

    return (
        <>
            <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Regional In-Charge</h2>
                <Card
                    className="border shadow-none overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <CardContent className="flex flex-col items-center text-center">
                        <div className="mb-4 transition-all duration-500 ease-in-out">
                            <ProfileAvatar
                                key={selectedPerson.id}
                                name={selectedPerson.name}
                                src={selectedPerson.profileImage ? getObjectUrl(selectedPerson.profileImage) : ""}
                                className="size-28 animate-in fade-in zoom-in-95 duration-500"
                            />
                        </div>
                        <h3 className="font-bold text-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" key={`name-${selectedPerson.id}`}>
                            {selectedPerson.name}
                        </h3>
                        <p className="text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-2" key={`role-${selectedPerson.id}`}>
                            {selectedPerson.role}
                        </p>

                        <div className="w-full mt-6 space-y-3">
                            <div className="flex justify-between text-xs transition-all duration-300 animate-in fade-in" key={`phone-${selectedPerson.id}`}>
                                <span className="text-muted-foreground">Phone</span>
                                <span className="font-bold">{selectedPerson.phone}</span>
                            </div>
                            <div className="flex justify-between text-xs transition-all duration-300 animate-in fade-in" key={`email-${selectedPerson.id}`}>
                                <span className="text-muted-foreground">E-mail</span>
                                <span className="font-bold wrap-break-word max-w-[180px]">{selectedPerson.email}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            <div className="flex-1">
                <div className="space-y-3">
                    {ri.map((lead, i) => (
                        <div
                            key={lead.id}
                            onClick={() => setSelectedIndex(i)}
                            className={cn(
                                "flex gap-4 items-center p-2 rounded-lg cursor-pointer transition-all duration-300",
                                selectedIndex === i
                                    ? "bg-primary/10 ring-2 ring-primary/20 scale-105"
                                    : "hover:bg-accent/50"
                            )}
                        >
                            <ProfileAvatar
                                name={lead.name}
                                src={lead.profileImage ? getObjectUrl(lead.profileImage) : ""}
                                className={cn(
                                    "transition-all duration-300",
                                    selectedIndex === i && "ring-2 ring-primary"
                                )}
                            />
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-bold truncate transition-colors duration-300",
                                    selectedIndex === i && "text-primary"
                                )}>
                                    {lead.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">{lead.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}