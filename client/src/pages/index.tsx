import { Layout } from "../components/Layout";
import { GetServerSideProps } from "next";
import React from "react";
import buildClient from "../api/build-client";

type Props = {
  currentUser: string;
};

export default function Home({ currentUser }: Props) {
  return (
    <Layout currentUser={currentUser}>
      <h1>Welcome</h1>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get("/api-gateway/currentuser");
  return {
    props: {
      currentUser: data.currentUser,
    },
  };
};
