import ExperienceCard from "@/components/ExperienceCard";
import { prisma } from "@/lib/prismaClient";

export default async function ExperiencesPage() {
  const experiences = await prisma.experiences.findMany({
    orderBy: { start_date: "desc" },
  });

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="mb-12 text-center text-2xl sm:text-3xl font-bold animate-fade-in">
        Experience
      </h1>

      <div className="flex flex-col gap-8 items-center">
        {experiences.map((exp) => (
          <ExperienceCard
            key={exp.id}
            role={exp.role}
            description={exp.description ?? ""}
            corporation={exp.corporation}
            location={exp.location}
            startDate={exp.start_date}
            endDate={exp.end_date}
          />
        ))}
      </div>
    </section>
  );
}
