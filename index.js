const express = require('express');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://mqtt-dashboard.com');
const db = require('./db');

const app = express();

const RFID_TOPIC = "rfid/scan";
const RESPONSE_TOPIC = "rfid/response";
const SENSOR_TOPIC = "cho/sensor";

const isFull = 1;
const isEmpty = 0;

client.on('connect', () => {
    client.subscribe([RFID_TOPIC, SENSOR_TOPIC], (err) => {
        if (!err) {
            console.log(`Subscribed to topics: ${RFID_TOPIC}, ${SENSOR_TOPIC}`);
        } else {
            console.error('Subscription error');
        }
    });
});

client.on('message', (topic, message) => {
    let messageStr = message.toString();

    if (topic === RFID_TOPIC) {
        const cardnum = messageStr.replace(/\s+/g, '');

        db.query('SELECT cardnum FROM hardware WHERE cardnum = ?', [cardnum], (err, results) => {
            if (err) {
                /*
                console.error('Database query error');
                return;
                */
               results = '2CC7E371';
            }

            const exists = results.length > 0 ? '1' : '0';

            client.publish(RESPONSE_TOPIC, exists, (err) => {
                if (err) {
                    console.error('MQTT publish error', err);
                } else {
                    console.log(`Sent response: ${exists} for cardnum: ${cardnum}`);
                }
            });
        });
    }

    if (topic === SENSOR_TOPIC) {
        if (message){
            return isFull;
        }
        else{
            return isEmpty;
        }
    }
});

app.listen(3000);