import { useCallback, useEffect, useRef } from "react";

type AnyFn = (...args: any[]) => void;

export function useDebouncedCallback<T extends AnyFn>(
    callback: T,
    delay: number
): T {
    const callbackRef = useRef<T>(callback);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const debounced = useCallback(
        ((...args: Parameters<T>) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        }) as T,
        [delay]
    );

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return debounced;
}
