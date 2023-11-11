import { ReactNode } from "react";
import { GetServerSideProps } from "next";
import { Header } from "./Header";
import React from "react";
import buildClient from "../api/build-client";
import { getServerSideProps } from "@/pages";

type Props = {
  children: ReactNode;
  currentUser: string;
};

export const Layout = ({ children }: Props) => {
  return (
    <>
      <Header currentUser={currentUser}></Header>
      <main>{children}</main>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient("auth-srv", context);
  const { data } = await client.get("/api/users/currentuser");
  return {
    props: {
      currentUser: data.currentUser,
    },
  };
};