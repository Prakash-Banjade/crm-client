import { TableHead, TableRow } from '../ui/table'

type Props = {
    headings: string[];
}

export default function TableHeadings({ headings }: Props) {
    return (
        <TableRow>
            {headings.map((heading, index) => (
                <TableHead key={index}>{heading}</TableHead>
            ))}
        </TableRow>
    )
}