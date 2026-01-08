'use client'

import { ResponsiveDialog } from '../ui/responsive-dialog'
import RegionalInchargeForm from './regional-incharge-form'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

const AddRegionalInchargeButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);

    return (
        <div>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Add Regional Incharge"
                confirmOnExit={isFormDirty}
            >
                <RegionalInchargeForm setIsOpen={setIsOpen} setIsFormDirty={setIsFormDirty} />
            </ResponsiveDialog>

            <Button
                onClick={() => setIsOpen(true)}
            >
                <Plus />
                Add Regional Incharge
            </Button>
        </div>
    )
}

export default AddRegionalInchargeButton
