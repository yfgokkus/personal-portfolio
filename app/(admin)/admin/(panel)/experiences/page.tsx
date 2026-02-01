"use client";

import MdTextbox from "@/components/admin-panel/MdTextbox";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@/components/admin-panel/Button";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeSanitize from "rehype-sanitize";

interface Experience {
  id: string;
  role: string;
  description?: string;
  corporation: string;
  location: string;
  start_date: string;
  end_date?: string | null;
}

export default function ExperiencesPanel() {
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [corporation, setCorporation] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    const res = await fetch("/api/experiences");
    const json = await res.json();
    if (res.ok) setExperiences(json.data ?? []);
  };

  const addExperience = async () => {
    setErrors([]);

    if (!role || !corporation || !location || !startDate) {
      setErrors(["Please fill all required fields"]);
      return;
    }

    const res = await fetch("/api/experiences", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(editingId && { id: editingId }),
        role: normalizeMarkdown(role),
        description: normalizeMarkdown(description),
        corporation: normalizeMarkdown(corporation),
        location: normalizeMarkdown(location),
        start_date: startDate.toISOString(),
        end_date: endDate ? endDate.toISOString() : null,
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      setErrors([json.error]);
      return;
    }

    if (editingId) {
      setExperiences((prev) =>
        prev.map((p) => (p.id === editingId ? json.data : p)),
      );
    } else {
      setExperiences((prev) => [...prev, json.data]);
    }

    resetForm();
  };

  const deleteExperience = async (id: string) => {
    const res = await fetch("/api/experiences", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const json = await res.json();
      setErrors([json.error]);
      return;
    }

    setExperiences((prev) => prev.filter((e) => e.id !== id));
    setErrors([]);
  };

  const editExperience = (exp: Experience) => {
    setEditingId(exp.id);
    setRole(exp.role);
    setDescription(exp.description || "");
    setCorporation(exp.corporation);
    setLocation(exp.location);
    setStartDate(new Date(exp.start_date));
    setEndDate(exp.end_date ? new Date(exp.end_date) : null);
  };

  const resetForm = () => {
    setEditingId(null);
    setRole("");
    setDescription("");
    setCorporation("");
    setLocation("");
    setStartDate(null);
    setEndDate(null);
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
      <p className="text-2xl font-bold">Experiences Panel</p>

      <div className="flex gap-6">
        {/* FORM */}
        <div className="flex flex-1 flex-col gap-3">
          {editingId && (
            <div className="bg-blue-100 p-2 rounded text-sm">
              Editing mode – update the experience and save changes
            </div>
          )}

          <MdTextbox placeholder="Role*" value={role} onChange={setRole} />
          <MdTextbox
            placeholder="Corporation*"
            value={corporation}
            onChange={setCorporation}
          />
          <MdTextbox
            placeholder="Location*"
            value={location}
            onChange={setLocation}
          />
          <MdTextbox
            placeholder="Description*"
            value={description}
            onChange={setDescription}
          />

          <div className="flex gap-6">
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="Start date"
              className="border rounded px-3 py-2"
            />
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              placeholderText="End date"
              className="border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={addExperience}
              text={editingId ? "Update Experience" : "Save Experience"}
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

          {(role || description) && (
            <div
              className="prose prose-sm dark:prose-invert prose-headings:font-normal prose-headings:text-2xl prose-strong:text-pink-700 
                  max-w-none text-justify wrap-break-words whitespace-normal"
            >
              <ReactMarkdown
                remarkPlugins={[remarkBreaks]}
                rehypePlugins={[rehypeSanitize]}
              >
                {`${role}\n\n${description}\n\n${corporation}\n\n${location}`}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* LIST */}
        <div className="flex flex-1 flex-col gap-4">
          <p className="text-xl font-bold text-center">Experiences</p>

          {experiences.length === 0 ? (
            <p className="text-center text-sm text-neutral-500">
              No experiences yet
            </p>
          ) : (
            experiences.map((exp, i) => (
              <div key={exp.id} className="flex gap-2 items-start">
                <span>{i + 1}.</span>

                <div className="flex-1 flex flex-col gap-3">
                  <div
                    className="prose prose-sm dark:prose-invert prose-headings:font-normal prose-headings:text-2xl prose-strong:text-pink-700 
                  max-w-none text-justify wrap-break-words whitespace-normal"
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkBreaks]}
                      rehypePlugins={[rehypeSanitize]}
                    >
                      {`${exp.role}\n\n${exp.description ?? ""}\n\n${exp.corporation}\n\n${exp.location}`}
                    </ReactMarkdown>
                  </div>

                  <p className="text-sm font-semibold text-right">
                    {new Date(exp.start_date).toLocaleDateString("en-GB", {
                      month: "2-digit",
                      year: "numeric",
                    })}
                    {" - "}
                    {exp.end_date
                      ? new Date(exp.end_date).toLocaleDateString("en-GB", {
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "continues"}
                  </p>

                  <div className="flex gap-2 self-end">
                    <button
                      onClick={() => editExperience(exp)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteExperience(exp.id)}
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
