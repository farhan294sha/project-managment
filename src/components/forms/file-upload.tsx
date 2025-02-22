import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
type FileUploadprops = {
  control: Control<{
    title: string;
    status: "Todo" | "InProgress" | "Done";
    priority: "Low" | "Medium" | "High";
    description?: string | undefined;
    deadline?: Date | undefined;
    files?: FileList | undefined;
    imageUrls?: string[] | undefined;
    tags?: string[] | undefined;
  }>;
  name: "files";
};

const FileUploadFeild = ({ control, name }: FileUploadprops) => {
  const [preview, setPreview] = useState<{ type: string; blob: string }[]>([]);

  function handileFileChange(e: ChangeEvent<HTMLInputElement>, field) {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const preViewUrls = fileArray.map((file) => {
        return {
          type: file.type,
          blob: URL.createObjectURL(file),
        };
      });
      setPreview(preViewUrls);
      field.onChange(files);
    }
  }
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Attachments (max 5MB each)</FormLabel>
          <FormControl>
            <Input
              type="file"
              multiple
              onChange={(e) => handileFileChange(e, field)}
            />
          </FormControl>
          <FormDescription>Upload relevant files for this task</FormDescription>
          <FormMessage />
          {preview.length > 0 && (
            <div className="mt-4 flex h-20 items-center gap-2 space-y-4 overflow-scroll">
              {preview.map((file, index) => (
                <div key={index} className="relative">
                  {file.type.endsWith("pdf") ? (
                    <iframe src={file.blob}></iframe>
                  ) : (
                    <Image
                      src={file.blob}
                      alt="preview"
                      width={200}
                      height={300}
                      className="h-auto rounded-lg object-cover"
                    />
                  )}
                  <Button
                    type="button"
                    className="absolute right-2 top-1 h-4 w-4 rounded-full"
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => {
                      const updatedPreiew = preview.filter(
                        (_, i) => i !== index,
                      );
                      setPreview(updatedPreiew);
                      // on input feild
                      if (field.value) {
                        const updatedFiles = Array.from(field?.value).filter(
                          (_, i) => i !== index,
                        );
                        field.onChange(updatedFiles);
                      }
                    }}
                  >
                    x
                  </Button>
                </div>
              ))}
            </div>
          )}
        </FormItem>
      )}
    />
  );
};
export default FileUploadFeild;
