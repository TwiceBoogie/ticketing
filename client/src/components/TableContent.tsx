"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Selection,
  SortDescriptor,
} from "@nextui-org/table";
import { Input } from "@nextui-org/input";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Pagination } from "@nextui-org/pagination";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import {
  Ticket,
  TransformOrder,
  useFilteredItems,
  useItems,
  useOnNextPage,
  useOnPreviousPage,
  useOnRowsPerPageChange,
  useOnSearchChange,
  useSortedItems,
} from "@/core";
import { SearchIcon } from ".";

const columnType = [
  [
    {
      key: "title",
      label: "TITLE",
    },
    {
      key: "price",
      label: "PRICE",
    },
    {
      key: "id",
      label: "ADD TO CART",
    },
  ],
  [
    {
      key: "id",
      label: "ACTIONS",
    },
    {
      key: "ticketId",
      label: "TICKET-ID",
    },
    {
      key: "title",
      label: "TITLE",
    },
    {
      key: "price",
      label: "PRICE",
    },
    {
      key: "expiresAt",
      label: "EXPIRES AT",
    },
    {
      key: "status",
      label: "STATUS",
    },
  ],
];

type Columns = {
  key: string;
  label: string;
};

type Data = Ticket | TransformOrder;
interface TableProps<T> {
  data: T;
  type: string;
  userId: string;
}

const TableContent = <T extends Data[]>({
  data,
  type,
  userId,
}: TableProps<T>) => {
  const router = useRouter();
  let columns: Columns[] = [];
  let url = "";

  if (type === "tickets") {
    columns = columnType[0];
    url = "/api/tickets";
  } else {
    columns = columnType[1];
    url = "/api/orders";
  }
  const [loading, setLoading] = useState(true);
  const [dropdownKey, setDropdownKey] = useState("");
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = async () => {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await res.json();
      if (res.ok) {
        setRefresh(true);
      }

      setTimeout(() => {
        setRefresh(false);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const pages = Math.ceil(data.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useFilteredItems<Data[]>({
    data,
    filterValue,
    hasSearchFilter,
  });

  const items = useItems<Data[]>({ page, filteredItems, rowsPerPage });

  const sortedItems = useSortedItems<Data[]>({ items, sortDescriptor });

  const onSearchChange = useOnSearchChange({ setFilterValue, setPage });
  const onRowsPerPageChange = useOnRowsPerPageChange({
    setRowsPerPage,
    setPage,
  });
  const onPreviousPage = useOnPreviousPage({ page, setPage });
  const onNextPage = useOnNextPage({ page, pages, setPage });

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-center">
          <Input
            isClearable
            classNames={{
              base: "w-full",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <Button color="primary" onPress={handleRefresh}>
            Refresh
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.length} {type}
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    data.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center gap-2">
        <div>
          <Button
            isDisabled={hasSearchFilter}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
        </div>
        <Pagination
          aria-label="pagination-nav"
          isCompact
          showControls
          showShadow
          color="primary"
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex gap-2">
          <Button
            isDisabled={hasSearchFilter}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, []);

  const renderCell = useCallback(
    (item: Data, ColumnKey: React.Key) => {
      const cellValue = item[ColumnKey as keyof Data];

      switch (ColumnKey) {
        case "id":
          if (type !== "tickets") {
            return (
              <Dropdown key={cellValue}>
                <DropdownTrigger>
                  <Button variant="bordered">Open Menu</Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Available Tickets"
                  className="dark:text-white"
                >
                  <DropdownItem
                    key={`proceed-${cellValue}`}
                    as={Link}
                    href={`/orders/payment/${cellValue}`}
                  >
                    Proceed to Checkout
                  </DropdownItem>
                  <DropdownItem
                    key={`delete--${cellValue}`}
                    className="text-danger"
                    color="danger"
                    href={`/orders/delete/${cellValue}`}
                  >
                    Delete Order
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            );
          } else {
            const ticket = item as Ticket;
            let href = "";
            let title = "";
            if (ticket.userId === userId) {
              href = `/tickets/update/${cellValue}`;
              title = "Update Ticket";
            } else {
              href = `/tickets/order/${cellValue}`;
              title = "Add to Cart";
            }
            return (
              <Button key={cellValue} as={Link} href={href}>
                {title}
              </Button>
            );
          }
        default:
          return cellValue;
      }
    },
    [data]
  );

  return (
    <div>
      {refresh && (
        <div
          className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-300 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">Success alert!</span> Items have
          refreshed successfully.
        </div>
      )}
      <Table
        aria-label="available tickets"
        isHeaderSticky
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        sortDescriptor={sortDescriptor}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align="end">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No rows to display."} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableContent;
