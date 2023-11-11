import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

interface Props {
    currentUser: CurrentUserProps,
    order: OrderProps
}

interface CurrentUserProps {
    id: number,
    email: string
}

interface OrderProps {
    id: number,
    ticket: {
        price: number
    },
    expiresAt: number
}

const OrderShow = ({ order, currentUser }: Props) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id,
        },
        onSuccess: () => Router.push("/orders"),
    });

    useEffect(() => {
        const findTimeLeft = () => {
            const expirationDate = new Date(order.expiresAt); // Parse 'order.expiresAt' into a Date object
            const currentDate = new Date(); // Get the current date

            if (!isNaN(expirationDate.getTime()) && !isNaN(currentDate.getTime())) {
                const msLeft = expirationDate.getTime() - currentDate.getTime(); // Calculate the time difference in milliseconds
                setTimeLeft(Math.round(msLeft / 1000)); // Convert to seconds and update 'timeLeft'
            }
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [order]);

    if (timeLeft < 0) {
        return <div>Order Expired</div>;
    }

    return (
        <div>
            Time left to pay: {timeLeft} seconds
            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey={process.env.STRIPE_KEY}
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>
    );
}
