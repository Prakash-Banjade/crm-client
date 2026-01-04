import ContainerLayout from "@/components/container-layout"
import AddLearningResourcesButton from "@/components/learning-resources/add-learning-resource-button"
import LearningResourcesDataTable from "@/components/learning-resources/learning-resources-data-table"

const LearningResources = () => {
    return (
        <ContainerLayout
            title="Learning Resources"
            description="Manage learning resources information"
            action={
                <AddLearningResourcesButton />
            }
        >
            <LearningResourcesDataTable />
        </ContainerLayout>
    )
}

export default LearningResources