import React from "react";
import { useState, useRef } from "react";
import UploadIcon from "../../assets/upload";
import Chat from "./Chat";
import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import FormData from "form-data";
import Table from "./Table";
import { ResultContextProvider } from "./ResultContext";
import toast from "react-hot-toast";

const UploadPdf = () => {
  const { userId } = useAuth();
  if (!userId) {
    redirect("/");
  }
  // const user = await clerkClient.users.getUser(userId);
  const [sourceId, setSourceId] = useState(""); //"src_Rxq5JwJQZUKZ3tESLaPmx", src_JStXFjL1ZwvAgrHbCqslH
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileName, setFileName] = useState("Chat bot");
  const fileInput = useRef<any>();

  const saveUploadCount = async (uploadMB: number) => {
    await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadMB: uploadMB,
      }),
    });
  };
  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const file = event.target.files?.[0];
    setFileName(file?.name as string);

    const formData = new FormData();
    formData.append("file", file);
    if (!file) return;
    const fileSizeMB = file.size / 1024 / 1024; // Convert bytes to MB
    const options = {
      headers: {
        "x-api-key": "sec_PxZwgM7psJzuQuECpHnPfihFL5ghXowP",
      },
    };
    toast.promise(
      axios
        .post("https://api.chatpdf.com/v1/sources/add-file", formData, options)
        .then(async (response) => {
          setSourceId(response.data.sourceId);
          setUploading(false);
          await saveUploadCount(fileSizeMB);
        })
        .catch((error) => {
          toast.error(error.message);
        }),
      {
        loading: <p className="text-sm">Uploading PDF...</p>,
        success: <p className="text-sm">PDF upload success!</p>,
        error: <p className="text-sm">PDF upload failed!</p>,
      }
    );
  };
  return (
    <div className="px-8 w-full">
      {/* Always display the Chat component and Table component */}
      <div className="flex gap-10 pt-3">
        <ResultContextProvider>
          <Chat
            sourceId={sourceId}
            className="px-10 sm:p-6 justify-between flex h-[calc(100vh-17rem)] w-2/3 overflow-auto"
            fileName={fileName}
          />
          <Table className="w-1/3 h-full overflow-auto" />
        </ResultContextProvider>
      </div>

      {/* Always display the Upload Files section */}
      <div className="pt-0">
        <div className="flex justify-center">
          <button
            className="border border-neutral-200 p-8 rounded-2xl border-dashed"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
          >
            <div className="flex justify-center">
              <UploadIcon className="w-8 h-8 fill-white" />
            </div>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="text-center justify-center items-center">
                <p className="text-sm text-gray-400">Click to select files</p>
                <span className="text-xs text-gray-100" id="file_type_help">
                  Supported File Types: .pdf, .doc, .docx, .txt
                </span>
                <p className="text-white">
                  {uploading ? "Uploading..." : "Upload"}
                </p>
              </div>
            </div>
          </button>
        </div>
        <p
          className="mt-2 text-sm text-center text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          NOTE: Uploading a PDF using Safari doesn't work, we're looking into
          the issue. Make sure the text is OCR'd, i.e., you can copy it.
        </p>
        <div className="pt-8"></div>
      </div>
      <input
        ref={fileInput}
        accept="text/html,.pdf,.doc,.docx,.txt"
        type="file"
        className="hidden"
        onChange={handlePdfUpload}
        placeholder="Upload File"
      />
    </div>
  );
};

export default UploadPdf;
