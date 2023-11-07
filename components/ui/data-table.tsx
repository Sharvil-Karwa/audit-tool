"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { useState } from "react"
import * as React from "react"
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ChevronsUpDown, PlusCircle, Briefcase} from "lucide-react"

interface Filter {
  label : string
  value: string
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey: string
  filters: Filter[]
}

import * as XLSX from "xlsx";


function exportToExcel<T>(data: T[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  // Create a download link for the Excel file
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  filters
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  console.log(filters)
  
const [columnVisibility, setColumnVisibility] =
React.useState<VisibilityState>({})
const [rowSelection, setRowSelection] = React.useState({})
const table = useReactTable({
data,
columns,
getCoreRowModel: getCoreRowModel(),
getPaginationRowModel: getPaginationRowModel(),
onColumnFiltersChange: setColumnFilters,
getFilteredRowModel: getFilteredRowModel(),
onSortingChange: setSorting,
getSortedRowModel: getSortedRowModel(),
onColumnVisibilityChange: setColumnVisibility,
onRowSelectionChange: setRowSelection,
state:{
    columnFilters,
    sorting,
    columnVisibility,
    rowSelection
}
}) 

  const [filter, setFilter] = useState("")
  const [label, setLabel] = useState("")
  const [openFilter, setOpenFilter] = useState(false)

  return (
    <div>
        <div className="flex items-center py-4 space-x-4">
            <Input
            placeholder={`Search (${label})`}
            value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn(filter)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
              <Popover open={openFilter} onOpenChange={setOpenFilter}>
              <PopoverTrigger asChild>
                  <Button
                  variant="outline"
                  size="sm"
                  role="combobox"
                  aria-expanded={openFilter}
                  aria-label="Select a filter"
                  className={cn("w-[200px] justify-between")}
                  >
                
                Filter: <span className="mx-2 text-gray-600 truncate max-w[50px]">{label}</span>
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList>
                  {/* <CommandInput placeholder="Search filter..." />
                  <CommandEmpty>No filter found.</CommandEmpty> */}
                  <CommandGroup heading="Filters">
                    {filters && filters.map((f) => (
                      <CommandItem
                        key={f.value}
                        onSelect={() => {
                          setLabel(f.label);
                          setFilter(f.value)
                        }}
                        className="text-sm"
                      >
                        
                        {f.label}
                        
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
              </Command>
            </PopoverContent>
              </Popover>
              <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Set Columns
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {table
                        .getAllColumns()
                        .filter(
                          (column) => column.getCanHide()
                        )
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          )
                        })}
                    </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => {
              const dataToExport = table.getFilteredSelectedRowModel().flatRows.map(row => row.original);
              exportToExcel(dataToExport, "exported_data.xlsx");
            }}>
              Export as Excel
            </Button> 
            
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
                            header.getContext()
                            )}
                    </TableHead>
                    )
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
