import React from "react";
import { Record } from "@prisma/client";
import { format } from "date-fns";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  

interface RecordsFormProps {
  initialData: Record | null;
}

export const RecordsForm: React.FC<RecordsFormProps> = ({ initialData }) => {
  if (!initialData) {
    return <div>No record data available.</div>;
  }

  const {
    id,
    department,
    equipment,
    eq_id,
    type,
    location,
    area,
    reference,
    comment,
    rating,
    source,
    observation,
    createdAt,
  } = initialData;

  const date = format(createdAt, "MMMM do, yyyy")

  return (
    <div className="max-w-2xl mx-auto">
        <Table>
            <TableCaption>Record ID: obs{id}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="">Parameter</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            <TableRow>
                <TableCell className="font-medium">Department</TableCell>
                <TableCell className="text-right">{department}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Equipment</TableCell>
                <TableCell className="text-right">{equipment}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Equipment ID</TableCell>
                <TableCell className="text-right">{eq_id}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Equipment Type</TableCell>
                <TableCell className="text-right">{type}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Location</TableCell>
                <TableCell className="text-right">{location}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Area</TableCell>
                <TableCell className="text-right">{area}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Reference</TableCell>
                <TableCell className="text-right">{reference}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Observation</TableCell>
                <TableCell className="text-right">{observation}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Rating</TableCell>
                <TableCell className="text-right">{rating}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Source</TableCell>
                <TableCell className="text-right">{source}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Comments</TableCell>
                <TableCell className="text-right">{comment}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="font-medium">Date</TableCell>
                <TableCell className="text-right">{date}</TableCell>
            </TableRow>
            </TableBody>
        </Table>
    </div>
  );
};
