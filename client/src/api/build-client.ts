import axios, { AxiosInstance } from "axios";
import { GetServerSidePropsContext } from "next";

const buildClient = (serviceName: string, { req }: GetServerSidePropsContext): AxiosInstance => {
  if (typeof window === "undefined") {
    // We are on the server

    const baseURL = `http://${serviceName}.default.svc.cluster.local:3000`;
    return axios.create({
      baseURL,
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