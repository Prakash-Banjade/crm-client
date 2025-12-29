import OrganizationUsersDataTable from "@/components/organization/users/organization-users-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { serverFetch } from "@/lib/server-fetch";
import { TSingleOrganization } from "@/lib/types/organization.type";
import { formatDate } from "date-fns";
import { AlertCircle, Building2, Calendar, CreditCard, Globe, Landmark, Mail, MapPin, Palette, Phone, User } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{
        id: string;
    }>
}

export default async function SingleOrganizationPage({ params }: Props) {
    const { id } = await params;

    const res = await serverFetch(`/organizations/${id}`, {
        next: { revalidate: 60 }
    });

    if (!res.ok) return notFound();

    const organization: TSingleOrganization = await res.json();

    return (
        <div className="@container container space-y-6 py-4">
            <div className="flex items-start justify-be tween">
                <div>
                    <Building2 className="w-12 h-12" />
                    <h1 className="text-3xl font-bold mt-2">{organization.name}</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {organization.address}
                    </p>
                </div>
                {organization.blacklistedAt && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-900">Blacklisted</span>
                    </div>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid @5xl:grid-cols-4 @xl:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <InfoItem
                            icon={<User className="w-5 h-5" />}
                            label="Concerning Person"
                            value={organization.concerningPersonName}
                        />
                        <InfoItem
                            icon={<Mail className="w-5 h-5" />}
                            label="Email"
                            value={organization.email}
                            link={`mailto:${organization.email}`}
                        />
                        <InfoItem
                            icon={<Phone className="w-5 h-5" />}
                            label="Contact Number"
                            value={organization.contactNumber}
                            link={`tel:${organization.contactNumber}`}
                        />
                        <InfoItem
                            icon={<Globe className="w-5 h-5" />}
                            label="Website"
                            value={organization.websiteUrl || "N/A"}
                            link={organization.websiteUrl}
                        />
                    </div>
                    <div className="space-y-4">
                        <InfoItem
                            icon={<CreditCard className="w-5 h-5" />}
                            label="VAT Number"
                            value={organization.vatNumber}
                        />
                        <InfoItem
                            icon={<CreditCard className="w-5 h-5" />}
                            label="PAN Number"
                            value={organization.panNumber}
                        />
                    </div>
                    <div className="@2xl:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoItem
                            icon={<Landmark className="w-5 h-5" />}
                            label="Bank Name"
                            value={organization.bankingDetails.bankName}
                        />
                        <InfoItem
                            icon={<User className="w-5 h-5" />}
                            label="Beneficiary Name"
                            value={organization.bankingDetails.benificiaryName}
                        />
                        <InfoItem
                            icon={<CreditCard className="w-5 h-5" />}
                            label="Account Number"
                            value={organization.bankingDetails.accountNumber}
                        />
                        <InfoItem
                            icon={<Globe className="w-5 h-5" />}
                            label="SWIFT Code"
                            value={organization.bankingDetails.swiftCode || "N/A"}
                        />
                        <InfoItem
                            icon={<MapPin className="w-5 h-5" />}
                            label="Bank Location"
                            value={organization.bankingDetails.bankLocation || "N/A"}
                        />
                        <InfoItem
                            icon={<MapPin className="w-5 h-5" />}
                            label="Bank City"
                            value={organization.bankingDetails.bankCity}
                        />
                        <InfoItem
                            icon={<MapPin className="w-5 h-5" />}
                            label="Bank State"
                            value={organization.bankingDetails.bankState}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Brand Colors
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-lg shadow-sm border"
                                    style={{ backgroundColor: organization.brandColorPrimary }}
                                />
                                <div>
                                    <p className="text-sm font-medium">Primary Color</p>
                                    <p className="text-sm text-muted-foreground font-mono">{organization.brandColorPrimary}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-lg shadow-sm border"
                                    style={{ backgroundColor: organization.brandColorSecondary }}
                                />
                                <div>
                                    <p className="text-sm font-medium">Secondary Color</p>
                                    <p className="text-sm text-muted-foreground font-mono">{organization.brandColorSecondary}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                        <InfoItem
                            icon={<Calendar className="w-5 h-5" />}
                            label="Created"
                            value={formatDate(organization.createdAt, 'dd MMM yyyy')}
                        />
                        <InfoItem
                            icon={<Calendar className="w-5 h-5" />}
                            label="Last Updated"
                            value={formatDate(organization.updatedAt, 'dd MMM yyyy')}
                        />
                    </CardContent>
                </Card>
            </div>

            <Separator className="my-6" />

            <OrganizationUsersDataTable organizationId={id} />
        </div>
    )
}


interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    link?: string;
}

function InfoItem({ icon, label, value, link }: InfoItemProps) {
    const content = (
        <div className="flex items-start gap-3 w-fit">
            <div className="text-muted-foreground mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className={`text-sm font-medium ${link ? 'hover:text-blue-600 transition-colors' : ''}`}>
                    {value}
                </p>
            </div>
        </div>
    );

    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="block w-fit">
                {content}
            </a>
        );
    }

    return content;
}
