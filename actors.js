const comedy = require("comedy");
const { IdaActor, VueltaActor } = require("./scrapping"); // Asegúrate de usar la ruta correcta

const actors = comedy();

async function main() {
  try {
    const rootActor = await actors.rootActor();

    // Actor local para Ida
    const idaActor = await rootActor.createChild(IdaActor);
    const idaData = await idaActor.sendAndReceive("scrapeIda");
    console.log("Resultados de Ida (local):", idaData);

    // Actor local para Vuelta
    const vueltaActor = await rootActor.createChild(VueltaActor);
    const vueltaData = await vueltaActor.sendAndReceive("scrapeVuelta");
    console.log("Resultados de Vuelta (local):", vueltaData);

    // Actor remoto para Ida
    const idaActorRemoto = await rootActor.createChild(IdaActor, {
      mode: "remote",
      host: "192.168.1.26", // Reemplaza con la dirección IP correcta del actor remoto
    });
    const idaDataRemoto = await idaActorRemoto.sendAndReceive("scrapeIda");
    console.log("Resultados de Ida (remoto):", idaDataRemoto);

    // Actor remoto para Vuelta
    const vueltaActorRemoto = await rootActor.createChild(VueltaActor, {
      mode: "remote",
      host: "192.168.1.26", // Reemplaza con la dirección IP correcta del actor remoto
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
