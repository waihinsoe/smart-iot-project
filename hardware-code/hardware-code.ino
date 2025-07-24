#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#include <ArduinoJson.h>

// ----------- WiFi & MQTT -------------
const char* ssid = "NCC_InstituteOfScience";
const char* password = "CrazySci3ntist";
const char* mqtt_server = "192.168.110.242";

// ----------- Sensor Pins -------------
#define DHTPIN 11
#define DHTTYPE DHT22
#define MQ135_PIN 4

#define RED_PIN 5
#define GREEN_PIN 6
#define BLUE_PIN 7

unsigned long lastSensorTime = 0;
const unsigned long interval = 5000;  // 5 seconds


DHT dht(DHTPIN, DHTTYPE);

WiFiClient espClient;
PubSubClient client(espClient);

// MQTT callback
void callback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }

  if (String(topic) == "esp32/led/control") {
    StaticJsonDocument<128> doc;
    DeserializationError error = deserializeJson(doc, msg);
    if (!error) {
      int r = doc["r"] | 0;
      int g = doc["g"] | 0;
      int b = doc["b"] | 0;

      setColor(r,g,b);
      
      Serial.printf("LED set to R:%d G:%d B:%d\n", r, g, b);
    } else {
      Serial.println("Invalid JSON for LED");
    }
  }
}

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
    if (client.connect("esp32-combined")) {
      Serial.println("connected");
      client.subscribe("esp32/led/control");
    } else {
      Serial.print("failed, rc=");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void setColor(int r, int g, int b) {
    analogWrite(RED_PIN, r);
    analogWrite(GREEN_PIN, g);
    analogWrite(BLUE_PIN,  b);
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Setup pins
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);

  analogWrite(RED_PIN, 255);
  analogWrite(GREEN_PIN, 0);
  analogWrite(BLUE_PIN,  0);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

}


void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  unsigned long now = millis();
  if (now - lastSensorTime >= interval) {
    lastSensorTime = now;

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
  }

  // No blocking delay, can still receive MQTT messages
}

