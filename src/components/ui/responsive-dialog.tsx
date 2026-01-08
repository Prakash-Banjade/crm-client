import * as React from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ResponsiveAlertDialog } from './responsive-alert-dialog';

export function ResponsiveDialog({
    children,
    isOpen,
    setIsOpen,
    title,
    description,
    className,
    confirmOnExit
}: {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    description?: string;
    className?: string;
    confirmOnExit?: boolean;
}) {
    const isMobile = useIsMobile();
    const [isAlertOpen, setIsAlertOpen] = React.useState(false);

    const onOpenChange = (open: boolean) => {
        if (confirmOnExit) {
            setIsAlertOpen(true);
        } else {
            setIsOpen(open);
        }
    }

    const dialog = () => {
        return !isMobile ? (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                {/* TODO: FIX THIS OVERFLOW STYLE USING SCROLLAREA */}
                <DialogContent className={cn('max-h-[97vh] overflow-y-auto', className)}>
                    <DialogHeader>
                        <DialogTitle className='text-lg'>{title}</DialogTitle>
                        {description && (
                            <DialogDescription>{description}</DialogDescription>
                        )}
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        ) : (
            <Drawer open={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>{title}</DrawerTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DrawerHeader>
                    <section className='p-4'>
                        {children}
                    </section>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <>
            {dialog()}
            {
                confirmOnExit && (
                    <ResponsiveAlertDialog
                        isOpen={isAlertOpen}
                        setIsOpen={setIsAlertOpen}
                        title="You have unsaved changes."
                        description="Are you sure you want to leave?"
                        action={() => {
                            setIsAlertOpen(false);
                            setIsOpen(false);
                        }}
                        actionLabel="Leave, any way"
                        cancelLabel="Stay, here"
                    />
                )
            }
        </>
    );
}