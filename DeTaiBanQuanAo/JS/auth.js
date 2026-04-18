// ../JS/auth.js
const USERS_KEY = "users"; // danh sách user đã đăng ký
const AUTH_KEY = "currentUser"; // user đang đăng nhập

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function isValidName(name) {
  const n = String(name || "").trim();
  return n.length >= 2 && n.length <= 40;
}

function validatePassword(pw) {
  const p = String(pw || "");
  if (p.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
  if (!/[A-Za-z]/.test(p)) return "Mật khẩu phải có ít nhất 1 chữ.";
  if (!/[0-9]/.test(p)) return "Mật khẩu phải có ít nhất 1 số.";
  return "";
}

function logout({ redirect = false } = {}) {
  localStorage.removeItem(AUTH_KEY);
  syncNavUser();
  syncUserLink();

  if (redirect) window.location.href = "trangchu.html";
}

function register({ name, email, password, confirmPassword } = {}) {
  const n = String(name || "").trim();
  const e = String(email || "").trim();
  const p = String(password || "");
  const p2 = String(confirmPassword || "");

  if (!n) return { ok: false, field: "name", message: "Vui lòng nhập họ tên." };
  if (!isValidName(n))
    return {
      ok: false,
      field: "name",
      message: "Họ tên không hợp lệ (2-40 ký tự, chỉ chữ & khoảng trắng).",
    };

  if (!e) return { ok: false, field: "email", message: "Vui lòng nhập email." };
  if (!isValidEmail(e))
    return {
      ok: false,
      field: "email",
      message: "Email không đúng định dạng.",
    };

  const pwErr = validatePassword(p);
  if (pwErr) return { ok: false, field: "password", message: pwErr };

  if (p2 && p !== p2)
    return {
      ok: false,
      field: "confirmPassword",
      message: "Mật khẩu nhập lại không khớp.",
    };

  const users = loadUsers();
  const exists = users.some(
    (u) => String(u.email || "").toLowerCase() === e.toLowerCase(),
  );
  if (exists)
    return { ok: false, field: "email", message: "Email này đã được đăng ký." };

  const newUser = {
    id: Date.now(),
    name: n,
    email: e,
    password: p,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { ok: true, message: "Đăng ký thành công!" };
}

function login({ email, password } = {}) {
  const e = String(email || "").trim();
  const p = String(password || "");

  if (!e) return { ok: false, field: "email", message: "Vui lòng nhập email." };
  if (!isValidEmail(e))
    return {
      ok: false,
      field: "email",
      message: "Email không đúng định dạng.",
    };
  if (!p)
    return { ok: false, field: "password", message: "Vui lòng nhập mật khẩu." };

  const users = loadUsers();
  const user = users.find(
    (u) =>
      String(u.email || "").toLowerCase() === e.toLowerCase() &&
      String(u.password || "") === p,
  );

  if (!user)
    return {
      ok: false,
      field: "password",
      message: "Email hoặc mật khẩu không đúng.",
    };

  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  syncNavUser();
  syncUserLink();

  return { ok: true, message: "Đăng nhập thành công!" };
}

function syncNavUser() {
  const helloEl = document.getElementById("nav-user");
  const userLink = document.getElementById("user-link");

  const u = getCurrentUser();

  if (!u) {
    if (helloEl) helloEl.innerHTML = "";
    if (userLink) userLink.classList.remove("d-none");
    return;
  }

  // Đã đăng nhập: ẩn icon user, chỉ hiện xin chào + tên
  if (userLink) userLink.classList.add("d-none");
  if (helloEl) {
    helloEl.innerHTML = `Xin chào, <strong>${u.name}</strong>`;
  }
}
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  hideMsg();
  clearErrs();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const password2 = document.getElementById("regPassword2").value;

  let ok = true;

  if (!name) {
    setErr("errName", "Vui lòng nhập họ tên.");
    ok = false;
  }

  if (!email) {
    setErr("errEmail", "Vui lòng nhập email.");
    ok = false;
  } else if (!isValidEmail(email)) {
    setErr("errEmail", "Email không đúng định dạng.");
    ok = false;
  }

  const pwErr = validatePassword(password);
  if (!password) {
    setErr("errPassword", "Vui lòng nhập mật khẩu.");
    ok = false;
  } else if (pwErr) {
    setErr("errPassword", pwErr);
    ok = false;
  }

  if (!password2) {
    setErr("errPassword2", "Vui lòng nhập lại mật khẩu.");
    ok = false;
  } else if (password !== password2) {
    setErr("errPassword2", "Mật khẩu nhập lại không khớp.");
    ok = false;
  }

  if (!ok) return;

  // ===== register =====
  const res = register({ name, email, password });
  if (!res.ok) {
    setErr("errEmail", res.message);
    return;
  }

  // ===== THÀNH CÔNG: quay về form đăng nhập =====
  showMsg("Đăng ký thành công! Vui lòng đăng nhập.", true);

  // đổ sẵn email sang form login + focus password
  document.getElementById("loginEmail").value = email;
  document.getElementById("loginPassword").value = "";

  // chuyển về login
  switchToLogin();
  showMsg("Đăng ký thành công! Vui lòng đăng nhập.", true);

  // xoá dữ liệu form đăng ký
  registerForm.reset();
});

function syncUserLink() {
  const link = document.getElementById("user-link");
  if (!link) return;

  const u = getCurrentUser();
  if (!u) {
    link.setAttribute("data-bs-toggle", "modal");
    link.setAttribute("data-bs-target", "#authModal");
    link.setAttribute("href", "#");
    return;
  }

  link.removeAttribute("data-bs-toggle");
  link.removeAttribute("data-bs-target");
  link.setAttribute("href", "taikhoan.html");
}

function initAuthModal() {
  const modalEl = document.getElementById("authModal");
  if (!modalEl) return;

  const titleEl = document.getElementById("authTitle");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  function switchTo(mode) {
    if (mode === "register") {
      titleEl && (titleEl.innerText = "Đăng ký");
      loginForm && loginForm.classList.add("d-none");
      registerForm && registerForm.classList.remove("d-none");
    } else {
      titleEl && (titleEl.innerText = "Đăng nhập");
      registerForm && registerForm.classList.add("d-none");
      loginForm && loginForm.classList.remove("d-none");
    }
  }

  // Khi bấm “Đăng ký/Đăng nhập” trên navbar (data-auth)
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-auth]");
    if (!a) return;
    const mode = a.getAttribute("data-auth");
    switchTo(mode);
  });

  // Mở modal mặc định: login
  modalEl.addEventListener("show.bs.modal", () => switchTo("login"));
}

// Auto sync khi load trang
document.addEventListener("DOMContentLoaded", () => {
  syncNavUser();
  syncUserLink();
});
// auth.js
function requireLoginOrRedirect({ redirectTo = "trangchu.html" } = {}) {
  const u = getCurrentUser();
  if (u) return true;

  alert("Vui lòng đăng nhập để tiếp tục!");
  window.location.href = redirectTo;
  return false;
}
