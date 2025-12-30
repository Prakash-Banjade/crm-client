import ContainerLayout from '@/components/container-layout'
import AddRegionalInchargeButton from '@/components/regional-incharge/add-regional-incharge'
import RegionalInchargeDataTable from '@/components/regional-incharge/regional-incharge-data-table'


const RegionalIncharge = () => {
  return (

    <ContainerLayout
      title="Regional Incharge"
      description="Manage regional Incharge"
      action={
        <AddRegionalInchargeButton />
      }
    >
      <RegionalInchargeDataTable />
    </ContainerLayout>
  )
}




export default RegionalIncharge