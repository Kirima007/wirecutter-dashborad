export function validateForm(l, f, b, q) {
    if (l < 50) return { valid: false, msg: "ความยาวรวมต้องไม่ต่ำกว่า 50 mm" };
    if ((f + b) >= l) return { valid: false, msg: "ระยะปอกหน้า/หลังรวมกัน ต้องน้อยกว่าความยาวรวม" };
    if (q < 1) return { valid: false, msg: "จำนวนต้องมีอย่างน้อย 1 ชิ้น" };
    return { valid: true };
}