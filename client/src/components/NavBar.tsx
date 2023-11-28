"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, Bars3Icon } from "./icons";

import SellTicketButton from "./buttons/SellTicketButton";
import DarkModeToggle from "./buttons/DarkModeToggle";
import Link from "next/link";
import SignOut from "./buttons/SignOut";
import { classNames } from "@/core";

const navigation = {
  pages: [{ name: "Home", href: "/" }],
};

const NavBar = ({
  loggedIn,
  pageSite,
}: {
  loggedIn: boolean;
  pageSite: string;
}) => {
  const sitePage = pageSite;
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-slate-800 pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <Link
                        href={page.href}
                        className="-m-2 block p-2 font-medium text-gray-900 dark:text-white"
                      >
                        {page.name}
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {loggedIn ? (
                    <SignOut />
                  ) : (
                    <>
                      <div className="flow-root">
                        <Link
                          href="/signin"
                          className="-m-2 block p-2 font-medium text-gray-900 dark:text-white"
                        >
                          Sign in
                        </Link>
                      </div>
                      <div className="flow-root">
                        <Link
                          href="/signup"
                          className="-m-2 block p-2 font-medium text-gray-900 dark:text-white"
                        >
                          Create account
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative">
        {/* <CookieBanner /> */}
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="">
            <div className="flex h-16 items-center">
              {/* mobile menu open button */}
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden dark:bg-slate-800 border"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="hidden lg:flex lg:ml-0">
                <Link href="/">
                  <span className="sr-only">Your Company</span>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt=""
                  />
                </Link>
              </div>

              {/* Flyout menus */}
              <div className="hidden lg:ml-8 lg:block lg-self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      href={page.href}
                      className={classNames(
                        page.name === sitePage
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-700 hover:text-gray-800",
                        "flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 dark:text-white"
                      )}
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="ml-auto flex items-center">
                <div className="flex flex-1 items-center justify-end space-x-6">
                  {loggedIn ? (
                    <>
                      <SellTicketButton />
                      <div className="hidden lg:flex">
                        <SignOut />
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/signin" className="hidden lg:flex">
                        <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white">
                          Log In
                        </button>
                      </Link>
                      <span
                        className="hidden lg:h-6 lg:w-px lg:bg-gray-200"
                        aria-hidden="true"
                      />
                      <Link href="/signup" className="hidden lg:flex">
                        {/* <Button>Register</Button> */}
                        <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white">
                          Register
                        </button>
                      </Link>
                    </>
                  )}
                </div>

                <div className="ml-8 flex">
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
