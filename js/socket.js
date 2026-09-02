import { CONFIG } from './config.js';
import { state } from './state.js';
import { logTerminal } from './ui-log.js';
import { Storage } from './storage.js';
import { playBladeAnimation } from './ui-wire.js';

let ws;

export function initSocket() {
    if (state.isDemo) return;
    
    ws = new WebSocket(CONFIG.WS_URL);
    
    ws.onopen = () => {
        state.connected = true;
        state.ledPower = true;
        logTerminal('🔗 Connected to Node-RED / ESP32', 'SUCCESS');
        state.notify();
    };

    ws.onclose = () => {
        state.connected = false;
        state.machineState = 'OFFLINE';
        state.ledPower = false;
        logTerminal('⚠️ Connection lost. Retrying in 3s...', 'ERROR');
        state.notify();
        setTimeout(initSocket, 3000);
    };

    ws.onmessage = (e) => {
        try {
            const data = JSON.parse(e.data);
            
            if (data.temperature !== undefined) state.temp = data.temperature;
            if (data.state) {
                state.machineState = data.state;
                state.ledBlade = (data.state === 'RUNNING' || data.state === 'HOMING');
            }

            // คำนวณ Cycle Time เมื่อยอด done เพิ่ม
            if (data.done !== undefined && data.done > state.done) {
                const now = Date.now();
                if (state.lastDoneTime) {
                    state.cycleTime = ((now - state.lastDoneTime) / 1000).toFixed(1);
                }
                state.lastDoneTime = now;
                
                playBladeAnimation(); // สั่งใบมีดและเสียงทำงาน

                // เมื่อเสร็จสิ้น
                if (data.done === data.target && data.target > 0) {
                    Storage.saveHistory(state.awg, state.length, state.target);
                    logTerminal(`✅ Job Completed: Target ${state.target} pcs.`, 'SUCCESS');
                }
            }

            if (data.done !== undefined) state.done = data.done;
            if (data.target !== undefined) state.target = data.target;

            if (state.target > state.done && state.cycleTime > 0) {
                state.eta = Math.ceil(state.cycleTime * (state.target - state.done));
            } else {
                state.eta = 0;
            }

            if (data.queue) state.queue = data.queue;

            state.notify();
        } catch (err) {
            console.error(err);
        }
    };
}

export function stopSocket() {
    if (ws) ws.close();
}