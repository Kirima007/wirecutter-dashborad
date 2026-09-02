import { sendCommand } from './api.js';
import { logTerminal } from './ui-log.js';

// ปุ่มหยุดเครื่องต้องกดค้างให้ครบก่อนถึงจะสั่งจริง กันมือไปโดนแล้วงานเสีย
const HOLD_MS = 1000;
const IDLE_NOTE = 'กดค้างเพื่อสั่งหยุด · ปล่อยก่อนครบถือว่ายกเลิก';

export function initStopButton() {
    const btn = document.getElementById('btnStopJob');
    const fill = document.getElementById('stopHoldFill');
    const note = document.getElementById('stopHoldNote');
    if (!btn || !fill || !note) return;

    let raf = null;
    let startedAt = 0;
    let fired = false;

    note.textContent = IDLE_NOTE;

    const reset = (msg = IDLE_NOTE) => {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        fired = false;
        fill.style.width = '0%';
        btn.classList.remove('holding');
        note.textContent = msg;
    };

    const trigger = async () => {
        fired = true;
        raf = null;
        fill.style.width = '100%';
        btn.classList.remove('holding');
        note.textContent = '⏹ ส่งคำสั่งหยุดเครื่องแล้ว';
        logTerminal('🛑 สั่งหยุดเครื่อง (STOP)', 'ERROR');
        await sendCommand({ command: 'stop' });
        setTimeout(() => reset(), 1600);
    };

    const tick = () => {
        const progress = Math.min((performance.now() - startedAt) / HOLD_MS, 1);
        fill.style.width = `${progress * 100}%`;
        if (progress >= 1) {
            trigger();
            return;
        }
        raf = requestAnimationFrame(tick);
    };

    const start = (e) => {
        if (fired || raf) return;
        e.preventDefault();
        startedAt = performance.now();
        btn.classList.add('holding');
        note.textContent = 'กดค้างต่อ…';
        raf = requestAnimationFrame(tick);
    };

    const cancel = () => {
        if (fired || !raf) return;
        reset('ปล่อยก่อนครบ · ยังไม่ได้สั่งหยุด');
    };

    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', cancel);
    btn.addEventListener('pointerleave', cancel);
    btn.addEventListener('pointercancel', cancel);

    // รองรับคีย์บอร์ด: กด Space/Enter ค้างเหมือนกัน
    btn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') start(e);
    });
    btn.addEventListener('keyup', cancel);
}
