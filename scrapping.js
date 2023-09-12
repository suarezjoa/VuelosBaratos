const cheerio = require('cheerio');
const request = require('request-promise');

class IdaActor {
  async scrapeIda() {
    // Llama a la función getTresFechasPrecios con la URL de Ida y retorna los resultados
    const resultadosIda = await this.getTresFechasPrecios("https://flybondi.com/ar/search/dates?adults=1&children=0&fromCityCode=BUE&infants=0&toCityCode=MDZ");
    return resultadosIda;
  }

  async getTresFechasPrecios(url) {
    const resultados = [];

    try {
      // Realiza una solicitud HTTP a la URL y carga la página en cheerio
      const $ = await request({
        uri: url,
        transform: (body) => cheerio.load(body),
      });

      const precios = [];

      // Busca los elementos HTML correspondientes a los precios y las fechas
      $('.dt-row-group .jsx-468550366.fare-day').each((i, precio) => {
        const precioTexto = $(precio).text();
        const precioNumero = parseFloat(precioTexto.replace('$', '').replace(',', ''));

        if (!isNaN(precioNumero)) {
          precios.push({ date: i + 1, price: precioNumero }); // Corrige el índice para que el mes comience en el día 1
        }
      });

      precios.sort((a, b) => a.price - b.price);

      // Agrega los tres precios más bajos al arreglo de resultados
      resultados.push(precios[0]);
      resultados.push(precios[1]);
      resultados.push(precios[2]);

      return resultados;
    } catch (error) {
      console.error(error);
      throw new Error("Ha ocurrido un error en el scraping de Ida.");
    }
  }
}


class VueltaActor {
  async scrapeVuelta() {
    // Llama a la función getTresFechasPrecios con la URL de Vuelta y retorna los resultados
    const resultadosVuelta = await this.getTresFechasPrecios("https://flybondi.com/ar/search/dates?adults=1&children=0&currency=ARS&fromCityCode=MDZ&infants=0&toCityCode=BUE&utm_origin=search_bar");
    return resultadosVuelta;
  }

  async getTresFechasPrecios(url) {
    const resultados = [];

    try {
      // Realiza una solicitud HTTP a la URL y carga la página en cheerio
      const $ = await request({
        uri: url,
        transform: (body) => cheerio.load(body),
      });

      const precios = [];

      // Busca los elementos HTML correspondientes a los precios y las fechas
      $('.dt-row-group .jsx-468550366.fare-day').each((i, precio) => {
        const precioTexto = $(precio).text();
        const precioNumero = parseFloat(precioTexto.replace('$', '').replace(',', ''));

        if (!isNaN(precioNumero)) {
          precios.push({ date: i + 1, price: precioNumero }); // Corrige el índice para que el mes comience en el día 1
        }
      });

      precios.sort((a, b) => a.price - b.price);

      // Agrega los tres precios más bajos al arreglo de resultados
      resultados.push(precios[0]);
      resultados.push(precios[1]);
      resultados.push(precios[2]);

      return resultados;
    } catch (error) {
      console.error(error);
      throw new Error("Ha ocurrido un error en el scraping de Vuelta.");
    }
  }
}

// Exportamos las clases IdaActor y VueltaActor
module.exports = {
  IdaActor,
  VueltaActor,
};
