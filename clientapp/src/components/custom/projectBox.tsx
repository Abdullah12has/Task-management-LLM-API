"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Carousel from "@/components/ui/carousel";
import { useAuth } from '@/app/context/authProvider';

type ProjectLink = {
    self: string;
    tasks: string;
};

type Project = {
    _links: ProjectLink;
    category_id: string | null;
    deadline: string | null;
    description: string;
    project_id: string;
    status: "planning" | "active" | "completed" | "on_hold" | "cancelled";
    team_id: string;
    title: string;
};

type ProjectsApiResponse = {
    _links: {
        [key: string]: any;
    };
    projects: Project[];
};

type CarouselSlide = {
    title: string;
    button: string;
    src: string;
    onClick?: () => void;
    description?: string;
    status?: string;
    deadline?: string | null;
    team_id?: string;
    project_id?: string;
};

export function ProjectBox() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth(); // Get the auth token

    // Background images to cycle through
    const backgroundImages = [
        "https://images.unsplash.com/photo-1494806812796-244fe51b774d?q=80&w=3534&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1518710843675-2540dd79065c?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1590041794748-2d8eb73a571c?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1679420437432-80cfbf88986c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        if (!token) {
            console.warn("[DEBUG] Missing token. Skipping fetch.");
            return;
        }

        try {
            console.log("[DEBUG] Fetching projects");
            setLoading(true);

            const response = await fetch('http://127.0.0.1:8080/projects/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("[DEBUG] Fetch response status:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: ProjectsApiResponse = await response.json();
            console.log("[DEBUG] Fetched projects data:", data);
            setProjects(data.projects);
            setError(null);
        } catch (err) {
            console.error("[DEBUG] Error fetching projects:", err);
            setError('Failed to fetch projects. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleProjectClick = (projectId: string) => {
        // Navigate to project detail page
        window.location.href = `/projects/${projectId}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-400';
            case 'completed':
                return 'text-blue-400';
            case 'planning':
                return 'text-yellow-400';
            case 'on_hold':
                return 'text-orange-400';
            case 'cancelled':
                return 'text-red-400';
            default:
                return 'text-gray-400';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'completed':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'planning':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'on_hold':
                return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            case 'cancelled':
                return 'bg-red-500/20 text-red-300 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Convert projects to carousel slides
    const slideData: CarouselSlide[] = projects.map((project, index) => ({
        title: project.title,
        button: "View Project",
        src: backgroundImages[index % backgroundImages.length],
        onClick: () => handleProjectClick(project.project_id),
        description: project.description,
        status: project.status,
        deadline: project.deadline,
        team_id: project.team_id,
        project_id: project.project_id,
    }));

    if (loading) {
        return (
            <div className="relative overflow-hidden w-full h-full py-20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative overflow-hidden w-full h-full py-20 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Unable to Load Projects</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <button
                        onClick={fetchProjects}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="relative overflow-hidden w-full h-full py-20 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">No Projects Found</h3>
                    <p className="text-gray-600 dark:text-gray-400">There are no projects to display at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative  w-full ">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Our Projects</h2>
                <p className="text-gray-600 dark:text-gray-400">Explore our current and completed projects</p>
            </div>

            {/* Enhanced Carousel with project info overlay */}
            <div className=" ">
                <Carousel
                    slides={slideData.map(slide => ({
                        ...slide,
                        // Add custom content overlay for project info
                        customContent: (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="max-w-3xl">
                                        {/* Status and metadata */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(slide.status || '')
                                                }`}>
                                                {slide.status?.toUpperCase()}
                                            </span>
                                            {slide.deadline && (
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                                                    Due: {formatDate(slide.deadline)}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Title */}
                                        <h3 className="text-4xl font-bold text-white mb-3">{slide.title}</h3>
                                        
                                        {/* Description */}
                                        {slide.description && (
                                            <p className="text-gray-200 text-lg mb-4 line-clamp-3">
                                                {slide.description}
                                            </p>
                                        )}

                                        {/* Project Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                                <div className="text-xs text-gray-300 mb-1">Project ID</div>
                                                <div className="text-sm font-mono text-white truncate">
                                                    {slide.project_id}
                                                </div>
                                            </div>
                                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                                <div className="text-xs text-gray-300 mb-1">Team ID</div>
                                                <div className="text-sm font-mono text-white truncate">
                                                    {slide.team_id}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link 
                                            href={`/projects/${slide.project_id}`}
                                            className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-lg hover:bg-white/30 transition-all duration-200 font-medium"
                                        >
                                            {slide.button}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    }))}
                />
            </div>

            {/* Project Statistics */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {['planning', 'active', 'completed', 'on_hold', 'cancelled'].map(status => {
                    const count = projects.filter(p => p.status === status).length;
                    return (
                        <div key={status} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                            <div className={`text-2xl font-bold ${getStatusColor(status)}`}>
                                {count}
                            </div>
                            <div className="text-sm text-gray-400 capitalize">
                                {status.replace('_', ' ')}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}