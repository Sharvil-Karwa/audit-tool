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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


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
import { Check, ChevronsUpDown, PlusCircle, Briefcase, ChevronDown} from "lucide-react"
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const filters = [
    {
        label: "Department",
        value: "department"
    }, 
    {
        label: "Equipment",
        value: "equipment"
    }, 
    {
        label: "Equipment ID",
        value: "eq_id"
    }, 
    {
        label: "Rating",
        value: "rating"
    },
    {
        label: "Date",
        value: "createdAt"
    }, 
    
    {
        label : "Equipment Type",
        value: "type"
    },
    {
      label : "Equipment Location",
      value: "location"
    },
    {
      label : "Equipment Area",
      value: "area"
    },
    {
      label : "Equipment Reference",
      value: "reference"
    },
    {
      label: "Reference Country",
      value: "refCountry"
    },
    {
      label : "Comment",
      value: "comment"
    },
    {
      label : "Source",
      value: "source"
    },
    {
      label : "Observation",
      value: "observation"
    },
]

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
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
      )
      const [sorting, setSorting] = React.useState<SortingState>([])
      
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

  const [filter, setFilter] = useState("department")
  const [label, setLabel] = useState("Department")
  const [openFilter, setOpenFilter] = useState(false)

  interface MyData {
    department: string;
    equipment: string;
    eq_id: string;
    rating: string;
    createdAt: string;
    type: string;
    location: string;
    area: string;
    reference: string;
    refCountry: string;
    comment: string;
    source: string;
    observation: string;
  }
  


 console.log(table.getRowModel().rows);
  

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
                    {filters.map((f) => (
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
                        Select Columns <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
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
                <TableRow >
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
