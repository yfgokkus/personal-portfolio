import ProjectCard from "@/components/ProjectCard";
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
    <section className="max-w-7xl mx-auto py-30 px-5 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-12 animate-fade-in">
        Projects
      </h1>

      {projects.length === 0 ? (
        <p className="text-center">No projects yet</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 flex flex-col gap-5">
            {projects
              .filter((_, i) => i % 3 === 0)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
          <div className="flex-1 flex flex-col gap-5">
            {projects
              .filter((_, i) => i % 3 === 1)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
          <div className="flex-1 flex flex-col gap-5">
            {projects
              .filter((_, i) => i % 3 === 2)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
