import { useCallback, useMemo } from "react";
import type { ChangeEvent, Key } from "react";
import {
  Order,
  Ticket,
  TransformOrder,
  UseFilteredItemsI,
  UseItemsI,
  UseOnNextPageI,
  UseOnPrevPageI,
  UseOnRowsPerPageChangeI,
  UseOnSearchChangeI,
  UseSortedItemsI,
} from "@/core";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

interface RenderCell {
  handleActions: (key: Key) => void;
}

type Data = Ticket | TransformOrder;

function isTicket(data: Data) {
  if ("title" in data) {
    return true;
  }
  return false;
}

export const useFilteredItems = <T extends Data[]>({
  data,
  filterValue,
  hasSearchFilter,
}: UseFilteredItemsI<T>) => {
  return useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) => {
        return item.title.toLowerCase().includes(filterValue.toLowerCase());
      });
    }
    return filteredData;
  }, [data, filterValue, hasSearchFilter]);
};

export function useItems<T extends Data[]>({
  page,
  filteredItems,
  rowsPerPage,
}: UseItemsI<T>) {
  return useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
}

export function useSortedItems<T extends Data[]>({
  items,
  sortDescriptor,
}: UseSortedItemsI<T>) {
  return useMemo(() => {
    return [...items].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof T] as number;
      const second = b[sortDescriptor.column as keyof T] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [items, sortDescriptor]);
}

export const useRenderCell = ({ handleActions }: RenderCell) => {
  return useCallback((data: Data, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof Data];

    switch (columnKey) {
      case "id":
        return (
          <Button key={cellValue} as={Link} href={`/tickets/${cellValue}`}>
            Add to Cart
          </Button>
        );
      case "orderId":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">Open Menu</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              className="text-black"
              onAction={handleActions}
            >
              <DropdownItem
                key="proceed"
                as={Link}
                href={`/orders/${cellValue}`}
              >
                Proceed to Checkout
              </DropdownItem>
              <DropdownItem key={`update-${cellValue}`}>
                Update Order
              </DropdownItem>
              <DropdownItem
                key={`delete-${cellValue}`}
                className="text-danger"
                color="danger"
              >
                Delete Order
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return <div className="flex justify-center">cellValue</div>;
    }
  }, []);
};

export const useOnNextPage = ({ page, pages, setPage }: UseOnNextPageI) => {
  return useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages, setPage]);
};

export const useOnPreviousPage = ({ page, setPage }: UseOnPrevPageI) => {
  const onPrevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);

  return onPrevPage;
};

export const useOnRowsPerPageChange = ({
  setRowsPerPage,
  setPage,
}: UseOnRowsPerPageChangeI) => {
  return useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(event.target.value));
      setPage(1);
    },
    [setRowsPerPage, setPage]
  );
};

export const useOnSearchChange = ({
  setFilterValue,
  setPage,
}: UseOnSearchChangeI) => {
  return useCallback(
    (value?: string) => {
      if (value) {
        setFilterValue(value);
        setPage(1);
      } else {
        setFilterValue("");
      }
    },
    [setFilterValue, setPage]
  );
};
