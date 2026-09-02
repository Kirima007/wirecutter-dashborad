// ผ่าน nginx reverse proxy: /ws และ /api อยู่ origin เดียวกับหน้าเว็บเสมอ
// จึงไม่ต้องฮาร์ดโค้ด host/port — ใช้ได้ทั้ง localhost, LAN IP, โดเมนจริง, http/https
const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

export const CONFIG = {
    WS_URL: `${wsProtocol}://${window.location.host}/ws/machine`,
    API_URL: `${window.location.protocol}//${window.location.host}/api/start_job`,
    FALLBACK_MIRROR_QUEUE: true // ถ้า Node-RED ไม่ส่ง Queue มาให้เว็บจำเองชั่วคราว
};