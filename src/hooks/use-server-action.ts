import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ActionResponse } from "@/lib/types";

type ServerAction<TInput> = (data: TInput) => Promise<ActionResponse>;

interface UseServerActionOptions<TInput> {
    // The actual server action function reference
    action: ServerAction<TInput>;

    // Optional: Query keys to invalidate on success
    invalidateTags?: string[] | string[][];

    // Optional: Toggle toasts
    toastOnSuccess?: boolean;
    toastOnError?: boolean;

    // Callbacks
    onSuccess?: (data: Extract<ActionResponse, { success: true }>) => void;
    onError?: (error: unknown) => void;
}

export function useServerAction<TInput>({
    action,
    invalidateTags = [],
    toastOnSuccess = true,
    toastOnError = true,
    onSuccess,
    onError,
}: UseServerActionOptions<TInput>) {
    const [isPending, startTransition] = useTransition();
    const queryClient = useQueryClient();

    const mutate = (data: TInput) => {
        startTransition(async () => {
            try {
                // We get an OBJECT back, not an error thrown
                const result = await action(data);

                if (result.success) {
                    if (toastOnSuccess) {
                        toast.success(result.data?.message || "Success");
                    }

                    if (invalidateTags?.length) {
                        if (Array.isArray(invalidateTags[0])) {
                            await Promise.all(invalidateTags.map(tag => queryClient.invalidateQueries({ queryKey: typeof tag === "string" ? [tag] : tag })));
                        } else {
                            await queryClient.invalidateQueries({ queryKey: invalidateTags });
                        }
                    }

                    onSuccess?.(result);
                } else {
                    if (toastOnError) {
                        toast.error(result.error.error, { description: result.error.message });
                    }
                    onError?.(result);
                }

            } catch (e) {
                if (toastOnError) {
                    const msg = e instanceof Error ? e.message : "Something went wrong";
                    toast.error(msg);
                }

                onError?.(e);
            }
        });
    };

    return {
        mutate,
        isPending,
    };
}