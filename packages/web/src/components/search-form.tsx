import React, { useMemo, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchFormContent } from "./search-form-content";
import { SetCategories } from "@/hooks/use-sets";

export type SearchFormContextType = {
  selectedCategory: SetCategories;
  setSelectedCategory: (category: SetCategories) => void;
  cardNumber: string;
  setCardNumber: (cardNumber: string) => void;
  selectedSet: string;
  setSelectedSet: (set: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchData: any;
  setSearchData: (data: any) => void;
};

export const SearchFormContext =
  React.createContext<SearchFormContextType | null>(null);

export const useSearchForm = (): SearchFormContextType => {
  const context = useContext(SearchFormContext);
  if (!context) {
    throw new Error("useSearchForm must be used within a SearchFormProvider.");
  }
  return context;
};

export const SearchFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCategory, _setSelectedCategory] =
    React.useState<SetCategories>("one-piece");
  const [cardNumber, setCardNumber] = React.useState<string>("");
  const [selectedSet, setSelectedSet] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [searchData, setSearchData] = React.useState<any>(null);

  const setSelectedCategory = (input: SetCategories) => {
    setSearchQuery("");
    setCardNumber("");
    setSelectedSet("");
    
    _setSelectedCategory(input);
  }

  const contextValue = useMemo(
    () => ({
      selectedCategory,
      setSelectedCategory,
      cardNumber,
      setCardNumber,
      selectedSet,
      setSelectedSet,
      searchQuery,
      setSearchQuery,
      searchData,
      setSearchData,
    }),
    [selectedCategory, cardNumber, selectedSet, searchQuery, searchData],
  );

  return (
    <SearchFormContext.Provider value={contextValue}>
      {children}
    </SearchFormContext.Provider>
  );
};

export const SearchForm: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Find Your Card's Value
          </CardTitle>
          <CardDescription>
            Select a category and search for your card using the filters below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchFormContent />
        </CardContent>
      </Card>
    </div>
  );
};
