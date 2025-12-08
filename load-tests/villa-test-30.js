import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';

export let options = {
    stages: [
        { duration: config.WARM_UP, target: config.LIGHT },
        { duration: config.TEST, target: config.MEDIUM },
        { duration: config.COOL_DOWN, target: 0 },
    ],

    thresholds: {
        'http_req_duration': ['p(95)<500'],
        'http_req_failed': ['rate<0.01'],
    },
};

export default function () {
    let response = http.get(`${config.BASE_URL}/villas/v1/`);

    check(response, {
        '✅ Status is 200': (r) => r.status === 200,
        '✅ Response time < 500ms': (r) => r.timings.duration < 500,
        '✅ Has response body': (r) => r.body.length > 0,
        '✅ Content-Type is JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
    });

    sleep(1);
}