"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon, FlagIcon, Loader2, Plus } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import FileUploadFeild from "./file-upload";
import { api } from "~/utils/api";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "~/utils/constant";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

export const taskUpdateSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().optional(),
  status: z.enum(["Todo", "InProgress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  deadline: z.date().optional(),
  files: z
    .unknown()
    .transform((value) => {
      return value as FileList;
    })
    .refine((files) => {
      for (const file of Array.from(files)) {
        if (file.size > MAX_FILE_SIZE) return false;
      }
      return true;
    }, "File size must be less than 5MB")
    .refine((files) => {
      for (const file of Array.from(files)) {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) return false;
      }
      return true;
    }, "Only PDF and image files (JPEG, png) are allowed")
    .optional(),
  tags: z.array(z.string()).optional(),
});

type UpdateTaskSchema = z.infer<typeof taskUpdateSchema>;

// Form
export function TaskFormUpdate() {
  const form = useForm<UpdateTaskSchema>({
    resolver: zodResolver(taskUpdateSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "Todo",
      priority: "Low",
    },
  });
  const mutation = api.task.update.useMutation();
  const signUrlMutation = api.file.getSignedUrl.useMutation({
    onError(error) {
      form.setError("root", { message: error.message });
    },
  });

  async function onSubmit(values: z.infer<typeof taskUpdateSchema>) {
    const { files } = values;
    if (files) {
      //try {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
          const signedUrl = await signUrlMutation.mutateAsync();

          await fetch(signedUrl.url, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });
          console.log(signedUrl);
        }
      }
      //} catch (_) {}
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid h-[calc(100vh-8rem)] grid-cols-1 md:grid-cols-5">
          <div className="col-span-3 space-y-2 overflow-auto border-r p-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
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
                    <Textarea
                      placeholder="Task description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root?.message && (
              <p className="text-red-500">
                {form.formState.errors.root.message}
              </p>
            )}
            <FileUploadFeild control={form.control} name="files" />

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Task"
              )}
            </Button>
          </div>
          <div className="col-span-2 w-full space-y-6 bg-accent/50 p-6 overflow-auto">
            {/* Created By */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Created by</div>
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary/10 text-xs">
                    MJ
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">Michelle Jordan</span>
              </div>
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Assignee</div>
              <div className="flex items-center gap-1">
                {/* TODO: make like +2 when more than 4  */}
                <Avatar className="h-7 w-7 border-2 border-background text-xs">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6 border-2 border-background text-xs">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6 border-2 border-background text-xs">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
                {/* TODO: Need to show members of project when click */}
                <Button
                  variant="purpleIcon"
                  size="purpleIcon"
                  className="h-6 w-6 rounded-full"
                  type="button"
                >
                  <Plus className="h-3 w-3 text-primary/70" />
                </Button>
              </div>
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
