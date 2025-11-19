"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, FolderKanban, Settings, LogOut, Home, Users } from "lucide-react"
import { cn } from "@/lib/utils"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LogoutButton } from "./LogoutButton"

const menuItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Blogs",
        url: "/admin/blogs",
        icon: FileText,
    },
    {
        title: "Projects",
        url: "/admin/projects",
        icon: FolderKanban,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/" target="_blank" rel="noopener noreferrer">
                                        <Home className="h-4 w-4" />
                                        <span>View Site</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.url || (item.url !== "/admin" && pathname.startsWith(item.url))
                                return (
                                    <SidebarMenuItem key={item.url}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link href={item.url}>
                                                <Icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <div className="px-2">
                                    <LogoutButton />
                                </div>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

