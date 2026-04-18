const CART_KEY = "cart";
const DRAFT_KEY = "quickContactDraft";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function getCartCount(cart) {
  return (cart || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
}

function syncCartBadges() {
  const cart = loadCart();
  const count = getCartCount(cart);
  document.querySelectorAll("#nav-cart-count, .cart-badge").forEach((el) => {
    el.innerText = String(count);
  });
}

const userLink = document.getElementById("user-link");
const helloLink = document.getElementById("hello-link");
const helloName = document.getElementById("hello-name");

function syncHelloUI() {
  const u = getCurrentUser?.();
  if (!u) {
    userLink?.classList.remove("d-none");
    helloLink?.classList.add("d-none");
    if (helloName) helloName.innerText = "";
    return;
  }
  userLink?.classList.add("d-none");
  helloLink?.classList.remove("d-none");
  if (helloName) helloName.innerText = u.name || "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function animateCounters() {
  const els = Array.from(document.querySelectorAll(".countup"));
  if (!els.length) return;

  const run = () => {
    els.forEach((el) => {
      const target = Number(el.getAttribute("data-target")) || 0;
      const duration = 900;
      const start = performance.now();
      const from = 0;

      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const val = Math.floor(from + (target - from) * p);
        el.textContent = val.toLocaleString("vi-VN");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const seen = entries.some((e) => e.isIntersecting);
      if (seen) {
        run();
        io.disconnect();
      }
    },
    { threshold: 0.3 },
  );

  const anchor = document.querySelector(".countup");
  if (anchor) io.observe(anchor);
  else run();
}

function openTeamModal(title, d1, d2) {
  const t = document.getElementById("teamTitle");
  const a = document.getElementById("teamDesc1");
  const b = document.getElementById("teamDesc2");
  t.textContent = title;
  a.textContent = d1;
  b.textContent = d2;
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("teamModal"),
  ).show();
}

function setText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt || "";
}

function showContactAlert(text, ok) {
  const el = document.getElementById("contactAlert");
  if (!el) return;
  el.className = ok ? "alert alert-success py-2" : "alert alert-danger py-2";
  el.textContent = text;
  el.classList.remove("d-none");
}

function hideContactAlert() {
  const el = document.getElementById("contactAlert");
  if (!el) return;
  el.classList.add("d-none");
  el.textContent = "";
}

function loadDraft() {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY));
    if (!d) return;
    document.getElementById("qcName").value = d.name || "";
    document.getElementById("qcEmail").value = d.email || "";
    document.getElementById("qcMessage").value = d.message || "";
  } catch {}
}

function saveDraft() {
  const d = {
    name: document.getElementById("qcName").value.trim(),
    email: document.getElementById("qcEmail").value.trim(),
    message: document.getElementById("qcMessage").value.trim(),
    savedAt: Date.now(),
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

const authTitle = document.getElementById("authTitle");
const authMsg = document.getElementById("authMsg");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const toRegister = document.getElementById("toRegister");
const toLogin = document.getElementById("toLogin");

const accountView = document.getElementById("accountView");
const accName = document.getElementById("accName");
const accEmail = document.getElementById("accEmail");
const btnLogout = document.getElementById("btnLogout");

function setErr(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}

function clearErrs() {
  [
    "errLoginEmail",
    "errLoginPassword",
    "errName",
    "errEmail",
    "errPassword",
    "errPassword2",
  ].forEach((id) => setErr(id, ""));
}

function hideMsg() {
  authMsg.classList.add("d-none");
  authMsg.textContent = "";
}

function showMsg(text, ok) {
  authMsg.className = ok
    ? "alert alert-success py-2"
    : "alert alert-danger py-2";
  authMsg.textContent = text;
  authMsg.classList.remove("d-none");
}

function showAccountView() {
  const u = getCurrentUser?.();
  if (!u) return false;

  accName.innerText = u.name || "";
  accEmail.innerText = u.email || "";

  loginForm.classList.add("d-none");
  registerForm.classList.add("d-none");
  accountView.classList.remove("d-none");

  authTitle.innerText = "Tài khoản";
  hideMsg();
  clearErrs();
  return true;
}

function switchToRegister() {
  authTitle.innerText = "Đăng ký";
  hideMsg();
  clearErrs();
  accountView.classList.add("d-none");
  loginForm.classList.add("d-none");
  registerForm.classList.remove("d-none");
}

function switchToLogin() {
  authTitle.innerText = "Đăng nhập";
  hideMsg();
  clearErrs();
  accountView.classList.add("d-none");
  registerForm.classList.add("d-none");
  loginForm.classList.remove("d-none");
}

toRegister.addEventListener("click", (e) => {
  e.preventDefault();
  switchToRegister();
});

toLogin.addEventListener("click", (e) => {
  e.preventDefault();
  switchToLogin();
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  hideMsg();
  clearErrs();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  let ok = true;
  if (!email) {
    setErr("errLoginEmail", "Vui lòng nhập email.");
    ok = false;
  } else if (!isValidEmail(email)) {
    setErr("errLoginEmail", "Email không đúng định dạng.");
    ok = false;
  }
  if (!password) {
    setErr("errLoginPassword", "Vui lòng nhập mật khẩu.");
    ok = false;
  }
  if (!ok) return;

  const res = login({ email, password });
  if (!res.ok) {
    setErr("errLoginPassword", res.message);
    return;
  }

  syncHelloUI();
  syncCartBadges();
  bootstrap.Modal.getInstance(document.getElementById("authModal"))?.hide();
});

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
  if (!password) {
    setErr("errPassword", "Vui lòng nhập mật khẩu.");
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

  const res = register({ name, email, password });
  if (!res.ok) {
    setErr("errEmail", res.message);
    return;
  }

  registerForm.reset();
  switchToLogin();
  showMsg("Đăng ký thành công! Vui lòng đăng nhập.", true);
  document.getElementById("loginEmail").value = email;
});

document.getElementById("authModal").addEventListener("show.bs.modal", () => {
  if (!showAccountView()) switchToLogin();
});

btnLogout.addEventListener("click", () => {
  logout();
  syncHelloUI();
  switchToLogin();
});

document.getElementById("btnClearDraft").addEventListener("click", () => {
  clearDraft();

  document
    .getElementById("quickContactForm")
    .querySelectorAll("input, textarea")
    .forEach((el) => (el.value = ""));

  setText("qcErrName", "");
  setText("qcErrEmail", "");
  setText("qcErrMsg", "");

  showContactAlert("Đã xóa nháp.", true);
  setTimeout(hideContactAlert, 1400);
});

const form = document.getElementById("quickContactForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  hideContactAlert();

  const name = document.getElementById("qcName").value.trim();
  const email = document.getElementById("qcEmail").value.trim();
  const msg = document.getElementById("qcMessage").value.trim();

  setText("qcErrName", "");
  setText("qcErrEmail", "");
  setText("qcErrMsg", "");

  let ok = true;

  if (!name) {
    setText("qcErrName", "Vui lòng nhập họ tên.");
    ok = false;
  }
  if (!email) {
    setText("qcErrEmail", "Vui lòng nhập email.");
    ok = false;
  } else if (!isValidEmail(email)) {
    setText("qcErrEmail", "Email không đúng định dạng.");
    ok = false;
  }
  if (!msg) {
    setText("qcErrMsg", "Vui lòng nhập nội dung.");
    ok = false;
  }

  if (!ok) return;

  const payload = {
    name,
    email,
    msg,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem("lastQuickContact", JSON.stringify(payload));

  clearDraft();

  form.reset();
  showContactAlert("Đã gửi liên hệ. Fashion Store sẽ phản hồi sớm!", true);
  setTimeout(hideContactAlert, 2200);
});
