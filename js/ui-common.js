export function toggleModal(id) {
    const el = document.getElementById(id);
    if (el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        setTimeout(() => el.classList.remove('opacity-0'), 10);
    } else {
        el.classList.add('opacity-0');
        setTimeout(() => el.classList.add('hidden'), 200);
    }
}

export function showToast(msg, type = 'success', customTitle = null) {
    // กำหนดธีมสีและไอคอน (ปรับไอคอนให้เหมือนภาพตัวอย่าง)
    const themes = {
        warning: { bg: 'bg-[#f59e0b]', text: 'text-[#f59e0b]', icon: 'fa-exclamation', title: 'Warning' },
        info:    { bg: 'bg-[#3b82f6]', text: 'text-[#3b82f6]', icon: 'fa-info', title: 'Info' },
        success: { bg: 'bg-[#10b981]', text: 'text-[#10b981]', icon: 'fa-check', title: 'Success' },
        error:   { bg: 'bg-[#ef4444]', text: 'text-[#ef4444]', icon: 'fa-xmark', title: 'Error' }
    };

    const theme = themes[type] || themes.success;
    const title = customTitle || theme.title;

    const toast = document.createElement('div');
    
    // เปลี่ยนจาก rounded-lg เป็น rounded-xl เพื่อเพิ่มความโค้งมน
    toast.className = 'fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[70] flex items-stretch w-[400px] max-w-[90vw] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-300 translate-y-[20px] opacity-0 cursor-pointer border border-slate-100';
    
    toast.innerHTML = `
        <!-- แถบสีด้านซ้าย -->
        <div class="w-16 flex-shrink-0 flex items-center justify-center ${theme.bg}">
            <!-- วงกลมสีขาวพื้นหลังไอคอน (ตามภาพตัวอย่าง) -->
            <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <i class="fa-solid ${theme.icon} ${theme.text} text-lg"></i>
            </div>
        </div>
        
        <!-- พื้นที่ข้อความด้านขวา -->
        <div class="flex-1 p-4 relative bg-white">
            <button class="close-btn absolute top-3 right-3 text-slate-300 hover:text-slate-400 transition">
                <i class="fa-solid fa-xmark text-lg"></i>
            </button>
            <h4 class="text-slate-800 font-bold text-base mb-0.5">${title}</h4>
            <p class="text-slate-500 text-sm leading-snug">${msg}</p>
        </div>
    `;

    document.body.appendChild(toast);

    // ฟังก์ชันสำหรับปิดการแจ้งเตือน
    const dismissToast = () => {
        clearTimeout(autoDismiss);
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[20px]', 'opacity-0');
        setTimeout(() => toast.remove(), 300); // รอเฟดออกเสร็จค่อยลบ Node
    };

    // กดที่ตัว Toast หรือปุ่ม X เพื่อปิด
    toast.addEventListener('click', dismissToast);

    // แอนิเมชันเด้งขึ้นมา
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-[20px]', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    // ตั้งเวลาปิดอัตโนมัติ (3.5 วินาที)
    let autoDismiss = setTimeout(dismissToast, 3500);
}

export function showConfirm(title, msg, onConfirm) {
    document.getElementById('confirmTitle').innerText = title;
    document.getElementById('confirmMsg').innerText = msg;
    toggleModal('confirmModal');
    
    document.getElementById('btnConfirmOk').onclick = () => {
        toggleModal('confirmModal');
        if(onConfirm) onConfirm();
    };
    document.getElementById('btnConfirmCancel').onclick = () => toggleModal('confirmModal');
}