const comedy = require("comedy");
const { IdaActor, VueltaActor } = require("./scrapping"); // Asegúrate de usar la ruta correcta

const actors = comedy();

class RemoteActor {
  showMessage() {
    return this.ScrapRemoto();
  }

  async ScrapRemoto() {
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


async function main() {
  try {
    const rootActor = await actors.rootActor();

    // Crear un actor local para Ida
    const idaActor = await rootActor.createChild(IdaActor);
    const idaData = await idaActor.sendAndReceive("scrapeIda");
    console.log("Resultados de Ida (local):", idaData);

    // Crear un actor local para Vuelta
    const vueltaActor = await rootActor.createChild(VueltaActor);
    const vueltaData = await vueltaActor.sendAndReceive("scrapeVuelta");
    console.log("Resultados de Vuelta (local):", vueltaData);

    // Crear un actor remoto para Ida
    const idaActorRemoto = await rootActor.createChild(RemoteActor, {
      mode: "remote",
      host: "192.168.0.2", // Reemplaza con la dirección IP correcta del actor remoto
    });
    const idaDataRemoto = await idaActorRemoto.sendAndReceive("scrapeIda");
    console.log("Resultados de Ida (remoto):", idaDataRemoto);

    // Crear un actor remoto para Vuelta
    const vueltaActorRemoto = await rootActor.createChild(VueltaActor, {
      mode: "remote",
      host: "192.168.1.33", // Reemplaza con la dirección IP correcta del actor remoto
    });
    const vueltaDataRemoto = await vueltaActorRemoto.sendAndReceive("scrapeVuelta");
    console.log("Resultados de Vuelta (remoto):", vueltaDataRemoto);
  } catch (err) {
    console.error(err);
  } finally {
    actors.destroy();
  }
}

main();
