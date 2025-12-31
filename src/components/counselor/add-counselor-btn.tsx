'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ResponsiveDialog } from '../ui/responsive-dialog';
import { Button } from '../ui/button';
import CounselorForm from './counselor-form';

export default function AddCounselorButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);

    return (
        <div>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Add Counselor"
                confirmOnExit={isFormDirty}
                className='sm:min-w-4xl'
            >
                <CounselorForm setIsOpen={setIsOpen} setIsFormDirty={setIsFormDirty} />
            </ResponsiveDialog>

            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
            >
                <Plus />
                Add Counselor
            </Button>
        </div>
    )
}