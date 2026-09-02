export const state = {
    connected: false,
    isDemo: false,
    machineState: 'IDLE',
    
    // Form Current Inputs
    awg: '22awg', length: 100, front: 10, back: 10, qty: 50,
    
    // Telemetry Data
    temp: 0, cycleTime: 0, done: 0, target: 0, eta: 0,
    uptimeStart: Date.now(), lastDoneTime: null,
    ledPower: false, ledBlade: false,
    
    // Data
    queue: [], history: [], recipes: {}, activeMemorySlot: 1,

    listeners: [],
    subscribe(callback) { this.listeners.push(callback); },
    notify() { this.listeners.forEach(cb => cb(this)); }
};