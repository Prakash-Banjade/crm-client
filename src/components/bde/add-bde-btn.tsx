'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ResponsiveDialog } from '../ui/responsive-dialog';
import { Button } from '../ui/button';
import BdeForm from './bde-form';

export default function AddBdeButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);

    return (
        <div>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Add BDE"
                confirmOnExit={isFormDirty}
                className='sm:min-w-2xl'
            >
                <BdeForm setIsOpen={setIsOpen} setIsFormDirty={setIsFormDirty} />
            </ResponsiveDialog>

            <Button
                onClick={() => setIsOpen(true)}
            >
                <Plus />
                Add BDE
            </Button>
        </div>
    )
}