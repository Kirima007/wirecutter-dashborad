// ตารางมาตรฐาน American Wire Gauge (AWG)
// dia  = เส้นผ่านศูนย์กลางตัวนำทองแดง (mm)
// area = พื้นที่หน้าตัด (mm²)
// cma  = Circular Mil Area
// หมายเหตุ: ถ้าเครื่องรองรับเฉพาะบางขนาด ลบแถวที่ไม่ใช้ออกจาก array นี้ได้เลย
//           dropdown กับ simulation จะปรับตามอัตโนมัติ
export const AWG_TABLE = [
    { id: '10awg',   name: '10',         dia: 2.5882,  area: 5.2612,   cma: 10383 },
    { id: '11awg',   name: '11',         dia: 2.3048,  area: 4.1723,   cma: 8234 },
    { id: '12awg',   name: '12',         dia: 2.0525,  area: 3.3088,   cma: 6530 },
    { id: '13awg',   name: '13',         dia: 1.8278,  area: 2.6240,   cma: 5178 },
    { id: '14awg',   name: '14',         dia: 1.6277,  area: 2.0809,   cma: 4107 },
    { id: '15awg',   name: '15',         dia: 1.4495,  area: 1.6502,   cma: 3257 },
    { id: '16awg',   name: '16',         dia: 1.2908,  area: 1.3087,   cma: 2583 },
    { id: '17awg',   name: '17',         dia: 1.1495,  area: 1.0378,   cma: 2048 },
    { id: '18awg',   name: '18',         dia: 1.0237,  area: 0.8230,   cma: 1624 },
    { id: '19awg',   name: '19',         dia: 0.9116,  area: 0.6527,   cma: 1288 },
    { id: '20awg',   name: '20',         dia: 0.8118,  area: 0.5176,   cma: 1022 },
    { id: '21awg',   name: '21',         dia: 0.7229,  area: 0.4105,   cma: 810 },
    { id: '22awg',   name: '22',         dia: 0.6438,  area: 0.3255,   cma: 642 },
    { id: '23awg',   name: '23',         dia: 0.5733,  area: 0.2582,   cma: 509 },
    { id: '24awg',   name: '24',         dia: 0.5106,  area: 0.2047,   cma: 404 },
    { id: '25awg',   name: '25',         dia: 0.4547,  area: 0.1624,   cma: 320 },
    { id: '26awg',   name: '26',         dia: 0.4049,  area: 0.1288,   cma: 254 },
    { id: '27awg',   name: '27',         dia: 0.3606,  area: 0.1021,   cma: 202 },
    { id: '28awg',   name: '28',         dia: 0.3211,  area: 0.0810,   cma: 160 },
    { id: '29awg',   name: '29',         dia: 0.2859,  area: 0.0642,   cma: 127 },
    { id: '30awg',   name: '30',         dia: 0.2546,  area: 0.0509,   cma: 101 }
];

const DEFAULT_AWG = AWG_TABLE.find(a => a.id === '22awg');

// หาข้อมูลสายไฟจาก id (เช่น '22awg') — คืนค่า 22 AWG ถ้าหาไม่เจอ
export function getAwg(id) {
    return AWG_TABLE.find(a => a.id === id) || DEFAULT_AWG;
}

// ป้ายที่แสดงใน dropdown เช่น "22 AWG — Ø 0.644 mm (0.326 mm²)"
export function awgLabel(awg) {
    return `${awg.name} AWG — Ø ${awg.dia.toFixed(3)} mm (${awg.area.toFixed(3)} mm²)`;
}

// แปลงเส้นผ่านศูนย์กลางจริง (mm) เป็นความหนาที่วาดใน SVG (px)
// ใช้ power scale เพราะช่วงจริงกว้างมาก (0.08 – 11.68 mm) ถ้าใช้สเกลตรงๆ
// เบอร์เล็กจะบางจนมองไม่เห็น — สเกลนี้คงลำดับความหนาไว้แต่ยังอ่านออกทุกเบอร์
export function diameterToPx(dia) {
    const maxDia = AWG_TABLE[0].dia;
    return 10 + 50 * Math.pow(dia / maxDia, 0.45);
}
