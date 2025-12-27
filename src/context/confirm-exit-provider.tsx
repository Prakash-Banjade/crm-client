"use client";

import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { useRouter } from "next/navigation";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type TConfirmExitAlertContext = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setExitLocation: (exitLocation: string) => void;
};

const confirmExitAlertDefaultValue: TConfirmExitAlertContext = {
    isOpen: false,
    setIsOpen: ((isOpen: boolean) => isOpen) as TConfirmExitAlertContext["setIsOpen"],
    setExitLocation: ((exitLocation: string) => exitLocation) as TConfirmExitAlertContext["setExitLocation"],
};

const ConfirmExitAlertContext = createContext<TConfirmExitAlertContext>(confirmExitAlertDefaultValue);

export const ConfirmExitAlertProvider = ({ children }: PropsWithChildren) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [exitLocation, setExitLocation] = useState<string | null>(null);
    const router = useRouter();

    return (
        <ConfirmExitAlertContext.Provider value={{ isOpen, setIsOpen, setExitLocation }}>
            {children}
            <ResponsiveAlertDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Are you sure?"
                description="You have unsaved changes. Are you sure you want to leave?"
                action={() => {
                    if (!exitLocation) return;
                    setIsOpen(false);
                    setExitLocation(null);
                    router.push(exitLocation);
                }}
                actionLabel="Leave"
                cancelLabel="Stay"
            />
        </ConfirmExitAlertContext.Provider>
    );
};

export const useConfirmExitAlert = () => {
    const context = useContext(ConfirmExitAlertContext);

    if (!context)
        throw new Error("Please use this hook inside the context provider.");

    return context;
};
