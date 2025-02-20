import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Skeleton } from "./ui/skeleton";

interface ComboboxProps {
  onChange: (value: string) => void;
  options: string[];
  isLoading: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  onChange,
  options,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);

  useEffect(() => {
    setFilteredOptions(options);
  }, [isOpen, options]);

  // Handle option selection
  const handleSelect = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">Select tag</Button>
      </PopoverTrigger>

      {isOpen && (
        <PopoverContent className="p-2">
          {isLoading ? (
            <Skeleton />
          ) : (
            <div>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <Button
                    key={option}
                    variant="ghost"
                    className="w-full text-left"
                    onClick={() => {
                      handleSelect(option);
                    }}
                  >
                    {option}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No options found
                </p>
              )}
            </div>
          )}
        </PopoverContent>
      )}
    </Popover>
  );
};
