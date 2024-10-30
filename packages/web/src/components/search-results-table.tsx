import * as React from "react";
import { useSearchForm } from "./search-form";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table";

export const SearchResultsTable: React.FC = () => {
  const { searchData } = useSearchForm();

  if (!searchData || !searchData.data || searchData.data.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <Table className="w-full mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Card Name</TableHead>
          <TableHead>Rarity</TableHead>
          <TableHead>Card Number</TableHead>
          <TableHead>Market Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {searchData.data.map((card: any) => (
          <TableRow key={card.SK}>
            <TableCell>{card.CardName}</TableCell>
            <TableCell>{card.Rarity}</TableCell>
            <TableCell>{card.SK.split("#")[1]}</TableCell> {/* Extracts Card Number from SK */}
            <TableCell>${parseFloat(card.Price).toFixed(2)}</TableCell> {/* Formats Price */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
