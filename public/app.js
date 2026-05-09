const HOTEL_STORAGE_KEY = "hotelMockApiStoreV1";

const pageTitles = {
    dashboard: "Bảng điều khiển tổng quan",
    rooms: "Quản lý phòng và thư viện ảnh",
    booking: "Tạo đặt phòng mới",
    reviews: "Đánh giá khách hàng",
    reception: "Quầy lễ tân và danh sách booking",
    guests: "Hồ sơ khách hàng",
    services: "Quản lý dịch vụ khách sạn",
    housekeeping: "Điều phối dọn phòng",
    finance: "Báo cáo tài chính",
    settings: "Cài đặt hệ thống",
    crud: "Mock API + Context API + CRUD"
};

const authGate = document.getElementById("authGate");
const appShell = document.getElementById("appShell");
const showLoginBtn = document.getElementById("showLogin");
const showRegisterBtn = document.getElementById("showRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const userRoleBadge = document.getElementById("userRoleBadge");
const userAvatar = document.getElementById("userAvatar");
const logoutBtn = document.getElementById("logoutBtn");
const globalSearch = document.getElementById("globalSearch");
const settingsForm = document.getElementById("settingsForm");
const settingsLogoutBtn = document.getElementById("settingsLogoutBtn");
const guestTableBody = document.getElementById("guestTableBody");
const staffTableBody = document.getElementById("staffTableBody");
const guestStayingCount = document.getElementById("guestStayingCount");
const guestCheckoutCount = document.getElementById("guestCheckoutCount");
const guestVipCount = document.getElementById("guestVipCount");

const staffProfiles = [
    { name: "Lê Thanh Hương", email: "huong.reception@hotel.vn", roleName: "Trưởng lễ tân", shift: "07:00 - 15:00", status: "Đang trực" },
    { name: "Trần Hoàng Phúc", email: "phuc.finance@hotel.vn", roleName: "Kế toán", shift: "08:30 - 17:30", status: "Đang trực" },
    { name: "Đặng Gia Linh", email: "linh.hk@hotel.vn", roleName: "Giám sát buồng phòng", shift: "06:30 - 14:30", status: "Nghỉ ca" },
    { name: "Phạm Hữu Duy", email: "duy.service@hotel.vn", roleName: "Quản lý dịch vụ", shift: "13:00 - 21:00", status: "Sắp vào ca" }
];

const guestProfiles = [
    { name: "Nguyễn Văn Nam", room: "301", phone: "0908123456", checkin: "21/03/2026", checkout: "24/03/2026", tier: "VIP", status: "Đang ở" },
    { name: "Lê Thị Thu", room: "418", phone: "0909234567", checkin: "20/03/2026", checkout: "22/03/2026", tier: "Gold", status: "Sắp trả" },
    { name: "Phạm Quang Duy", room: "120", phone: "0912345678", checkin: "19/03/2026", checkout: "23/03/2026", tier: "Silver", status: "Gia hạn" },
    { name: "Lisa Tran", room: "512", phone: "0935678912", checkin: "18/03/2026", checkout: "25/03/2026", tier: "VIP", status: "Đang ở" },
    { name: "Hoàng Gia Hân", room: "203", phone: "0987111222", checkin: "21/03/2026", checkout: "24/03/2026", tier: "Silver", status: "Đang ở" },
    { name: "Đỗ Minh Anh", room: "104", phone: "0944556677", checkin: "22/03/2026", checkout: "24/03/2026", tier: "Gold", status: "Sắp trả" },
    { name: "Ngô Hải Đăng", room: "201", phone: "0977888999", checkin: "20/03/2026", checkout: "23/03/2026", tier: "VIP", status: "Đang ở" },
    { name: "Bùi Lan Chi", room: "305", phone: "0966661111", checkin: "21/03/2026", checkout: "26/03/2026", tier: "Silver", status: "Đang ở" },
    { name: "Trần Đức Khoa", room: "401", phone: "0911002200", checkin: "19/03/2026", checkout: "22/03/2026", tier: "Gold", status: "Sắp trả" },
    { name: "Nguyễn Phương Thảo", room: "107", phone: "0903004005", checkin: "18/03/2026", checkout: "24/03/2026", tier: "VIP", status: "Đang ở" },
    { name: "Lâm Gia Bảo", room: "403", phone: "0922333444", checkin: "21/03/2026", checkout: "27/03/2026", tier: "Gold", status: "Đang ở" },
    { name: "Phan Quốc Khánh", room: "204", phone: "0933555666", checkin: "22/03/2026", checkout: "24/03/2026", tier: "Silver", status: "Đang ở" }
];

let currentUser = null;

function readMockStore() {
    try {
        const raw = localStorage.getItem(HOTEL_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function writeMockStore(store) {
    localStorage.setItem(HOTEL_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("hotel-store-changed"));
}

function getAuthUsers() {
    const store = readMockStore();
    if (!store || !Array.isArray(store.users)) return [];
    return store.users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role
    }));
}

function appendUserToMockStore({ name, email, password, role }) {
    let store = readMockStore();
    if (!store) {
        store = {
            rooms: [],
            bookings: [],
            reviews: [],
            users: [
                { id: "u-admin", name: "Admin Hotel", email: "admin@hotel.vn", password: "123456", role: "staff" }
            ]
        };
    }
    if (!Array.isArray(store.users)) store.users = [];
    const id = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    store.users.push({ id, name, email, password, role });
    writeMockStore(store);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2100);
}

function setAuthTab(mode) {
    const isLogin = mode === "login";
    showLoginBtn.classList.toggle("active", isLogin);
    showRegisterBtn.classList.toggle("active", !isLogin);
    loginForm.classList.toggle("hidden", !isLogin);
    registerForm.classList.toggle("hidden", isLogin);
}

function applyRoleAccess(role) {
    const internalNodes = document.querySelectorAll(".internal-only");
    internalNodes.forEach((el) => {
        el.classList.toggle("hidden", role !== "staff");
    });
    userRoleBadge.textContent = role === "staff" ? "Nội bộ quản lý" : "Khách hàng";
}

function loginSuccess(user) {
    currentUser = user;
    window.__hotelUserRole = user.role;
    applyRoleAccess(user.role);
    authGate.classList.add("hidden");
    appShell.classList.remove("hidden");
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`;
    const firstPage = user.role === "staff" ? "dashboard" : "rooms";
    setPage(firstPage);
    showToast(`Xin chào ${user.name}`);
    renderStaffManagement();
}

function setPage(pageId) {
    const blockedPages = ["reception", "guests", "services", "housekeeping", "finance", "settings", "crud"];
    if (currentUser && currentUser.role !== "staff" && blockedPages.includes(pageId)) {
        showToast("Tài khoản khách hàng không có quyền vào mục này.");
        pageId = "rooms";
    }
    document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
    document.querySelectorAll(".side-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.page === pageId);
    });
    document.getElementById("page-title").textContent = pageTitles[pageId] || "Hotel Manager";
    window.dispatchEvent(new CustomEvent("hotel:active-page", { detail: pageId }));
}

window.__hotelSetPage = setPage;

function guestStatusTag(status) {
    if (status === "Đang ở") return '<span class="tag green">Đang ở</span>';
    if (status === "Sắp trả") return '<span class="tag yellow">Sắp trả</span>';
    return '<span class="tag blue">Gia hạn</span>';
}

function guestTierTag(tier) {
    if (tier === "VIP") return '<span class="tag purple">VIP</span>';
    if (tier === "Gold") return '<span class="tag yellow">Gold</span>';
    return '<span class="tag blue">Silver</span>';
}

function renderGuestManagement() {
    guestTableBody.innerHTML = guestProfiles.map((guest) => `
        <tr>
            <td>${guest.name}</td>
            <td>${guest.room}</td>
            <td>${guest.phone}</td>
            <td>${guest.checkin}</td>
            <td>${guest.checkout}</td>
            <td>${guestTierTag(guest.tier)}</td>
            <td>${guestStatusTag(guest.status)}</td>
        </tr>
    `).join("");

    const staying = guestProfiles.filter((g) => g.status === "Đang ở").length;
    const checkoutSoon = guestProfiles.filter((g) => g.status === "Sắp trả").length;
    const vip = guestProfiles.filter((g) => g.tier === "VIP").length;
    guestStayingCount.textContent = String(staying);
    guestCheckoutCount.textContent = String(checkoutSoon);
    guestVipCount.textContent = String(vip);
}

function staffStatusTag(status) {
    if (status === "Đang trực") return '<span class="tag green">Đang trực</span>';
    if (status === "Sắp vào ca") return '<span class="tag yellow">Sắp vào ca</span>';
    return '<span class="tag blue">Nghỉ ca</span>';
}

function renderStaffManagement() {
    const storeUsers = getAuthUsers().filter((u) => u.role === "staff");
    const dynamicStaff = storeUsers.map((u) => ({
        name: u.name,
        email: u.email,
        roleName: "Nhân sự nội bộ",
        shift: "Theo lịch phân ca",
        status: "Đang trực"
    }));

    const merged = [...staffProfiles, ...dynamicStaff.filter((s) => !staffProfiles.some((p) => p.email === s.email))];
    staffTableBody.innerHTML = merged.map((staff) => `
        <tr>
            <td>${staff.name}</td>
            <td>${staff.email}</td>
            <td>${staff.roleName}</td>
            <td>${staff.shift}</td>
            <td>${staffStatusTag(staff.status)}</td>
        </tr>
    `).join("");
}

document.querySelectorAll(".side-btn").forEach((btn) => {
    btn.addEventListener("click", () => setPage(btn.dataset.page));
});

document.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => setPage(btn.dataset.page));
});

if (globalSearch) {
    globalSearch.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            setPage("rooms");
            window.dispatchEvent(new CustomEvent("hotel:global-search", { detail: event.target.value }));
            showToast("Đã tìm theo từ khóa trên trang phòng.");
        }
    });
}

renderGuestManagement();
renderStaffManagement();

showLoginBtn.addEventListener("click", () => setAuthTab("login"));
showRegisterBtn.addEventListener("click", () => setAuthTab("register"));

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = String(formData.get("email")).trim().toLowerCase();
    const password = String(formData.get("password")).trim();
    const pool = getAuthUsers();
    const user = pool.find((item) => item.email.toLowerCase() === email && item.password === password);
    if (!user) {
        showToast("Sai email hoặc mật khẩu.");
        return;
    }
    loginSuccess(user);
    event.target.reset();
});

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim().toLowerCase();
    const password = String(formData.get("password")).trim();
    const role = String(formData.get("role"));
    if (password.length < 6) {
        showToast("Mật khẩu cần ít nhất 6 ký tự.");
        return;
    }
    if (getAuthUsers().some((item) => item.email.toLowerCase() === email)) {
        showToast("Email đã tồn tại.");
        return;
    }
    appendUserToMockStore({ name, email, password, role });
    loginSuccess({ name, email, password, role });
    event.target.reset();
});

logoutBtn.addEventListener("click", () => {
    currentUser = null;
    window.__hotelUserRole = undefined;
    appShell.classList.add("hidden");
    authGate.classList.remove("hidden");
    setAuthTab("login");
    showToast("Đã đăng xuất.");
});

function loadSystemSettings() {
    const raw = localStorage.getItem("hotelSystemSettings");
    if (!raw) return;
    try {
        const settings = JSON.parse(raw);
        Object.entries(settings).forEach(([key, value]) => {
            const field = settingsForm.elements.namedItem(key);
            if (!field) return;
            if (field.type === "checkbox") {
                field.checked = Boolean(value);
            } else {
                field.value = value;
            }
        });
        const hotelName = settings.hotelName || "Grand Royal Coastal Resort";
        const title = document.querySelector(".hero h3");
        if (title) title.textContent = hotelName;
    } catch {
        showToast("Không đọc được cài đặt đã lưu.");
    }
}

settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const settings = {
        hotelName: String(formData.get("hotelName") || ""),
        hotelPhone: String(formData.get("hotelPhone") || ""),
        hotelEmail: String(formData.get("hotelEmail") || ""),
        hotelAddress: String(formData.get("hotelAddress") || ""),
        language: String(formData.get("language") || "vi"),
        timezone: String(formData.get("timezone") || "Asia/Ho_Chi_Minh"),
        vatRate: String(formData.get("vatRate") || "8"),
        enableNotify: event.target.enableNotify.checked
    };
    localStorage.setItem("hotelSystemSettings", JSON.stringify(settings));
    const title = document.querySelector(".hero h3");
    if (title) title.textContent = settings.hotelName || "Grand Royal Coastal Resort";
    showToast("Đã lưu cài đặt hệ thống.");
});

settingsLogoutBtn.addEventListener("click", () => {
    logoutBtn.click();
});

window.addEventListener("hotel-store-changed", () => {
    renderStaffManagement();
});

loadSystemSettings();
