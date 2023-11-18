import {
  useState,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useCallback,
} from "react";
import { Button } from "@nextui-org/button";

interface Props {
  id: string;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  action: string;
  title?: string;
  price?: string;
  setInvalidT: Dispatch<SetStateAction<boolean>>;
  setInvalidP: Dispatch<SetStateAction<boolean>>;
  setIsEmpty: Dispatch<SetStateAction<boolean>>;
  isEmpty: boolean;
}

const ConfirmActionButton = ({
  id,
  setSuccess,
  action,
  title,
  price,
  setInvalidT,
  setInvalidP,
  setIsEmpty,
  isEmpty,
}: Props) => {
  const [disabled, setDisabled] = useState(false);
  let url = "";
  let btnTitle = "";
  let method = "";
  switch (action) {
    case "update":
      url = "/api/tickets";
      btnTitle = "Update";
      method = "PUT";
      break;
    case "order":
      url = "/api/orders";
      btnTitle = "Order";
      method = "POST";
      break;
    case "delete":
      url = "/api/orders";
      btnTitle = "Cancel Order";
      method = "DELETE";
      break;
  }

  const handleAction = useCallback(() => {
    if (action === "update") {
      if (title === "") setInvalidT(true);
      if (price === "") setInvalidP(true);

      if (title !== "" && price !== "") {
        setIsEmpty(false);
      }
    } else {
      setIsEmpty(false);
    }
  }, [title, price, action, setInvalidT, setInvalidP, setIsEmpty]);

  useEffect(() => {
    if (!isEmpty) {
      console.log(id, method, url);
      const fetchData = async () => {
        try {
          const res = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id,
              title,
              price,
            }),
          });
          const responseData = await res.json();
          if (res.ok) {
            setSuccess(true);
            setDisabled(true);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [isEmpty, id, method, price, setSuccess, title, url]);
  return (
    <>
      <Button color="primary" onPress={handleAction} isDisabled={disabled}>
        Confirm {btnTitle}
      </Button>
    </>
  );
};

export default ConfirmActionButton;
