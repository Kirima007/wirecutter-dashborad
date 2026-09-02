import { state } from './state.js';

export function logTerminal(msg, type = 'INFO') {
    const box = document.getElementById('terminalLogBox');
    const time = new Date().toLocaleTimeString('th-TH');
    let color = 'text-indigo-400';
    if(type === 'WARN') color = 'text-amber-400';
    if(type === 'ERROR') color = 'text-red-400';
    if(type === 'SUCCESS') color = 'text-emerald-400';
    
    const div = document.createElement('div');
    div.innerHTML = `<span class="text-slate-500">[${time}]</span> <span class="${color}">[${type}]</span> ${msg}`;
    box.prepend(div);
}

export function renderHistoryTable() {
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = state.history.map(h => `
        <tr class="hover:bg-slate-50 transition">
            <td class="py-1.5 px-2.5 text-slate-500">${h.time}</td>
            <td class="py-1.5 px-2.5 font-bold">${h.awg.replace('awg','')} AWG</td>
            <td class="py-1.5 px-2.5">${h.length}</td>
            <td class="py-1.5 px-2.5 font-bold text-emerald-600">${h.target}</td>
        </tr>
    `).join('');
}

export function exportLogCsv() {
    let csv = 'Time,AWG,Length,Pieces\n';
    state.history.forEach(r => csv += `${r.time},${r.awg},${r.length},${r.target}\n`);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `WireMaster_Log_${Date.now()}.csv`;
    a.click();
}