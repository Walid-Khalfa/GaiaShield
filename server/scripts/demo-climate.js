import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const API_URL = process.env.API_URL || 'http://localhost:3001';
async function runDemo() {
    console.log('🌍 GaiaShield - Climate Guard Demo\n');
    const samplePath = join(__dirname, 'samples/climate.json');
    const payload = JSON.parse(await readFile(samplePath, 'utf-8'));
    console.log('📤 Sending request to:', `${API_URL}/api/analyze/climate_guard`);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2), '\n');
    try {
        const response = await fetch(`${API_URL}/api/analyze/climate_guard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        console.log('✅ Response:', JSON.stringify(data, null, 2));
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
runDemo();
//# sourceMappingURL=demo-climate.js.map