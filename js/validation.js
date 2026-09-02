// ข้อความที่คืนกลับไปจะถูกแสดงบนป้ายเตือนในแผงจำลอง ต้องบอกให้ชัดว่าค่าไหนขัดกัน
export function validateForm(l, f, b, q) {
    if (!(l > 0)) return { valid: false, msg: "กรุณากรอกความยาวรวม" };
    if (f < 0 || b < 0) return { valid: false, msg: "ระยะปอกหน้า/หลัง ต้องไม่ติดลบ" };
    if (l < 50) return { valid: false, msg: `ความยาวรวม (${l} mm) ต้องไม่ต่ำกว่า 50 mm` };
    if ((f + b) >= l) return { valid: false, msg: `ปอกหน้า + ปอกหลัง (${f + b} mm) ต้องน้อยกว่าความยาวรวม (${l} mm)` };
    if (q < 1) return { valid: false, msg: "จำนวนต้องมีอย่างน้อย 1 ชิ้น" };
    return { valid: true, msg: "" };
}
