import { state } from './state.js';
import { validateForm } from './validation.js';
import { getAwg, diameterToPx } from './awg-data.js';

// ฟังก์ชันปลอดภัยสำหรับเปลี่ยน Attribute (ไม่แครชถ้าหา Element ไม่เจอ)
const setAttr = (id, attrs) => { 
    const el = document.getElementById(id); 
    if(el) Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v)); 
};

// ฟังก์ชันปลอดภัยสำหรับเปลี่ยนข้อความ (ไม่แครชถ้าหา Element ไม่เจอ)
const setText = (id, text) => {
    const el = document.getElementById(id);
    if(el) el.textContent = text;
};

export function updateWireVisuals() {
    state.awg = document.getElementById('inputAwg')?.value || '22awg';
    state.length = parseFloat(document.getElementById('inputLength')?.value) || 0;
    state.front = parseFloat(document.getElementById('inputFront')?.value) || 0;
    state.back = parseFloat(document.getElementById('inputBack')?.value) || 0;
    state.qty = parseInt(document.getElementById('inputQty')?.value) || 0;

    const val = validateForm(state.length, state.front, state.back, state.qty);
    const simContainer = document.getElementById('simContainer');
    const badge = document.getElementById('invalidBadge');
    const btnAdd = document.getElementById('btnAddJob');

    if (!val.valid) {
        if(simContainer) simContainer.classList.add('invalid-state');
        if(badge) badge.classList.remove('hidden');
        if(btnAdd) {
            btnAdd.disabled = true;
            btnAdd.classList.add('opacity-50', 'cursor-not-allowed');
        }
        return;
    }

    if(simContainer) simContainer.classList.remove('invalid-state');
    if(badge) badge.classList.add('hidden');
    if(btnAdd) {
        btnAdd.disabled = false;
        btnAdd.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    setText('titleLengthText', state.length);

    // --- ขนาดสายไฟจากตารางมาตรฐาน AWG ---
    // coreHeight = ตัวนำทองแดง (ตรงกับค่า Ø จริงในตาราง), jacketHeight = ฉนวนหุ้มรอบนอก
    const awg = getAwg(state.awg);
    const coreHeight = diameterToPx(awg.dia);
    const jacketHeight = coreHeight / 0.55;
    const wireY = 100 - (jacketHeight / 2);
    const coreY = 100 - (coreHeight / 2);

    const L = state.length, F = state.front, B = state.back;
    const baseStartX = 120, maxPx = 520;
    const totalPx = Math.min(Math.max(L * 3.2, 240), maxPx);
    const frontPx = (F / L) * totalPx;
    const rearPx = (B / L) * totalPx;
    const jacketPx = totalPx - frontPx - rearPx;

    const fEndX = baseStartX + frontPx;
    const rStartX = fEndX + jacketPx;
    const rEndX = rStartX + rearPx;

    // Elements
    setAttr('frontCoreBase', { x: baseStartX, y: coreY, width: frontPx, height: coreHeight });
    setAttr('middleJacket', { x: fEndX, y: wireY, width: jacketPx, height: jacketHeight });
    setAttr('jacketHighlight', { x1: fEndX+5, y1: wireY+8, x2: rStartX-5, y2: wireY+8 });
    setAttr('rearCoreBase', { x: rStartX, y: coreY, width: rearPx, height: coreHeight });
    setAttr('copperEnd3dCap', { cx: rEndX, cy: 100, rx: 5, ry: coreHeight/2 });

    // Strands
    ['strandF1', 'strandF2', 'strandF3'].forEach((id, idx) => {
        setAttr(id, { x1: baseStartX, x2: fEndX, y1: coreY + (idx+1)*(coreHeight/4), y2: coreY + (idx+1)*(coreHeight/4) });
    });
    ['strandR1', 'strandR2', 'strandR3'].forEach((id, idx) => {
        setAttr(id, { x1: rStartX, x2: rEndX, y1: coreY + (idx+1)*(coreHeight/4), y2: coreY + (idx+1)*(coreHeight/4) });
    });

    // Dimensions Text & Lines
    setAttr('lineTop1', { x1: rStartX, x2: rStartX });
    setAttr('lineTop2', { x1: rEndX, x2: rEndX });
    setAttr('arrowTop', { x1: rStartX, x2: rEndX });
    setAttr('txtTopVal', { x: (rStartX + rEndX)/2 });
    setText('txtTopVal', `${B} mm`);

    setAttr('lineBottom1', { x1: baseStartX, x2: baseStartX });
    setAttr('lineBottom2', { x1: rEndX, x2: rEndX });
    setAttr('arrowBottom', { x1: baseStartX, x2: rEndX });
    setAttr('txtBottomVal', { x: (baseStartX + rEndX)/2 });
    setText('txtBottomVal', `${L} mm`);

    // เส้นบอกขนาดด้านขวา = เส้นผ่านศูนย์กลางตัวนำ (ตรงกับค่าในตาราง AWG)
    setAttr('lineRight1', { y1: coreY, y2: coreY, x1: rEndX+5, x2: rEndX+35 });
    setAttr('lineRight2', { y1: coreY+coreHeight, y2: coreY+coreHeight, x1: rEndX+5, x2: rEndX+35 });
    setAttr('arrowRight', { y1: coreY, y2: coreY+coreHeight, x1: rEndX+30, x2: rEndX+30 });
    setAttr('txtRightVal', { x: rEndX+42, y: 104 });
    setText('txtRightVal', `Ø ${awg.dia.toFixed(3)} mm`);

    // Blades
    setAttr('bladeLeftTop', { d: `M ${fEndX-5},5 L ${fEndX+5},5 L ${fEndX+2},${wireY-3} L ${fEndX-2},${wireY-3} Z` });
    setAttr('bladeLeftBottom', { d: `M ${fEndX-5},215 L ${fEndX+5},215 L ${fEndX+2},${wireY+jacketHeight+3} L ${fEndX-2},${wireY+jacketHeight+3} Z` });
    setAttr('bladeRightTop', { d: `M ${rStartX-5},5 L ${rStartX+5},5 L ${rStartX+2},${wireY-3} L ${rStartX-2},${wireY-3} Z` });
    setAttr('bladeRightBottom', { d: `M ${rStartX-5},215 L ${rStartX+5},215 L ${rStartX+2},${wireY+jacketHeight+3} L ${rStartX-2},${wireY+jacketHeight+3} Z` });
}

export function playBladeAnimation() {
    if (state.machineState === 'RUNNING') {
        const bLTop = document.getElementById('bladeLeftTop');
        const bLBottom = document.getElementById('bladeLeftBottom');
        const bRTop = document.getElementById('bladeRightTop');
        const bRBottom = document.getElementById('bladeRightBottom');
        
        if(bLTop) bLTop.style.transform = 'translateY(14px)';
        if(bRTop) bRTop.style.transform = 'translateY(14px)';
        if(bLBottom) bLBottom.style.transform = 'translateY(-14px)';
        if(bRBottom) bRBottom.style.transform = 'translateY(-14px)';
        
        createSparks();
        const soundCheck = document.getElementById('settingSound');
        if(soundCheck && soundCheck.checked) playSound();

        setTimeout(() => {
            if(bLTop) bLTop.style.transform = 'translateY(0px)';
            if(bLBottom) bLBottom.style.transform = 'translateY(0px)';
            if(bRTop) bRTop.style.transform = 'translateY(0px)';
            if(bRBottom) bRBottom.style.transform = 'translateY(0px)';
        }, 150);
    }
}

function createSparks() {
    const holder = document.getElementById('sparksHolder');
    const midJacket = document.getElementById('middleJacket');
    if(!holder || !midJacket) return;

    const fx = parseFloat(midJacket.getAttribute('x'));
    const rx = fx + parseFloat(midJacket.getAttribute('width'));

    [fx, rx].forEach(x => {
        for(let i=0; i<3; i++) {
            const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            spark.setAttribute('cx', x + (Math.random()*8-4));
            spark.setAttribute('cy', 100 + (Math.random()*16-8));
            spark.setAttribute('r', Math.random()*2+1);
            spark.setAttribute('fill', Math.random()>0.5 ? '#fbbf24' : '#f97316');
            holder.appendChild(spark);
            setTimeout(() => spark.remove(), 180);
        }
    });
}

function playSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.08);
    } catch(e) {}
}