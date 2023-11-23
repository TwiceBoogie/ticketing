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
import Link from "next/link";

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
