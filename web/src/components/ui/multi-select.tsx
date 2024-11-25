"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export type Option = { label: string; value: string };

interface ISelectProps {
  placeholder: string;
  options: Option[];
  selected?: string[];
  onChange?: (...event: any[]) => void;
}

const MultiSelect = ({
  placeholder,
  options: values,
  selected = [],
  onChange,
}: ISelectProps) => {

  const handleSelectChange = (value: string) => {
    let newSelected: string[];
    if (!selected.includes(value)) {
      newSelected = [...selected, value];
    } else {
      newSelected = selected.filter(item => item !== value);
    }
    
    if (onChange) {
      onChange(newSelected);
    }
  };

  const isOptionSelected = (value: string): boolean => {
    return selected.includes(value);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
          >
            <div>
              {selected.length === 0 ? (
                placeholder
              ) : (
                `${selected.length} selected`
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          {values.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isOptionSelected(option.value)}
              onCheckedChange={() => handleSelectChange(option.value)}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MultiSelect;