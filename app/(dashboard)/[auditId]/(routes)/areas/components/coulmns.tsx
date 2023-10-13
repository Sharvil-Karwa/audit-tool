"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type AreaColumn = {
  id: string
  area: string
  createdAt: string
}

export const columns: ColumnDef<AreaColumn>[] = [
  {
    accessorKey: "area",
    header: "Area",
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
