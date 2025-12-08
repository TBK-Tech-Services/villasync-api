import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from './config.js';

// 100 User Load Test Configuration
export let options = {
    stages: [
        { duration: config.WARM_UP, target: config.HEAVY },   // 0→50 in 30s
        { duration: '1m', target: config.STRESS },            // 50→100 in 1min
        { duration: config.TEST, target: config.STRESS },     // Hold 100 for 2min
        { duration: config.COOL_DOWN, target: 0 },            // 100→0 in 30s
    ],

    // Relaxed thresholds for first heavy test
    thresholds: {
        'http_req_duration': ['p(95)<1000'],  // 1 second (relaxed from 500ms)
        'http_req_failed': ['rate<0.05'],     // 5% errors ok (relaxed from 1%)
    },
};

export default function () {
    // Test: GET All Villas
    let response = http.get(`${config.BASE_URL}/villas/v1/`);

    // Validate response
    check(response, {
        '✅ Status is 200': (r) => r.status === 200,
        '✅ Response time < 1s': (r) => r.timings.duration < 1000,
        '✅ Has response body': (r) => r.body.length > 0,
        '✅ Content-Type is JSON': (r) => r.headers['Content-Type']?.includes('application/json'),
    });

    // Simulate user think time
    sleep(1);
}