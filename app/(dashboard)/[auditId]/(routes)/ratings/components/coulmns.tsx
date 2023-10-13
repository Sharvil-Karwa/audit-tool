"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type RatingColumn = {
  id: string
  rating: string
  createdAt: string
}

export const columns: ColumnDef<RatingColumn>[] = [
  {
    accessorKey: "rating",
    header: "Rating",
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
