import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./alert-dialog";
import { ButtonProps, LoadingButton } from "./button";

export function ResponsiveAlertDialog({
    isOpen,
    setIsOpen,
    title,
    description,
    className,
    action,
    actionLabel = "Sure",
    cancelLabel = "Cancel",
    isLoading = false,
    loadingText = "Deleting...",
    loadingButtonProps
}: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    description?: string;
    className?: string;
    action: () => void;
    cancelLabel?: string;
    actionLabel?: string;
    isLoading?: boolean;
    loadingText?: string;
    loadingButtonProps?: ButtonProps
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className={className}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {
                        description && (
                            <AlertDialogDescription>{description}</AlertDialogDescription>
                        )
                    }
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <LoadingButton
                        isLoading={isLoading}
                        loadingText={loadingText}
                        type="button"
                        variant={"destructive"}
                        onClick={action}
                        {...loadingButtonProps}
                    >
                        {actionLabel}
                    </LoadingButton>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
