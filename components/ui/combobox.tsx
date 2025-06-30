import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
    value: string | number;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    emptyMessage?: string;
    searchPlaceholder?: string;
    className?: string;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = "Seleccionar...",
    emptyMessage = "No se encontraron resultados.",
    searchPlaceholder = "Buscar...",
    className,
}: ComboboxProps) {
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find((option) => option.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.label}
                                onSelect={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                className="truncate"
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4 shrink-0",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <span className="truncate">{option.label}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
} 