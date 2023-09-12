const comedy = require("comedy");
const { IdaActor, VueltaActor } = require("./scrapping"); // Importa las funciones de las clases

const actors = comedy();// Creamos una instancia del sistema de actores

async function main() {
  try {
    const rootActor = await actors.rootActor(); // Creamos el actor raíz del sistema de actores

    // Actor local para Ida
    const idaActor = await rootActor.createChild(IdaActor); // Crea un actor local
    const idaData = await idaActor.sendAndReceive("scrapeIda"); // Envía un mensaje al actor y recibe una respuesta
    console.log("Resultados de Ida (local):", idaData);// Imprime los resultados

    // Actor local para Vuelta
    const vueltaActor = await rootActor.createChild(VueltaActor); // Crea un actor local
    const vueltaData = await vueltaActor.sendAndReceive("scrapeVuelta");// Envía un mensaje al actor y recibe una respuesta
    console.log("Resultados de Vuelta (local):", vueltaData);// Imprime los resultados

    // Actor remoto para Ida
    const idaActorRemoto = await rootActor.createChild(IdaActor, {mode: "remote",host: "172.16.12.67",});
    const idaDataRemoto = await idaActorRemoto.sendAndReceive("scrapeIda");
    console.log("Resultados de Ida (remoto):", idaDataRemoto);

    // Actor remoto para Vuelta
    const vueltaActorRemoto = await rootActor.createChild(VueltaActor, {mode: "remote",host: "172.16.12.67",});
    const vueltaDataRemoto = await vueltaActorRemoto.sendAndReceive("scrapeVuelta");
    console.log("Resultados de Vuelta (remoto):", vueltaDataRemoto);
  } catch (err) {
    console.error(err);
  } finally {
    actors.destroy();
  }
}

main();

