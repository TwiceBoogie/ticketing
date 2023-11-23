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
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={onPreviousPage}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {startPage > 1 && (
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
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
                    : "text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0",
                  "relative inline-flex items-center px-4 py-2 text-sm font-semibold"
                )}
              >
                {pageNumber}
              </button>
            ))}

            {endPage < pages && (
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                ...
              </span>
            )}
            <button
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
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
