import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const res = await fetch(
      `${process.env.TICKETS_ENDPOINT!}/api/tickets/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const ticket = await res.json();
    const product = await stripe.products.create({
      name: ticket.title,
      default_price_data: {
        unit_amount: ticket.price * 100,
        currency: "usd",
      },
    });

    const productPriceId = product.default_price as string;
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: productPriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/checkout/?success=true`,
      cancel_url: `http://localhost:3000/checkout/?canceled=true`,
    });
    console.log(session);
    return Response.json({ session });
  } catch (error) {
    console.log(error);
  }
}
