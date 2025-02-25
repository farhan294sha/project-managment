import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { Textarea } from "../ui/textarea";
import { api } from "~/utils/api";
import { useTaskSection } from "~/context/task-section-context";
import { createTaskSchema, TaskFormValues } from "~/utils/schema/task";
import { useSession } from "next-auth/react";
import { AssigneeDisplay } from "../assignee";
import TagManager from "../tag-manager";
import DueDateForm from "./due-date-form";
import PriorityForm from "./priority-form";
import { useActiveProjectState } from "~/store/active-project";
import { useToast } from "~/hooks/use-toast";

export default function TaskForm({ onSave }: { onSave: () => void }) {
  const taskSection = useTaskSection() as "Todo" | "InProgress" | "Done";
  const utils = api.useUtils();
  const { data: session } = useSession();
  const { image, name } = session?.user || {};
  const { data: projectId } = useActiveProjectState();
  const { toast } = useToast();
  // Create task mutation
  const createTaskMutation = api.task.create.useMutation({
    async onSuccess(data, variables) {
      await utils.project.getTask.invalidate({
        projectId: variables.projectId,
      });
      toast({title: "Task created succefully"})
      onSave();
    },
    onError(error) {
      toast({
        title: "Something went worng",
        description: error.message,
      });
    },
  });

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: undefined,
      priority: "Medium",
      taskStatus: taskSection,
      projectId: projectId?.projectId ?? "",
    },
  });

  async function onSubmit(data: TaskFormValues) {
    if (!projectId?.projectId) return;
    try {
      await createTaskMutation.mutateAsync({
        ...data,
        projectId: projectId.projectId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const isPending = createTaskMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full space-y-6">
        <div className="grid h-full grid-cols-1 md:grid-cols-5 overflow-hidden">
          <div className="col-span-3 space-y-2 p-6 overflow-auto h-full">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "Create Task"}
            </Button>
          </div>

          <div className="col-span-2 overflow-auto h-full">
            <div className="space-y-6 bg-accent/50 p-6 w-full h-full">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Created by</div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={image ? image : "./placeholder"} />
                    <AvatarFallback className="bg-primary/10 text-xs">
                      {name && name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <AssigneeDisplay
                  onChange={(emails) => form.setValue("memberEmails", emails)}
                />
              </div>

              <div className="space-y-2">
                <DueDateForm form={form} />
              </div>

              <div className="space-y-2">
                <PriorityForm form={form} />
              </div>

              <div className="space-y-2">
                {/* <InputTags/> */}
                <TagManager
                  onChange={(tags) => {
                    form.setValue("tags", tags);
                  }}
                />
                {form.formState.errors.tags && (
                  <p className="text-red-600">Required</p>
                )}
              </div>
              {/* 
              {isEditMode && (
                <div className="space-y-2 border-t pt-4">
                  <div className="flex flex-col gap-2 text-sm">
                    <span>Created</span>
                    <span className="text-xs text-muted-foreground">
                      {existingTask.createdAt ? new Date(existingTask.createdAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 text-sm">
                    <span>Updated</span>
                    <span className="text-xs text-muted-foreground">
                      {existingTask.updatedAt ? new Date(existingTask.updatedAt).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
