import { RouterInputs, RouterOutputs } from "./api";
import { computeSHA256 } from "./utils";

type SignedUrlInputs = RouterInputs["file"]["getSignedUrl"];
type SignUrlOutputs = RouterOutputs["file"]["getSignedUrl"];

export async function uploadFiles(
  files: File[],
  urlMutation: (inputs: SignedUrlInputs) => Promise<SignUrlOutputs>,
): Promise<{ imageId: string | null }[]> {
  const uploadPromises = files.map(async (file) => {
    try {
      const cheakSum = await computeSHA256(file);
      const signedUrl = await urlMutation({
        type: file.type,
        size: file.size,
        checkSum: cheakSum,
      });

      if (!signedUrl || !signedUrl.url) {
        console.error("SignedUrl is not received");
        return { imageId: null };
      }

      const response = await fetch(signedUrl.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
          "Content-Length": file.size.toString(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error file not uploaded, ${file.name}`);
      }

      console.log("File uploaded successfully");
      return { imageId: signedUrl.fileId };
    } catch (error) {
      console.log(error);
      return { imageId: null };
    }
  });

  return Promise.all(uploadPromises);
}
