const comedy = require("comedy");
const { IdaActor, VueltaActor } = require("./scrapping"); // Importa las funciones de las clases

const actors = comedy(); // Instancia del sistema de actores

async function main() {
  try {
    const rootActor = await actors.rootActor(); // Creamos el actor raíz del sistema de actores

    // Actor local para Ida
    const idaActor = await rootActor.createChild(IdaActor); // Creamos un actor local
    const idaData = await idaActor.sendAndReceive("scrapeIda"); // Envía un mensaje al actor y recibe una respuesta
    console.log("Resultados de Ida (local):", idaData); // Imprime los resultados

    // Actor local para Vuelta
    const vueltaActor = await rootActor.createChild(VueltaActor); // Crea un actor local
    const vueltaData = await vueltaActor.sendAndReceive("scrapeVuelta"); // Envía un mensaje al actor y recibe una respuesta
    console.log("Resultados de Vuelta (local):", vueltaData); // Imprime los resultados

    // Actor remoto para Ida
    const idaActorRemoto = await rootActor.createChild(IdaActor, {
      mode: "remote",
      host: "192.168.1.26",
    });
    const idaDataRemoto = await idaActorRemoto.sendAndReceive("scrapeIda"); // Envía un mensaje al actor remoto y recibe una respuesta
    console.log("Resultados de Ida (remoto):", idaDataRemoto); // Imprime los resultados

    // Actor remoto para Vuelta
    const vueltaActorRemoto = await rootActor.createChild(VueltaActor, {
      mode: "remote",
      host: "192.168.1.26",
    });
    const vueltaDataRemoto = await vueltaActorRemoto.sendAndReceive("scrapeVuelta"); // Envía un mensaje al actor remoto y recibe una respuesta
    console.log("Resultados de Vuelta (remoto):", vueltaDataRemoto); // Imprime los resultados
  } catch (err) {
    console.error(err); 
  } finally {
    actors.destroy(); // Destruye el sistema de actores al finalizar
  }
}

main();
