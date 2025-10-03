import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-04-10",
});

export async function createPaymentIntent(amount: number, currency: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    return paymentIntent;
  } catch (error) {
    throw error;
  }
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    throw error;
  }
}
