import requests
import time

API_BASE = "https://intelligent-system-for-managing-and.onrender.com/api/productos"

carrito = []


def obtener_productos():
    try:
        resp = requests.get(API_BASE)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print("❌ Error obteniendo productos:", e)
        return []


def mostrar_productos(productos):
    print("\n=== LISTA DE PRODUCTOS ===\n")
    for p in productos:
        nombre = p.get('title', 'SIN NOMBRE')
        precio = p.get('price', 'N/A')
        stock = p.get('quantity', p.get('qty', p.get('stock', 'N/A')))

        print(f"""
ID: {p.get('_id', 'N/A')}
Nombre: {nombre}
Precio: {precio}
Stock: {stock}
--------------------------
""")


def agregar_al_carrito(productos):
    producto_id = input("👉 Ingresa el ID del producto que deseas comprar: ").strip()

    producto = next((p for p in productos if p['_id'] == producto_id), None)

    if not producto:
        print("❌ Producto no encontrado.")
        return

    cantidad = int(input("👉 ¿Cuántas unidades deseas agregar? "))

    if cantidad <= 0:
        print("❌ Cantidad inválida.")
        return

    if cantidad > producto['stock']:
        print(f"❌ Solo hay {producto['stock']} unidades disponibles.")
        return

    carrito.append({
        "productId": producto['_id'],
        "title": producto['title'],
        "price": producto['price'],
        "quantity": cantidad
    })

    print(f"✅ {cantidad} unidad(es) de '{producto['title']}' agregadas al carrito.")


def mostrar_carrito():
    print("\n========== TU CARRITO ==========\n")
    if not carrito:
        print("🛒 El carrito está vacío.")
        return

    total = 0
    for item in carrito:
        subtotal = item['price'] * item['quantity']
        total += subtotal
        print(f"{item['title']}  x{item['quantity']}  → ${subtotal:,}")

    print(f"\nTOTAL A PAGAR: ${total:,}\n")


def procesar_pago():
    if not carrito:
        print("❌ Tu carrito está vacío.")
        return

    mostrar_carrito()

    confirm = input("¿Deseas pagar? (s/n): ").strip().lower()
    if confirm != 's':
        print("❌ Pago cancelado.")
        return

    print("\n💳 Procesando pago...\n")
    time.sleep(1)

    # ACTUALIZAR STOCK EN TU BACKEND
    for item in carrito:
        try:
            url = f"{API_BASE}/{item['productId']}/stock"
            resp = requests.put(url, json={"quantity": item['quantity']})
            resp.raise_for_status()
            print(f"✔ Stock actualizado para {item['title']}")
        except Exception as e:
            print("❌ Error actualizando stock:", e)

    carrito.clear()
    print("\n🎉 COMPRA EXITOSA — ¡Gracias por tu compra! 🎉\n")


def menu():
    while True:
        print("""
==============================    
 SIMULACIÓN PASARELA DE PAGO    
==============================

1. Ver productos
2. Agregar producto al carrito
3. Ver carrito
4. Procesar pago
5. Salir
""")

        opcion = input("👉 Selecciona una opción: ").strip()

        productos = obtener_productos()

        if opcion == "1":
            mostrar_productos(productos)

        elif opcion == "2":
            mostrar_productos(productos)
            agregar_al_carrito(productos)

        elif opcion == "3":
            mostrar_carrito()

        elif opcion == "4":
            procesar_pago()

        elif opcion == "5":
            print("👋 Saliendo...")
            break

        else:
            print("❌ Opción inválida.")


if __name__ == "__main__":
    menu()
