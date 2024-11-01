import * as React from "react";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { SearchFormTabs } from "./search-form-tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { SearchFormSetSelect } from "./search-form-set-select";
import { SearchFormCardNumber } from "./search-form-card-number";
import { useSearchForm } from "./search-form";
import { useSets } from "@/hooks/use-sets";
import { useCards } from "@/hooks/use-cards";

export const SearchFormFilters: React.FC = () => {
  const { cardNumber, selectedSet, selectedCategory, searchQuery, setSearchQuery, setSearchData } = useSearchForm();
  const { fetchCardsBySetNameAndCardNumber, fetchCardsBySetName, fetchCardsBySetNameAndCardNumberAndQuery, fetchCardsBySetNameAndQuery} = useSets(selectedCategory);
  const { fetchCardsByCardNumber, fetchCardsByGame, fetchCardsByNumberAndQuery } = useCards();

  const handleSearch = async () => {
    console.log("Searching with", { searchQuery, cardNumber, selectedSet });

    try {
      if (!selectedSet && !cardNumber && !searchQuery) {
        console.log("Please provide at least a set, card number, or search query.");
        return;
      }

      if (cardNumber && selectedSet && searchQuery) {
        console.log("Search for all three..");
        const data = await fetchCardsBySetNameAndCardNumberAndQuery(selectedCategory, selectedSet, cardNumber, searchQuery);
        setSearchData(data);
        console.log("Card Data11:", data);
        return;
      }

      // Search by card number and set name
      if (cardNumber && selectedSet) {
        const data = await fetchCardsBySetNameAndCardNumber(selectedCategory, selectedSet, cardNumber);
        setSearchData(data);
        console.log("Card Data:", data);
        return;
      }

      if (cardNumber && searchQuery) {
        const data = await fetchCardsByNumberAndQuery(selectedCategory, cardNumber, searchQuery);
        setSearchData(data);
        console.log("Card Dataaa:", data);
        return;
      }

      if (selectedSet && searchQuery) {
        const data = await fetchCardsBySetNameAndQuery(selectedCategory, selectedSet, searchQuery);
        setSearchData(data);
        console.log("Card Data1212:", data);
        return;
      }

      // Search by set name only
      if (selectedSet) {
        const data = await fetchCardsBySetName(selectedCategory, selectedSet);
        setSearchData(data);
        console.log("Card Data by Set Name:", data);
        return;
      }

      // Search by card number only
      if (cardNumber) {
        const data = await fetchCardsByCardNumber(selectedCategory, cardNumber);
        setSearchData(data);
        console.log("Card Data:", data);
        return;
      }

      // Search by game and query (newly added functionality)
      if (searchQuery) {
        if (selectedCategory !== "all") {
          const data = await fetchCardsByGame(selectedCategory, searchQuery);
          setSearchData(data);
          console.log("Card Data by Search Query:", data);
          return;
        } else {
          const data = await fetchCardsByGame(selectedCategory, searchQuery);
          setSearchData(data);
          console.log("Card Data by Search Query:", data);
          return;
        }

      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <div>
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-5 w-5" />
              <span className="font-semibold text-lg">Search Filters</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <SearchFormTabs />

              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <SearchFormSetSelect />
                <SearchFormCardNumber />
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search for cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleSearch} className="w-32 flex items-center justify-center space-x-2">
                  <SearchIcon className="h-4 w-4" />
                  <span>Search</span>
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
