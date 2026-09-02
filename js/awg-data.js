// ตารางมาตรฐาน American Wire Gauge (AWG)
// dia  = เส้นผ่านศูนย์กลางตัวนำทองแดง (mm)
// area = พื้นที่หน้าตัด (mm²)
// cma  = Circular Mil Area
// หมายเหตุ: ถ้าเครื่องรองรับเฉพาะบางขนาด ลบแถวที่ไม่ใช้ออกจาก array นี้ได้เลย
//           dropdown กับ simulation จะปรับตามอัตโนมัติ
export const AWG_TABLE = [
    { id: '0000awg', name: '0000 (4/0)', dia: 11.6840, area: 107.2193, cma: 211600 },
    { id: '000awg',  name: '000 (3/0)',  dia: 10.4049, area: 85.0288,  cma: 167806 },
    { id: '00awg',   name: '00 (2/0)',   dia: 9.2658,  area: 67.4309,  cma: 133077 },
    { id: '0awg',    name: '0 (1/0)',    dia: 8.2515,  area: 53.4751,  cma: 105534 },
    { id: '1awg',    name: '1',          dia: 7.3481,  area: 42.4077,  cma: 83693 },
    { id: '2awg',    name: '2',          dia: 6.5437,  area: 33.6308,  cma: 66371 },
    { id: '3awg',    name: '3',          dia: 5.8273,  area: 26.6705,  cma: 52635 },
    { id: '4awg',    name: '4',          dia: 5.1894,  area: 21.1506,  cma: 41741 },
    { id: '5awg',    name: '5',          dia: 4.6213,  area: 16.7732,  cma: 33102 },
    { id: '6awg',    name: '6',          dia: 4.1154,  area: 13.3018,  cma: 26251 },
    { id: '7awg',    name: '7',          dia: 3.6649,  area: 10.5488,  cma: 20818 },
    { id: '8awg',    name: '8',          dia: 3.2636,  area: 8.3656,   cma: 16510 },
    { id: '9awg',    name: '9',          dia: 2.9064,  area: 6.6342,   cma: 13093 },
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
    { id: '30awg',   name: '30',         dia: 0.2546,  area: 0.0509,   cma: 101 },
    { id: '31awg',   name: '31',         dia: 0.2268,  area: 0.0404,   cma: 80 },
    { id: '32awg',   name: '32',         dia: 0.2019,  area: 0.0320,   cma: 63 },
    { id: '33awg',   name: '33',         dia: 0.1798,  area: 0.0254,   cma: 50 },
    { id: '34awg',   name: '34',         dia: 0.1601,  area: 0.0201,   cma: 40 },
    { id: '35awg',   name: '35',         dia: 0.1426,  area: 0.0160,   cma: 32 },
    { id: '36awg',   name: '36',         dia: 0.1270,  area: 0.0127,   cma: 25 },
    { id: '37awg',   name: '37',         dia: 0.1131,  area: 0.0100,   cma: 20 },
    { id: '38awg',   name: '38',         dia: 0.1007,  area: 0.0080,   cma: 16 },
    { id: '39awg',   name: '39',         dia: 0.0897,  area: 0.0063,   cma: 12 },
    { id: '40awg',   name: '40',         dia: 0.0799,  area: 0.0050,   cma: 10 }
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
