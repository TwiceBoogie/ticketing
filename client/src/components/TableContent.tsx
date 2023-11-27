"use client";

import { useCallback, useMemo, useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, SpinnerIcon } from "./icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  SortDescriptor,
  Ticket,
  TransformOrder,
  classNames,
  useFilteredItems,
  useItems,
  useOnNextPage,
  useOnPreviousPage,
  useOnRowsPerPageChange,
  useOnSearchChange,
  useSortedItems,
} from "@/core";

import { getStripe } from "@/core";
import { TimeLeft } from "./TimeLeft";
import { SearchIcon, XMarkIcon } from "./icons";
import { BottomContent } from "./tableUI";

// import {Key} from 'react';

// export interface SingleSelection {
//   /** Whether the collection allows empty selection. */
//   disallowEmptySelection?: boolean,
//   /** The currently selected key in the collection (controlled). */
//   selectedKey?: Key | null,
//   /** The initial selected key in the collection (uncontrolled). */
//   defaultSelectedKey?: Key,
//   /** Handler that is called when the selection changes. */
//   onSelectionChange?: (key: Key) => any
// }

// export type SelectionMode = 'none' | 'single' | 'multiple';
// export type SelectionBehavior = 'toggle' | 'replace';
// export type Selection = 'all' | Set<Key>;
// export interface MultipleSelection {
//   /** The type of selection that is allowed in the collection. */
//   selectionMode?: SelectionMode,
//   /** Whether the collection allows empty selection. */
//   disallowEmptySelection?: boolean,
//   /** The currently selected keys in the collection (controlled). */
//   selectedKeys?: 'all' | Iterable<Key>,
//   /** The initial selected keys in the collection (uncontrolled). */
//   defaultSelectedKeys?: 'all' | Iterable<Key>,
//   /** Handler that is called when the selection changes. */
//   onSelectionChange?: (keys: Selection) => any,
//   /** The currently disabled keys in the collection (controlled). */
//   disabledKeys?: Iterable<Key>
// }

// export interface SpectrumSelectionProps {
//   /** How selection should be displayed. */
//   selectionStyle?: 'checkbox' | 'highlight'
// }

// export type FocusStrategy = 'first' | 'last';
// export type DisabledBehavior = 'selection' | 'all';

const columnType = [
  [
    {
      key: "title",
      label: "TITLE",
    },
    {
      key: "price",
      label: "PRICE $",
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
      key: "createdAt",
      label: "CREATED AT",
    },
    {
      key: "title",
      label: "TITLE",
    },
    {
      key: "price",
      label: "PRICE $",
    },
    {
      key: "expiresAt",
      label: "EXPIRES IN",
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
  // const [dropdownKey, setDropdownKey] = useState("");
  // const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  // const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setRefresh(true);
      }

      setTimeout(() => {
        setRefresh(false);
        setLoading(false);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      const stripe = await getStripe();
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const { sessionId } = await res.json();

      const result = await stripe?.redirectToCheckout({
        sessionId: sessionId,
      });
      console.error(result, "result");
    } catch (error) {
      console.error(error);
    }
  };

  const pages = Math.ceil((data?.length ?? 1) / rowsPerPage);

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
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="">
        <div className="flex justify-between gap-3 items-center">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Search by name..."
              value={filterValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-black dark:text-white">
              <SearchIcon />
            </div>
            {filterValue && (
              <button
                onClick={onClear}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XMarkIcon className="border rounded-md" />
              </button>
            )}
          </div>

          <button
            className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
            data-ripple-light="true"
            onClick={handleRefresh}
          >
            {loading ? <SpinnerIcon /> : "Refresh"}
          </button>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-400 items-center">
          <span className="text-small">
            Total {data.length} {type}
          </span>
          <label className="flex items-center text-small">
            Rows per page:
            <select
              className="bg-transparent text-small border-none focus:border-none"
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
  }, [filterValue, onSearchChange, onRowsPerPageChange, data.length, type]);

  const renderCell = useCallback(
    (item: Data, ColumnKey: React.Key) => {
      const cellValue = item[ColumnKey as keyof Data];

      switch (ColumnKey) {
        case "id":
          if (type !== "tickets") {
            const { ticketId, status } = item as TransformOrder;
            if (status === "cancelled" || status === "complete") {
              return "none";
            }
            return (
              <Menu
                as="div"
                className="relative inline-block text-left"
                key={cellValue}
              >
                <div>
                  <Menu.Button
                    className="bg-zinc-200 dark:bg-zinc-800 inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-black dark:text-white shadow-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    data-ripple-light="true"
                  >
                    Options
                    <ChevronDownIcon
                      className="-mr-1 h-5 w-5 text-black dark:text-gray-400 "
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="right-0 z-10 mt-2 w-full origin-top-right divide-y rounded-md bg-white dark:bg-zinc-800 shadow-lg dark:ring-zinc-600">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleSubmit(cellValue as string)}
                            className={classNames(
                              active
                                ? "bg-zinc-300 dark:bg-zinc-600 text-gray-900 dark:text-white"
                                : "text-gray-700 dark:text-white",
                              "block px-4 mx-2 py-2 text-sm rounded-lg"
                            )}
                          >
                            Checkout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={`/orders/delete/${cellValue}`}
                            className={classNames(
                              active
                                ? "bg-red-500 text-white"
                                : "text-red-700 dark:text-red-500",
                              "block px-4 mx-2 py-2 text-sm rounded-lg"
                            )}
                          >
                            Delete
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            );
          } else {
            const ticket = item as Ticket;
            let href = "";
            let title = "";

            if (ticket.userId === userId) {
              href = `/tickets/update/${cellValue}`;
              title = "Update";
            } else if (userId) {
              href = `/tickets/order/${cellValue}`;
              title = "Add to Cart";
            } else {
              return <p>You must be signed in</p>;
            }
            return (
              <Link key={`${cellValue}-button`} href={href}>
                <button
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
                  data-ripple-light="true"
                >
                  {title}
                </button>
              </Link>
            );
          }
        case "createdAt":
          const formattedTime = new Date(cellValue).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
          });
          return formattedTime;
        case "status":
          const color =
            cellValue === "cancelled"
              ? "red"
              : cellValue === "complete"
              ? "green"
              : "blue";
          return (
            <span
              className={`inline-flex items-center rounded-md bg-${color}-50 px-2 py-1 text-xs font-medium text-${color}-800 ring-1 ring-${color}-600`}
            >
              {cellValue}
            </span>
          );
        case "expiresAt":
          const order = item as TransformOrder;

          return <TimeLeft expiresAt={order.expiresAt} />;
        default:
          return cellValue;
      }
    },
    [type, userId]
  );

  return (
    <div className="h-full">
      {refresh && (
        <div
          className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-300 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">Success alert!</span> Items have
          refreshed successfully.
        </div>
      )}
      <div className="relative flex flex-col w-full h-full min-w-0 mb-0 break-words border-0 border-transparent border-solid shadow-soft-xl rounded-2xl">
        <div className="p-6 pb-0 mb-0 rounded-t-2xl">{topContent}</div>
        <div className="px-0 pt-0 pb-2 h-full overflow-x-auto">
          <div className="p-0 h-full">
            <table className="w-full h-full mb-0 align-top text-black dark:text-white">
              <thead className="align-bottom">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-0 sm:px-6 py-3 font-bold text-left uppercase bg-transparent border-b shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70"
                      style={{ minWidth: "100px" }} // Adjust the minWidth as needed
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  sortedItems.map((item) => (
                    <tr key={item.id}>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-6 py-3"
                          style={{ minWidth: "100px" }} // Match the minWidth with th
                        >
                          {renderCell(item, column.key)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length}>No rows to display.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-6 rounded-b-2xl">
          <BottomContent
            hasSearchFilter={hasSearchFilter}
            onPreviousPage={onPreviousPage}
            page={page}
            pages={pages}
            setPage={setPage}
            onNextPage={onNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default TableContent;
