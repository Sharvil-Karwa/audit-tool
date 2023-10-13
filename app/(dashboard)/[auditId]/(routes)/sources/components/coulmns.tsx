"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type SourceColumn = {
  id: string
  source: string
  createdAt: string
}

export const columns: ColumnDef<SourceColumn>[] = [
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "id",
    header: "Id",
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
