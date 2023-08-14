const actors = require('comedy');
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

async function scrapingTask(url) {
    const $ = await request({
        uri: url,
        transform: body => cheerio.load(body)
    });

    $('.dt-row-group .jsx-468550366.fare-day').each((i, precio) => {
        const precioTexto = $(precio).text();
        dict.agregar(i, precioTexto); // agregamos al dic
        arrayDePreciosAux.push(precioTexto); // agregamos al arreglo
    });

    return dict;
}

(async () => {
    // Crea el sistema de actores
    const actorSystem = actors();

    try {
        // Obtiene una referencia al actor raíz
        const rootActor = await actorSystem.rootActor();

        // Crea actores para las tareas de scraping
        const scrapingActor1 = await rootActor.createChild(scrapingTask, { mode: 'forked' });
        const scrapingActor2 = await rootActor.createChild(scrapingTask, { mode: 'forked' });

        // Envía mensajes a los actores para que realicen las tareas de scraping
        const result1 = await scrapingActor1.sendAndReceive('scrapingTask', 'https://flybondi.com/ar/search/dates?adults=1&children=0&fromCityCode=BUE&infants=0&toCityCode=MDZ');
        const result2 = await scrapingActor2.sendAndReceive('scrapingTask', 'https://flybondi.com/ar/search/dates?adults=1&children=0&currency=ARS&fromCityCode=BUE&infants=0&toCityCode=USH');

        console.log(result1);
        console.log(result2);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Destruye el sistema de actores
        actorSystem.destroy();
    }
})();