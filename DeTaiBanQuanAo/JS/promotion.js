const CART_KEY = "cart";
const SAVE_KEY = "saved_promo_codes";

const PROMOS = [
  {
    id: "FASHION10",
    code: "FASHION10",
    title: "Ưu đãi đơn hàng",
    discount: 10,
    cat: "all",
    img: "../IMG/boquanao.png",
    desc: "Áp dụng cho hầu hết sản phẩm",
    ctaText: "Dùng ngay",
    ctaHref: "payment.html",
    priority: 1,
  },
  {
    id: "SALE20",
    code: "SALE20",
    title: "Sale cuối tuần",
    discount: 20,
    cat: "sale",
    img: "../IMG/aokhoacgio2lop.png",
    desc: "Một số sản phẩm sale/flash deal (xem trang Sale)",
    ctaText: "Xem sale",
    ctaHref: "sale.html",
    priority: 2,
  },
  {
    id: "NEW15",
    code: "NEW15",
    title: "Set quần áo mới",
    discount: 15,
    cat: "all",
    img: "../IMG/unisex.png",
    desc: "Áp dụng cho đơn hàng đầu tiên",
    ctaText: "Xem set đồ mới",
    ctaHref: "introduction.html",
    priority: 3,
  },
  {
    id: "MEN10",
    code: "MEN10",
    title: "Deal thời trang nam",
    discount: 10,
    cat: "nam",
    img: "../IMG/Jeansbasicregularfit.png",
    desc: "Ưu đãi cho một số sản phẩm nam",
    ctaText: "Xem quần áo nam",
    ctaHref: "list.html?category=nam",
    priority: 4,
  },
  {
    id: "WOMEN10",
    code: "WOMEN10",
    title: "Deal thời trang nữ",
    discount: 10,
    cat: "nu",
    img: "../IMG/vayxanhcongso.png",
    desc: "Ưu đãi cho một số sản phẩm nữ",
    ctaText: "Xem quần áo nữ",
    ctaHref: "list.html?category=nu",
    priority: 5,
  },
  {
    id: "ACC15",
    code: "ACC15",
    title: "Phụ kiện giảm 15%",
    discount: 15,
    cat: "phu-kien",
    img: "../IMG/daychuyen.png",
    desc: "Mua phụ kiện làm điểm nhấn outfit",
    ctaText: "Xem phụ kiện",
    ctaHref: "list.html?category=phu-kien-khac",
    priority: 6,
  },

  {
    id: "OUTER20",
    code: "OUTER20",
    title: "Outerwear giảm 20%",
    discount: 20,
    cat: "sale",
    img: "../IMG/dalonbasic.png",
    desc: "Áp dụng cho áo khoác/vest trong chương trình sale",
    ctaText: "Xem áo khoác",
    ctaHref: "list.html?category=ao-khoac-vest",
    priority: 7,
  },
  {
    id: "SET30",
    code: "SET30",
    title: "Mua set giảm 30%",
    discount: 20,
    cat: "all",
    img: "../IMG/boquanao.png",
    desc: "Ưu đãi cho một số combo/set (tùy chương trình)",
    ctaText: "Xem sản phẩm",
    ctaHref: "list.html",
    priority: 8,
  },
];

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

function toast(id) {
  const el = document.getElementById(id);
  if (!el || !window.bootstrap?.Toast) return;
  bootstrap.Toast.getOrCreateInstance(el, { delay: 1600 }).show();
}

function copyCode(code) {
  const doToast = () => toast("copyToast");

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(doToast).catch(doToast);
      return;
    }
  } catch {}
  doToast();
}

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSaved(ids) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(ids));
}

function isSaved(code) {
  return loadSaved().includes(code);
}

function toggleSave(code) {
  const ids = loadSaved();
  const idx = ids.indexOf(code);
  if (idx >= 0) ids.splice(idx, 1);
  else ids.push(code);
  saveSaved(ids);
  syncSavedCount();
  toast("saveToast");
  renderPromos();
}

function syncSavedCount() {
  const el = document.getElementById("savedCount");
  if (el) el.innerText = String(loadSaved().length);
}

function toText(s) {
  return String(s || "").toLowerCase();
}

function getFiltered() {
  const q = toText(document.getElementById("q").value).trim();
  const cat = document.getElementById("fCat").value;
  const disc = document.getElementById("fDiscount").value;
  const sort = document.getElementById("fSort").value;

  let items = PROMOS.slice();

  if (cat) items = items.filter((p) => p.cat === cat);
  if (disc) items = items.filter((p) => String(p.discount) === String(disc));

  if (q) {
    items = items.filter((p) => {
      const blob = toText([p.code, p.title, p.desc, p.cat].join(" "));
      return blob.includes(q);
    });
  }

  if (sort === "best")
    items.sort((a, b) => (a.priority || 999) - (b.priority || 999));
  if (sort === "discount_desc")
    items.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  if (sort === "discount_asc")
    items.sort((a, b) => (a.discount || 0) - (b.discount || 0));
  if (sort === "code_az")
    items.sort((a, b) => String(a.code).localeCompare(String(b.code)));

  return items;
}

function renderPromos() {
  const grid = document.getElementById("promoGrid");
  const resultCount = document.getElementById("resultCount");
  if (!grid || !resultCount) return;

  const items = getFiltered();
  resultCount.innerText = String(items.length);

  grid.innerHTML = "";
  items.forEach((p) => {
    const saved = isSaved(p.code);

    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6";
    col.innerHTML = `
            <div class="card promo-card shadow-sm h-100">
              <img src="${p.img}" alt="${p.code}" class="w-100" />
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <div class="badge bg-dark rounded-pill mb-2">Giảm ${p.discount}%</div>
                    <h5 class="fw-bold mb-1">${p.title}</h5>
                    <p class="text-muted small mb-3">${p.desc}</p>
                  </div>

                  <button class="btn btn-outline-dark save-btn ${saved ? "active" : ""}" type="button" data-save="${p.code}" title="Lưu mã">
                    <i class="bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"}"></i>
                  </button>
                </div>

                <div class="d-flex align-items-center justify-content-between gap-2">
                  <span class="badge bg-warning text-dark rounded-pill px-3 py-2 code-pill">${p.code}</span>
                  <button class="btn btn-dark btn-sm px-3 copy-btn" type="button" data-copy="${p.code}">Sao chép</button>
                </div>
              </div>
              <div class="card-footer bg-white border-0 pt-0 pb-3 px-3">
                <a href="${p.ctaHref}" class="btn btn-outline-dark w-100 rounded-pill">${p.ctaText}</a>
              </div>
            </div>
          `;
    grid.appendChild(col);
  });

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () =>
      copyCode(btn.getAttribute("data-copy")),
    );
  });

  document.querySelectorAll("[data-save]").forEach((btn) => {
    btn.addEventListener("click", () =>
      toggleSave(btn.getAttribute("data-save")),
    );
  });
}

function renderSavedModal() {
  const ids = loadSaved();
  const list = document.getElementById("savedList");
  const empty = document.getElementById("savedEmpty");
  if (!list || !empty) return;

  list.innerHTML = "";
  if (!ids.length) {
    empty.classList.remove("d-none");
    return;
  }
  empty.classList.add("d-none");

  const items = PROMOS.filter((p) => ids.includes(p.code));
  items.forEach((p) => {
    const col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
            <div class="p-3 bg-light rounded-4 border">
              <div class="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <div class="fw-bold mb-1">${p.title}</div>
                  <div class="text-muted small mb-2">${p.desc}</div>
                  <div class="d-flex gap-2 flex-wrap">
                    <span class="badge bg-dark rounded-pill">Giảm ${p.discount}%</span>
                    <span class="badge bg-warning text-dark rounded-pill">${p.code}</span>
                  </div>
                </div>
                <button class="btn btn-outline-dark save-btn active" type="button" data-unsave="${p.code}" title="Bỏ lưu">
                  <i class="bi bi-bookmark-fill"></i>
                </button>
              </div>

              <div class="d-flex gap-2 flex-wrap mt-3">
                <button class="btn btn-dark btn-sm rounded-pill px-3" type="button" data-copy="${p.code}">
                  <i class="bi bi-clipboard me-1"></i> Sao chép
                </button>
                <a class="btn btn-outline-dark btn-sm rounded-pill px-3" href="${p.ctaHref}">${p.ctaText}</a>
              </div>
            </div>
          `;
    list.appendChild(col);
  });

  document.querySelectorAll("[data-unsave]").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleSave(btn.getAttribute("data-unsave"));
      renderSavedModal();
    });
  });

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () =>
      copyCode(btn.getAttribute("data-copy")),
    );
  });
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

document.addEventListener("DOMContentLoaded", () => {
  syncHelloUI();
  syncCartBadges();
  syncSavedCount();
  renderPromos();

  const onChange = () => renderPromos();
  ["q", "fCat", "fDiscount", "fSort"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(id === "q" ? "input" : "change", onChange);
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    document.getElementById("q").value = "";
    document.getElementById("fCat").value = "";
    document.getElementById("fDiscount").value = "";
    document.getElementById("fSort").value = "best";
    renderPromos();
  });

  document.getElementById("btnShowSaved").addEventListener("click", () => {
    renderSavedModal();
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("savedModal"),
    ).show();
  });

  const btn = document.getElementById("btnBackTop");
  const onScroll = () => {
    if (window.scrollY > 400) btn.style.display = "inline-flex";
    else btn.style.display = "none";
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
});

window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) syncCartBadges();
  if (e.key === SAVE_KEY) {
    syncSavedCount();
    renderPromos();
  }
  if (e.key === "currentUser") syncHelloUI();
});

window.addEventListener("auth:changed", () => {
  syncHelloUI();
});
