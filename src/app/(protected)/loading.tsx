export default function LoadingPage() {
    return (
        <div className="p-4 mt-[10%] space-y-5">
            <h2 className="text-3xl font-bold text-primary text-center">Abhyam CRM</h2>
            <p className="text-center">Validating user. Please wait...</p>
            <div className="flex items-center justify-center text-center">
                <div className="h-1 rounded-full w-[200px] bg-secondary relative overflow-hidden">
                    <div className="absolute loader_indicator h-full rounded-full w-[40%] bg-primary"></div>
                </div>
            </div>
        </div>
    )
}