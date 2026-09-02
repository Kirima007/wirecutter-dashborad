import { state } from './state.js';

export function renderTelemetry() {
    document.getElementById('telTemp').textContent = state.temp ? `${parseFloat(state.temp).toFixed(1)} °C` : '-- °C';
    document.getElementById('telCycle').textContent = state.cycleTime ? `${state.cycleTime} s` : '-- s';
    document.getElementById('telDone').textContent = state.done;
    document.getElementById('telTarget').textContent = state.target;
    
    const pct = state.target > 0 ? (state.done / state.target) * 100 : 0;
    document.getElementById('telProgressBar').style.width = `${pct}%`;

    document.getElementById('telEta').textContent = state.eta > 0 
        ? `${Math.floor(state.eta/60)}m ${state.eta%60}s` 
        : '--:--';

    document.getElementById('ledPower').className = `led w-2.5 h-2.5 rounded-full inline-block border border-slate-900 ${state.ledPower ? 'on' : ''}`;
    document.getElementById('ledBlade').className = `led w-2.5 h-2.5 rounded-full inline-block border border-slate-900 ${state.ledBlade ? 'blade-on' : ''}`;
    
    updateStatusBadge();

    const blGroup = document.getElementById('bladesLeftGroup');
    const brGroup = document.getElementById('bladesRightGroup');
    if (state.machineState === 'RUNNING') {
        if(blGroup) blGroup.classList.remove('opacity-0');
        if(brGroup) brGroup.classList.remove('opacity-0');
    } else {
        if(blGroup) blGroup.classList.add('opacity-0');
        if(brGroup) brGroup.classList.add('opacity-0');
    }
}

function updateStatusBadge() {
    const dot = document.getElementById('machineStatusDot');
    const txt = document.getElementById('machineStatusName');
    
    if (!state.connected && !state.isDemo) {
        dot.className = "w-2.5 h-2.5 rounded-full bg-red-500 inline-block";
        txt.textContent = "OFFLINE";
        txt.className = "text-red-500 font-bold tracking-widest";
    } else {
        dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block pulse-active";
        txt.textContent = state.machineState;
        txt.className = "text-emerald-500 font-bold tracking-widest";
    }
}

export function initUptime() {
    setInterval(() => {
        const diff = Math.floor((Date.now() - state.uptimeStart) / 1000);
        const h = String(Math.floor(diff / 3600)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const s = String(diff % 60).padStart(2, '0');
        document.getElementById('telUptime').textContent = `UP: ${h}:${m}:${s}`;
    }, 1000);
}