import React from "react";
import { Input } from "./ui/input";

type LabeledInputProps = {
  label: string;
  id: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
const LabeledInput = ({ label, id, ...props }: LabeledInputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input {...props} id={id} />
    </div>
  );
};
export default LabeledInput;
