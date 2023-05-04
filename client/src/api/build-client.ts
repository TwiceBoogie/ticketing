import axios, { AxiosInstance } from "axios";
import { GetServerSidePropsContext } from "next";

const buildClient = ({ req }: GetServerSidePropsContext): AxiosInstance => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL: "http://api-gateway-srv.default.svc.cluster.local:3000",
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
