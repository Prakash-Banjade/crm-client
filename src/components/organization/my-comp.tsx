import React from 'react'
import { useFormContext } from 'react-hook-form'

type Props = {}

export default function MyComponent({ }: Props) {
    const form = useFormContext();

    console.log(form)

    return (
        <div>MyComponent</div>
    )
}