"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import React, { useEffect, useMemo } from "react";
import { TGroupMenuItem } from "@/components/sidebar-layout/sidebar";
import { useSidebar } from "../ui/sidebar";
import { TCurrentUser } from "@/context/auth-provider";
import Link from "next/link";

export default function AppBreadCrumb({
    menuItems,
    user
}: {
    menuItems: TGroupMenuItem[],
    user: NonNullable<TCurrentUser>
}) {
    const { dynamicBreadcrumb, setDynamicBreadcrumb } = useSidebar();

    const active = useMemo(() => {
        const menuItem = menuItems.find(group => group.menuItems
            .some(item => location.pathname.includes(`/${user.role}/${item.url}`)))
            ?.menuItems?.find(item => location.pathname.includes(`/${user.role}/${item.url}`))

        const item = menuItem?.items?.length
            ? (
                menuItem.items.find(item => {
                    return location.pathname === (`/${user.role}/${menuItem.url}${!!item.url ? `/${item.url}` : ''}`)
                })
                || menuItem.items.find(item => {
                    return location.pathname.includes(`/${user.role}/${menuItem.url}${!!item.url ? `/${item.url}` : ''}`)
                })
            )
            : undefined;

        return { menuItem, item };
    }, [location, menuItems]);

    useEffect(() => {
        setDynamicBreadcrumb(prev => [
            ...prev.filter(breadcrumb => {
                return breadcrumb.url && location.pathname.includes(breadcrumb.url);
            })
        ])
    }, [location]);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage className="text-muted-foreground line-clamp-1">
                        {active.menuItem?.title}
                    </BreadcrumbPage>
                </BreadcrumbItem>
                {
                    active.item && <>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild className="line-clamp-1">
                                <Link href={`/${user.role}/${active.menuItem?.url}/${active.item?.url}`}>
                                    {active.item?.title}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                }
                {
                    dynamicBreadcrumb.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem key={index}>
                                    {
                                        item.isEdit ? (
                                            <BreadcrumbLink asChild>
                                                <Link href={`/${user.role}${item.url}`} className="line-clamp-1">
                                                    {item.label}
                                                </Link>
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage className="line-clamp-1">{item.label}</BreadcrumbPage>
                                        )
                                    }
                                </BreadcrumbItem>

                                {
                                    item.isEdit && (
                                        <>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                            <BreadcrumbItem>
                                                <BreadcrumbPage>Edit</BreadcrumbPage>
                                            </BreadcrumbItem>
                                        </>
                                    )
                                }
                            </React.Fragment>
                        )
                    })
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}