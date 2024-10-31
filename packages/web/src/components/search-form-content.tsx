import { useSearchForm } from "./search-form";
import { SearchFormFilters } from "./search-form-filters";
import { SearchResultsTable } from "./search-results-table";

export const SearchFormContent = () => {
  const { searchData } = useSearchForm();

  return (
    <div className="space-y-6">
      <SearchFormFilters />
      {searchData && <SearchResultsTable />}
    </div>
  );
};
