import ContainerLayout from '@/components/container-layout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import BookingDataTable from '@/components/booking/booking-data-table'

const Bookings = () => {
    return (
        <ContainerLayout
            title="IELTS/PTE Bookings"
            description="Manage bookings"
            action={
                <Button asChild>
                    <Link href="bookings/new">
                        <Plus />
                        Add Booking
                    </Link>
                </Button>
            }
        >
            <BookingDataTable />
        </ContainerLayout>
    )
}

export default Bookings