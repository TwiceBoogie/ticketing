import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { GetServerSideProps } from "next";
import { Layout } from "@/components/Layout";
import buildClient from "@/api/build-client";

type Props = {
  currentUser: string;
};

const Signup = ({ currentUser }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await doRequest();
  };
  return (
    <Layout currentUser={currentUser}>
      <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
          <label>Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Sign Up</button>
      </form>
    </Layout>
  );
};

export default Signup;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient("auth-srv", context);
  const { data } = await client.get("/api/users/currentuser");
  return {
    props: {
      currentUser: data.currentUser,
    },
  };
};
