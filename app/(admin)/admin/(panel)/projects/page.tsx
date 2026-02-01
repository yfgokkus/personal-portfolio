"use client";
import MdTextbox from "@/components/admin-panel/MdTextbox";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@/components/admin-panel/Button";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeSanitize from "rehype-sanitize";
import FileUploader from "@/components/admin-panel/FileUploader";
import ImageSlider from "@/components/admin-panel/ImageSlider";

interface Project {
  id: string;
  name: string;
  description: string;
  github_link: string;
  project_date: string;
  project_images: { image: string }[];
}

export default function ProjectsPanel() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch("/api/projects");
    const json = await res.json();
    if (res.ok) {
      setProjects(json.data || []); // Handle null/undefined
    }
    setLoading(false);
  };

  const addProject = async () => {
    setErrors([]);

    if (!name || !selectedDate) {
      setErrors(["Please fill all required fields"]);
      return;
    }

    let imagePaths: string[] = [];

    // Upload images via project-images endpoint
    try {
      imagePaths = await Promise.all(
        images.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/project-images", {
            method: "POST",
            body: formData,
          });

          const body = await res.json();
          if (!res.ok) throw new Error(body.error);

          return body.imagePath;
        }),
      );
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "Upload failed"]);
      return;
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...imagePaths].filter(Boolean);

    // Create project in DB
    const res = await fetch("/api/projects", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(editingId && { id: editingId }),
        name: normalizeMarkdown(name),
        description: normalizeMarkdown(description),
        github_link: githubLink || null,
        project_date: selectedDate.toISOString(),
        project_images: allImages.map((path) => ({ image: path })),
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      console.log(json.error);
      setErrors([json.error]);
      return;
    }

    if (editingId) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? json.data : p)),
      );
    } else {
      setProjects((prev) => [...prev, json.data]);
    }

    resetForm();
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const res = await fetch(`/api/projects`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: projectId }),
    });

    if (!res.ok) {
      const json = await res.json();
      console.log(json.error);
      setErrors([json.error]);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setErrors([]);
  };

  const editProject = (project: Project) => {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description || "");
    setGithubLink(project.github_link || ""); // ✅ good
    setSelectedDate(new Date(project.project_date));
    setExistingImages(project.project_images.map((img) => img.image));
    setImages([]);
  };

  const deleteExistingImage = async (imagePath: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const res = await fetch("/api/project-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePath }),
    });

    if (!res.ok) {
      const json = await res.json();
      console.log(json);
      setErrors([json.error]);
      return;
    }

    setExistingImages((prev) => prev.filter((img) => img !== imagePath));
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setGithubLink(""); // ✅ ADD
    setSelectedDate(null);
    setImages([]);
    setExistingImages([]);
    setErrors([]);
  };

  const normalizeMarkdown = (text: string) =>
    text
      .replace(/\u00A0/g, " ") // non-breaking spaces
      .replace(/\u200B/g, "") // zero-width spaces
      .replace(/\t/g, " ") // tabs
      .replace(/^ {4,}/gm, "") // remove code-block indentation
      .trim();

  return (
    <div className="flex flex-col space-y-10">
      <p className="text-2xl font-bold">Projects Panel</p>
      <div className="flex gap-6">
        <div className="flex flex-1 flex-col gap-3">
          {editingId && (
            <div className="bg-blue-100 p-2 rounded text-sm">
              Editing mode - modify and save changes
            </div>
          )}

          <div className="space-y-1">
            <h1 className="font-bold">Project Name</h1>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none">
                #
              </span>
              <MdTextbox
                placeholder="Type project name here..."
                value={name}
                onChange={setName}
                className="pl-6"
              />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="font-bold">Project Description</h1>
            <MdTextbox
              placeholder="Type project description here..."
              onChange={setDescription}
              value={description}
            />
          </div>

          <div className="space-y-1">
            <h1 className="font-bold">GitHub Repository</h1>
            <input
              type="url"
              placeholder="Github link*"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div className="space-y-1">
            <h1 className="font-bold">Delivered At</h1>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) setSelectedDate(date);
              }}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="border rounded px-3 py-2"
              placeholderText="Select month/year"
            />
          </div>

          {/* Show existing images in edit mode */}
          {editingId && existingImages.length > 0 && (
            <div className="space-y-1">
              <h1 className="font-bold">Existing Images</h1>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded overflow-hidden group"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}${img}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => deleteExistingImage(img)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <h1 className="font-bold">
              {editingId ? "Add More Images" : "Upload Project Images"}
            </h1>
            <FileUploader
              maxFiles={5}
              maxSize={5}
              type="image"
              files={images}
              setFiles={setImages}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={addProject}
              text={editingId ? "Update Project" : "Save Project"}
            />
            {editingId && (
              <Button
                onClick={resetForm}
                text="Cancel"
                className="bg-gray-500"
              />
            )}
          </div>

          {errors.length !== 0 &&
            errors.map((err, i) => (
              <div key={i} className="text-red-600">
                {err}
              </div>
            ))}

          {/* Project preview */}
          {(name || description) && (
            <div className="rounded-md bg-neutral-50 p-4">
              <div className="prose prose-headings:font-normal prose-strong:text-blue-600">
                <ReactMarkdown
                  remarkPlugins={[remarkBreaks]}
                  rehypePlugins={[rehypeSanitize]}
                >
                  {name ? `# ${name}\n\n${description}` : description}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <p className="text-xl font-bold text-center">Projects</p>

          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>No projects yet</p>
          ) : (
            projects.map((project, i) => (
              <div key={project.id} className="flex gap-2 items-start">
                <h2>{i + 1}.</h2>

                <div className="flex flex-col flex-1 gap-5">
                  {project.project_images?.length > 0 && (
                    <ImageSlider
                      images={project.project_images.map(
                        (img) =>
                          `${process.env.NEXT_PUBLIC_CDN_URL}${img.image}`,
                      )}
                    />
                  )}

                  <div className="prose prose-headings:font-normal prose-strong:text-blue-600">
                    <ReactMarkdown
                      remarkPlugins={[remarkBreaks]}
                      rehypePlugins={[rehypeSanitize]}
                    >
                      {project.name + "\n\n" + (project.description || "")}
                    </ReactMarkdown>
                  </div>

                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline self-start"
                    >
                      View on GitHub →
                    </a>
                  )}

                  <p className="font-semibold text-sm self-end">
                    {new Date(project.project_date).toLocaleDateString(
                      "en-GB",
                      {
                        month: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => editProject(project)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
