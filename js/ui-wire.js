import { state } from './state.js';
import { validateForm } from './validation.js';
import { getAwg, diameterToPx } from './awg-data.js';

// พิกัดอ้างอิงของ SVG (viewBox 0 0 820 300) — สายไฟวางกลางแนวตั้งที่ y = CY
const X0 = 90;      // ขอบซ้ายของสายไฟ
const CY = 150;     // แกนกลางสายไฟ
const MIN_W = 240;  // ความกว้างขั้นต่ำที่วาด (สายสั้นมากจะได้ยังเห็น)
const MAX_W = 560;  // ความกว้างสูงสุด (ยาวเกินนี้ภาพไม่ยืดต่อ)

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
        setText('invalidMsg', val.msg);   // บอกให้ชัดว่าผิดกฎข้อไหน ไม่ใช่แค่ INVALID
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
    const wireY = CY - (jacketHeight / 2);
    const coreY = CY - (coreHeight / 2);

    const L = state.length, F = state.front, B = state.back;
    const totalPx = Math.min(Math.max(L * 3.2, MIN_W), MAX_W);
    const frontPx = (F / L) * totalPx;
    const rearPx = (B / L) * totalPx;
    const jacketPx = totalPx - frontPx - rearPx;

    const fEndX = X0 + frontPx;
    const rStartX = fEndX + jacketPx;
    const rEndX = rStartX + rearPx;

    // ตัวสายไฟ
    setAttr('frontCoreBase', { x: X0, y: coreY, width: frontPx, height: coreHeight });
    setAttr('middleJacket', { x: fEndX, y: wireY, width: jacketPx, height: jacketHeight });
    setAttr('jacketClipRect', { x: fEndX, y: wireY, width: jacketPx, height: jacketHeight });
    setAttr('feedSheen', { y: wireY, height: jacketHeight });
    setAttr('jacketHighlight', { x1: fEndX+7, y1: wireY+11, x2: rStartX-7, y2: wireY+11 });
    setAttr('rearCoreBase', { x: rStartX, y: coreY, width: rearPx, height: coreHeight });
    setAttr('copperEnd3dCap', { cx: rEndX, cy: CY, rx: 5, ry: coreHeight/2 });

    // เส้นลวดฝอยในตัวนำ
    ['strandF1', 'strandF2', 'strandF3'].forEach((id, idx) => {
        setAttr(id, { x1: X0, x2: fEndX, y1: coreY + (idx+1)*(coreHeight/4), y2: coreY + (idx+1)*(coreHeight/4) });
    });
    ['strandR1', 'strandR2', 'strandR3'].forEach((id, idx) => {
        setAttr(id, { x1: rStartX, x2: rEndX, y1: coreY + (idx+1)*(coreHeight/4), y2: coreY + (idx+1)*(coreHeight/4) });
    });

    // เส้นบอกขนาดด้านบน เรียงลูกโซ่ ปอกหน้า | ฉนวน | ปอกหลัง
    const topY = Math.min(wireY - 6, 90);
    [['lineFront1', X0], ['lineFront2', fEndX], ['lineBack1', rStartX], ['lineBack2', rEndX]]
        .forEach(([id, x]) => setAttr(id, { x1: x, x2: x, y1: topY, y2: 52 }));

    setAttr('arrowFront', { x1: X0, x2: fEndX });
    setAttr('arrowJacket', { x1: fEndX, x2: rStartX });
    setAttr('arrowBack', { x1: rStartX, x2: rEndX });

    const mid = (a, b) => (a + b) / 2;
    [['txtFrontName', mid(X0, fEndX)], ['txtFrontVal', mid(X0, fEndX)],
     ['txtJacketName', mid(fEndX, rStartX)], ['txtJacketVal', mid(fEndX, rStartX)],
     ['txtBackName', mid(rStartX, rEndX)], ['txtBackVal', mid(rStartX, rEndX)]
    ].forEach(([id, x]) => setAttr(id, { x }));

    setText('txtFrontVal', `${F} mm`);
    setText('txtJacketVal', `${+(L - F - B).toFixed(2)} mm`);
    setText('txtBackVal', `${B} mm`);

    // ความยาวรวมด้านล่าง
    const botY = Math.max(wireY + jacketHeight + 6, 210);
    setAttr('lineBottom1', { x1: X0, x2: X0, y1: botY });
    setAttr('lineBottom2', { x1: rEndX, x2: rEndX, y1: botY });
    setAttr('arrowBottom', { x1: X0, x2: rEndX });
    setAttr('txtBottomVal', { x: mid(X0, rEndX) });
    setAttr('txtBottomName', { x: mid(X0, rEndX) });
    setText('txtBottomVal', `${L} mm`);

    // เส้นบอกขนาดด้านขวา = เส้นผ่านศูนย์กลางตัวนำ (ตรงกับค่าในตาราง AWG)
    setAttr('lineRight1', { y1: coreY, y2: coreY, x1: rEndX+10, x2: rEndX+44 });
    setAttr('lineRight2', { y1: coreY+coreHeight, y2: coreY+coreHeight, x1: rEndX+10, x2: rEndX+44 });
    setAttr('arrowRight', { y1: coreY, y2: coreY+coreHeight, x1: rEndX+38, x2: rEndX+38 });
    setAttr('txtRightVal', { x: rEndX+50, y: CY+4 });
    setText('txtRightVal', `Ø ${awg.dia.toFixed(3)}`);

    // หน้าตัดสายไฟ — ย่อ 60% ให้พอดีมุมขวาบน แต่ยังเทียบสัดส่วนข้ามเบอร์ได้
    setAttr('xsecOuter', { r: (jacketHeight / 2) * 0.6 });
    setAttr('xsecInner', { r: (coreHeight / 2) * 0.6 });
    setText('xsecLabel', `${awg.name} AWG`);

    // ใบมีด
    const jTop = wireY, jBot = wireY + jacketHeight;
    setAttr('bladeLeftTop', { d: `M ${fEndX-6},8 L ${fEndX+6},8 L ${fEndX+3},${jTop-4} L ${fEndX-3},${jTop-4} Z` });
    setAttr('bladeLeftBottom', { d: `M ${fEndX-6},292 L ${fEndX+6},292 L ${fEndX+3},${jBot+4} L ${fEndX-3},${jBot+4} Z` });
    setAttr('bladeRightTop', { d: `M ${rStartX-6},8 L ${rStartX+6},8 L ${rStartX+3},${jTop-4} L ${rStartX-3},${jTop-4} Z` });
    setAttr('bladeRightBottom', { d: `M ${rStartX-6},292 L ${rStartX+6},292 L ${rStartX+3},${jBot+4} L ${rStartX-3},${jBot+4} Z` });
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
            spark.setAttribute('cy', CY + (Math.random()*16-8));
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