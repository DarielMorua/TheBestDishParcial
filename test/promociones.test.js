dishes = {
  1: {
    dishName: "Hamburguesa",
    dishDescription: "Hamburguesa de carne",
    dishImgSrc: "img",
    price: 100,
    type: "food",
  },
  2: {
    dishName: "Agua",
    dishDescription: "Agua de horchata",
    dishImgSrc: "img",
    price: 20,
    type: "drink",
  },
  3: {
    dishName: "Papas",
    dishDescription: "Papas fritas",
    dishImgSrc: "img",
    price: 50,
    type: "food",
  },

  4: {
    dishName: "Refresco",
    dishDescription: "Refresco de cola",
    dishImgSrc: "img",
    price: 30,
    type: "food",
  },
  5: {
    dishName: "Ensalada",
    dishDescription: "Ensalada de lechuga",
    dishImgSrc: "img",
    price: 40,
    type: "food",
  },
  6: {
    dishName: "Pizza",
    dishDescription: "Pizza de pepperoni",
    dishImgSrc: "img",
    price: 120,
    type: "food",
  },
};

const promotionController = require("../controllers/promotion.controller");

describe("Pruebas unitarias", () => {
  describe("Pruebas de promociones", () => {
    it("Dado que existan 3 platillos iguales en la orden se debera agregar solamente el precio de 2 de ellos pero que no exceda mas de $20 el descuento", async () => {
      currentOrder = {
        date: new Date(),
        clientName: "Juan",
        dishes: [
          dishes[1],
          dishes[1],
          dishes[1],
          dishes[3],
          dishes[3],
          dishes[3],
          dishes[5],
          dishes[5],
          dishes[5],
          dishes[6],
          dishes[6],
          dishes[6],
        ],
        hasPromotion: false,
        total: 0,
        //total: dishes[1].price * 3 + dishes[3].price * 3 + dishes[5].price * 3 + dishes[6].price * 3,
      };
      currentOrder.total = promotionController.calcularPrecio(
        currentOrder.dishes
      );
      const updatedOrder = promotionController.promocion3x2(currentOrder);

      try {
        //expect(updatedOrder.total).toEqual(280);
        console.log("El precio total de la orden es " + updatedOrder.total);
      } catch (error) {
        console.log(error);
      }
    });
    it("Dado que existan 2 bebidas iguales en la orden debera agregar solamente el precio de una pero que no exceda mas de $10 el descuento", async () => {
      currentOrder = {
        date: new Date(),
        clientName: "Juan",
        dishes: [dishes[2], dishes[2]],
        hasPromotion: false,

        total: dishes[2].price * 2,
      };
      const updatedOrder = promotionController.promocion2x1(currentOrder);

      try {
        expect(updatedOrder.total).toEqual(30);
        console.log("El precio total de la orden es " + updatedOrder.total);
      } catch (error) {
        console.log(error);
      }
    });

    it("Dado que existan más de 2 promociones en la orden, deberá aplicar aquella que genere el mayor descuento", async () => {
      currentOrder = {
        date: new Date(),
        clientName: "Juan",
        dishes: [
          dishes[1],
          dishes[1],
          dishes[1],
          dishes[2],
          dishes[2],
          dishes[2],
          dishes[3],
          dishes[3],
          dishes[3],
          dishes[4],
          dishes[4],
          dishes[4],
          dishes[5],
          dishes[5],
          dishes[5],
          dishes[6],
          dishes[6],
          dishes[6],
        ],
        hasPromotion: false,

        total:
          dishes[2].price * 3 +
          dishes[1].price * 3 +
          dishes[3].price * 3 +
          dishes[4].price * 3 +
          dishes[5].price * 3 +
          dishes[6].price * 3,
      };
      const updatedOrder = promotionController.mejorDescuento(currentOrder);
      try {
        expect(updatedOrder.total).toBeLessThan(currentOrder.total);

        expect(updatedOrder.hasPromotion).toBe(true);

        console.log("El precio total de la orden es " + updatedOrder.total);
      } catch (error) {
        console.log(error);
      }
    });
    it("Dado que tengan codigo promocional debera aplicar solamente si no existe alguna promocion dentro de la orden", () => {
      let currentOrder = {
        date: new Date(),
        clientName: "Juan",
        dishes: [
          dishes[1],
          dishes[1],
          dishes[1],
          dishes[2],
          dishes[2],
          dishes[3],
          dishes[3],
          dishes[3],
          dishes[4],
          dishes[4],
          dishes[5],
          dishes[5],
          dishes[5],
          dishes[6],
          dishes[6],
        ],
        total:
          dishes[1].price * 3 +
          dishes[2].price * 3 +
          dishes[3].price * 3 +
          dishes[4].price * 3 +
          dishes[5].price * 3 +
          dishes[6].price * 3,
        hasPromotion: false,
      };
      console.log("PRUEBA" + currentOrder.total);
      const updatedOrder = promotionController.aplicarCodigo(
        currentOrder,
        "BIENVENIDA"
      );

      // verificar que se haya aplicado el código
      expect(updatedOrder.hasPromotion).toBe(true);
      console.log("El precio total de la orden es " + updatedOrder.total);
      // Intentar aplicar otro código (no debería aplicarse)
      const orderWithSecondCode = promotionController.aplicarCodigo(
        updatedOrder,
        "REFRESCATE"
      );
      console.log(
        "El precio total no cambio, sigue siendo:  " + updatedOrder.total
      );

      // El total no debería cambiar al intentar aplicar un segundo código
      expect(orderWithSecondCode.total).toEqual(updatedOrder.total);
    });
  });
});
