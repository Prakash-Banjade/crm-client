import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { getObjectUrl } from "@/lib/utils";
import { TSingleLearningResource } from "@/lib/types/learning-resources.types";
import AddLearningResourcesButton from "./add-learning-resource-button";
import { useAuth } from "@/context/auth-provider";
import { Role } from "@/lib/types";

type Props = {
    resource: TSingleLearningResource;
}

export const LearningResourceSinglePage = ({ resource }: Props) => {
    const { user } = useAuth();
    const superAdminBackLink = resource.parent?.id ? `/${Role.SUPER_ADMIN}/learning-resources/${resource.parent.id}` : `/${Role.SUPER_ADMIN}/learning-resources`;

    return (
        <div className="container flex flex-col gap-6 p-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={user?.role === Role.SUPER_ADMIN ? superAdminBackLink : "/learning-resources"}>
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h3 className="text-2xl font-bold tracking-tight"> {resource.title}</h3>
                {
                    user?.role === Role.SUPER_ADMIN && (
                        <div className="ml-auto">
                            <AddLearningResourcesButton />
                        </div>
                    )
                }
            </div>

            <Card className="w-full">
                <CardHeader>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center text-muted-foreground gap-2 text-sm pt-2">
                            <Calendar className="h-4 w-4" />
                            <span>Created on {resource.createdAt ? format(new Date(resource.createdAt), "PPP") : "N/A"}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-8">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg border-b pb-2">Description</h3>
                        <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                            {resource.description || "No description provided."}
                        </div>
                    </div>

                    {!resource.parent ? (
                        resource.children && resource.children.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">
                                    Available Modules
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {resource.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={user?.role === Role.SUPER_ADMIN ? `/super_admin/learning-resources/${resource.id}/${child.id}` : `/learning-resources/${resource.id}/${child.id}`}
                                            className="block group decoration-0"
                                        >
                                            <Card className="h-full hover:shadow-md hover:border-primary/50 transition-all duration-300">
                                                <CardContent className="p-4 flex items-center gap-4">
                                                    <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                                                        <FileText className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="overflow-hidden flex flex-col gap-1">
                                                        <p className="font-medium truncate group-hover:text-primary transition-colors">
                                                            {child.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Click to view details
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )
                    ) : (
                        resource.files && resource.files.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">
                                    Attached Resources
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {resource.files.map((file, index) => (
                                        <Link
                                            key={index}
                                            href={getObjectUrl(file)}
                                            target="_blank"
                                            className="block group decoration-0"
                                        >
                                            <Card className="h-full hover:shadow-md hover:border-primary/50 transition-all duration-300">
                                                <CardContent className="p-4 flex items-center gap-4">
                                                    <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                                                        <FileText className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="overflow-hidden flex flex-col gap-1">
                                                        <p className="font-medium truncate group-hover:text-primary transition-colors">
                                                            {file.split("/").pop() || `File ${index + 1}`}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Click to view document
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )
                    )}



                </CardContent>
            </Card>
        </div>
    )
}