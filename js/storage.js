import { state } from './state.js';
import { showToast } from './ui-common.js';
import { updateWireVisuals } from './ui-wire.js';

export const Storage = {
    init() {
        state.recipes = JSON.parse(localStorage.getItem('wm_recipes')) || {};
        state.history = JSON.parse(localStorage.getItem('wm_history')) || [];
    },

    saveHistory(awg, length, target) {
        const time = new Date().toLocaleTimeString('th-TH');
        state.history.unshift({ time, awg, length, target, status: 'Success' });
        if(state.history.length > 20) state.history.pop();
        localStorage.setItem('wm_history', JSON.stringify(state.history));
        state.notify();
    },

    saveMemory(slot) {
        const data = { awg: state.awg, l: state.length, f: state.front, b: state.back, q: state.qty };
        localStorage.setItem(`wm_mem_${slot}`, JSON.stringify(data));
        showToast(`บันทึกค่าลง Memory M${slot} เรียบร้อย`);
    },

    loadMemory(slot) {
        const data = JSON.parse(localStorage.getItem(`wm_mem_${slot}`));
        if(data) {
            this.applyToForm(data);
            showToast(`โหลดค่าจาก M${slot}`);
        }
    },

    saveRecipe(name) {
        state.recipes[name] = { awg: state.awg, l: state.length, f: state.front, b: state.back, q: state.qty };
        localStorage.setItem('wm_recipes', JSON.stringify(state.recipes));
        showToast(`บันทึกสูตร "${name}" สำเร็จ`);
        state.notify();
    },

    loadRecipe(name) {
        if(state.recipes[name]) {
            this.applyToForm(state.recipes[name]);
            showToast(`โหลดสูตร "${name}" สำเร็จ`);
        }
    },

    deleteRecipe(name) {
        if(state.recipes[name]) {
            delete state.recipes[name];
            localStorage.setItem('wm_recipes', JSON.stringify(state.recipes));
            showToast(`ลบสูตร "${name}" แล้ว`);
            state.notify();
        }
    },

    applyToForm(data) {
        document.getElementById('inputAwg').value = data.awg;
        document.getElementById('inputLength').value = data.l;
        document.getElementById('inputFront').value = data.f;
        document.getElementById('inputBack').value = data.b;
        document.getElementById('inputQty').value = data.q;
        updateWireVisuals();
    }
};