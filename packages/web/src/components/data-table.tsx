import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [isFilterExpanded, setIsFilterExpanded] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const getUniqueRarities = () => {
    const rarities = new Set(data.map((item: any) => item.rarity));
    return Array.from(rarities);
  };

  const getUniqueSetNames = () => {
    const setNames = new Set(data.map((item: any) => item.setName));
    return Array.from(setNames);
  };

  const getUniqueCardNumbers = () => {
    const cardNumbers = new Set(data.map((item: any) => item.cardNumber));
    return Array.from(cardNumbers);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5" />
        <span className="font-semibold text-lg">Search Results</span>
      </div>
      <div className="md:hidden">
        <Button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          variant="outline"
          className="w-full"
        >
          {isFilterExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Hide Filters
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show Filters
            </>
          )}
        </Button>
      </div>
      <div
        className={`space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4 ${isFilterExpanded ? "block" : "hidden md:flex"}`}
      >
        <Input
          placeholder="Filter by Card Name..."
          value={
            (table.getColumn("cardName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("cardName")?.setFilterValue(event.target.value)
          }
          className="w-full md:max-w-sm"
        />

        <Select
          value={(table.getColumn("rarity")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => {
            if (value === "ALL") {
              table.getColumn("rarity")?.setFilterValue(undefined);
            } else {
              table.getColumn("rarity")?.setFilterValue(value);
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by Rarity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Rarities</SelectItem>
            {getUniqueRarities().map((rarity) => (
              <SelectItem key={rarity} value={rarity}>
                {rarity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn("setName")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => {
            if (value === "ALL") {
              table.getColumn("setName")?.setFilterValue(undefined);
            } else {
              table.getColumn("setName")?.setFilterValue(value);
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by Set Name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Sets</SelectItem>
            {getUniqueSetNames().map((setName) => (
              <SelectItem key={setName} value={setName}>
                {setName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("cardNumber")?.getFilterValue() as string) ?? ""
          }
          onValueChange={(value) => {
            if (value === "ALL") {
              table.getColumn("cardNumber")?.setFilterValue(undefined);
            } else {
              table.getColumn("cardNumber")?.setFilterValue(value);
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by Card Number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Card Numbers</SelectItem>
            {getUniqueCardNumbers().map((cardNumber) => (
              <SelectItem key={cardNumber} value={cardNumber}>
                {cardNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
