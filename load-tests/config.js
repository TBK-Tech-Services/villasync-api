export const config = {
    // Backend URL - NO TRAILING SLASH
    BASE_URL: "http://localhost:8000",

    // JWT Token
    ADMIN_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJzYWhpbCIsImxhc3ROYW1lIjoibGFkaGFuaWEiLCJlbWFpbCI6InNAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzYzNTUyNjQwLCJleHAiOjE3NjM2MzkwNDB9.KD47EU2AvtWu2xtC1GKbKkR7qllgqtQ2mi-oEsjBITI",
    
    // Test durations
    WARM_UP: "30s",
    TEST: "2m",
    COOL_DOWN: "30s",

    // Load levels
    LIGHT: 10,
    MEDIUM: 30,
    HEAVY: 50,
    STRESS: 100,
};