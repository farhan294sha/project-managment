import React, { useEffect, useState } from "react";
import TagManager from "../tag-manager";
import PriorityForm from "./priority-form";
import DueDateForm from "./due-date-form";
import { AssigneeDisplay } from "../assignee";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { UpdateFormTypes, updateTaskSchema } from "~/utils/schema/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api, RouterOutputs } from "~/utils/api";
import { useToast } from "~/hooks/use-toast";
import { useActiveProjectState } from "~/store/active-project";
import { useSession } from "next-auth/react";
import { useTaskSection } from "~/context/task-section-context";
import TaskDetailSkeleton from "../loading-skeleton/task-display";

const UpdateTask = ({
  taskId,
  onSave,
}: {
  taskId: string;
  onSave: () => void;
}) => {
  const taskSection = useTaskSection() as "Todo" | "InProgress" | "Done";
  const utils = api.useUtils();
  const { data: session } = useSession();
  const { image, name } = session?.user || {};
  const { data: projectId } = useActiveProjectState();
  const { toast } = useToast();

  const [taskDetails, setTaskDetails] = useState<
    RouterOutputs["task"]["getbyId"] | null
  >(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setLoading(true);
      try {
        const details = await utils.task.getbyId.ensureData({ taskId: taskId });
        setTaskDetails(details);
      } catch (error) {
        console.error("Error fetching task details:", error);
        toast({
          title: "Error fetching task details",
          description: "Failed to load task.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId, toast, utils]);

  const updateMutation = api.task.update.useMutation({
    async onSuccess(variables) {
      await utils.task.getbyId.invalidate({ taskId: variables.id });
      await utils.task.getTask.invalidate({
        projectId: projectId?.projectId ?? "",
      });
      toast({ title: "Task is updated" });
      onSave();
    },
    onError(error) {
      toast({ title: "Something went worng", description: error.message });
    },
  });

  const form = useForm<UpdateFormTypes>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      id: taskId,
      title: taskDetails?.title,
      description: taskDetails?.description ?? undefined,
      deadline: taskDetails?.deadline ?? undefined,
      priority: taskDetails?.priority,
      taskStatus: taskSection,
      projectId: projectId?.projectId ?? "",
      memberEmails: taskDetails?.assignedTo.map((member) => member.email),
      tags: taskDetails?.tags.map((tag) => tag.name),
    },
  });

  useEffect(() => {
    if (taskDetails) {
      form.reset({
        id: taskId,
        title: taskDetails.title ?? "",
        description: taskDetails.description ?? "",
        deadline: taskDetails.deadline
          ? new Date(taskDetails.deadline)
          : undefined,
        priority: taskDetails.priority ?? "Medium",
        taskStatus: taskSection,
        projectId: projectId?.projectId ?? "",
        memberEmails:
          taskDetails.assignedTo?.map((member) => member.email) ?? [],
      });
    }
  }, [taskDetails, form, taskId, taskSection, projectId]);

  async function onSubmit(data: UpdateFormTypes) {
    if (!projectId?.projectId) return;
    try {
      await updateMutation.mutateAsync({
        ...data,
        projectId: projectId.projectId,
      });
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <TaskDetailSkeleton />;
  }

  const isPending = updateMutation.isPending;

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
              {isPending ? <Loader2 className="animate-spin" /> : "Update task"}
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
                  assignedTo={taskDetails?.assignedTo.map(
                    (assignee) => assignee
                  )}
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
                  defaultTags={
                    taskDetails?.tags.map((tag) => ({
                      id: tag.id,
                      label: tag.name,
                    })) ?? []
                  }
                  onChange={(tags) => {
                    form.setValue("tags", tags);
                  }}
                />
                {form.formState.errors.tags && (
                  <p className="text-red-600">Required</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default UpdateTask;
