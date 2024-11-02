import { ColumnDef } from "@tanstack/react-table";
import { useSearchForm } from "./search-form";
import { SearchFormFilters } from "./search-form-filters";
import { DataTable } from "./data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableImageDialog } from "./data-table-image-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "./ui/badge";

export type SearchContent = {
  imageUri: string;
  cardName: string;
  rarity: string;
  cardNumber: string;
  marketPrice: string;
  setName: string;
  flags: string[];
  game: string;
};

export const SearchFormContent = () => {
  const { searchData, selectedCategory } = useSearchForm();

  const columns: ColumnDef<SearchContent>[] = [
    {
      accessorKey: "imageUri",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        const card = row.original;
        return (
          <DataTableImageDialog
            imageUri={card.imageUri}
            cardName={card.cardName}
          />
        );
      },
    },
    {
      accessorKey: "cardName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Card Name" />
      ),
    },
    {
      accessorKey: "rarity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rarity" />
      ),
    },
    {
      accessorKey: "cardNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Card Number" />
      ),
    },
    {
      accessorKey: "marketPrice",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Market Price" />
      ),
      cell: ({ row }) => {
        const marketPrice = parseFloat(row.getValue("marketPrice"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(marketPrice);

        return <div className="text-left">{formatted}</div>;
      },
    },
    {
      accessorKey: "setName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Set Name" />
      ),
    },
    ...(selectedCategory === "one-piece"
      ? [
          {
            accessorKey: "flags",
            header: ({ column }: { column: any }) => (
              <DataTableColumnHeader column={column} title="Flags" />
            ),
            cell: ({ row }: { row: any }) => {
              const flags = row.getValue("flags");
              if (!flags || flags.length === 0) {
                return null;
              }
              return (
                <div className="flex flex-wrap gap-1">
                  {flags.map((flag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {flag}
                    </Badge>
                  ))}
                </div>
              );
            },
          },
        ]
      : []),
    {
      id: "actions",
      cell: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  window.open(`https://www.tcgplayer.com`, "_blank")
                }
              >
                View on TCGPlayer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <SearchFormFilters />
      {searchData && <DataTable columns={columns} data={searchData} />}
    </div>
  );
};
