const CART_KEY = "cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount) || 0);
}

function syncCartBadges(cart) {
  const count = (cart || []).reduce((s, i) => s + (Number(i.quantity) || 0), 0);
  document.querySelectorAll("#nav-cart-count, .cart-badge").forEach((el) => {
    el.innerText = String(count);
  });
}

function flyCartIconToNav(btnEl) {
  try {
    const navIcon = document.getElementById("nav-cart-icon");
    if (!btnEl || !navIcon) return;

    const b = btnEl.getBoundingClientRect();
    const c = navIcon.getBoundingClientRect();
    const dx = c.left + c.width / 2 - (b.left + b.width / 2);
    const dy = c.top + c.height / 2 - (b.top + b.height / 2);

    const flying = document.createElement("i");
    flying.className = "bx bx-cart fly-cart-icon";
    flying.style.cssText = `left:${b.left + b.width / 2}px;top:${b.top + b.height / 2}px;transform:translate(-50%,-50%) scale(1.15);opacity:1;`;
    document.body.appendChild(flying);

    requestAnimationFrame(() => {
      flying.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.55)`;
      flying.style.opacity = "0.2";
    });

    setTimeout(() => flying.remove(), 1550);
  } catch {}
}

function popCartIcon() {
  const icon = document.getElementById("nav-cart-icon");
  if (!icon) return;
  icon.classList.remove("cart-pop");
  void icon.offsetWidth;
  icon.classList.add("cart-pop");
  setTimeout(() => icon.classList.remove("cart-pop"), 200);
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

function requireLogin() {
  const u = getCurrentUser?.();
  if (u) return true;

  const modalEl = document.getElementById("authModal");
  if (modalEl && window.bootstrap?.Modal) {
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
    if (typeof switchToLogin === "function") switchToLogin();
  } else {
    alert("Vui lòng đăng nhập để thêm vào giỏ hàng.");
  }
  return false;
}

function addToCart(id, name, price, img, btnEl) {
  if (!requireLogin()) return;

  if (btnEl) flyCartIconToNav(btnEl);
  popCartIcon();

  const cart = loadCart();
  const existing = cart.find((item) => String(item.id) === String(id));
  if (existing) existing.quantity = (Number(existing.quantity) || 0) + 1;
  else
    cart.push({
      id: String(id),
      name,
      price: Number(price) || 0,
      quantity: 1,
      img,
      selected: true,
    });

  saveCart(cart);
  syncCartBadges(cart);

  const toastName = document.getElementById("toastProductName");
  const toastEl = document.getElementById("liveToast");
  if (toastName && toastEl && window.bootstrap?.Toast) {
    toastName.innerText = name;
    new bootstrap.Toast(toastEl).show();
  }
}

function goToDetail(id, name, price, img, category) {
  localStorage.setItem(
    "selectedProduct",
    JSON.stringify({
      id: String(id),
      name,
      price: Number(price) || 0,
      img,
      category,
    }),
  );
}

const CATEGORY_NAMES = {
  nam: "Thời Trang Nam",
  nu: "Thời Trang Nữ",
  "tre-em": "Thời Trang Trẻ Em",
  "ao-khoac-vest": "Áo Khoác & Vest",
  "tui-xach": "Túi Xách",
  "dong-ho": "Đồng Hồ",
  "kinh-mat": "Kính Mắt",
  "giay-dep": "Giày Dép",
  "phu-kien-khac": "Phụ Kiện Khác",
};

function filterByCategory() {
  const params = new URLSearchParams(window.location.search);
  const category = (params.get("category") || "").trim();

  const titleEl = document.getElementById("list-page-title");
  const breadEl = document.getElementById("breadcrumb-cat");
  const countEl = document.getElementById("product-count-label");
  const emptyEl = document.getElementById("empty-state");

  let visibleCount = 0;
  document.querySelectorAll(".product-item").forEach((el) => {
    const c = (el.dataset.category || "").trim();
    if (!category || c === category) {
      el.style.display = "";
      visibleCount++;
    } else {
      el.style.display = "none";
    }
  });

  document.querySelectorAll(".category-list a").forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle("active-cat", href === `list.html?category=${category}`);
  });

  const catName = category
    ? CATEGORY_NAMES[category] || category
    : "Tất Cả Sản Phẩm";
  if (titleEl) titleEl.innerText = catName;
  if (breadEl) breadEl.innerText = catName;
  if (countEl) countEl.innerText = `(${visibleCount} sản phẩm)`;
  if (emptyEl) emptyEl.classList.toggle("d-none", visibleCount > 0);
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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
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
  syncCartBadges(loadCart());
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

document.addEventListener("DOMContentLoaded", () => {
  filterByCategory();
  syncCartBadges(loadCart());
  syncHelloUI();
});

window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) syncCartBadges(loadCart());
  if (e.key === "currentUser") syncHelloUI();
});

window.addEventListener("auth:changed", () => {
  syncHelloUI();
});
