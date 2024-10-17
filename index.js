const express = require('express');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://mqtt-dashboard.com');

const app = express();

const SENSOR_TOPIC = "cho/sensor";

const isFull = 1;
const isEmpty = 0;

let currentSensorStatus = null; // 센서 상태를 저장하기 위한 변수

// 센서 상태 반환 API
app.get('/sensor/status', (req, res) => {
    if (currentSensorStatus === null) {
        return res.status(404).send('센서 상태를 아직 받지 못했습니다');
    }

    res.send({ status: currentSensorStatus }); // 0 (Empty), 1 (Full) 그대로 반환
});

// MQTT 연결 및 메시지 처리
client.on('connect', () => {
    client.subscribe([SENSOR_TOPIC], (err) => {
        if (!err) {
            console.log(`토픽 구독: ${SENSOR_TOPIC}`);
        } else {
            console.error('구독 오류');
        }
    });
});

client.on('message', (topic, message) => {
    const messageStr = message.toString();

    if (topic === SENSOR_TOPIC) {
        currentSensorStatus = messageStr === "1" ? isFull : isEmpty;
        console.log(`센서 상태: ${currentSensorStatus}`);
    }
});

// 서버 실행
app.listen(3000, () => {
    console.log('서버가 3000번 포트에서 실행 중입니다');
});
