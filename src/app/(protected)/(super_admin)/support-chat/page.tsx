import React from 'react'

type Props = {}

export default function Page({ }: Props) {
    return (
        <div className='h-full grid place-items-center'>
            <p className='text-muted-foreground'>Select a chat to view messages</p>
        </div>
    )
}