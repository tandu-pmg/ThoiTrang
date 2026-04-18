const CART_KEY = "cart";
let selectedColor = "Cam";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function syncCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
  document.querySelectorAll("#nav-cart-count, .cart-badge").forEach((el) => {
    el.innerText = String(total);
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
      flying.style.transform = `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.55)`;
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
    alert("Vui lòng đăng nhập để tiếp tục.");
  }
  return false;
}

function openDescTab() {
  const descTab = new bootstrap.Tab(document.querySelector("#desc-tab"));
  descTab.show();
}

function updatePrice() {
  const unitPrice =
    parseInt(
      document.getElementById("qty-input").getAttribute("data-unit-price"),
    ) || 0;
  const qty = parseInt(document.getElementById("qty-input").value) || 1;
  document.getElementById("display-price").innerText =
    (qty * unitPrice).toLocaleString("vi-VN") + "đ";
}

function changeProduct(element) {
  document.getElementById("mainImage").src = element.src;
  document.getElementById("desc-image").src = element.src;

  document
    .querySelectorAll(".product-thumbnail")
    .forEach((img) => img.classList.remove("active"));
  element.classList.add("active");

  document.getElementById("product-title").innerText =
    element.getAttribute("data-title");
  document.getElementById("display-price").innerText =
    element.getAttribute("data-price");
  document.getElementById("old-price").innerText =
    element.getAttribute("data-old") || "";
  document.getElementById("product-desc").innerText =
    element.getAttribute("data-desc") || "";

  const qtyInput = document.getElementById("qty-input");
  qtyInput.setAttribute("data-unit-price", element.getAttribute("data-unit"));
  qtyInput.value = 1;

  selectedColor = "Cam";
  document.querySelectorAll(".color-option").forEach((c) => {
    c.classList.remove("active");
    if (c.getAttribute("data-color") === "Cam") c.classList.add("active");
  });

  document.querySelectorAll(".size-option").forEach((r) => {
    r.checked = r.value === "M";
  });

  document.getElementById("selection-area").classList.remove("needs-selection");
  document.getElementById("color-error").classList.add("d-none");
  document.getElementById("size-error").classList.add("d-none");
}

function selectColor(element) {
  document
    .querySelectorAll(".color-option")
    .forEach((c) => c.classList.remove("active"));
  element.classList.add("active");
  selectedColor = element.getAttribute("data-color");
  document.getElementById("selection-area").classList.remove("needs-selection");
  document.getElementById("color-error").classList.add("d-none");
}

function getSelectedProduct() {
  const p =
    window._currentProduct ||
    (function () {
      try {
        return JSON.parse(localStorage.getItem("selectedProduct"));
      } catch {
        return null;
      }
    })();
  return p;
}

function validateAndGetCartItem() {
  const selectedSize = document.querySelector('input[name="size"]:checked');
  let isValid = true;

  if (!selectedColor) {
    document.getElementById("color-error").classList.remove("d-none");
    isValid = false;
  }
  if (!selectedSize) {
    document.getElementById("size-error").classList.remove("d-none");
    isValid = false;
  }
  if (!isValid) {
    const area = document.getElementById("selection-area");
    if (area) {
      area.classList.add("needs-selection");
      area.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return null;
  }

  const p = getSelectedProduct();
  if (!p) {
    alert("Không tìm thấy thông tin sản phẩm!");
    return null;
  }

  const qtyInput = document.getElementById("qty-input");
  const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
  const unitPrice =
    parseInt(qtyInput ? qtyInput.getAttribute("data-unit-price") : p.price) ||
    p.price;
  const key = String(p.id) + "_" + selectedSize.value + "_" + selectedColor;

  return {
    id: key,
    name: p.name + " / " + selectedSize.value + " / " + selectedColor,
    price: unitPrice,
    quantity: qty,
    img: p.img,
    selected: true,
    category: p.category || "",
  };
}

function showAddedFeedback(btnEl) {
  const originalText = btnEl.innerHTML;
  btnEl.innerHTML =
    '<i class="bx bx-check fs-4 me-1 align-middle"></i> ĐÃ THÊM';
  btnEl.classList.replace("btn-outline-dark", "btn-success");
  btnEl.classList.add("text-white");

  const toastEl = document.getElementById("cartToast");
  if (toastEl && window.bootstrap)
    new bootstrap.Toast(toastEl, { delay: 3000 }).show();

  setTimeout(() => {
    btnEl.innerHTML = originalText;
    btnEl.classList.replace("btn-success", "btn-outline-dark");
    btnEl.classList.remove("text-white");
  }, 1500);
}

function addRelatedToCart(id, name, price, img) {
  if (!requireLogin()) return;

  const cart = getCart();
  const existing = cart.find((i) => String(i.id) === String(id));
  if (existing) existing.quantity = (Number(existing.quantity) || 0) + 1;
  else
    cart.push({
      id: String(id),
      name,
      price,
      quantity: 1,
      img,
      selected: true,
    });

  saveCart(cart);
  syncCartBadge();

  const toastEl = document.getElementById("cartToast");
  if (toastEl && window.bootstrap)
    new bootstrap.Toast(toastEl, { delay: 2000 }).show();
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

(function () {
  try {
    // Ưu tiên đọc từ URL params (khi đến từ trang chủ qua link có params)
    var urlParams = new URLSearchParams(window.location.search);
    if (
      urlParams.has("id") &&
      urlParams.has("name") &&
      urlParams.has("price")
    ) {
      var rawImg = urlParams.get("img") || "";
      // index.html dùng đường dẫn "../DeTaiBanQuanAo/IMG/..." (từ thư mục gốc)
      // productdetails.html nằm trong HTML/ nên cần "../IMG/..."
      // Chuyển đổi: "../DeTaiBanQuanAo/IMG/xxx" → "../IMG/xxx"
      var fixedImg = rawImg.replace(/^\.\.\/DeTaiBanQuanAo\/IMG\//, "../IMG/");
      var fromUrl = {
        id: String(urlParams.get("id")),
        name: urlParams.get("name"),
        price: Number(urlParams.get("price")) || 0,
        img: fixedImg,
        category: urlParams.get("category") || "",
      };
      localStorage.setItem("selectedProduct", JSON.stringify(fromUrl));
    }

    const p = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!p) return;

    const mainImg = document.getElementById("mainImage");
    if (mainImg) {
      mainImg.src = p.img;
      mainImg.alt = p.name;
    }

    document.querySelectorAll(".product-thumbnail").forEach((th) => {
      th.src = p.img;
      th.setAttribute("data-title", p.name);
      th.setAttribute("data-unit", String(p.price));
      th.setAttribute(
        "data-price",
        (Number(p.price) || 0).toLocaleString("vi-VN") + "đ",
      );
      th.setAttribute("data-old", "");
    });

    const titleEl = document.getElementById("product-title");
    if (titleEl) titleEl.innerText = p.name;

    const priceEl = document.getElementById("display-price");
    if (priceEl)
      priceEl.innerText = (Number(p.price) || 0).toLocaleString("vi-VN") + "đ";

    const oldEl = document.getElementById("old-price");
    if (oldEl) oldEl.innerText = "";

    const qtyInput = document.getElementById("qty-input");
    if (qtyInput) qtyInput.setAttribute("data-unit-price", String(p.price));

    const breadName = document.getElementById("breadcrumb-name");
    if (breadName) breadName.innerText = p.name;

    const descImg = document.getElementById("desc-image");
    if (descImg) descImg.src = p.img;

    window._currentProduct = p;
  } catch {}
})();

document.addEventListener("DOMContentLoaded", function () {
  syncCartBadge();
  syncHelloUI();

  document.querySelectorAll(".size-option").forEach((radio) => {
    radio.addEventListener("change", function () {
      document
        .getElementById("selection-area")
        .classList.remove("needs-selection");
      document.getElementById("size-error").classList.add("d-none");
    });
  });

  const inputQty = document.getElementById("qty-input");
  document.getElementById("btn-plus").addEventListener("click", () => {
    inputQty.value = parseInt(inputQty.value) + 1;
    updatePrice();
  });

  document.getElementById("btn-minus").addEventListener("click", () => {
    if (parseInt(inputQty.value) > 1) {
      inputQty.value = parseInt(inputQty.value) - 1;
      updatePrice();
    }
  });

  const btnAdd = document.getElementById("btn-add-cart");
  if (btnAdd) {
    btnAdd.addEventListener("click", function () {
      if (!requireLogin()) return;

      const item = validateAndGetCartItem();
      if (!item) return;

      flyCartIconToNav(this);
      popCartIcon();

      const cart = getCart();
      const existing = cart.find((i) => i.id === item.id);
      if (existing)
        existing.quantity = (Number(existing.quantity) || 0) + item.quantity;
      else cart.push(item);

      saveCart(cart);
      syncCartBadge();
      showAddedFeedback(this);
    });
  }

  const btnBuyNow = document.getElementById("btn-buy-now");
  if (btnBuyNow) {
    btnBuyNow.addEventListener("click", function () {
      if (!requireLogin()) return;

      const item = validateAndGetCartItem();
      if (!item) return;

      const cart = getCart();
      const existing = cart.find((i) => i.id === item.id);
      if (existing)
        existing.quantity = (Number(existing.quantity) || 0) + item.quantity;
      else cart.push(item);

      saveCart(cart);
      localStorage.setItem("checkout", JSON.stringify([item]));
      window.location.href = "payment.html";
    });
  }
});

window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) syncCartBadge();
  if (e.key === "currentUser") syncHelloUI();
});

window.addEventListener("auth:changed", () => {
  syncHelloUI();
});

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
  syncCartBadge();
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
