import { ReactNode } from "react";
import { GetServerSideProps } from "next";
import { Header } from "./Header";
import React from "react";
import buildClient from "../api/build-client";

type Props = {
  children: ReactNode;
  currentUser: string;
};

export const Layout = ({ currentUser, children }: Props) => {
  return (
    <>
      <Header currentUser={currentUser}></Header>
      <main>{children}</main>
    </>
  );
};
