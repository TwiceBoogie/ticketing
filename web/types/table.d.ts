export type TTableColumnConfig = {
  key: string;
  label: string;
};

export type TBase = {
  id: string;
  userId: string;
};

export type TTableComponentProps<T extends IBase> = {
  name: "orders" | "tickets";
  data: T[];
  columns: TableColumnConfig[];
};
