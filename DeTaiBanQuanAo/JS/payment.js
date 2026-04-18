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
    alert("Vui lòng đăng nhập để tiếp tục.");
  }
  return false;
}

function getCartCount(cart) {
  return (cart || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
}

function syncNavCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = getCartCount(cart);
  document.querySelectorAll("#nav-cart-count, .cart-badge").forEach((el) => {
    el.innerText = String(count);
  });
}

let discountAmount = 0;
const VALID_COUPONS = { FASHION10: 10, SALE20: 20, NEW15: 15 };

function loadCart() {
  try {
    const checkout = JSON.parse(localStorage.getItem("checkout")) || [];
    if (checkout.length) return checkout;
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

function formatVND(amount) {
  return (Number(amount) || 0).toLocaleString("vi-VN") + "đ";
}

function loadCheckoutData() {
  const cart = loadCart();
  const checkoutItemsContainer = document.getElementById("checkout-items");
  const orderCountHeader = document.getElementById("order-count-header");
  const subTotalEl = document.getElementById("sub-total");
  const discountEl = document.getElementById("discount-amount");
  const finalTotalEl = document.getElementById("final-total");

  checkoutItemsContainer.innerHTML = "";
  let subtotal = 0;
  let count = 0;

  if (cart.length === 0) {
    checkoutItemsContainer.innerHTML = `
            <div class="text-center py-3">
              <i class="bi bi-cart-x text-muted fs-3"></i>
              <p class="text-muted small mt-2 mb-3">Bạn chưa chọn sản phẩm nào</p>
              <a href="cart.html" class="btn btn-sm btn-outline-dark">Quay lại giỏ hàng</a>
            </div>`;
  } else {
    cart.forEach((item) => {
      subtotal += (Number(item.price) || 0) * (Number(item.quantity) || 0);
      count += Number(item.quantity) || 0;

      checkoutItemsContainer.innerHTML += `
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center">
                  <div class="checkout-thumb bg-light border rounded p-1 me-2">
                    <img src="${item.img}" alt="${item.name}">
                  </div>
                  <div>
                    <small class="d-block fw-bold">${item.name}</small>
                    <small class="text-muted">SL: <span class="fw-semibold">${item.quantity}</span></small>
                  </div>
                </div>
                <span class="fw-bold small">${formatVND((Number(item.price) || 0) * (Number(item.quantity) || 0))}</span>
              </div>`;
    });
  }

  const discount = Math.round((subtotal * discountAmount) / 100);
  const total = subtotal - discount;

  orderCountHeader.innerText = `Đơn Hàng (${count} sản phẩm)`;
  subTotalEl.innerText = formatVND(subtotal);
  discountEl.innerText = discount > 0 ? `-${formatVND(discount)}` : "0đ";
  finalTotalEl.innerText = formatVND(total);

  syncNavCartCount();
}

function applyCoupon() {
  const code = (document.getElementById("coupon-input").value || "")
    .trim()
    .toUpperCase();
  const msgEl = document.getElementById("coupon-message");

  if (!code) {
    msgEl.className = "small mb-3 text-danger";
    msgEl.innerText = "⚠ Vui lòng nhập mã giảm giá.";
    msgEl.classList.remove("d-none");
    return;
  }

  if (VALID_COUPONS[code] !== undefined) {
    discountAmount = VALID_COUPONS[code];
    msgEl.className = "small mb-3 text-success";
    msgEl.innerText = `✓ Áp dụng thành công! Giảm ${discountAmount}%`;
  } else {
    discountAmount = 0;
    msgEl.className = "small mb-3 text-danger";
    msgEl.innerText = "✗ Mã giảm giá không hợp lệ hoặc đã hết hạn.";
  }
  msgEl.classList.remove("d-none");
  loadCheckoutData();
}

const nameRegex =
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
const phoneRegex = /^(03|05|07|08|09)\d{8}$/;

function showError(inputEl, errorEl, msg) {
  inputEl.classList.add("is-invalid");
  inputEl.classList.remove("is-valid");
  errorEl.innerText = msg;
  errorEl.classList.remove("d-none");
}

function clearError(inputEl, errorEl) {
  inputEl.classList.remove("is-invalid");
  inputEl.classList.add("is-valid");
  errorEl.classList.add("d-none");
  errorEl.innerText = "";
}

function validateName() {
  const nameInput = document.getElementById("customer-name");
  const nameError = document.getElementById("name-error");
  const val = nameInput.value.trim();

  if (!val) {
    showError(nameInput, nameError, "* Vui lòng nhập họ và tên.");
    return false;
  }
  if (!nameRegex.test(val)) {
    showError(
      nameInput,
      nameError,
      "* Tên chỉ được chứa chữ cái, không bao gồm số hay ký tự đặc biệt.",
    );
    return false;
  }
  clearError(nameInput, nameError);
  return true;
}

function validatePhone() {
  const phoneInput = document.getElementById("customer-phone");
  const phoneError = document.getElementById("phone-error");
  const val = phoneInput.value.trim();

  if (!val) {
    showError(phoneInput, phoneError, "* Vui lòng nhập số điện thoại.");
    return false;
  }
  if (!phoneRegex.test(val)) {
    showError(
      phoneInput,
      phoneError,
      "* Số điện thoại phải gồm 10 số và bắt đầu bằng 03, 05, 07, 08 hoặc 09.",
    );
    return false;
  }
  clearError(phoneInput, phoneError);
  return true;
}

function placeOrder() {
  if (!requireLogin()) return;

  const isValidName = validateName();
  const isValidPhone = validatePhone();

  if (!isValidName || !isValidPhone) {
    document
      .getElementById("customer-name")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const cart = loadCart();
  if (cart.length === 0) {
    alert("Giỏ hàng trống, hãy chọn sản phẩm trước nhé!");
    return;
  }

  localStorage.removeItem("cart");
  localStorage.removeItem("checkout");

  const modal = new bootstrap.Modal(document.getElementById("successModal"));
  modal.show();

  syncNavCartCount();
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
  syncNavCartCount();
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
  requireLogin();

  loadCheckoutData();
  syncNavCartCount();
  syncHelloUI();

  const nameInput = document.getElementById("customer-name");
  const phoneInput = document.getElementById("customer-phone");
  nameInput.addEventListener("input", validateName);
  nameInput.addEventListener("blur", validateName);
  phoneInput.addEventListener("input", validatePhone);
  phoneInput.addEventListener("blur", validatePhone);
});

window.addEventListener("storage", (e) => {
  if (e.key === "cart" || e.key === "checkout") loadCheckoutData();
  if (e.key === "currentUser") syncHelloUI();
});

window.addEventListener("auth:changed", () => {
  syncHelloUI();
});
