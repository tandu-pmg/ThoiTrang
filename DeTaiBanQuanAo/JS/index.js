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

function getCartCount(cart) {
  return (cart || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );
}

function syncCartBadges(cart) {
  const count = getCartCount(cart);
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

function updateQtyOffcanvas(id, change) {
  const cart = loadCart();
  const idx = cart.findIndex((item) => String(item.id) === String(id));
  if (idx === -1) return;

  const next = (Number(cart[idx].quantity) || 0) + change;
  if (next <= 0) return;

  cart[idx].quantity = next;
  saveCart(cart);
  renderOffcanvasCart();
  syncCartBadges(cart);
}

function removeItemOffcanvas(id) {
  let cart = loadCart();
  cart = cart.filter((item) => String(item.id) !== String(id));
  saveCart(cart);
  renderOffcanvasCart();
  syncCartBadges(cart);
}

function renderOffcanvasCart() {
  const cart = loadCart();
  syncCartBadges(cart);

  const container = document.getElementById("cart-items-container");
  const totalElement = document.getElementById("cart-total");
  if (!container || !totalElement) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
            <div class="text-center text-muted mt-5">
              <i class="bi bi-bag-x fs-1"></i>
              <p class="mt-2">Giỏ hàng đang trống</p>
              <a href="list.html" class="btn btn-dark btn-sm mt-2">Mua Sắm Ngay</a>
            </div>`;
    totalElement.innerText = "0₫";
    return;
  }

  let totalMoney = 0;

  cart.forEach((item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    totalMoney += price * qty;

    container.innerHTML += `
            <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
              <img src="${item.img}" alt="${item.name}" class="cart-item-img border shadow-sm me-3">
              <div class="flex-grow-1">
                <h6 class="mb-1 fw-bold text-truncate" style="max-width:150px">${item.name}</h6>
                <div class="text-danger fw-semibold small mb-2">${formatCurrency(price)}</div>
                <div class="input-group input-group-sm w-auto d-inline-flex align-items-center border rounded-2">
                  <button class="btn btn-light quantity-btn border-0" onclick="updateQtyOffcanvas('${item.id}',-1)">-</button>
                  <span class="px-2 fw-semibold" style="min-width:30px;text-align:center">${qty}</span>
                  <button class="btn btn-light quantity-btn border-0" onclick="updateQtyOffcanvas('${item.id}',1)">+</button>
                </div>
              </div>
              <button class="btn btn-link text-muted p-0 ms-2" onclick="removeItemOffcanvas('${item.id}')">
                <i class="bi bi-trash fs-5 text-danger"></i>
              </button>
            </div>`;
  });

  totalElement.innerText = formatCurrency(totalMoney);
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
  renderOffcanvasCart();
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
  renderOffcanvasCart();
  syncCartBadges(loadCart());
  syncHelloUI();
});

window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) renderOffcanvasCart();
  if (e.key === "currentUser") syncHelloUI();
});

window.addEventListener("auth:changed", () => {
  syncHelloUI();
});
const HOME_PRODUCTS = {
  "ao-so-mi": [
    {
      id: 101,
      name: "Levis dri-FIT",
      price: 250000,
      oldPrice: 350000,
      img: "../DeTaiBanQuanAo/IMG/p1.jpg",
      category: "Áo thun nam",
      badge: { text: "Mới", cls: "bg-danger" },
    },
    {
      id: 102,
      name: "Levis Stripes",
      price: 320000,
      img: "../DeTaiBanQuanAo/IMG/p2.jpg",
      category: "Áo thun nam",
    },
    {
      id: 103,
      name: "H&amp;M Regular Fit",
      price: 360000,
      oldPrice: 450000,
      img: "../DeTaiBanQuanAo/IMG/p3.jpg",
      category: "Áo thun nam",
      badge: { text: "-20%", cls: "bg-warning text-dark" },
    },
    {
      id: 104,
      name: "Jack &amp; Jones",
      price: 450000,
      img: "../DeTaiBanQuanAo/IMG/p44.jpg",
      category: "Áo thun nam",
    },
  ],
  "quan-short": [
    {
      id: 201,
      name: "Quần Short Levi's",
      price: 280000,
      oldPrice: 350000,
      img: "../DeTaiBanQuanAo/IMG/levisshort.jpg",
      category: "Quần short nam",
      badge: { text: "-20%", cls: "bg-warning text-dark" },
    },
    {
      id: 202,
      name: "Quần Short H&amp;M",
      price: 220000,
      img: "../DeTaiBanQuanAo/IMG/h&mshort.jpg",
      category: "Quần short nam",
      badge: { text: "Mới", cls: "bg-danger" },
    },
    {
      id: 203,
      name: "Quần Short Nike",
      price: 350000,
      img: "../DeTaiBanQuanAo/IMG/nikeshort.jpg",
      category: "Quần short nam",
    },
    {
      id: 204,
      name: "Quần Short Zara",
      price: 300000,
      oldPrice: 400000,
      img: "../DeTaiBanQuanAo/IMG/zarashort.jpg",
      category: "Quần short nam",
    },
  ],
  "ao-khoac": [
    {
      id: 301,
      name: "Áo Khoác Bomber",
      price: 650000,
      oldPrice: 800000,
      img: "../DeTaiBanQuanAo/IMG/jacket.jpg",
      category: "Áo khoác nam",
      badge: { text: "-19%", cls: "bg-warning text-dark" },
    },
    {
      id: 302,
      name: "Áo Vest Classic",
      price: 850000,
      img: "../DeTaiBanQuanAo/IMG/vest.png",
      category: "Áo vest nam",
      badge: { text: "Mới", cls: "bg-danger" },
    },
    {
      id: 303,
      name: "Áo Khoác Denim",
      price: 550000,
      img: "../DeTaiBanQuanAo/IMG/aonicanphoimautay.png",
      category: "Áo khoác nam",
    },
    {
      id: 304,
      name: "Áo Khoác Gió",
      price: 420000,
      oldPrice: 500000,
      img: "../DeTaiBanQuanAo/IMG/aosweater.png",
      category: "Áo khoác nam",
    },
  ],
  "ao-hoodie": [
    {
      id: 401,
      name: "Hoodie Levis Basic",
      price: 450000,
      img: "../DeTaiBanQuanAo/IMG/hoodie1.avif",
      category: "Áo hoodie nam",
      badge: { text: "Mới", cls: "bg-danger" },
    },
    {
      id: 402,
      name: "Hoodie Champion",
      price: 580000,
      oldPrice: 700000,
      img: "../DeTaiBanQuanAo/IMG/hoodie2.jpeg",
      category: "Áo hoodie nam",
      badge: { text: "-17%", cls: "bg-warning text-dark" },
    },
    {
      id: 403,
      name: "Hoodie H&amp;M Zip",
      price: 390000,
      img: "../DeTaiBanQuanAo/IMG/hoodie3.jpg",
      category: "Áo hoodie nam",
    },
    {
      id: 404,
      name: "Hoodie Uniqlo",
      price: 520000,
      img: "../DeTaiBanQuanAo/IMG/hoodie4.jpg",
      category: "Áo hoodie nam",
    },
  ],
  "quan-dai": [
    {
      id: 501,
      name: "Quần Jeans Levi's 501",
      price: 750000,
      oldPrice: 900000,
      img: "../DeTaiBanQuanAo/IMG/quan1.jpg",
      category: "Quần jeans nam",
      badge: { text: "-17%", cls: "bg-warning text-dark" },
    },
    {
      id: 502,
      name: "Quần Kaki H&amp;M",
      price: 380000,
      img: "../DeTaiBanQuanAo/IMG/quan2.jpg",
      category: "Quần dài nam",
      badge: { text: "Mới", cls: "bg-danger" },
    },
    {
      id: 503,
      name: "Quần Âu Zara",
      price: 620000,
      img: "../DeTaiBanQuanAo/IMG/quan3.jpg",
      category: "Quần dài nam",
    },
    {
      id: 504,
      name: "Quần Jogger Nike",
      price: 480000,
      oldPrice: 600000,
      img: "../DeTaiBanQuanAo/IMG/quan4.jpg",
      category: "Quần dài nam",
    },
  ],
  "giay-dep": [
    {
      id: 601,
      name: "Nike Air Force 1",
      price: 1800000,
      oldPrice: 2200000,
      img: "../DeTaiBanQuanAo/IMG/airforce.webp",
      category: "Giày sneaker",
      badge: { text: "-18%", cls: "bg-warning text-dark" },
    },
    {
      id: 602,
      name: "Adidas Stan Smith",
      price: 1600000,
      img: "../DeTaiBanQuanAo/IMG/nike.jpg",
      category: "Giày sneaker",
      badge: { text: "Mới", cls: "bg-danger" },
    },
    {
      id: 603,
      name: "Dép Birkenstock",
      price: 950000,
      img: "../DeTaiBanQuanAo/IMG/sandalsberade.jpg",
      category: "Dép thời trang",
    },
    {
      id: 604,
      name: "Giày Lười Zara",
      price: 780000,
      oldPrice: 950000,
      img: "../DeTaiBanQuanAo/IMG/giaydep.png",
      category: "Giày lười",
    },
  ],
};

function formatVND(n) {
  return n.toLocaleString("vi-VN") + "đ";
}

function renderHomeProducts(category) {
  const grid = document.getElementById("home-products-grid");
  const products = HOME_PRODUCTS[category] || [];
  grid.innerHTML = products
    .map((p) => {
      const cleanName = p.name.replace(/&amp;/g, "&");
      // Ảnh trong index.js dùng "../DeTaiBanQuanAo/IMG/..."
      // productdetails.html nằm trong HTML/ nên cần "../IMG/..."
      const fixedImg = p.img.replace("../DeTaiBanQuanAo/IMG/", "../IMG/");
      const detailUrl =
        "../DeTaiBanQuanAo/HTML/productdetails.html" +
        "?id=" +
        encodeURIComponent(p.id) +
        "&name=" +
        encodeURIComponent(cleanName) +
        "&price=" +
        encodeURIComponent(p.price) +
        "&img=" +
        encodeURIComponent(fixedImg) +
        "&category=" +
        encodeURIComponent(p.category);
      const safeName = cleanName.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
      return `
        <div class="col-lg-3 col-md-6 col-sm-6">
          <div class="card border-0 h-100 shadow-sm rounded-4 overflow-hidden position-relative">
            <div class="position-relative overflow-hidden">
              <a href="${detailUrl}">
                <img src="${p.img}" class="card-img-top product-img" alt="${safeName}" />
              </a>
              ${
                p.badge
                  ? `<span class="position-absolute top-0 start-0 m-3 badge ${p.badge.cls} rounded-pill">${p.badge.text}</span>`
                  : ""
              }
            </div>
            <div class="card-body text-center">
              <a href="${detailUrl}" class="text-decoration-none text-dark">
                <h6 class="card-title fw-bold mb-2">${p.name}</h6>
              </a>
              <p class="text-muted small mb-2">${p.category}</p>
              <div class="d-flex justify-content-center align-items-center gap-2">
                ${
                  p.oldPrice
                    ? `<span class="text-decoration-line-through text-muted small">${formatVND(p.oldPrice)}</span>`
                    : ""
                }
                <span class="text-danger fw-bold fs-5">${formatVND(p.price)}</span>
              </div>
              <button class="btn btn-outline-dark btn-sm w-100 mt-3 rounded-pill home-add-cart-btn"
                data-id="${p.id}"
                data-name="${safeName}"
                data-price="${p.price}"
                data-img="${fixedImg}">
                <i class="bx bx-cart me-1"></i> Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  // Gắn sự kiện addToCart an toàn sau khi render xong
  grid.querySelectorAll(".home-add-cart-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      addToCart(
        parseInt(this.dataset.id),
        this.dataset.name,
        parseInt(this.dataset.price),
        this.dataset.img,
        this,
      );
    });
  });
}

function filterHomeProducts(category, btnEl) {
  document
    .querySelectorAll("#home-category-pills .nav-link")
    .forEach((el) => el.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");

  const grid = document.getElementById("home-products-grid");
  grid.style.opacity = "0";
  grid.style.transition = "opacity 0.2s ease";
  setTimeout(() => {
    renderHomeProducts(category);
    grid.style.opacity = "1";
  }, 200);
}

document.addEventListener("DOMContentLoaded", function () {
  renderHomeProducts("ao-so-mi");
});
function searchCartItems() {
  const search = document
    .getElementById("cartSearchInput")
    .value.trim()
    .toLowerCase();
  const itemsContainer = document.getElementById("cart-items-container");
  const items = itemsContainer.querySelectorAll(".cart-item");
  let hasResult = false;

  items.forEach((item) => {
    const title = item.querySelector(".cart-item-title")
      ? item.querySelector(".cart-item-title").innerText.trim().toLowerCase()
      : "";
    if (title.includes(search)) {
      item.style.display = "";
      hasResult = true;
    } else {
      item.style.display = "none";
    }
  });

  let noResult = document.getElementById("cart-no-result");
  if (!hasResult) {
    if (!noResult) {
      noResult = document.createElement("div");
      noResult.id = "cart-no-result";
      noResult.className = "text-center text-muted py-4";
      noResult.innerText = "Không tìm thấy sản phẩm phù hợp.";
      itemsContainer.appendChild(noResult);
    }
  } else if (noResult) {
    noResult.remove();
  }
}

document
  .getElementById("cartSearchInput")
  .addEventListener("keyup", function (e) {
    if (e.key === "Enter") searchCartItems();
  });
