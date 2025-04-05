import React, { FC } from "react";

type ISecureForm = {
  children: React.ReactNode;
  action: (prev: any, formData: FormData) => Promise<any>;
};

export const SecureForm: FC<ISecureForm> = (props) => {
  const { children, action } = props;
  return <div>SecureForm</div>;
};
