import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  gradient?: boolean;
};

const DefaultLayout = ({ children, gradient = false }: Props) => {
  return <div className={`h-full w-full flex justify-center ${gradient ? "" : ""}`}>{children}</div>;
};

export default DefaultLayout;
