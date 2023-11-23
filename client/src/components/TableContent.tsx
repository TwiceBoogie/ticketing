"use client";

import { useCallback, useMemo, useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "./icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  SortDescriptor,
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
      key: "createdAt",
      label: "CREATED AT",
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

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
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
  const [loading, setLoading] = useState(true);
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
      console.log(sessionId);

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
      <div className="flex flex-col gap-4">
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
            onClick={handleRefresh}
          >
            Refresh
          </button>
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
  }, [filterValue, onSearchChange, onRowsPerPageChange, data.length, type]);

  // const bottomContent = useMemo(() => {
  //   return (
  //     <div className="flex justify-center sm:justify-between items-center gap-2">
  //       <div className="hidden sm:flex gap-2">
  //         <button
  //           className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
  //           disabled={hasSearchFilter}
  //           onClick={onPreviousPage}
  //         >
  //           Previous
  //         </button>
  //       </div>
  //       <Pagination
  //         aria-label="pagination-nav"
  //         isCompact
  //         showControls
  //         showShadow
  //         color="primary"
  //         isDisabled={hasSearchFilter}
  //         page={page}
  //         total={pages}
  //         onChange={setPage}
  //       />
  //       <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
  //         <div className="flex flex-1 justify-between sm:hidden">
  //           <a
  //             href="#"
  //             className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
  //           >
  //             Previous
  //           </a>
  //           <a
  //             href="#"
  //             className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
  //           >
  //             Next
  //           </a>
  //         </div>
  //         <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
  //           <div>
  //             <nav
  //               className="isolate inline-flex -space-x-px rounded-md shadow-sm"
  //               aria-label="Pagination"
  //             >
  //               <button
  //                 className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
  //                 onClick={onPreviousPage}
  //               >
  //                 <span className="sr-only">Previous</span>
  //                 <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
  //               </button>
  //               {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
  //               <a
  //                 href="#"
  //                 aria-current="page"
  //                 className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
  //               >
  //                 1
  //               </a>
  //               <a
  //                 href="#"
  //                 className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
  //               >
  //                 2
  //               </a>
  //               <a
  //                 href="#"
  //                 className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
  //               >
  //                 3
  //               </a>
  //               <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
  //                 ...
  //               </span>
  //               <a
  //                 href="#"
  //                 className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
  //               >
  //                 8
  //               </a>
  //               <a
  //                 href="#"
  //                 className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
  //               >
  //                 9
  //               </a>
  //               <a
  //                 href="#"
  //                 className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
  //               >
  //                 10
  //               </a>
  //               <button
  //                 className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
  //                 onClick={onNextPage}
  //               >
  //                 <span className="sr-only">Next</span>
  //                 <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
  //               </button>
  //             </nav>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="hidden sm:flex gap-2">
  //         <button
  //           className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
  //           disabled={hasSearchFilter}
  //           onClick={onNextPage}
  //         >
  //           Next
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }, [hasSearchFilter, onNextPage, onPreviousPage, page, pages]);

  const renderCell = useCallback(
    (item: Data, ColumnKey: React.Key) => {
      const cellValue = item[ColumnKey as keyof Data];

      switch (ColumnKey) {
        case "id":
          if (type !== "tickets") {
            const { ticketId, status } = item as TransformOrder;
            if (status === "cancelled") {
              return "none";
            }
            return (
              <Menu
                as="div"
                className="relative inline-block text-left"
                key={cellValue}
              >
                <div>
                  <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    Options
                    <ChevronDownIcon
                      className="-mr-1 h-5 w-5 text-gray-400"
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Edit
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Archive
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Delete
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              // <Dropdown key={cellValue}>
              //   <DropdownTrigger>
              //     <Button variant="bordered">Open Menu</Button>
              //   </DropdownTrigger>
              //   <DropdownMenu
              //     aria-label="Available Tickets"
              //     className="dark:text-white"
              //   >
              //     <DropdownItem
              //       key={`proceed-${cellValue}`}
              //       onPress={() => handleSubmit(ticketId)}
              //     >
              //       Proceed to Checkout
              //     </DropdownItem>
              //     <DropdownItem
              //       key={`delete--${cellValue}`}
              //       className="text-danger"
              //       color="danger"
              //       as={Link}
              //       href={`/orders/delete/${cellValue}`}
              //     >
              //       Cancel Order
              //     </DropdownItem>
              //   </DropdownMenu>
              // </Dropdown>
            );
          } else {
            const ticket = item as Ticket;
            let href = "";
            let title = "";

            if (ticket.userId === userId) {
              href = `/tickets/update/${cellValue}`;
              title = "Update Ticket";
            } else if (userId) {
              href = `/tickets/order/${cellValue}`;
              title = "Add to Cart";
            } else {
              return <p>You must be signed in</p>;
            }
            return (
              <Link key={`${cellValue}-button`} href={href}>
                <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white">
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
              className={`inline-flex items-center rounded-md bg-${color}-50 px-2 py-1 text-xs font-medium text-${color}-700 ring-1 ring-inset ring-${color}-600/10`}
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
      {/* <Table
        aria-label="available tickets"
        isStriped
        isCompact
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
            <TableColumn key={column.key} align="center">
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
      </Table> */}
      <div className="relative flex flex-col w-full min-w-0 mb-0 break-words bg-white dark:bg-gray-800 border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="p-6 pb-0 mb-0 rounded-t-2xl">{topContent}</div>
        <div className="flex-auto px-0 pt-0 pb-2">
          <div className="p-0 overflow-x-auto">
            <table className="items-center w-full mb-0 align-top text-black dark:text-white">
              <thead className="align-bottom flex justify-center w-full">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70"
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
                        <td key={column.key}>{renderCell(item, column.key)}</td>
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
