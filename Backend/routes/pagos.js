const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const Address = require("../models/address");
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const api=process.env.REACT_APP_API_URL;
// Crea una sesión de Checkout
// Espera recibir en el body { items: [{ name, unit_amount, quantity, currency }], success_url, cancel_url }
router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("Create checkout session called - code updated");
    const token = req.cookies.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const { items, success_url, cancel_url } = req.body;

    // Items are already with addressId
    const processedItems = items;

    // Mapear items al formato que Stripe espera
    const line_items = processedItems.map(item => ({
      price_data: {
        currency: item.currency || "cop", // o "cop" si usas COP
        product_data: { name: item.name },
        // unit_amount en la mínima unidad (centavos para COP).
        unit_amount: Math.round(item.unit_amount * 100), // Convertir a centavos
      },
      quantity: item.quantity,
    }));

    // Prepare metadata items with only essential fields to stay under 500 char limit
    const metadataItems = processedItems.map(item => ({
      c: item._id,
      p: item.productId,
      a: item.addressId,
      q: item.quantity,
      u: item.unit_amount
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata: {
        items: JSON.stringify(metadataItems),
        userId: userId
      },
      success_url: success_url || api+"/success/{CHECKOUT_SESSION_ID}",
      cancel_url: cancel_url || `${api}/cancel`,
    });

    // Devuelvo la url para redirigir
    res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: err.message });
  }
});

// Retrieve session details
router.get("/payment/session/:id", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json(session);
  } catch (err) {
    console.error("Error retrieving session:", err);
    res.status(500).json({ error: err.message });
  }
});

// Webhook endpoint para recibir confirmación de pago
router.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar evento de pago completado
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(session);
    // session contiene: id, amount_total, currency, customer_details, metadata, etc.
    console.log("Checkout session completed:", session.id);
    const items = JSON.parse(session.metadata.items).map(i => ({
      _id: i.c,
      productId: i.p,
      addressId: i.a,
      quantity: i.q,
      unit_amount: i.u
    }));
    const userId = session.metadata.userId;
    console.log("Productos en el pedido:", items);
    console.log("User ID:", userId);

    for (const item of items) {
        try {
          await axios.put(
            `${api}/api/productos/${item.productId}/stock`,
            {
              quantity: item.quantity
            }
          );
          console.log(` Stock actualizado para producto ${item.productId}`);
        } catch (err) {
          console.error(" Error actualizando stock:", err.response?.data || err.message);
        }

        try{
          await axios.delete(
            `${api}/api/carrito/payed/${item._id}`,
          );
          console.log(` Comprado producto en carrito con id ${item._id}`);
        }catch(err){
          console.error(" Error actualizando carrito:", err.response?.data || err.message);
        }

        try{
          console.log("Attempting to save order for item:", item);

          console.log(item);
          const orderData = {
            userId: userId,
            idProd: item.productId,
            idAddress: item.addressId,
            cuantity: item.quantity,
            total: item.unit_amount * item.quantity,
            status: "Payed"
          };
          const token = jwt.sign({ id: userId }, JWT_SECRET);
          await axios.post(
            `${api}/api/pedidos/`, orderData,
            {
              headers: {
                Cookie: `token=${token}`
              }
            }
          );
          console.log("Pedido agregado al historial");
        }catch(err){
          console.error("Error guardando pedido", err);
          console.error("Error details:", err.response?.data || err.message);
        }
      }
    }
    res.status(200).send('OK');
  
});

module.exports = router;
