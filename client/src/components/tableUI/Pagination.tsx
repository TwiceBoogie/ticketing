import { Dispatch, SetStateAction } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../icons";

interface Props {
  hasSearchFilter: boolean;
  page: number;
  pages: number;
  setPage: Dispatch<SetStateAction<number>>;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const Pagination = ({
  hasSearchFilter,
  page,
  pages,
  setPage,
  onPreviousPage,
  onNextPage,
}: Props) => {
  let startPage = Math.max(1, page - 2);
  let endPage = Math.min(pages, startPage + 5);

  if (pages <= 6) {
    startPage = 1;
    endPage = pages;
  } else if (page <= 3) {
    endPage = 6;
  } else if (page >= pages - 2) {
    startPage = pages - 5;
  }
  const pageArray = [];
  for (let i = 1; i <= pages; i++) {
    pageArray.push(i);
  }
  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-lg bg-zinc-200 dark:bg-zinc-700"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center rounded-l-lg px-2 py-1 text-gray-400 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-500"
              onClick={onPreviousPage}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {startPage > 1 && (
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-500 focus:outline-offset-0">
                ...
              </span>
            )}
            {pageArray.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                aria-current={page === pageNumber ? "page" : undefined}
                className={classNames(
                  page === pageNumber
                    ? "z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    : "text-gray-700 dark:text-white focus:outline-offset-0 hover:bg-zinc-300 dark:hover:bg-zinc-500 rounded-none",
                  "relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg"
                )}
              >
                {pageNumber}
              </button>
            ))}

            {endPage < pages && (
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 focus:outline-offset-0">
                ...
              </span>
            )}
            <button
              className="relative inline-flex items-center rounded-r-lg px-2 py-1 text-gray-400 dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-500"
              onClick={onNextPage}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
