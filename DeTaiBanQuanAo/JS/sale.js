const CART_KEY = "cart";
const WISH_KEY = "wishlist_deals";

const SALE_PRODUCTS = [
  {
    id: "sp1",
    title: "Quần Jeans basic regular fit",
    cat: "nam",
    img: "../IMG/Jeansbasicregularfit.png",
    off: 29,
    priceOld: 520000,
    priceNew: 369000,
    desc: "Jeans basic dễ phối, form regular fit, phù hợp đi học/đi làm.",
    link: "list.html?category=nam&q=jeans",
    priority: 1,
  },
  {
    id: "sp2",
    title: "Áo da lộn basic",
    cat: "outerwear",
    img: "../IMG/dalonbasic.png",
    off: 27,
    priceOld: 890000,
    priceNew: 649000,
    desc: "Áo khoác da lộn basic, tone dễ phối, hợp thời tiết se lạnh.",
    link: "list.html?category=ao-khoac-vest&q=da%20l%E1%BB%99n",
    priority: 2,
  },
  {
    id: "sp3",
    title: "Áo khoác gió 2 lớp",
    cat: "outerwear",
    img: "../IMG/aokhoacgio2lop.png",
    off: 39,
    priceOld: 790000,
    priceNew: 479000,
    desc: "Gió lạnh không lo: áo khoác gió 2 lớp, nhẹ và tiện dụng.",
    link: "list.html?category=ao-khoac-vest&q=kho%C3%A1c%20gi%C3%B3",
    priority: 3,
  },
  {
    id: "sp4",
    title: "Áo khoác lông cừu 2 lớp",
    cat: "outerwear",
    img: "../IMG/aohoaclongcuu2lop.png",
    off: 20,
    priceOld: 990000,
    priceNew: 792000,
    desc: "Giữ ấm tốt, chất liệu mềm, phù hợp mùa lạnh.",
    link: "list.html?category=ao-khoac-vest&q=l%C3%B4ng%20c%E1%BB%ABu",
    priority: 4,
  },
  {
    id: "sp5",
    title: "Áo nỉ cánh phối màu tay",
    cat: "nam",
    img: "../IMG/aonicanphoimautay.png",
    off: 20,
    priceOld: 450000,
    priceNew: 360000,
    desc: "Áo nỉ phối màu trẻ trung, mặc đi chơi/đi học đều đẹp.",
    link: "list.html?category=nam&q=%C3%A1o%20n%E1%BB%89",
    priority: 5,
  },
  {
    id: "sp6",
    title: "Váy xanh công sở",
    cat: "nu",
    img: "../IMG/vayxanhcongso.png",
    off: 15,
    priceOld: 520000,
    priceNew: 442000,
    desc: "Thanh lịch công sở, màu xanh dễ phối blazer/giày cao gót.",
    link: "list.html?category=nu&q=v%C3%A1y%20xanh",
    priority: 6,
  },
  {
    id: "sp7",
    title: "Unisex fit – dễ phối",
    cat: "all",
    img: "../IMG/unisex.png",
    off: 20,
    priceOld: 390000,
    priceNew: 312000,
    desc: "Form unisex dễ mặc, phối đồ nhanh theo phong cách tối giản.",
    link: "list.html?q=unisex",
    priority: 7,
  },
  {
    id: "sp8",
    title: "Áo phông trắng / oversize",
    cat: "nu",
    img: "../IMG/aophongtrang.png",
    off: 20,
    priceOld: 250000,
    priceNew: 200000,
    desc: "Oversize thoải mái, style streetwear nổi bật.",
    link: "list.html?category=nu&q=%C3%A1o%20ph%C3%B4ng",
    priority: 8,
  },
  {
    id: "sp9",
    title: "Bộ quần áo basic set",
    cat: "all",
    img: "../IMG/boquanao.png",
    off: 30,
    priceOld: 520000,
    priceNew: 364000,
    desc: "Set basic tiện lợi, mua 1 lần mặc được nhiều dịp.",
    link: "list.html?q=set",
    priority: 9,
  },
  {
    id: "sp10",
    title: "Áo couple basic (Unisex)",
    cat: "all",
    img: "../IMG/aocapdoi.png",
    off: 25,
    priceOld: 420000,
    priceNew: 315000,
    desc: "Áo couple basic, phù hợp đi chơi/du lịch cùng nhau.",
    link: "list.html?q=couple",
    priority: 10,
  },
];

function formatVND(n) {
  const v = Number(n || 0);
  try {
    return v.toLocaleString("vi-VN") + "₫";
  } catch {
    return String(v) + "₫";
  }
}

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

function loadWish() {
  try {
    return JSON.parse(localStorage.getItem(WISH_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWish(ids) {
  localStorage.setItem(WISH_KEY, JSON.stringify(ids));
}

function isWished(id) {
  return loadWish().includes(id);
}

function toggleWish(id) {
  const ids = loadWish();
  const idx = ids.indexOf(id);
  if (idx >= 0) ids.splice(idx, 1);
  else ids.push(id);
  saveWish(ids);
  syncWishCount();
  renderDeals();
}

function syncWishCount() {
  const el = document.getElementById("wishCount");
  if (el) el.innerText = String(loadWish().length);
}

function toText(s) {
  return String(s || "").toLowerCase();
}

function passesFilter(d) {
  const q = toText(document.getElementById("q").value).trim();
  const cat = document.getElementById("fCat").value;
  const off = document.getElementById("fOff").value;

  if (cat && d.cat !== cat) return false;
  if (off && Number(d.off || 0) < Number(off)) return false;

  if (q) {
    const blob = toText([d.title, d.desc, d.cat, String(d.off)].join(" "));
    if (!blob.includes(q)) return false;
  }
  return true;
}

function openDeal(d) {
  document.getElementById("dmTitle").innerText = d.title;
  document.getElementById("dmImg").src = d.img;
  document.getElementById("dmImg").alt = d.title;
  document.getElementById("dmOff").innerText = `-${d.off}%`;

  document.getElementById("dmCat").innerText =
    d.cat === "all"
      ? "Toàn shop"
      : d.cat === "nam"
        ? "Nam"
        : d.cat === "nu"
          ? "Nữ"
          : d.cat === "outerwear"
            ? "Áo khoác"
            : d.cat === "phu-kien"
              ? "Phụ kiện"
              : d.cat;

  document.getElementById("dmDesc").innerText = d.desc;
  document.getElementById("dmLink").href = d.link;

  document.getElementById("dmPriceNew").innerText = formatVND(d.priceNew);
  document.getElementById("dmPriceOld").innerText = formatVND(d.priceOld);

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("dealModal"),
  ).show();
}

function renderDeals() {
  const grid = document.getElementById("dealGrid");
  const resultCount = document.getElementById("resultCount");
  if (!grid || !resultCount) return;

  const items = SALE_PRODUCTS.filter(passesFilter).sort(
    (a, b) => (a.priority || 999) - (b.priority || 999),
  );
  resultCount.innerText = String(items.length);

  grid.innerHTML = "";
  items.forEach((d) => {
    const wished = isWished(d.id);

    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6";
    col.innerHTML = `
            <div class="card sale-card border-0 shadow-sm rounded-4 overflow-hidden h-100">
              <img src="${d.img}" alt="${d.title}" class="w-100" />
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <span class="badge bg-danger rounded-pill sale-badge">-${d.off}%</span>
                    <h5 class="fw-bold mt-2 mb-1">${d.title}</h5>
                    <p class="text-muted small mb-2">${d.desc}</p>

                    <div class="d-flex align-items-center gap-2 flex-wrap">
                      <span class="fw-bold text-danger">${formatVND(
                        d.priceNew,
                      )}</span>
                      <span class="text-muted text-decoration-line-through small">${formatVND(
                        d.priceOld,
                      )}</span>
                    </div>
                  </div>

                  <button class="btn btn-light wish-btn ${wished ? "active" : ""}" type="button" data-wish="${d.id}" title="Yêu thích">
                    <i class="bx ${wished ? "bxs-heart" : "bx-heart"} fs-5"></i>
                  </button>
                </div>
              </div>
              <div class="card-footer bg-white border-0 pt-0 pb-3 px-3 d-flex gap-2">
                <a href="${d.link}" class="btn btn-dark w-100 rounded-pill">Xem sản phẩm</a>
                <button class="btn btn-outline-dark w-100 rounded-pill" type="button" data-open="${d.id}">Xem nhanh</button>
              </div>
            </div>
          `;
    grid.appendChild(col);
  });

  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-open");
      const d = SALE_PRODUCTS.find((x) => x.id === id);
      if (d) openDeal(d);
    });
  });

  document.querySelectorAll("[data-wish]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-wish");
      toggleWish(id);
    });
  });
}

(function countdown() {
  const h = document.getElementById("d-h");
  const m = document.getElementById("d-m");
  const s = document.getElementById("d-s");
  if (!h || !m || !s) return;

  let seconds = 8 * 3600 + 12 * 60 + 30;
  setInterval(() => {
    seconds = Math.max(0, seconds - 1);
    const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    h.textContent = hh;
    m.textContent = mm;
    s.textContent = ss;
  }, 1000);
})();

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
  syncWishCount();
  renderDeals();

  const onChange = () => renderDeals();
  ["q", "fCat", "fOff"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(id === "q" ? "input" : "change", onChange);
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    document.getElementById("q").value = "";
    document.getElementById("fCat").value = "";
    document.getElementById("fOff").value = "";
    renderDeals();
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
  if (e.key === WISH_KEY) {
    syncWishCount();
    renderDeals();
  }
  if (e.key === "currentUser") syncHelloUI();
});

window.addEventListener("auth:changed", () => {
  syncHelloUI();
});
