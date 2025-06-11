console.log("Dashboard-Skript geladen.");

// WICHTIG: Tragen Sie hier Ihre HiveMQ Cloud-Daten ein!
const options = {
  host: 'e511a0ad851e4fdaafd32f113a294998.s1.eu.hivemq.cloud', // URL von Ihrer HiveMQ-Seite
  port: 8884,                                  // WSS Port von Ihrer HiveMQ-Seite
  
  username: 'Dashi2',           // Username aus dem Access Management
  password: 'Sdfcioi88'      // Passwort aus dem Access Management
};

// Verbindet sich mit dem MQTT Broker
const client = mqtt.connect(options);

// Diese Funktion wird ausgeführt, wenn die Verbindung erfolgreich war
client.on('connect', function () {
  console.log('Erfolgreich mit HiveMQ Cloud verbunden!');

  // Wir abonnieren alle Themen unterhalb der Fräsmaschine. 
  // Das '#' ist eine Wildcard für "alles auf den folgenden Ebenen".
  const topicToSubscribe = 'MyCompany/Biberach/Produktion_A/Fraesmaschine_01/#';

  client.subscribe(topicToSubscribe, function (err) {
    if (!err) {
      console.log(`Topic '${topicToSubscribe}' erfolgreich abonniert!`);
    } else {
      console.error('Fehler beim Abonnieren:', err);
    }
  });
});

// Diese Funktion wird jedes Mal ausgeführt, wenn eine neue Nachricht ankommt
client.on('message', function (topic, message) {
  try {
    const data = JSON.parse(message.toString());
    console.log(`Nachricht empfangen auf Topic [${topic}]:`, data);

    // Wir finden heraus, um welchen Sensor es sich handelt,
    // indem wir den letzten Teil des Topics nehmen (z.B. "Temperatur")
    const sensor = topic.split('/').pop();

    // Jetzt aktualisieren wir das richtige HTML-Element
    switch(sensor) {
      case 'Temperatur':
        document.getElementById('temp-value').innerText = data.value;
        break;
      case 'Druck':
        document.getElementById('pressure-value').innerText = data.value;
        break;
      case 'Vibration':
        document.getElementById('vibration-value').innerText = data.value;
        break;
      case 'Status':
        document.getElementById('status-value').innerText = data.value;
        break;
      case 'Teilezaehler':
        document.getElementById('counter-value').innerText = data.value;
        break;
    }
  } catch (e) {
    console.error("Fehler beim Verarbeiten der Nachricht:", e);
  }
});

// Falls ein Fehler bei der Verbindung auftritt
client.on('error', function (err) {
  console.error('Verbindungsfehler:', err);
  client.end();
});
