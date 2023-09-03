const cheerio = require('cheerio');
const request = require('request-promise');

class Diccionario {
    constructor() {
        this.items = {}
    }
    agregar(llave, valor) {
        if (!this.items[llave]) {
            this.items[llave] = [];
        }
        this.items[llave].push(valor);
    }
    getItems() {
        return this.items;
    }
    encontrarLlavesPorValor(valor) {
        const llavesEncontradas = [];

        for (const llave in this.items) {
            if (this.items.hasOwnProperty(llave)) {
                if (this.items[llave].includes(valor)) {
                    llavesEncontradas.push(parseInt(llave) + 1);
                }
            }
        }

        return llavesEncontradas.length > 0 ? llavesEncontradas : null;
    }
}

var dict = new Diccionario();

var arrayDePreciosAux = [];

async function init() {
    const $ = await request({
        uri: "https://flybondi.com/ar/search/dates?adults=1&children=0&currency=ARS&fromCityCode=MDZ&infants=0&toCityCode=BUE&utm_origin=search_bar",
        transform: body => cheerio.load(body)
    });

    $('.dt-row-group .jsx-468550366.fare-day').each((i, precio) => {
        const precioTexto = $(precio).text();
        dict.agregar(i+1, precioTexto); // Corregimos el índice para que el mes comience en el día 1
    });

    const arrayDePrecios = Object.entries(dict.getItems())
        .filter(([key, value]) => value[0] && value[0] !== '$0') // Filtramos los precios válidos
        .map(([key, value]) => ({ date: key, price: parseFloat(value[0].replace('$', '')) })) // Mapeamos a objetos {date, price}
        .sort((a, b) => a.price - b.price); // Ordenamos por precio de menor a mayor

    const tresPreciosMenores = arrayDePrecios.slice(0, 3); // Tomamos los tres precios menores

    tresPreciosMenores.forEach(({ date, price }) => {
        console.log(`Fecha: ${date}, Precio: $${price}`);
    });

    console.log(dict);

}

init();

