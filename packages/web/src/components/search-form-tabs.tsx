import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfinityIcon } from "lucide-react";
import { useSearchForm } from "./search-form";
import { SetCategories } from "@/hooks/use-sets";

export interface SearchCriteriaTabs {
  name: string;
  value: SetCategories;
  content: string;
}

export const searchCriteriaTabs: SearchCriteriaTabs[] = [
  { name: "One Piece", value: "one-piece", content: "Search for One Piece trading cards." },
  { name: "Pokemon", value: "pokemon", content: "Search for Pokémon trading cards." },
  { name: "All", value: "all", content: "Search all trading cards." },
];

export const SearchFormTabs: React.FC = () => {
  const { setSelectedCategory } = useSearchForm();

  return (
    <Tabs
      defaultValue="one-piece"
      className="w-full"
      onValueChange={(value) => setSelectedCategory(value as SetCategories)}
    >
      <TabsList className="grid w-full grid-cols-3 mb-6">
        {searchCriteriaTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex items-center justify-center">
            {tab.value === "all" ? <InfinityIcon className="mr-2 h-4 w-4" /> : null}
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
