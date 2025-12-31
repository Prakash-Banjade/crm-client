'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { ResponsiveDialog } from '../ui/responsive-dialog'
import CountriesForm from './countries-form'

const AddCountriesButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);
    return (
        <div>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
            >
                <Plus />
                Add Countries
            </Button>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Add Countries" 
                confirmOnExit={isFormDirty}  
                
            >
                <CountriesForm setIsOpen={setIsOpen}  setIsFormDirty={setIsFormDirty}  />
            </ResponsiveDialog>
        </div>
    )
}

export default AddCountriesButton