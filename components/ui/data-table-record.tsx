"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import { useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
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
import { Check, ChevronsUpDown, PlusCircle, Briefcase} from "lucide-react"


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
]

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
      )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state:{
        columnFilters
    }
  }) 

  const [filter, setFilter] = useState("department")
  const [label, setLabel] = useState("Department")
  const [openFilter, setOpenFilter] = useState(false)


  return (
    <div>
        <div className="flex items-center py-4 space-x-2">
            <Input
            placeholder={`Search (${label})`}
            value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn(filter)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            />
            <div>
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
          
          Filter: <span className="mx-2 text-gray-600">{label}</span>
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
        </div>
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
