"use client";
import React, { JSX, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
    Icon3dRotate
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import LoginForm from "./custom/loginBox";
import UserGrid from "./custom/userBox";

// New component imports for dashboard sections
// import HomeComponent from "./dashboard/HomeComponent";
// import ProjectsComponent from "./dashboard/ProjectsComponent";
// import TasksComponent from "./dashboard/TasksComponent";
// import TeamComponent from "./dashboard/TeamComponent";

export const dynamic = 'force-dynamic';
type ComponentType = "login" | "users" | "projects" | "tasks" | "team";
interface NavLink {
    label: string;
    id: ComponentType;
    icon: JSX.Element;
}
interface Links {
    id: ComponentType;
    label: string;
    icon: JSX.Element;
    href: string;
    active?: boolean; 
}


export function SidebarDemo() {


    const [activeComponent, setActiveComponent] = useState<ComponentType>("users");
    const [open, setOpen] = useState(false);

    // Updated links with onClick handlers
    const links: NavLink[] = [
        {
            label: "Login",
            id: "login",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Users",
            id: "users",
            icon: (
                <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Projects",
            id: "projects",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Tasks",
            id: "tasks",
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Team",
            id: "team",
            icon: (
                <Icon3dRotate className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];
    // Handle navigation click
    const handleNavClick = (id: ComponentType) => {
        setActiveComponent(id);
    };

    return (
        <div
            className={cn(
                "mx-auto flex w-screen max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                "h-screen",
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <div key={idx} onClick={() => handleNavClick(link.id)}>
                                    <SidebarLink
                                        link={{
                                            ...link,
                                            href: "#",
                                        }}
                                        // active={activeComponent === link.id} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Manu Arora",
                                href: "#",
                                icon: (
                                    <img
                                        src="https://assets.aceternity.com/manu.png"
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard activeComponent={activeComponent} />
        </div>
    );
}

export const Logo = () => {
    return (
        <a
            href="/"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                Task Management
            </motion.span>
        </a>
    );
};

export const LogoIcon = () => {
    return (
        <a
            href="/"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        </a>
    );
};

interface DashboardProps {
    activeComponent: "login" | "users" | "projects" | "tasks" | "team";
}

const Dashboard = ({ activeComponent }: DashboardProps) => {
    // Render the appropriate component based on the active component state
    const renderComponent = () => {
        switch (activeComponent) {
            case "login":
                return <LoginForm/>;
            case "users":
                return <UserGrid />;
            case "projects":
                return <div> <p>hello1 </p></div>;
            case "tasks":
                return <div> <p>hello 2</p></div>;
            case "team":
                return <div> <p>hello 3</p></div>;
            default:
                return <div> <p>hello 4</p></div>;
        }
    };

    return (
        <div className="flex flex-1 p-6 overflow-y-auto">
            {renderComponent()}
        </div>
    );
};

export default Dashboard;
