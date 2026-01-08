'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ResponsiveDialog } from '../ui/responsive-dialog';
import { Button } from '../ui/button';
import UniversityForm from './university-form';

export default function AddUniversityButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);

    return (
        <div>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Add University"
                confirmOnExit={isFormDirty}
                className='min-w-max'
            >
                <UniversityForm setIsOpen={setIsOpen} setIsFormDirty={setIsFormDirty} />
            </ResponsiveDialog>

            <Button
                onClick={() => setIsOpen(true)}
            >
                <Plus />
                Add University
            </Button>
        </div>
    )
}