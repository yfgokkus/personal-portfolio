import Image from "next/image";
import { prisma } from "@/lib/prismaClient";

export default async function ResumePage() {
  const resume = await prisma.resume.findFirst({
    include: {
      resume_images: {
        orderBy: { sort_order: "asc" },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto pt-16 px-4 pb-16 min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center space-y-8">
        {resume?.file_url && (
          <a
            href={`${process.env.NEXT_PUBLIC_CDN_URL}${resume.file_url}`}
            download
            className="inline-flex items-center rounded-md bg-black dark:bg-neutral-100 px-6 py-3 text-white dark:text-black transition hover:bg-neutral-800 dark:hover:bg-neutral-300"
          >
            Download Resume (PDF)
          </a>
        )}

        {resume?.resume_images && resume.resume_images.length > 0 ? (
          resume.resume_images.map((img, index) => (
            <Image
              key={img.id}
              src={`${process.env.NEXT_PUBLIC_CDN_URL}${img.image_url}`}
              alt={`Resume page ${index + 1}`}
              width={900}
              height={1200}
              className="h-auto w-full rounded-lg shadow-lg"
              priority={index === 0}
            />
          ))
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">
            No resume images available
          </p>
        )}
      </div>
    </div>
  );
}
