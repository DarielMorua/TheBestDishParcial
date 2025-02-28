//los ""..."" significa que se  agarra todo el array y lo pone en elementos separados
function promocion3x2(order) {
  const orderCopy = { ...order };
  let platillos = {};

  //por cada platillo se cuenta cuantas veces se repite, si no existe se inicia en 0 y luego se suma 1
  orderCopy.dishes.forEach((dish) => {
    platillos[dish.dishName] = (platillos[dish.dishName] || 0) + 1;
  });

  let totalSinDescuento = 0;
  let descuentoTotal = 0;

  // busca en nuestro contador busca que en orderCopy.dishes coincida con el platillo que se le paso
  for (const dishName in platillos) {
    const cantidad = platillos[dishName];
    const dish = orderCopy.dishes.find((d) => d.dishName === dishName);

    // se le pasa el precio de cada iteracion y se van sumando y guardando en totalSinDescuento
    const dishPrice = dish.price;
    totalSinDescuento += cantidad * dishPrice;

    if (cantidad >= 3) {
      // se calcula cuantos grupos de 3 platillos completos hjay
      const platillosConDescuento = Math.floor(cantidad / 3);

      // descuento por platillo
      let descuentoPorPlatillo = dishPrice;

      // limitar el descuento por platillo a $20
      descuentoPorPlatillo = Math.min(descuentoPorPlatillo, 20);

      // agregar al descuento total
      descuentoTotal += platillosConDescuento * descuentoPorPlatillo;
    }
  }

  orderCopy.total = totalSinDescuento - descuentoTotal;
  orderCopy.hasPromotion = true;

  return orderCopy;
}
function promocion2x1(order) {
  const orderCopy = { ...order };

  // contadores
  const bebidas = {};
  const descuentosAplicados = {};

  // contar bebidas
  for (let dish of orderCopy.dishes) {
    if (dish.type === "drink") {
      //si no existe la bebida en el contador se inicia con 0
      if (!bebidas[dish.name]) {
        bebidas[dish.name] = 0;
      }
      bebidas[dish.name]++;
    }
  }

  // aplicar descuentos
  for (const dish of orderCopy.dishes) {
    //si es una bebida y aparece al menos 2 veces y aun no se aplico descuento
    if (
      dish.type === "drink" &&
      bebidas[dish.name] >= 2 &&
      !descuentosAplicados[dish.name]
    ) {
      // no mas de  $10 el descuento
      const discount = Math.min(dish.price, 10);
      orderCopy.total -= discount;
      //evitar aplicar el desceunto mas de una vez
      descuentosAplicados[dish.name] = true;
      orderCopy.hasPromotion = true;
    }
  }

  return orderCopy;
}

function mejorDescuento(order) {
  const orderCopy = { ...order };

  let maxDescuento = 0;
  const descuentosAplicados = {};

  const bebidas = {};
  const platillos = {};

  // contar bebidas
  for (const dish of orderCopy.dishes) {
    // Contar bebidas
    if (dish.type === "drink") {
      if (!bebidas[dish.dishName]) {
        bebidas[dish.dishName] = 0;
      }
      bebidas[dish.dishName]++;
    }

    // contar platillos
    if (dish.type === "food") {
      if (!platillos[dish.dishName]) {
        platillos[dish.dishName] = 0;
      }
      platillos[dish.dishName]++;
    }
  }

  //  descuento para 3 platillos iguales
  for (const dishName in platillos) {
    if (platillos[dishName] >= 3) {
      // encontrar el platillo con el nombre correcto
      const dish = buscarPlatilloNombre(orderCopy.dishes, dishName);
      if (dish) {
        maxDescuento = Math.max(maxDescuento, Math.min(dish.price, 20));
      }
    }
  }

  //  descuento para 2 bebidas iguales
  for (const drinkName in bebidas) {
    if (bebidas[drinkName] >= 2 && !descuentosAplicados[drinkName]) {
      // ncontrar la bebida con el nombre correcto
      const drink = buscarBebidaNombre(orderCopy.dishes, drinkName);
      if (drink) {
        maxDescuento = Math.max(maxDescuento, Math.min(drink.price, 10));
        descuentosAplicados[drinkName] = true;
      }
    }
  }

  // aplicar el mayor descuento
  orderCopy.total -= maxDescuento;
  if (maxDescuento > 0) {
    orderCopy.hasPromotion = true;
  }

  return orderCopy;
}

function aplicarCodigo(order, promoCode) {
  const orderCopy = { ...order };

  // ver si ya se aplicó una promoción
  if (orderCopy.hasPromotion === true) {
    return orderCopy;
  }

  let discount = 0;

  if (promoCode === "BIENVENIDA") {
    discount = orderCopy.total * 0.3;
  } else if (promoCode === "REFRESCATE") {
    const drinkPrices = orderCopy.dishes
      .filter((dish) => dish.type === "drink") //busca en dish todos los que sean de tipo drink
      .map((drink) => drink.price); // de todos los drink solo agarra el precio

    const highestDrinkPrice = Math.max(...drinkPrices, 0);
    discount = highestDrinkPrice;
  } else if (promoCode === "COMBO") {
    const preciosComida = orderCopy.dishes
      .filter((dish) => dish.type === "food")
      .map((food) => food.price);

    const preciosBebidas = orderCopy.dishes
      .filter((dish) => dish.type === "drink")
      .map((drink) => drink.price);

    const comidaBarata = Math.min(...preciosComida, Infinity); //esto me rompio la cabeza, debe ser infinito porque si ponemos cero significa que habra una platillo que cuesta $0
    const bebidaBarata = Math.min(...preciosBebidas, Infinity);

    discount = comidaBarata + bebidaBarata;
  } else if (promoCode === "PAREJA") {
    const preciosComida = orderCopy.dishes
      .filter((dish) => dish.type === "food")
      .map((dish) => dish.price);

    const preciosBebidas = orderCopy.dishes
      .filter((dish) => dish.type === "drink")
      .map((dish) => dish.price);

    const maxPrecioComida = Math.max(...preciosComida, 0);
    const segundoMaxComida = Math.max(
      ...preciosComida.filter((price) => price < maxPrecioComida),
      0
    );

    const maxPrecioBebida = Math.max(...preciosBebidas, 0);
    const segundoMaxBebida = Math.max(
      ...preciosBebidas.filter((price) => price < maxPrecioBebida),
      0
    );

    discount =
      maxPrecioComida + segundoMaxComida + maxPrecioBebida + segundoMaxBebida;
  }

  // Aplicar descuento si hay uno válido
  if (discount > 0) {
    orderCopy.total -= discount;
  }
  orderCopy.hasPromotion = true;

  return orderCopy;
}

function buscarPlatilloNombre(dishes, dishName) {
  return (
    dishes.find((dish) => dish.dishName === dishName && dish.type === "food") ||
    null
  );
}

function buscarBebidaNombre(dishes, drinkName) {
  return (
    dishes.find(
      (dish) => dish.dishName === drinkName && dish.type === "drink"
    ) || null
  );
}

function calcularPrecio(dishes) {
  return dishes.reduce((total, dish) => total + dish.price, 0);
}

module.exports = {
  calcularPrecio,
  aplicarCodigo,
  mejorDescuento,
  buscarPlatilloNombre,
  buscarBebidaNombre,
  promocion3x2,
  promocion2x1,
};
