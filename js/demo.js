import { state } from './state.js';
import { stopSocket, initSocket } from './socket.js';
import { logTerminal } from './ui-log.js';

export function toggleDemoMode(enabled) {
    state.isDemo = enabled;
    if (enabled) {
        stopSocket();
        state.machineState = 'IDLE';
        state.ledPower = true;
        logTerminal('🔵 เข้าสู่โหมด DEMO', 'INFO');
        state.notify();
    } else {
        initSocket();
    }
}