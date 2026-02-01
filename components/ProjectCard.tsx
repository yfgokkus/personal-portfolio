import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";

type Props = {
  project: {
    id: string;
    name: string;
    description: string | null;
    github_link: string | null;
    project_date: Date;
    project_images: { id: string; image: string }[];
  };
};
const normalizeMarkdown = (text: string) =>
  text
    .replace(/\u00A0/g, " ") // non-breaking spaces
    .replace(/\u200B/g, "") // zero-width spaces
    .replace(/\t/g, " ") // tabs
    .replace(/^ {4,}/gm, "") // remove code-block indentation
    .trim();

export default function ProjectCard({ project }: Props) {
  const images = project.project_images.map(
    (img) => `${process.env.NEXT_PUBLIC_CDN_URL}${img.image}`,
  );

  return (
    <div
      className="
        relative shrink-0
        rounded-xl border border-slate-200 dark:border-slate-800
        bg-slate-200/60 dark:bg-slate-900/60
        animate-fade-in
      "
    >
      {images.length > 0 && (
        <Carousel className="w-full overflow-hidden rounded-t-xl">
          <CarouselContent>
            {images.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full min-h-48 max-h-80 flex items-center justify-center bg-slate-900/5 dark:bg-slate-100/5">
                  <img
                    src={src}
                    alt={`${project.name} image ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            rehypePlugins={[rehypeSanitize]}
          >
            {project.name}
          </ReactMarkdown>

          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              className="
                rounded-full p-2
                hover:bg-slate-200 dark:hover:bg-slate-800
              "
            >
              <FaGithub className="h-5 w-5" />
            </a>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <div className="prose prose-sm dark:prose-invert prose-headings:font-normal prose-headings:text-2xl prose-strong:text-pink-700 max-w-none text-justify wrap-break-words whitespace-normal">
            <ReactMarkdown
              remarkPlugins={[remarkBreaks]}
              rehypePlugins={[rehypeSanitize]}
            >
              {normalizeMarkdown(project.description)}
            </ReactMarkdown>
          </div>
        )}

        {/* Date */}
        <div className="pt-1 text-sm opacity-70">
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            year: "numeric",
          }).format(project.project_date)}
        </div>
      </div>
    </div>
  );
}
