import { Dispatch, SetStateAction, useMemo } from "react";
import { Pagination } from "./Pagination";

interface Props {
  hasSearchFilter: boolean;
  onPreviousPage: () => void;
  page: number;
  pages: number;
  setPage: Dispatch<SetStateAction<number>>;
  onNextPage: () => void;
}

export const BottomContent = ({
  hasSearchFilter,
  onPreviousPage,
  page,
  pages,
  setPage,
  onNextPage,
}: Props) => {
  const bottomContent = useMemo(() => {
    return (
      <div className="flex justify-center md:justify-between items-center gap-2">
        <div className="hidden md:flex gap-2">
          <button
            className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
            disabled={hasSearchFilter}
            onClick={onPreviousPage}
          >
            Previous
          </button>
        </div>
        <Pagination
          hasSearchFilter={hasSearchFilter}
          page={page}
          pages={pages}
          setPage={setPage}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
        <div className="hidden md:flex gap-2">
          <button
            className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
            disabled={hasSearchFilter}
            onClick={onNextPage}
          >
            Next
          </button>
        </div>
      </div>
    );
  }, [hasSearchFilter, onPreviousPage, page, pages, setPage, onNextPage]);

  return bottomContent;
};
