const CART_KEY = "cart";
const CHECKOUT_KEY = "checkout";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function setCheckoutItems(items) {
  localStorage.setItem(CHECKOUT_KEY, JSON.stringify(items || []));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(amount) || 0);
}

function updateCartBadge() {
  const cart = getCart();
  const totalQty = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
  document.querySelectorAll("#nav-cart-count, .cart-badge").forEach((el) => {
    el.innerText = String(totalQty);
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

function isAllSelected(cart) {
  if (!cart.length) return false;
  return cart.every((i) => i.selected === true);
}

function getSelectedSummary(cart) {
  const selected = cart.filter((i) => i.selected);
  const selectedTotal = selected.reduce(
    (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
    0,
  );
  return { selected, selectedTotal };
}
function fixImagePath(img) {
  if (!img) return "";

  // Nếu là URL đầy đủ (http/https/data) → giữ nguyên
  if (/^(https?:|data:)/.test(img)) return img;

  // Chuẩn hoá: lấy tên file từ bất kỳ path nào chứa /IMG/ hoặc /Images/
  // Hỗ trợ: "../IMG/x.jpg", "../DeTaiBanQuanAo/IMG/x.jpg",
  //         "IMG/x.jpg", "/DeTaiBanQuanAo/IMG/x.jpg", "../Images/x.jpg"
  const imgFolderRegex = /(?:^|.*[\/])(?:IMG|Images|images|img)[\/](.+)/i;
  const match = img.match(imgFolderRegex);
  if (match) {
    return "../IMG/" + match[1];
  }

  // Nếu chỉ là tên file thuần (không có dấu /), thêm prefix mặc định
  if (!img.includes("/") && !img.includes("\\")) {
    return "../IMG/" + img;
  }

  // Fallback: giữ nguyên
  return img;
}

function renderCart() {
  const cartData = getCart();
  const container = document.getElementById("cart-items-container");
  const totalElement = document.getElementById("cart-total");
  const totalItemsText = document.getElementById("total-items-text");
  const selectAllTop = document.getElementById("selectAllTop");
  const selectAllBottom = document.getElementById("selectAllBottom");

  if (!container || !totalElement || !totalItemsText) return;

  cartData.forEach((i) => {
    if (typeof i.selected !== "boolean") i.selected = true;
  });

  container.innerHTML = "";
  updateCartBadge();

  if (cartData.length === 0) {
    container.innerHTML = `
            <div class="cart-item-row text-center py-5">
              <i class="bi bi-cart-x text-muted" style="font-size:4rem"></i>
              <p class="mt-3 text-muted">Giỏ hàng của bạn đang trống</p>
              <a href="home.html" class="btn btn-dark mt-2">Mua Sắm Ngay</a>
            </div>`;
    totalElement.innerText = "0₫";
    totalItemsText.innerText = "0";
    if (selectAllTop) selectAllTop.checked = false;
    if (selectAllBottom) selectAllBottom.checked = false;
    saveCart(cartData);
    return;
  }

  cartData.forEach((item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    const line = price * qty;
    const escapedId = String(item.id).replace(/'/g, "\\'");

    container.innerHTML += `
            <div class="cart-item-row d-flex align-items-center flex-wrap flex-md-nowrap">
              <div class="col-1 mb-2 mb-md-0 d-flex justify-content-center">
                <input class="form-check-input" type="checkbox" style="transform:scale(1.2);"
                  ${item.selected ? "checked" : ""}
                  onchange="toggleSelect('${escapedId}', this.checked)">
              </div>

              <div class="col-11 col-md-4 d-flex align-items-center mb-3 mb-md-0">
                <img src="${fixImagePath(item.img)}" alt="${item.name}" class="cart-item-img me-3">
                <div class="d-flex flex-column justify-content-center pe-2">
                  <a href="productdetails.html" class="text-decoration-none text-dark fw-medium text-truncate d-inline-block"
                    style="max-width:200px" onclick="setProductFromCart(${JSON.stringify(item).replace(/"/g, "&quot;")})">
                    ${item.name}
                  </a>
                </div>
              </div>

              <div class="col-4 col-md-2 text-md-center text-muted">
                <span class="d-md-none small">Đơn giá: </span>${formatCurrency(price)}
              </div>

              <div class="col-4 col-md-2 d-flex justify-content-md-center align-items-center">
                <div class="input-group input-group-sm w-auto d-inline-flex align-items-center border rounded-1">
                  <button class="btn btn-light quantity-btn border-0" type="button" onclick="updateQuantity('${escapedId}', -1)">-</button>
                  <span class="px-2 fw-semibold text-center" style="min-width:35px;border-left:1px solid #ddd;border-right:1px solid #ddd">${qty}</span>
                  <button class="btn btn-light quantity-btn border-0" type="button" onclick="updateQuantity('${escapedId}', 1)">+</button>
                </div>
              </div>

              <div class="col-4 col-md-2 text-end text-md-center text-shopee fw-bold">
                <span class="d-md-none small text-dark fw-normal">Tổng: </span>${formatCurrency(line)}
              </div>

              <div class="col-12 col-md-1 text-end text-md-center mt-3 mt-md-0">
                <button class="btn text-dark p-0 border-0 bg-transparent" type="button" onclick="removeItem('${escapedId}')">Xóa</button>
              </div>
            </div>`;
  });

  const { selectedTotal } = getSelectedSummary(cartData);
  totalElement.innerText = formatCurrency(selectedTotal);
  totalItemsText.innerText = String(cartData.length);

  const all = isAllSelected(cartData);
  if (selectAllTop) selectAllTop.checked = all;
  if (selectAllBottom) selectAllBottom.checked = all;

  saveCart(cartData);
}

function toggleSelect(id, checked) {
  const cart = getCart();
  const idx = cart.findIndex((i) => String(i.id) === String(id));
  if (idx === -1) return;
  cart[idx].selected = checked;
  saveCart(cart);
  renderCart();
}

function toggleSelectAll(checked) {
  const cart = getCart();
  cart.forEach((i) => (i.selected = checked));
  saveCart(cart);
  renderCart();
}

function updateQuantity(id, change) {
  const cart = getCart();
  const idx = cart.findIndex((i) => String(i.id) === String(id));
  if (idx === -1) return;

  const next = (Number(cart[idx].quantity) || 0) + change;
  if (next <= 0) return;

  cart[idx].quantity = next;
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter((i) => String(i.id) !== String(id));
  saveCart(cart);
  renderCart();
}

function clearCart() {
  if (!confirm("Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ?")) return;
  localStorage.removeItem(CART_KEY);
  renderCart();
}

function buySelected() {
  if (!requireLogin()) return;

  const cart = getCart();
  const selected = cart.filter((i) => i.selected);
  if (selected.length === 0) {
    alert("Bạn chưa chọn sản phẩm nào để mua!");
    return;
  }
  setCheckoutItems(selected);
  window.location.href = "payment.html";
}

function setProductFromCart(item) {
  try {
    localStorage.setItem(
      "selectedProduct",
      JSON.stringify({
        id: String(item.id),
        name: item.name,
        price: Number(item.price) || 0,
        img: item.img,
        category: item.category || "",
      }),
    );
  } catch {}
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
  updateCartBadge();
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

  const selectAllTop = document.getElementById("selectAllTop");
  const selectAllBottom = document.getElementById("selectAllBottom");
  if (selectAllTop)
    selectAllTop.addEventListener("change", (e) =>
      toggleSelectAll(e.target.checked),
    );
  if (selectAllBottom)
    selectAllBottom.addEventListener("change", (e) =>
      toggleSelectAll(e.target.checked),
    );

  renderCart();
  syncHelloUI();
});

window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) renderCart();
  if (e.key === "currentUser") syncHelloUI();
});

window.addEventListener("auth:changed", () => {
  syncHelloUI();
});
