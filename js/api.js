import { CONFIG } from './config.js';
import { logTerminal } from './ui-log.js';
import { state } from './state.js';
import { showToast } from './ui-common.js';

export async function sendCommand(payload) {
    if (state.isDemo) {
        logTerminal(`[DEMO] Sent: ${payload.command}`, 'WARN');
        return true;
    }
    try {
        const res = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return true;
    } catch (e) {
        logTerminal(`❌ คำสั่งล้มเหลว: ${e.message}`, 'ERROR');
        
        // --- จุดที่แก้ไข: ระบุประเภท "error" เข้าไปด้วย ---
        showToast("ไม่สามารถส่งคำสั่งไปยังเครื่องได้", "error");
        // ------------------------------------------

        return false;
    }
}