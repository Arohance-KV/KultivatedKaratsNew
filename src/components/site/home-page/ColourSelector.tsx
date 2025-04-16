import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for class merging
import { Button } from "@/components/ui/button"; // Assuming this is your shadcn button component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Assuming these are your shadcn popover components
import { Check, ChevronDown } from "lucide-react"; // Assuming you are using lucide-react for icons

interface ColorOption {
  value: string;
  label: string;
  color: string;
}

const colorOptions: ColorOption[] = [
  { value: "white", label: "White", color: "#F9FAFB" },
  { value: "yellow-gold", label: "Yellow Gold", color: "#FACC15" },
  { value: "rose-gold", label: "Rose Gold", color: "#F472B6" },
];

interface ColorSelectProps {
  label?: string;
  onChange?: (value: string | undefined) => void;
  defaultValue?: string;
}

export const ColorSelector: React.FC<ColorSelectProps> = ({
  label = "Select",
  onChange,
  defaultValue,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  const displayValue = colorOptions.find((option) => option.value === selectedValue)?.label || label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            !selectedValue && "text-muted-foreground"
          )}
        >
          {displayValue}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        {colorOptions.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            className={cn(
              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
              selectedValue === option.value && "bg-accent text-accent-foreground",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            onClick={() => handleSelect(option.value)}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-6 rounded-sm"
                style={{ backgroundColor: option.color }}
              ></div>
              {option.label}
            </div>
            {selectedValue === option.value && (
              <Check className="ml-2 h-4 w-4" />
            )}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};