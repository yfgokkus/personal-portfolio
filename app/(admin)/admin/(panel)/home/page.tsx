"use client";
import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";
import MdTextbox from "@/components/admin-panel/MdTextbox";
import TitleListInput from "@/components/admin-panel/ListInput";
import Button from "@/components/admin-panel/Button";
import { useEffect, useState } from "react";

type UserInfo = {
  full_name: string;
  email: string;
  titles: string[];
  about_title: string;
  about_desc: string;
};

type UserInfoApi = Omit<UserInfo, "titles"> & { titles: string };

export default function InfoPanel() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    full_name: "",
    email: "",
    titles: [],
    about_title: "",
    about_desc: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [fullNameInput, setFullNameInput] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [titlesInput, setTitlesInput] = useState<string[]>([]);
  const [aboutTitleInput, setAboutTitleInput] = useState<string>("");
  const [aboutDescInput, setAboutDescInput] = useState<string>("");
  const [loadingStates, setLoadingStates] = useState({
    full_name: false,
    email: false,
    titles: false,
    about: false,
  });
  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    titles: "",
    about: "",
  });
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const postUserInfo = async (data: Partial<UserInfoApi>) => {
    const res = await fetch("/api/home", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await res.json();
  };

  const savefullName = async () => {
    setLoadingStates((prev) => ({ ...prev, full_name: true }));
    const result = await postUserInfo({ full_name: fullNameInput });

    if (result.success) {
      setUserInfo(result.data);
      setFullNameInput(""); // Clear
      setErrors((prev) => ({ ...prev, full_name: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        full_name: result.error || "Failed to save full name",
      }));
    }
    setLoadingStates((prev) => ({ ...prev, full_name: false }));
  };

  const saveEmail = async () => {
    setLoadingStates((prev) => ({ ...prev, email: true }));
    const result = await postUserInfo({ email: emailInput });
    if (result.success) {
      setUserInfo(result.data);
      setEmailInput(""); // Clear
      setErrors((prev) => ({ ...prev, email: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        email: result.error || "Failed to save email",
      }));
    }
    setLoadingStates((prev) => ({ ...prev, email: false }));
  };

  const saveTitles = async () => {
    setLoadingStates((prev) => ({ ...prev, titles: true }));

    const result = await postUserInfo({ titles: titlesInput.join(",") });
    if (result.success) {
      setUserInfo(result.data);
      setTitlesInput([]); //clear
      setErrors((prev) => ({ ...prev, titles: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        titles: result.error || "Failed to save titles",
      }));
    }
    setLoadingStates((prev) => ({ ...prev, titles: false }));
  };

  const saveAbout = async () => {
    setLoadingStates((prev) => ({ ...prev, about: true }));
    const result = await postUserInfo({
      about_title: "# " + aboutTitleInput,
      about_desc: aboutDescInput,
    });
    if (result.success) {
      setUserInfo(result.data);
      setAboutTitleInput(""); // Clear both
      setAboutDescInput("");
      setIsEditingAbout(false);
      setErrors((prev) => ({ ...prev, about: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        about: result.error || "Failed to save about section",
      }));
    }
    setLoadingStates((prev) => ({ ...prev, about: false }));
  };

  const startEditAbout = () => {
    setAboutTitleInput(userInfo.about_title.replace(/^#\s*/, ""));
    setAboutDescInput(userInfo.about_desc);
    setIsEditingAbout(true);
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/home")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserInfo(data.data);
        } else {
          console.error(data.error);
        }
      })
      .catch((error) => console.error("Error loading user info:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col space-y-14">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <h1 className="text-2xl font-bold">Home Page Editor</h1>
        <h1 className="text-xl font-bold">User Info</h1>
      </div>

      {/* FULL NAME */}
      <section className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-3">
          <input
            value={fullNameInput}
            onChange={(e) => setFullNameInput(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Full name*"
          />
          <Button
            onClick={savefullName}
            text="Save full name"
            loading={loadingStates.full_name}
          />
          {errors.full_name && (
            <p className="text-sm text-red-600">{errors.full_name}</p>
          )}
        </div>

        <div className="flex gap-2 text-lg">
          <span className="font-semibold">Full name:</span>
          <span>{userInfo.full_name}</span>
        </div>
      </section>

      {/* E-MAIL */}
      <section className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-3">
          <input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="E-mail*"
          />
          <Button
            onClick={saveEmail}
            text="Save email"
            loading={loadingStates.email}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="flex gap-2 text-lg">
          <span className="font-semibold">E-mail:</span>
          <span>{userInfo.email}</span>
        </div>
      </section>

      {/* TITLES EDITOR */}
      <section className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-3">
          <TitleListInput
            value={titlesInput}
            onChange={setTitlesInput}
            placeholder="Add a job title"
          />
          <Button
            onClick={saveTitles}
            text="Save titles"
            loading={loadingStates.titles}
          />
          {errors.titles && (
            <p className="text-sm text-red-600">{errors.titles}</p>
          )}
        </div>

        <div className="flex gap-2 text-lg">
          <span className="font-semibold">Job Titles:</span>
          <div className="flex flex-col gap-1">
            {userInfo.titles.length > 0 &&
              userInfo.titles.map((title) => <span key={title}>{title}</span>)}
          </div>
        </div>
      </section>

      {/* ABOUT EDITOR */}
      <section className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">About Section</h2>

          {isEditingAbout ? (
            <>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none">
                  #
                </span>
                <MdTextbox
                  placeholder="Write title ..."
                  value={aboutTitleInput}
                  onChange={setAboutTitleInput}
                  className="pl-6"
                />
              </div>

              <MdTextbox
                placeholder="Write description ..."
                value={aboutDescInput}
                onChange={setAboutDescInput}
              />

              <div className="flex gap-2">
                <Button
                  onClick={saveAbout}
                  text="Save About"
                  loading={loadingStates.about}
                />
                <Button
                  onClick={() => setIsEditingAbout(false)}
                  text="Cancel"
                />
              </div>

              {errors.about && (
                <p className="text-sm text-red-600">{errors.about}</p>
              )}
            </>
          ) : (
            <Button onClick={startEditAbout} text="Edit About" />
          )}
        </div>

        {(userInfo.about_title || userInfo.about_desc) && (
          <div className="rounded-md bg-neutral-50 p-4">
            <div className="prose prose-headings:font-bold prose-headings:text-2xl prose-strong:text-blue-600">
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {`${userInfo.about_title}\n\n${userInfo.about_desc}`}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
