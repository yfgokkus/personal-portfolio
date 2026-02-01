import ProjectCard from "@/components/ProjectCard";
import MasonryLayout from "@/components/MasonryLayout"; // Import the new component
import { prisma } from "@/lib/prismaClient";

export default async function ProjectsPage() {
  const projects = await prisma.projects.findMany({
    include: {
      project_images: {
        select: {
          id: true,
          image: true,
        },
      },
    },
    orderBy: { project_date: "desc" },
  });

  return (
    <section className="max-w-7xl mx-auto py-24 px-5 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-12 animate-fade-in">
        Projects
      </h1>

      {projects.length === 0 ? (
        <p className="text-center text-gray-500">No projects yet</p>
      ) : (
        <MasonryLayout>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </MasonryLayout>
      )}
    </section>
  );
}
