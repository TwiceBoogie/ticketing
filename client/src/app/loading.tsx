import { Spinner } from "@nextui-org/spinner";

const loading = () => {
  return (
    <div className="border border-gray-200 rounded-md p-4  w-full">
      <div className="flex flex-col gap-2">
        <h1>Please wait</h1>
        <h1 className="text-2xl font-bold">Loading...</h1>
        <Spinner />
      </div>
    </div>
  );
};

export default loading;
