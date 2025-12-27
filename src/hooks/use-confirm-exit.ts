"use client";

import { useEffect } from "react";

export function useConfirmExit(isDirty: boolean, message = "You have unsaved changes. Are you sure you want to leave?") {
    useEffect(() => {
        // 1. Handle Hard Navigation (Refresh/Close Tab)
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = message; // Standard for most browsers
                return message;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty, message]);

    // Note: For Soft Navigation (Next.js Links), 
    // stable support for preventing navigation is currently limited 
    // in the App Router without monkey-patching the router.
}