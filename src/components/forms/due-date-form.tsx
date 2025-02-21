import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { cn } from "~/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

import { FieldPath, UseFormReturn } from "react-hook-form";

// Generic type that ensures the form has a deadline field
type DueDateFormProps<T extends { deadline?: Date | undefined }> = {
  form: UseFormReturn<T>;
};

// Generic component that works with any form containing deadline field
function DueDateForm<T extends { deadline?: Date | undefined }>({
  form,
}: DueDateFormProps<T>) {
  return (
    <FormField
      control={form.control}
      name={"deadline" as FieldPath<T>} // Type safety for form field name
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
                  className={cn("w-full justify-start text-left font-normal", {
                    "text-muted-foreground": !field.value,
                  })}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "PPP") : "Pick a date"}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default DueDateForm;
