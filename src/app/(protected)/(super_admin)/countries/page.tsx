import ContainerLayout from "@/components/container-layout"
import AddCountriesButton from "@/components/countries/add-countries"
import CountriesDataTable from "@/components/countries/countries-data-table"

const Countries = () => {
    return (
        <ContainerLayout
            title="Countries"
            description="Manage countries information"
            action={
                <AddCountriesButton />
            }
        >
            <CountriesDataTable />

        </ContainerLayout>
    )
}

export default Countries