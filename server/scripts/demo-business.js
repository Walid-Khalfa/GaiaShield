import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const API_URL = process.env.API_URL || 'http://localhost:3001';
async function runDemo() {
    console.log('🛡️  GaiaShield - Business Shield Demo\n');
    const samplePath = join(__dirname, 'samples/business.json');
    const payload = JSON.parse(await readFile(samplePath, 'utf-8'));
    console.log('📤 Sending request to:', `${API_URL}/api/analyze/business_shield`);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2), '\n');
    try {
        const response = await fetch(`${API_URL}/api/analyze/business_shield`, {
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
//# sourceMappingURL=demo-business.js.map