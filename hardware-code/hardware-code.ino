#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

// ----------- WiFi & MQTT -------------
const char* ssid = "NCC_InstituteOfScience";
const char* password = "CrazySci3ntist";
const char* mqtt_server = "192.168.110.93";

// ----------- Sensor Pins -------------
#define DHTPIN 11
#define DHTTYPE DHT22
#define MQ135_PIN 4

DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient client(espClient);

// ----------- WiFi Setup -------------
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
}

// ----------- MQTT Reconnect -------------
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("esp32-dht22-mq135")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // --- Read from DHT22 ---
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (!isnan(humidity) && !isnan(temperature)) {
    String dhtPayload = "{\"temp\":" + String(temperature) + ",\"humidity\":" + String(humidity) + "}";
    client.publish("esp32/dht22/data", dhtPayload.c_str());
    Serial.println("DHT22 Published: " + dhtPayload);
  } else {
    Serial.println("Failed to read from DHT sensor!");
  }

  // --- Read from MQ135 ---
  int mq135Value = analogRead(MQ135_PIN);
  String airPayload = "{\"value\":" + String(mq135Value) + "}";
  client.publish("esp32/airquality/data", airPayload.c_str());
  Serial.println("MQ135 Published: " + airPayload);

  delay(5000);  // Publish every 5 seconds
}
