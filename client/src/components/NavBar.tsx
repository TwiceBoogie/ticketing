"use client";

import { Fragment, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import { CartIcon, XMarkIcon, Bars3Icon, MagnifyingGlassIcon } from "./icons";

import SellTicketButton from "./buttons/SellTicketButton";
import DarkModeToggle from "./buttons/DarkModeToggle";
import Link from "next/link";
import { ShoppingCart } from "./banners";
import SignOut from "./buttons/SignOut";

const navigation = {
  categories: [
    {
      id: "women",
      name: "Women",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg",
          imageAlt:
            "Models sitting back to back, wearing Basic Tee in black and bone.",
        },
        {
          name: "Basic Tees",
          href: "#",
          imageSrc:
            "https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg",
          imageAlt:
            "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Dresses", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Denim", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Significant Other", href: "#" },
          ],
        },
      ],
    },
    {
      id: "men",
      name: "Men",
    },
  ],
  pages: [
    { name: "Home", href: "/" },
    { name: "page2", href: "#" },
    { name: "page3", href: "#" },
  ],
};

function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

const NavBar = ({
  loggedIn,
  pageSite,
}: {
  loggedIn: boolean;
  pageSite: string;
}) => {
  const sitePage = pageSite;
  const [openCart, setOpenCart] = useState(false);
  const [open, setOpen] = useState(false);

  const handleShoppingCart = () => {
    setOpenCart(true);
  };

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
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $100
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
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
              <div className="ml-4 flex lg:ml-0">
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
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {loggedIn ? (
                    <>
                      <SellTicketButton />
                      <SignOut />
                    </>
                  ) : (
                    <>
                      <Link href="/signin">
                        <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white">
                          Log In
                        </button>
                      </Link>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <Link href="/signup">
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

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button
                    className="group -m-2 flex items-center p-2"
                    onClick={handleShoppingCart}
                  >
                    <CartIcon
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      0
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>
                  <ShoppingCart openCart={openCart} setOpenCart={setOpenCart} />
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
