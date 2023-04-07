import { createServer } from "node:http"; //createServer chiama una callback con due parametri: request che accetta le richieste, e response
const server = createServer((request, response) => {
  console.log("request recived");

  response.statusCode = 200; //200 è OK, 404 è ERRORE

  response.setHeader("Content-Type", "text/html");

  response.end( "<html><body><h1>This page was served with Node.js</h1></body></html");
  // });

  /*==== JSON -> alternative se uso file json ====*/
  const jsonResponseBody = JSON.stringify({ location: "Earth" });

  response.setHeader("Content-Type", "application/json");

  response.end(jsonResponseBody);
});


/*=========== PROTOCOLLO HyperText Transfer Protocol (http://) ============
Utilizzato per la trasmissione di informazioni su Internet, consente ai computer di comunicare tra loro. Trasferisce le pagine web da un server a un browser.
Il client -> invia una richiesta HTTP al server -> invia una risposta HTTP al browser del client. Le richieste HTTP possono essere GET, POST, PUT, DELETE... mentre le risposte HTTP contengono informazioni sullo stato della richiesta e i dati richiesti dal client.*/

/*=========== HOST(localhost:300) ============
== Host è un dispositivo che può comunicare con altri dispositivi attraverso una rete; un server web, un computer o qualsiasi dispositivo in grado di connettersi ad una rete.
== Localhost" indica l'host locale, di solito fa riferimento al proprio computer. Quando si utilizza "localhost" come nome dell'host, si fa riferimento all'indirizzo IP della scheda di rete del dispositivo, ovvero 127.0.0.1.
Quindi, se si accede al web tramite localhost, ci si sta connettendo al proprio computer come se fosse un server remoto.Utile poiché permette di testare l'applicazione sul proprio computer.
==:3000 -> La porta 3000 viene utilizzata da server web o applicazioni che eseguono su un ambiente Node.js. Ogni porta è associata ad un servizio o applicazione specifica, in modo che il server sappia a quale applicazione inviare le richieste ricevute sulla porta specifica.*/
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000"); //il server runna ed  è pronto a ricevere request
});

/*====TERMINAL====
node server.mjs
curl http://localhost:3000 ->per vedere il contenuto della response
curl --verbose(-v) http://localhost:3000 ->vedo altre info
*/
