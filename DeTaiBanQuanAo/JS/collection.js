const CART_KEY = "cart";
const WISH_KEY = "wishlist_collections";

const COLLECTIONS = [
  {
    id: "urban-men",
    cat: "nam",
    title: "Urban Menswear",
    subtitle: "Tối giản, dễ phối",
    img: "../IMG/Jeansbasicregularfit.png",
    style: "minimal",
    priceMin: 300000,
    priceMax: 600000,
    tags: ["Nam", "Minimal", "All-season"],
    link: "list.html?category=nam",
    desc: "Concept dành cho nam theo phong cách urban-minimal: áo thun, sơ mi, quần jean và sneaker. Ưu tiên form cơ bản và màu trung tính.",
  },
  {
    id: "modern-women",
    cat: "nu",
    title: "Modern Womenswear",
    subtitle: "Thanh lịch, tinh tế",
    img: "../IMG/vayxanhcongso.png",
    style: "formal",
    priceMin: 300000,
    priceMax: 600000,
    tags: ["Nữ", "Formal", "All-season"],
    link: "list.html?category=nu",
    desc: "Gợi ý phối đồ nữ theo hướng thanh lịch: sơ mi, chân váy/quần âu và một món điểm nhấn nhẹ nhàng. Phù hợp đi làm, đi chơi.",
  },
  {
    id: "winter-essential",
    cat: "outerwear",
    title: "Winter Essential",
    subtitle: "Ấm áp, thời thượng",
    img: "../IMG/aokhoacgio2lop.png",
    style: "street",
    priceMin: 600000,
    priceMax: 1200000,
    tags: ["Outerwear", "Winter", "Street"],
    link: "list.html?category=ao-khoac-vest",
    desc: "Áo khoác/vest giúp bạn layer đẹp khi trời lạnh. Ưu tiên chất liệu giữ ấm vừa đủ và form dễ phối với outfit hằng ngày.",
  },
  {
    id: "outerwear-luxe",
    cat: "outerwear",
    title: "Outerwear Luxe",
    subtitle: "Da lộn / lông cừu, dễ layer",
    img: "../IMG/dalonbasic.png",
    style: "formal",
    priceMin: 600000,
    priceMax: 1500000,
    tags: ["Outerwear", "Winter", "Formal"],
    link: "list.html?category=ao-khoac-vest",
    desc: "Collection tập trung vào áo khoác chất liệu dày dặn (da lộn, lông cừu) phù hợp thời tiết lạnh và outfit đi làm/đi chơi.",
  },
  {
    id: "street-oversize",
    cat: "all",
    title: "Street Oversize",
    subtitle: "Phóng khoáng, trẻ trung",
    img: "../IMG/aosweater.png",
    style: "street",
    priceMin: 300000,
    priceMax: 600000,
    tags: ["Street", "Oversize", "All-season"],
    link: "list.html",
    desc: "Phong cách streetwear/oversize: thoải mái, dễ phối cùng sneaker và phụ kiện tối giản.",
  },
  {
    id: "unisex-core",
    cat: "all",
    title: "Unisex Core",
    subtitle: "Ai cũng mặc được",
    img: "../IMG/unisex.png",
    style: "minimal",
    priceMin: 300000,
    priceMax: 600000,
    tags: ["Unisex", "Minimal", "All-season"],
    link: "list.html",
    desc: "Form unisex basic, tone trung tính dễ phối. Phù hợp mặc thường ngày.",
  },
  {
    id: "kids-style",
    cat: "tre-em",
    title: "Kids Style",
    subtitle: "Năng động, đáng yêu",
    img: "../IMG/nguoinhen.png",
    style: "active",
    priceMin: 0,
    priceMax: 300000,
    tags: ["Trẻ em", "Active", "All-season"],
    link: "list.html?category=tre-em",
    desc: "Phong cách trẻ em ưu tiên thoải mái và dễ vận động. Màu sắc tươi, chất liệu mềm và bền, thuận tiện giặt giũ.",
  },
  {
    id: "accessories",
    cat: "phu-kien",
    title: "Accessories",
    subtitle: "Điểm nhấn hoàn hảo",
    img: "../IMG/daychuyen.png",
    style: "minimal",
    priceMin: 0,
    priceMax: 300000,
    tags: ["Phụ kiện", "Minimal", "All-season"],
    link: "list.html?category=phu-kien-khac",
    desc: "Phụ kiện là “chìa khóa” nâng cấp outfit: dây chuyền, kính, đồng hồ... Chọn 1 điểm nhấn đủ tinh tế để outfit cân bằng.",
  },
  {
    id: "combo-set",
    cat: "all",
    title: "Combo / Set",
    subtitle: "Mua set tiện lợi",
    img: "../IMG/boquanao.png",
    style: "active",
    priceMin: 300000,
    priceMax: 600000,
    tags: ["Combo", "Set", "All-season"],
    link: "list.html",
    desc: "Gợi ý các combo/set cơ bản: mua 1 lần mặc được nhiều dịp, tiết kiệm thời gian phối đồ.",
  },
  {
    id: "hot-deals",
    cat: "sale",
    title: "Hot Deals",
    subtitle: "Ưu đãi theo tuần",
    img: "../IMG/boquanao.png",
    style: "street",
    priceMin: 0,
    priceMax: 300000,
    tags: ["SALE", "Deal", "Weekly"],
    link: "sale.html",
    desc: "Tổng hợp deal theo tuần và các chương trình sale. Theo dõi thường xuyên để không bỏ lỡ các mức giảm tốt.",
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

function loadWish() {
  try {
    const ids = JSON.parse(localStorage.getItem(WISH_KEY)) || [];
    return Array.from(new Set(ids));
  } catch {
    return [];
  }
}

function saveWish(ids) {
  localStorage.setItem(WISH_KEY, JSON.stringify(Array.from(new Set(ids))));
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
  renderCollections();
}

function syncWishCount() {
  const el = document.getElementById("wishCount");
  if (el) el.innerText = String(loadWish().length);
}

function toText(s) {
  return String(s || "").toLowerCase();
}

function passesFilter(item) {
  const q = toText(document.getElementById("q").value).trim();
  const style = document.getElementById("fStyle").value;
  const cat = document.getElementById("fCat").value;
  const price = document.getElementById("fPrice").value;

  if (style && item.style !== style) return false;
  if (cat && item.cat !== cat) return false;

  if (price) {
    const min = Number(item.priceMin ?? 0);
    const max = Number(item.priceMax ?? 0);

    if (price === "under-300") {
      if (!(max <= 300000 || min < 300000)) return false;
    }

    if (price === "300-600") {
      const a1 = 300000,
        a2 = 600000;
      const overlap = Math.max(min, a1) <= Math.min(max || min, a2);
      if (!overlap) return false;
    }

    if (price === "over-600") {
      if (!(min >= 600000 || max > 600000)) return false;
    }
  }

  if (q) {
    const blob = toText(
      [
        item.title,
        item.subtitle,
        item.tags?.join(" ") || "",
        item.desc,
        item.style,
        item.cat,
      ].join(" "),
    );
    if (!blob.includes(q)) return false;
  }

  return true;
}

function openQuickView(item) {
  document.getElementById("qvTitle").innerText = item.title;

  const img = document.getElementById("qvImg");
  img.src = item.img;
  img.alt = item.title;

  const chips = document.getElementById("qvChips");
  chips.innerHTML = "";
  (item.tags || []).forEach((t) => {
    const span = document.createElement("span");
    span.className = "badge rounded-pill bg-dark";
    span.textContent = t;
    chips.appendChild(span);
  });

  document.getElementById("qvDesc").innerText = item.desc;
  document.getElementById("qvLink").href = item.link;

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("quickViewModal"),
  ).show();
}

function renderCollections() {
  const grid = document.getElementById("collectionGrid");
  const resultCount = document.getElementById("resultCount");
  if (!grid || !resultCount) return;

  const items = COLLECTIONS.filter(passesFilter);
  resultCount.innerText = String(items.length);

  grid.innerHTML = "";
  items.forEach((item) => {
    const wished = isWished(item.id);

    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6";
    col.innerHTML = `
            <div class="card collection-card shadow-sm h-100">
              <div class="collection-img-wrap">
                <img src="${item.img}" alt="${item.title}" />
                <div class="collection-overlay"></div>

                <div class="position-absolute top-0 start-0 p-3">
                  <span class="badge bg-warning text-dark rounded-pill">${(item.tags && item.tags[0]) || "Collection"}</span>
                </div>

                <div class="position-absolute top-0 end-0 p-3">
                  <button class="btn btn-light wish-btn ${wished ? "active" : ""}" type="button" data-wish="${item.id}" title="Yêu thích">
                    <i class="bx ${wished ? "bxs-heart" : "bx-heart"} fs-5"></i>
                  </button>
                </div>

                <div class="position-absolute bottom-0 start-0 p-4 text-white">
                  <h4 class="fw-bold mb-1">${item.title}</h4>
                  <div class="small text-white-50">${item.subtitle}</div>
                </div>
              </div>

              <div class="card-body">
                <div class="d-flex flex-wrap gap-2 mb-3">
                  ${(item.tags || [])
                    .slice(0, 3)
                    .map(
                      (t) =>
                        `<span class="badge rounded-pill bg-light text-dark border">${t}</span>`,
                    )
                    .join("")}
                </div>

                <p class="text-muted mb-3" style="min-height:72px">${item.desc}</p>

                <div class="d-flex gap-2 flex-wrap">
                  <a href="${item.link}" class="btn btn-dark rounded-pill px-4">Xem sản phẩm</a>
                  <button class="btn btn-outline-dark rounded-pill px-4" type="button" data-qv="${item.id}">Xem nhanh</button>
                </div>
              </div>
            </div>
          `;
    grid.appendChild(col);
  });

  document.querySelectorAll("[data-qv]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-qv");
      const item = COLLECTIONS.find((x) => x.id === id);
      if (item) openQuickView(item);
    });
  });

  document.querySelectorAll("[data-wish]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-wish");
      toggleWish(id);
    });
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
  syncWishCount();
  renderCollections();

  const onChange = () => renderCollections();
  ["q", "fStyle", "fCat", "fPrice"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(id === "q" ? "input" : "change", onChange);
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    document.getElementById("q").value = "";
    document.getElementById("fStyle").value = "";
    document.getElementById("fCat").value = "";
    document.getElementById("fPrice").value = "";
    renderCollections();
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
    renderCollections();
  }
  if (e.key === "currentUser") syncHelloUI();
});

window.addEventListener("auth:changed", () => {
  syncHelloUI();
});
