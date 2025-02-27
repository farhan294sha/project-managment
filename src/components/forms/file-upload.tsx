import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import Image from "next/image";


const FileUploadFeild = ({
  onFileSelect,
}: {
  onFileSelect: (file: File[]) => void;
}) => {
  const [myFiles, setMyFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
      onFileSelect([...myFiles, ...acceptedFiles])
    },
    [myFiles, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 3,
      accept: {
        "image/*": [".jpeg", ".png"],
        "application/pdf": [".pdf"],
      },
      maxSize: 1024 * 1024 * 5,
    });

  const removeFile = (file: File) => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);

    setMyFiles(newFiles);
    onFileSelect(newFiles)
  };

  const files = myFiles.map((file: File) => (
    <li key={file.name} className="relative w-full h-full">
      <Image src={URL.createObjectURL(file)} alt="images" fill />
      <Button
        className="absolute top-0"
        variant={"secondary"}
        size={"purpleIcon"}
        onClick={(e) => {
          e.stopPropagation();
          console.log("Button clicked");
          removeFile(file);
        }}
      >
        <X className="w-5 h-5" />
      </Button>
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.path}>
        <ul className="text-red-900">
          {errors.map((e) => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    );
  });

  return (
    <div {...getRootProps()} className={cn("max-w-xl", "relative")}>
      <label
        className={cn(
          "flex flex-col justify-center items-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none",
          isDragActive && "border-primary/40"
        )}
      >
        <span className="flex items-center space-x-2">
          <Upload />
          <>
            {!isDragActive ? (
              <span className="font-medium text-gray-600">
                Drop image/pdf to Attach, or{" "}
                <span className="text-violet-600 underline">browse</span>
              </span>
            ) : (
              <span>Drop files here...</span>
            )}
          </>
        </span>
        <input {...getInputProps()} />
        <em className="font-medium text-gray-600 text-sm">
          (Upload up to 3 files, 5MB maximum size each.)
        </em>
      </label>
      <aside className="mt-4">
        <ul className="flex h-36 absolute w-full top-0">{files}</ul>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </div>
  );
};
export default FileUploadFeild;
