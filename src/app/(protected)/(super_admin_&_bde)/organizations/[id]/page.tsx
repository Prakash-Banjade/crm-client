"use client";

import SingleOrganizationActionBtns from "@/components/organization/single-organization-action-btns";
import OrganizationUsersDataTable from "@/components/organization/users/organization-users-data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-provider";
import { useGetOrganizationById } from "@/lib/data-access/organization-data-hooks";
import { Role } from "@/lib/types";
import { getObjectUrl } from "@/lib/utils";
import { formatDate } from "date-fns";
import { AlertCircle, Building2, Calendar, CreditCard, File, Globe, Landmark, Mail, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";

type Props = {
    params: Promise<{
        id: string;
    }>
}

export default function SingleOrganizationPage({ params }: Props) {
    const { id } = use(params);
    const { user } = useAuth();

    const { data: organization, isLoading } = useGetOrganizationById({ id })

    if (isLoading) return <div>Loading...</div>

    if (!organization) notFound();

    return (
        <div className="@container container space-y-6 py-4">
            <div className="space-y-2">
                {
                    organization.logo ? (
                        <Image
                            src={getObjectUrl(organization.logo)}
                            alt={organization.name}
                            width={100}
                            height={100}
                            className="max-w-52 h-auto object-contain"
                        />
                    ) : (
                        <Building2 className="w-12 h-12" />
                    )
                }
                <section className="flex items-center gap-2 justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold">{organization.name}</h1>
                            {organization.blacklistedAt && (
                                <Badge variant="destructive" className="bg-destructive/5!">
                                    <AlertCircle />
                                    Blacklisted
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {organization.address || "N/A"}
                        </p>
                    </div>
                    {
                        user?.role === Role.SUPER_ADMIN && (
                            <SingleOrganizationActionBtns organization={organization} />
                        )
                    }
                </section>
            </div>

            <Card>
                <CardContent className="grid @5xl:grid-cols-4 @xl:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <InfoItem
                            icon={<User className="size-5" />}
                            label="Concerning Person"
                            value={organization.concerningPersonName}
                        />
                        <InfoItem
                            icon={<Mail className="size-5" />}
                            label="Email"
                            value={organization.email}
                            link={`mailto:${organization.email}`}
                        />
                        <InfoItem
                            icon={<Phone className="size-5" />}
                            label="Contact Number"
                            value={organization.contactNumber}
                            link={`tel:${organization.contactNumber}`}
                        />
                        <InfoItem
                            icon={<Globe className="size-5" />}
                            label="Website"
                            value={organization.websiteUrl || "N/A"}
                            link={organization.websiteUrl}
                        />
                    </div>
                    <div className="space-y-4">
                        <InfoItem
                            icon={<CreditCard className="size-5" />}
                            label="VAT Number"
                            value={organization.vatNumber}
                        />
                        <InfoItem
                            icon={<CreditCard className="size-5" />}
                            label="PAN Number"
                            value={organization.panNumber}
                        />
                    </div>
                    <div className="@2xl:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InfoItem
                            icon={<Landmark className="size-5" />}
                            label="Bank Name"
                            value={organization.bankingDetails.bankName}
                        />
                        <InfoItem
                            icon={<User className="size-5" />}
                            label="Beneficiary Name"
                            value={organization.bankingDetails.benificiaryName}
                        />
                        <InfoItem
                            icon={<CreditCard className="size-5" />}
                            label="Account Number"
                            value={organization.bankingDetails.accountNumber}
                        />
                        <InfoItem
                            icon={<Globe className="size-5" />}
                            label="SWIFT Code"
                            value={organization.bankingDetails.swiftCode || "N/A"}
                        />
                        <InfoItem
                            icon={<MapPin className="size-5" />}
                            label="Bank Location"
                            value={organization.bankingDetails.bankLocation || "N/A"}
                        />
                        <InfoItem
                            icon={<MapPin className="size-5" />}
                            label="Bank City"
                            value={organization.bankingDetails.bankCity}
                        />
                        <InfoItem
                            icon={<MapPin className="size-5" />}
                            label="Bank State"
                            value={organization.bankingDetails.bankState}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 @3xl:grid-cols-2 @6xl:grid-cols-3 gap-6">
                <Card>
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
                    <CardContent className="grid grid-cols-2 gap-3">
                        <InfoItem
                            icon={<File className="size-5" />}
                            label="Pan Certificate"
                            link={organization.panCertificate ? getObjectUrl(organization.panCertificate) : undefined}
                            value="Click to view"
                        />
                        <InfoItem
                            icon={<File className="size-5" />}
                            label="Registration Document"
                            link={organization.registrationDocument ? getObjectUrl(organization.registrationDocument) : undefined}
                            value="Click to view"
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="grid grid-cols-2 gap-3">
                        <InfoItem
                            icon={<Calendar className="size-5" />}
                            label="Created"
                            value={formatDate(organization.createdAt, 'dd MMM yyyy')}
                        />
                        <InfoItem
                            icon={<Calendar className="size-5" />}
                            label="Last Updated"
                            value={formatDate(organization.updatedAt, 'dd MMM yyyy')}
                        />
                    </CardContent>
                </Card>
            </div>


            {
                user?.role === Role.SUPER_ADMIN && (
                    <>
                        <Separator className="my-6" />
                        <OrganizationUsersDataTable organizationId={id} />
                    </>
                )
            }
        </div>
    )
}


interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
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
            <a href={link} target="_blank" rel="noopener noreferrer" className="block w-fit line-clamp-1 truncate">
                {content}
            </a>
        );
    }

    return content;
}
