"use client";

import React, { useCallback } from "react";
import Link from "next/link";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Chip, ChipProps } from "@heroui/chip";

import { TBase, TTableComponentProps } from "@/types/table";

const statusColorMap: Record<string, ChipProps["color"]> = {
  created: "secondary",
  cancelled: "danger",
  "awaiting:payment": "warning",
  complete: "success",
};

function TableComponent<T extends TBase>({ name, data, columns }: TTableComponentProps<T>) {
  const renderCell = useCallback(
    (item: T, columnKey: keyof T): React.ReactNode => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "id":
          return (
            <Link href={`/${name}/${item.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
              View
            </Link>
          );
        case "price":
          if (typeof cellValue === "number" || typeof cellValue === "string") {
            return (
              <span className="flex">
                $<p>{cellValue}</p>
              </span>
            );
          }
        case "status":
          if (typeof cellValue === "string") {
            return (
              <Chip className="" color={statusColorMap[cellValue]}>
                {cellValue}
              </Chip>
            );
          }
        default:
          return cellValue as React.ReactNode;
      }
    },
    [name]
  );

  return (
    <Table aria-label="Data table">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent={"No rows to display."} items={data}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey as keyof T)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TableComponent;
