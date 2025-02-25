import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, PlusIcon, X } from "lucide-react";
import AvatarGroupDisplay from "./avatar-group-display";
import { api, RouterOutputs } from "~/utils/api";
import InputTags from "./invite-input";
import { z } from "zod";
import { cn } from "~/lib/utils";
import { useToast } from "~/hooks/use-toast";

const emailsSchema = z.array(z.string().email()).min(1,"Provide at least 1 email");

const InviteMember = ({
  project,
}: {
  project: RouterOutputs["project"]["getbyId"]; 
}) => {
  const [openInput, setopenInput] = useState(false);
  const [tagError, setTagError] = useState("");
  const [emails, setEmails] = useState<string[]>([]);

  const qureyClient = api.useUtils();
  const { toast } = useToast();

  const addMemberMut = api.project.addMembers.useMutation({
    async onSuccess() {
      await qureyClient.project.getbyId.invalidate({ id: project.id });
      toast({ title: "Invited Successfully" });
      setopenInput(false);
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: error.message,
      });
    },
  });

  const handleEmailsChange = (emails: string[]) => {
    const result = emailsSchema.safeParse(emails);

    if (result.success) {
      setTagError("");
      setEmails(result.data);
      // ... your API call
    } else {
      setTagError("Enter valid emails");
      console.error("Invalid emails:", result.error.errors);
    }
  };

  async function handleSentEmail() {
    const result = emailsSchema.safeParse(emails);
    try {
      if (!result.success) {
        return setTagError("Provide al least 1 email");
      }
      await addMemberMut.mutateAsync({
        projectId: project.id,
        memberEmails: emails,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="flex gap-2">
      {openInput && (
        <div className="flex items-center gap-2">
          <div className="relative ">
            <InputTags
              createDiscription="Add new email"
              placeholder="Enter email..."
              label="Members"
              onChange={(tags) => {
                const emails = tags.map((tag) => tag.label);
                handleEmailsChange(emails);
              }}
              error={tagError}
            />
            <div
              className={cn(
                "absolute top-0 right-2",
                "text-muted-foreground",
                "hover:text-black",
                "cursor-pointer"
              )}
              onClick={() => setopenInput(false)}
            >
              <X className="w-5 h-5" />
            </div>
          </div>
          <Button className="mt-4" onClick={handleSentEmail}>
            {addMemberMut.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Sent Invite"
            )}
          </Button>
        </div>
      )}
      {!openInput && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size={openInput ? "lg" : "purpleIcon"}
            variant="purpleIcon"
            onClick={() => setopenInput(true)}
          >
            <PlusIcon className="h-4 w-4 text-primary/90" />
          </Button>
          <div className="font-medium text-primary">Invite</div>
        </div>
      )}

      {project.members.length > 0 && (
        <AvatarGroupDisplay members={project.members} />
      )}
    </div>
  );
};

export default InviteMember;
