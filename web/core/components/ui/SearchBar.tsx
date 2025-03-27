"use client";

import React, { useEffect, useRef, useState } from "react";

import { Button } from "@heroui/button";
import { Divider, menuItem, VariantProps } from "@heroui/react";
import { Listbox, ListboxSection, ListboxItem } from "@heroui/listbox";

import { cn } from "@/helpers/common.helper";
import { SearchIcon } from "../icons";

type MenuItemVariantProps = VariantProps<typeof menuItem>;
type MenuItemColor = MenuItemVariantProps["color"];

function useOutsideClickHandler(
  ref1: React.RefObject<HTMLElement | null>,
  setOpenSearchMenu: React.Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref1.current && !ref1.current.contains(event.target as Node)) {
        // if container exist and click outside
        setOpenSearchMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref1, setOpenSearchMenu]);
}

export default function SearchBar() {
  const [openSearchMenu, setOpenSearchMenu] = useState(false);
  const containerRef = useRef(null);
  useOutsideClickHandler(containerRef, setOpenSearchMenu);

  // Open the menu when the input is focused
  const handleFocus = () => {
    setOpenSearchMenu(true);
  };

  const items = Array.from({ length: 9 }, (_, index) => ({
    key: `item-${index + 1}`,
    label: `Item ${index + 1}`,
    className: index === 8 ? "text-danger" : "", // Example: Make the last item red
    color: index === 8 ? "danger" : undefined, // Example: Make the last item red
  }));

  return (
    <div className="relative max-w-[880px] px-0 pt-2 text-base font-medium leading-[20px] box-content mx-auto">
      <div className="relative" ref={containerRef}>
        {/* Input Field */}
        <input
          type="text"
          placeholder="Search events, artists, teams, and more"
          className={cn(
            "w-full h-16 pl-16 pr-6 text-md transition-all duration-100 ease-in-out outline-none",
            "rounded-[32px] [box-shadow:0_0_10px_rgba(0,0,0,0.1)]", // StubHub styles
            openSearchMenu ? "rounded-b-none" : "" // Remove bottom rounding when menu is open
          )}
          onFocus={handleFocus}
        />

        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search Menu (Always Rendered) */}
        <div
          className={cn(
            "absolute top-full w-full bg-white rounded-b-[32px] shadow-lg z-10 transition-opacity duration-300",
            openSearchMenu ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="relative p-4 max-h-[800px]">
            <div className="grid grid-cols-2 grid-flow-row gap-4 relative">
              <div className="flex justify-between items-center px-4">
                <p className="text-sm font-bold text-gray-500">Recent Searches</p>
                <Button size="sm" variant="bordered">
                  Clear History
                </Button>
              </div>
              <div className="flex items-center px-4">
                <p className="text-sm font-bold text-gray-500">Trending</p>
              </div>
              <div className="px-2">
                <Listbox
                  aria-label="Actions"
                  items={items}
                  itemClasses={{
                    base: "",
                    wrapper: "",
                    title: "text-lg",
                  }}
                >
                  {(item) => (
                    <ListboxItem
                      key={item.key}
                      className={item.className}
                      color={item.color as MenuItemColor}
                      startContent={<SearchIcon className="rounded-md bg-gray-200 p-1" />}
                    >
                      {item.label}
                    </ListboxItem>
                  )}
                </Listbox>
              </div>
              <Divider className="absolute inset-y-0 left-1/2" orientation="vertical" />
              <div className="px-2">
                <Listbox aria-label="Actions">
                  <ListboxItem key="new">New file</ListboxItem>
                  <ListboxItem key="copy">Copy link</ListboxItem>
                  <ListboxItem key="edit">Edit file</ListboxItem>
                  <ListboxItem key="delete" className="text-danger" color="danger">
                    Delete file
                  </ListboxItem>
                </Listbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
