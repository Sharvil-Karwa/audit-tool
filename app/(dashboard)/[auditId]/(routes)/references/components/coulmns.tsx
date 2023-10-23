"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ReferenceColumn = {
  id: string
  mainRef: String
  reference: String 
  country: String 
  createdAt: string
}

export const columns: ColumnDef<ReferenceColumn>[] = [
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "mainRef",
    header: "Main Reference",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "createdAt",
    header: "Date"
  },
  {
    id: "actions",
    cell: ({row})=> <CellAction data={row.original} />
  }
]
