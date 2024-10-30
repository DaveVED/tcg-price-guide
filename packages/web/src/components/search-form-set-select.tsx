import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react"; // Correct icon name
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSets } from "@/hooks/use-sets";
import { useSearchForm } from "./search-form";

interface Set {
  SlugSetName: string;
  SetName: string;
}

export const SearchFormSetSelect: React.FC = () => {
  const { selectedCategory, selectedSet, setSelectedSet } = useSearchForm();
  const { sets, setsError, setsLoading } = useSets(selectedCategory);

  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-1/2 justify-between"
        >
          {selectedSet
            ? sets?.data?.find((set: Set) => set.SlugSetName === selectedSet)?.SetName
            : "Select a set..."}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search sets..." className="h-9" />
          <CommandList>
            <CommandEmpty>No sets found.</CommandEmpty>
            <CommandGroup>
              {setsLoading && <CommandItem>Loading sets...</CommandItem>}
              {setsError && <CommandItem>Error loading sets</CommandItem>}
              {!setsLoading &&
                !setsError &&
                sets?.data?.map((set: Set) => (
                  <CommandItem
                    key={set.SlugSetName}
                    value={set.SlugSetName}
                    onSelect={(currentValue) => {
                      setSelectedSet(currentValue === selectedSet ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {set.SetName}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedSet === set.SlugSetName ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
