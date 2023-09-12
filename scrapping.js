const cheerio = require('cheerio');
const request = require('request-promise');

class IdaActor {
  async scrapeIda() {
    const resultadosIda = await this.getTresFechasPrecios("https://flybondi.com/ar/search/dates?adults=1&children=0&fromCityCode=BUE&infants=0&toCityCode=MDZ");
    return resultadosIda;
  }

  async getTresFechasPrecios(url) {
    const resultados = [];

    try {
      const $ = await request({
        uri: url,
        transform: (body) => cheerio.load(body),
      });

      const precios = [];

      $('.dt-row-group .jsx-468550366.fare-day').each((i, precio) => {
        const precioTexto = $(precio).text();
        const precioNumero = parseFloat(precioTexto.replace('$', '').replace(',', ''));

        if (!isNaN(precioNumero)) {
          precios.push({ date: i + 1, price: precioNumero }); // Corregimos el índice para que el mes comience en el día 1
        }
      });

      precios.sort((a, b) => a.price - b.price);

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
    const resultadosVuelta = await this.getTresFechasPrecios("https://flybondi.com/ar/search/dates?adults=1&children=0&currency=ARS&fromCityCode=MDZ&infants=0&toCityCode=BUE&utm_origin=search_bar");
    return resultadosVuelta;
  }

  async getTresFechasPrecios(url) {
    const resultados = [];

    try {
      const $ = await request({
        uri: url,
        transform: (body) => cheerio.load(body),
      });

      const precios = [];

      $('.dt-row-group .jsx-468550366.fare-day').each((i, precio) => {
        const precioTexto = $(precio).text();
        const precioNumero = parseFloat(precioTexto.replace('$', '').replace(',', ''));

        if (!isNaN(precioNumero)) {
          precios.push({ date: i + 1, price: precioNumero }); // Corregimos el índice para que el mes comience en el día 1
        }
      });

      precios.sort((a, b) => a.price - b.price);

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

module.exports = {
  IdaActor,
  VueltaActor,
};
