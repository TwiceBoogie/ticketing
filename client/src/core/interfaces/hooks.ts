import type { Dispatch, Key, SetStateAction } from "react";
import { Order, Ticket } from ".";

export interface SortDescriptor {
  /** The key of the column to sort by. */
  column?: Key,
  /** The direction to sort by. */
  direction?: SortDirection
}

export type SortDirection = 'ascending' | 'descending';

type Items = Order[] | Ticket[];

export interface UseFilteredItemsI<T> {
  data: T;
  filterValue: string;
  hasSearchFilter: boolean;
}

export interface UseItemsI<T> {
  page: number;
  filteredItems: T;
  rowsPerPage: number;
}

export interface UseSortedItemsI<T> {
  items: T;
  sortDescriptor: SortDescriptor;
}

export interface UseOnSearchChangeI {
  setFilterValue: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
}

export interface UseOnNextPageI {
  page: number;
  pages: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export interface UseOnPrevPageI {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export interface UseOnRowsPerPageChangeI {
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
}
