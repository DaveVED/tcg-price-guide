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
import { SearchResultsTable } from "./search-results-table"; // Import the table component

export const SearchFormFilters: React.FC = () => {
  const { cardNumber, selectedSet, selectedCategory, searchQuery, setSearchQuery, setSearchData, searchData } = useSearchForm();
  const { fetchCardByNumber } = useSets(selectedCategory);

  const handleSearch = async () => {
    console.log("Searching with", { searchQuery, cardNumber, selectedSet });
  
    try {
      if (cardNumber && selectedSet) {
        const data = await fetchCardByNumber(selectedCategory, selectedSet, cardNumber);
        setSearchData(data); // Set the search data in the context
        console.log("Card Data:", data);
      } else {
        console.log("Please provide both a set and card number.");
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

            {/* Display Search Results Table */}
            {searchData && <SearchResultsTable />}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
