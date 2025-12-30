'use client'
import React from 'react'
import { ResponsiveDialog } from '../ui/responsive-dialog'
import RegionalInchargeForm from './regional-incharge-form'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

const AddRegionalInchargeButton = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
            >
                <Plus />
                Add Regional Incharge
            </Button>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Add Regional Incharge"
            >
                <RegionalInchargeForm setIsOpen={setIsOpen} />
            </ResponsiveDialog></div>
    )
}

export default AddRegionalInchargeButton
