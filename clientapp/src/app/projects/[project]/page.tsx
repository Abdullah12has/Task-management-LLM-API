import ProjectTaskKanban from "@/components/custom/projectTaskKanban";

interface PageProps {
  params: { project: string };
}

export default function Page({ params }: PageProps) {
  console.log("Project ID from params:", params.project);
  return <ProjectTaskKanban projectId={params.project} />;
}

