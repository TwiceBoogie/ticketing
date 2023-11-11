import { Layout } from "../components/Layout";
import { GetServerSideProps } from "next";
import React from "react";
import buildClient from "../api/build-client";

interface Tickets {
  id: number,
  title: string,
  price: string
}

export default function Home(tickets: Tickets) {
  return (
    <Layout>
      <h1>Welcome</h1>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient("auth-srv", context);
  const { data } = await client.get("/api/users/currentuser");
  return {
    props: {
      currentUser: data.currentUser,
    },
  };
};
