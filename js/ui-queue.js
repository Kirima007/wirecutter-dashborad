import { state } from './state.js';

export function renderQueue() {
    const box = document.getElementById('queueItemsContainer');
    document.getElementById('queueCountBadge').textContent = `${state.queue.length} งาน`;
    
    if (state.queue.length === 0) {
        box.innerHTML = '<div class="text-slate-400 text-center py-4">ไม่มีข้อมูลคิวจากเครื่อง</div>';
        return;
    }
    
    box.innerHTML = state.queue.map((q, i) => `
        <div class="p-2.5 rounded-xl border flex justify-between items-center text-xs bg-slate-50 border-slate-200">
            <div>
                <div class="font-bold text-slate-800">${q.size || 'AWG'} | L:${q.total_length}mm</div>
                <div class="text-[10px] text-slate-500 font-mono">F:${q.front_length} R:${q.back_length} (${q.quantity} pcs)</div>
            </div>
            <span class="px-2 py-0.5 text-[10px] font-bold rounded-full ${i === 0 ? 'bg-navy text-white' : 'bg-slate-200 text-slate-600'}">
                ${i === 0 ? 'Processing' : 'Waiting'}
            </span>
        </div>
    `).join('');
}