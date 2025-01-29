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
import { CalendarIcon } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import FileUploadFeild from "./file-upload";
import { api } from "~/utils/api";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "~/utils/constant";

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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Todo">To Do</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        new Date(field.value).toLocaleDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root?.message && (
          <p className="text-red-500">{form.formState.errors.root.message}</p>
        )}
        <FileUploadFeild control={form.control} name="files" />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          Update Task
        </Button>
      </form>
    </Form>
  );
}
