import { FlagIcon } from "lucide-react";
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FieldPath, UseFormReturn } from "react-hook-form";

type PriorityFormProps<T extends { priority?: "High" | "Medium" | "Low" }> = {
  form: UseFormReturn<T>;
};

function PriorityForm<T extends { priority?: "High" | "Medium" | "Low" }>({
  form,
}: PriorityFormProps<T>) {
  return (
    <FormField
      control={form.control}
      name={"priority" as FieldPath<T>}
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
  );
}

export default PriorityForm;
