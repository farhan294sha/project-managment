import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useToast } from "~/hooks/use-toast";
import InputTags from "./invite-input";

interface TagManagerProps {
  onChange: (tags: string[]) => void;
  defaultTags?: Tag[];
}

interface Tag {
  id: string;
  label: string;
  color?: string;
}

export default function TagManager({ onChange, defaultTags }: TagManagerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const apiClient = api.useUtils();
  const projectId = router.query.projects as string;
  const {
    data: projectTags,
    isError,
    error,
  } = api.project.getTags.useQuery(
    { projectId: projectId },
    { enabled: !!projectId }
  );

  const createTagMut = api.project.updateTags.useMutation({
    async onSuccess(data, variables) {
      onChange(variables.tags);
      await apiClient.project.getTags.invalidate({ projectId: projectId });
    },
    onError(error) {
      toast({ title: error.message });
    },
  });

  async function handleTagChange(tags: Tag[]) {
    let tagsToAdd;
    if (projectTags && projectTags.length > 0) {
      tagsToAdd = tags.filter((tag) => {
        return !projectTags.some((projectTag) => projectTag.id === tag.id);
      });
    } else {

      tagsToAdd = tags;
    }

    if (tagsToAdd.length > 0) {
      try {
        console.log("REACHED CRETAE MUT");
        await createTagMut.mutateAsync({
          projectId: projectId,
          tags: tagsToAdd.map((tag) => tag.label),
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      onChange(tags.map((tag) => tag.label));
    }
  }

  return (
    <InputTags
      onChange={handleTagChange}
      suggestions={
        projectTags
          ? projectTags?.map((projectTag) => {
              return { id: projectTag.id, label: projectTag.name };
            })
          : undefined
      }
      error={isError && error.message ? error.message : undefined}
      defaultTags={defaultTags}
    />
  );
}
