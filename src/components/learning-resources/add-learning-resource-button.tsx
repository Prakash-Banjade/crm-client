'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { ResponsiveDialog } from '../ui/responsive-dialog'
import LearningResourcesForm from './learning-resource-form'
import { useParams } from 'next/navigation'

const AddLearningResourcesButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const { id, subId } = useParams();

    if (subId) return null;

    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
            >
                <Plus />
                {id ? "Add Sub Resource" : "Add Resources"}
            </Button>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title={id ? "Add Sub Resource" : "Add Resources"}
                confirmOnExit={isFormDirty}

            >
                <LearningResourcesForm setIsOpen={setIsOpen} setIsFormDirty={setIsFormDirty} />
            </ResponsiveDialog>
        </div>
    )
}

export default AddLearningResourcesButton