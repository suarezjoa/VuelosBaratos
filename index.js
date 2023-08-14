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
        uri: "https://flybondi.com/ar/search/dates?adults=1&children=0&fromCityCode=BUE&infants=0&toCityCode=MDZ",
        transform: body => cheerio.load(body)
    });

    $('.dt-row-group .jsx-468550366.fare-day').each((i, precio) => {
        const precioTexto = $(precio).text();
        dict.agregar(i, precioTexto); // agregamos al dic
        arrayDePreciosAux.push(precioTexto); // agregamos al arreglo
    });

    arrayDePreciosAux.sort((a, b) => {
        // Convierte las cadenas a números y compara para la ordenación
        const precioA = parseFloat(a.replace(/\D/g, ''));
        const precioB = parseFloat(b.replace(/\D/g, ''));
        return precioA - precioB;
    });

    const preciosMayoresACero = arrayDePreciosAux.filter(precio => {
        const precioNum = parseFloat(precio.replace(/\D/g, ''));
        return precioNum > 0;
    });
    console.log(preciosMayoresACero);
    const valorBuscado = "$10399";
    const llavesEncontradas = dict.encontrarLlavesPorValor(valorBuscado);

    if (llavesEncontradas !== null) {
        console.log(`Las claves para el valor ${valorBuscado} son "${llavesEncontradas.join(', ')}"`);
    } else {
        console.log(`El valor ${valorBuscado} no se encontró en el diccionario`);
    }
}

init();
