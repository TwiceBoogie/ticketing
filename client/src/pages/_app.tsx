import buildClient from "@/api/build-client";
import { Header } from "@/components/Header";
import "bootstrap/dist/css/bootstrap.css";
import { GetServerSideProps } from "next";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <div className="container">
        <Component {...pageProps} />
      </div>
    </div>
  );
}