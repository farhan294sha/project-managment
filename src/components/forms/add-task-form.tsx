import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { useForm } from "react-hook-form";
import { CalendarIcon, FlagIcon, Loader2, Plus } from "lucide-react";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { z } from "zod";
import { cn } from "~/lib/utils";

import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useTaskSection } from "~/context/title-context";
import { createTaskSchema } from "~/utils/schema/task";
import { signIn, useSession } from "next-auth/react";
import { AssigneeDisplay } from "../assignee";

// TODO: need to put zod schema to seprate file
export type TaskFormValues = z.infer<typeof createTaskSchema>;

export default function TaskForm({ onSave }: { onSave: () => void }) {
  const taskSection = useTaskSection() as "Todo" | "InProgress" | "Done"; // Need better way to do this
  const router = useRouter();
  const utils = api.useUtils();
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    signIn(undefined, {
      callbackUrl: "/app/project",
    });
  }
  const { image, name } = session?.user || {};

  const taskMutation = api.task.create.useMutation({
    onSuccess(data, variables) {
      utils.project.getTask.invalidate({ projectId: variables.projectId });
      onSave();
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
    },
  });
  const projectId = router.asPath.split("/").slice(-1)[0];

  function onSubmit(data: TaskFormValues) {
    if (!projectId) {
      return;
    }
    console.log(data.deadline);
    taskMutation.mutateAsync({ ...data, projectId });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* Title */}
        <div className="grid h-[calc(100vh-8rem)] grid-cols-1 md:grid-cols-5">
          <div className="col-span-3 space-y-2 overflow-auto border-r p-6">
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
            {/* Right Side */}
            {/* Description */}
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
            <Button type="submit" disabled={taskMutation.isPending}>
              {taskMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
          <div className="col-span-2 w-full space-y-6 bg-accent/50 p-6 overflow-auto">
            {/* Created By */}
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

            {/* Assignee */}
            <div className="space-y-2">
              <AssigneeDisplay
                onChange={(emails) => form.setValue("memberEmails", emails)}
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-muted-foreground">
                      Due Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"ghost"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date <= new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-muted-foreground">
                      Priority
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High" className="flex gap-2">
                            <div className="flex items-center gap-2">
                              <FlagIcon className="h-4 w-4 text-red-800" />
                              <div>High</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="Medium">
                            <div className="flex items-center gap-2">
                              <FlagIcon className="h-4 w-4 text-orange-600" />

                              <div>Medium</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="Low" className="flex gap-2">
                            <div className="flex items-center gap-2">
                              <FlagIcon className="h-4 w-4 text-green-600" />

                              <div>Low</div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Tags</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Design</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  type="button"
                >
                  <Plus className="h-3 w-3" />
                  Add tag
                </Button>
              </div>
            </div>

            {/* Created/Updated Info */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex flex-col gap-2 text-sm">
                <span>Created</span>
                <span className="text-xs text-muted-foreground">
                  Feb 2, 2023 4:30 PM
                </span>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <span>Updated</span>
                <span className="text-xs text-muted-foreground">
                  Feb 2, 2023 4:55 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
