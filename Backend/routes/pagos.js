const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Crea una sesión de Checkout
// Espera recibir en el body { items: [{ name, unit_amount, quantity, currency }], success_url, cancel_url }
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, success_url, cancel_url } = req.body;

    // Mapear items al formato que Stripe espera
    const line_items = items.map(item => ({
      price_data: {
        currency: item.currency || "usd", // o "cop" si usas COP
        product_data: { name: item.name },
        // unit_amount en la mínima unidad (cents para USD). Para COP usar pesos (sin decimales).
        unit_amount: item.unit_amount,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: success_url || "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancel_url || "http://localhost:3000/cancel",
    });

    // Devuelvo la url para redirigir
    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook endpoint para recibir confirmación de pago
// IMPORTANTE: stripe.webhooks.constructEvent necesita el body raw — manejar en app.js
router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar evento de pago completado
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // session contiene: id, amount_total, currency, customer_details, metadata, etc.
    console.log("Checkout session completed:", session.id);

    // Aquí pones la lógica de tu app:
    // - Marcar pedido como pagado en la DB
    // - Guardar session.id o su metadata para reconciliación
    // - Enviar email, generar factura, etc.
    // EJEMPLO: Order.findOneAndUpdate({ checkoutSessionId: session.id }, { paid: true })
  }

  res.json({ received: true });
});

module.exports = router;
