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
  const {
    cardNumber,
    selectedSet,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    setSearchData,
  } = useSearchForm();
  const {
    fetchCardsBySetNameAndCardNumber,
    fetchCardsBySetName,
    fetchCardsBySetNameAndCardNumberAndQuery,
    fetchCardsBySetNameAndQuery,
  } = useSets(selectedCategory);
  const {
    fetchCardsByCardNumber,
    fetchCardsByGame,
    fetchCardsByNumberAndQuery,
  } = useCards();

  const handleSearch = async () => {
    console.log("Searching with", { searchQuery, cardNumber, selectedSet });
    let response = null;

    try {
      // Validate that at least one search criterion is provided
      if (!selectedSet && !cardNumber && !searchQuery) {
        console.log(
          "Please provide at least a set, card number, or search query.",
        );
        return;
      }

      if (cardNumber && selectedSet && searchQuery) {
        response = await fetchCardsBySetNameAndCardNumberAndQuery(
          selectedCategory,
          selectedSet,
          cardNumber,
          searchQuery,
        );
        console.log("Card Data with all criteria:", response);
        if (response && response.data) {
          formatAndSetData(response.data);
        }
        return;
      }

      if (cardNumber && selectedSet) {
        response = await fetchCardsBySetNameAndCardNumber(
          selectedCategory,
          selectedSet,
          cardNumber,
        );
        console.log("Card Data by Set and Card Number:", response);
        if (response && response.data) {
          formatAndSetData(response.data);
        }
        return;
      }

      if (cardNumber && searchQuery) {
        response = await fetchCardsByNumberAndQuery(
          selectedCategory,
          cardNumber,
          searchQuery,
        );
        console.log("Card Data by Card Number and Query:", response);
        if (response && response.data) {
          formatAndSetData(response.data);
        }
        return;
      }

      if (selectedSet && searchQuery) {
        response = await fetchCardsBySetNameAndQuery(
          selectedCategory,
          selectedSet,
          searchQuery,
        );
        console.log("Card Data by Set Name and Query:", response);
        if (response && response.data) {
          formatAndSetData(response.data);
        }
        return;
      }

      if (selectedSet) {
        response = await fetchCardsBySetName(selectedCategory, selectedSet);
        console.log("Card Data by Set Name:", response);
        if (response && response.data) {
          formatAndSetData(response.data);
        }
        return;
      }

      if (cardNumber) {
        response = await fetchCardsByCardNumber(selectedCategory, cardNumber);
        console.log("Card Data by Card Number:", response);
        if (response && response.data) {
          formatAndSetData(response.data);
        }
        return;
      }

      if (searchQuery) {
        response = await fetchCardsByGame(selectedCategory, searchQuery);
        console.log("Card Data by Search Query:", response);
        if (response && response.data) {
          formatAndSetData(response.data);
        }
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const formatAndSetData = (data: any[]) => {
    const formattedData = data.map((item: any) => {
      const flags = [];
      if (item.AlternateArt) flags.push("Alternate Art");
      if (item.Manga) flags.push("Manga");
      if (item.Parallel) flags.push("Parallel");
      console.log("HERE");
      console.log(item.Game);
      return {
        imageUri: `https://cdn.tcg-price-guide.com/${item.S3Key}`,
        cardName: item.CardName,
        rarity: item.Rarity,
        cardNumber: item.SK.split("#")[1],
        marketPrice: item.Price,
        setName: item.SetName,
        flags,
        game: item.Game,
      };
    });
    setSearchData(formattedData);
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
                <Button
                  onClick={handleSearch}
                  className="w-32 flex items-center justify-center space-x-2"
                >
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
