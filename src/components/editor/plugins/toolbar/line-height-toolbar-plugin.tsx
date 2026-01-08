'use client';

import { useState } from 'react';
import type { LexicalEditor } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { applyLineHeight } from '../line-height-lugin';
import { Menu, MoveVertical } from 'lucide-react';

const LINE_HEIGHTS = ['0.25', '0.5', '1', '1.15', '1.5', '2'];

export function LineHeightToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [value, setValue] = useState<string>('1');

    const onSelect = (newVal: string) => {
        setValue(newVal);
        applyLineHeight(editor as LexicalEditor, newVal);
    };

    return (
        <Select value={value} onValueChange={onSelect}>
            <SelectTrigger className="!h-8 gap-0">
                <div className='flex items-center'>
                    <MoveVertical className='size-3' />
                    <Menu className='-translate-x-1 size-4' />
                </div>
                {/* <SelectValue placeholder="Line height" /> */}
            </SelectTrigger>
            <SelectContent>
                {LINE_HEIGHTS.map((lh) => (
                    <SelectItem key={lh} value={lh}>
                        {lh}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
