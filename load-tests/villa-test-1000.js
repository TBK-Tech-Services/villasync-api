import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';

// 1000 User Stress Test Configuration
export let options = {
    stages: [
        { duration: '1m', target: 100 },     // Warm up to 100
        { duration: '2m', target: 500 },     // Ramp to 500
        { duration: '2m', target: 1000 },    // Ramp to 1000
        { duration: '3m', target: 1000 },    // SUSTAIN 1000 for 3 min
        { duration: '1m', target: 0 },       // Cool down
    ],

    // Thresholds - slightly relaxed for discovery
    thresholds: {
        'http_req_duration': ['p(95)<2000'],  // 2 seconds (10x jump)
        'http_req_failed': ['rate<0.10'],     // 10% errors ok (discovery)
    },
};

export default function () {
    // Test: GET All Villas
    let response = http.get(`${config.BASE_URL}/villas/v1/`);

    // Validate response
    check(response, {
        '✅ Status is 200': (r) => r.status === 200,
        '✅ Response time < 2s': (r) => r.timings.duration < 2000,
        '✅ Has response body': (r) => r.body.length > 0,
    });

    // Simulate user think time
    sleep(1);
}