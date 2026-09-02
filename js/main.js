import { state } from './state.js';
import { Storage } from './storage.js';
import { initSocket } from './socket.js';
import { sendCommand } from './api.js';
import { toggleDemoMode } from './demo.js';
import { updateWireVisuals } from './ui-wire.js';
import { renderTelemetry, initUptime } from './ui-telemetry.js';
import { renderQueue } from './ui-queue.js';
import { logTerminal, renderHistoryTable, exportLogCsv } from './ui-log.js';
import { toggleModal, showToast, showConfirm } from './ui-common.js';
import { CONFIG } from './config.js';
import { AWG_TABLE, awgLabel } from './awg-data.js';

document.addEventListener('DOMContentLoaded', () => {
    Storage.init();
    buildAwgDropdown();

    // Subscribe to State Changes (Observer)
    state.subscribe(() => {
        renderTelemetry();
        renderQueue();
        refreshRecipeDropdown();
    });

    // Initial Renders
    updateWireVisuals();
    renderHistoryTable();
    refreshRecipeDropdown();
    initUptime();
    initSocket();
    logTerminal('System Initialized', 'INFO');

    // Attach Listeners to Form
    ['inputAwg', 'inputLength', 'inputFront', 'inputBack', 'inputQty'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateWireVisuals);
    });

    // ADD JOB BUTTON
    document.getElementById('btnAddJob').addEventListener('click', async () => {
        const payload = {
            command: "add_queue",
            size: state.awg,
            total_length: state.length,
            front_length: state.front,
            back_length: state.back,
            quantity: state.qty
        };
        const success = await sendCommand(payload);
        if(success) {
            logTerminal(`➕ ADD JOB: ${payload.size} L:${state.length}mm (${state.qty}pcs)`, 'INFO');
            showToast("เพิ่มงานเข้าคิวเรียบร้อย");
            if(CONFIG.FALLBACK_MIRROR_QUEUE) {
                state.queue.push(payload);
                state.notify();
            }
        }
    });

    // STOP BUTTON
    document.getElementById('btnStopJob').addEventListener('click', () => {
        sendCommand({ command: "stop" });
        logTerminal("🛑 สั่งหยุดเครื่อง (STOP)", 'ERROR');
    });

    // CLEAR QUEUE BUTTON (With Custom Confirm)
    document.getElementById('btnClearQueue').addEventListener('click', () => {
        showConfirm("ล้างคิวงานทั้งหมด", "ยืนยันการล้างคิวงาน (CLEAR ALL QUEUE) หรือไม่?\nงานที่รอตัดอยู่จะถูกลบทิ้งทั้งหมด!", () => {
            sendCommand({ command: "clear_queue" });
            logTerminal("🗑 ล้างคิวงานทั้งหมด", 'WARN');
            if(CONFIG.FALLBACK_MIRROR_QUEUE) {
                state.queue = [];
                state.notify();
            }
        });
    });

    // MEMORY BUTTONS
    document.querySelectorAll('.btn-mem').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 1. รีเซ็ตปุ่มทั้งหมดให้เป็นสีเทา
            document.querySelectorAll('.btn-mem').forEach(b => {
                b.className = 'btn-mem py-2 text-xs font-bold rounded-lg border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 transition';
            });
            // 2. ทำให้ปุ่มที่กดกลายเป็นสีน้ำเงิน (Active)
            e.target.className = 'btn-mem py-2 text-xs font-bold rounded-lg border bg-navy text-white border-navy shadow-sm transition';
            
            const slot = e.target.getAttribute('data-slot');
            state.activeMemorySlot = slot;
            Storage.loadMemory(slot);
        });
    });

    // SAVE CURRENT VALUES TO ACTIVE MEMORY SLOT
    document.getElementById('btnSaveMem').addEventListener('click', () => {
        Storage.saveMemory(state.activeMemorySlot);
    });

    // RECIPES
    document.getElementById('btnLoadRecipe').addEventListener('click', () => Storage.loadRecipe(document.getElementById('recipeSelect').value));
    document.getElementById('btnSaveRecipe').addEventListener('click', () => {
        const name = prompt("ตั้งชื่อสูตรนี้:");
        if(name) Storage.saveRecipe(name);
    });
    document.getElementById('btnDelRecipe').addEventListener('click', () => Storage.deleteRecipe(document.getElementById('recipeSelect').value));

    // สร้างตัวเลือก AWG จากตารางมาตรฐานใน awg-data.js
    function buildAwgDropdown() {
        const select = document.getElementById('inputAwg');
        select.innerHTML = AWG_TABLE
            .map(a => `<option value="${a.id}">${awgLabel(a)}</option>`)
            .join('');
        select.value = state.awg;
    }

    function refreshRecipeDropdown() {
        const select = document.getElementById('recipeSelect');
        select.innerHTML = '<option value="">-- เลือกสูตร --</option>';
        Object.keys(state.recipes).forEach(k => select.innerHTML += `<option value="${k}">${k}</option>`);
    }

    // MODALS & OTHERS
    document.getElementById('btnSettingsOpen').addEventListener('click', () => toggleModal('settingsModal'));
    document.getElementById('btnSettingsClose').addEventListener('click', () => toggleModal('settingsModal'));
    document.getElementById('btnSettingsSave').addEventListener('click', () => toggleModal('settingsModal'));
    document.getElementById('btnClearConsole').addEventListener('click', () => document.getElementById('terminalLogBox').innerHTML = '');
    document.getElementById('btnExportCsv').addEventListener('click', exportLogCsv);

    // DEMO TOGGLE
    document.getElementById('settingDemo').addEventListener('change', (e) => toggleDemoMode(e.target.checked));
});