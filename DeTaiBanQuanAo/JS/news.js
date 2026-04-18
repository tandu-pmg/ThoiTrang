const CART_KEY = "cart";
const SAVE_KEY = "saved_posts";

const TAG_LABEL = {
  "xu-huong": "Xu hướng",
  "phoi-do": "Phối đồ",
  tips: "Tips",
  "san-pham": "Sản phẩm",
  "thong-bao": "Thông báo",
};

const POSTS = [
  {
    id: "p1",
    title: "Xu hướng tối giản: mặc đẹp mỗi ngày",
    tag: "xu-huong",
    date: "2024-10-01",
    img: "../IMG/unisex.png",
    excerpt:
      "Gợi ý phối đồ minimal — ít nhưng chất, phù hợp đi học, đi làm và dạo phố.",
    content: [
      "Tối giản không có nghĩa là nhàm chán. Điều quan trọng là form dáng chuẩn, chất liệu ổn và bảng màu trung tính.",
      "Gợi ý bảng màu: đen / trắng / be / navy. Chọn 2–3 màu chủ đạo để phối nhanh và đẹp.",
      "Thêm 1 món điểm nhấn vừa đủ như túi, đồng hồ hoặc kính mát để outfit hoàn thiện.",
    ],
  },
  {
    id: "p2",
    title: "3 công thức phối đồ cho nam",
    tag: "phoi-do",
    date: "2024-09-15",
    img: "../IMG/Jeansbasicregularfit.png",
    excerpt: "Đơn giản, dễ áp dụng, phù hợp nhiều dáng người.",
    content: [
      "Công thức 1: Áo thun + quần jean + sneaker.",
      "Công thức 2: Sơ mi + quần âu + giày da (đi làm/đi sự kiện).",
      "Công thức 3: Áo khoác + quần tối màu + phụ kiện tối giản.",
    ],
  },
  {
    id: "p3",
    title: "Chọn áo khoác mùa lạnh",
    tag: "san-pham",
    date: "2024-08-28",
    img: "../IMG/aokhoacgio2lop.png",
    excerpt: "Nên ưu tiên chất liệu gì? Form nào dễ mặc?",
    content: [
      "Ưu tiên áo có độ giữ ấm phù hợp và dễ layer: hoodie/len mỏng bên trong.",
      "Form vừa vặn (không quá bó) để dễ phối và di chuyển thoải mái.",
      "Màu trung tính giúp phối đồ nhanh hơn: đen, xám, navy, be.",
    ],
  },
  {
    id: "p4",
    title: "Chọn size chuẩn khi mua online",
    tag: "tips",
    date: "2024-07-18",
    img: "../IMG/boquanao.png",
    excerpt: "Gợi ý cách đo và chọn form phù hợp để giảm đổi trả.",
    content: [
      "Đo vòng ngực/vai/eo theo áo bạn hay mặc nhất.",
      "Đọc mô tả form: regular/oversize/slim và so với số đo cơ thể.",
      "Nếu bạn thích thoải mái: tăng 1 size hoặc chọn oversize.",
    ],
  },
  {
    id: "p5",
    title: "Thông báo: cập nhật chương trình ưu đãi",
    tag: "thong-bao",
    date: "2024-06-10",
    img: "../IMG/dalonbasic.png",
    excerpt:
      "Tổng hợp các thay đổi về mã giảm giá và chương trình trong tháng.",
    content: [
      "Các mã giảm giá có thể thay đổi theo thời điểm và danh mục.",
      "Theo dõi trang Khuyến mãi để cập nhật nhanh nhất.",
      "Nếu mã không áp dụng được, hãy kiểm tra điều kiện hoặc thử mã khác.",
    ],
  },

  {
    id: "p6",
    title: "Deal hot tuần này: Jeans basic & set basic",
    tag: "san-pham",
    date: "2026-04-05",
    img: "../IMG/Jeansbasicregularfit.png",
    excerpt:
      "Gợi ý 2 sản phẩm dễ phối, form cơ bản — mua 1 lần mặc được nhiều dịp.",
    content: [
      "Jeans regular fit là item “must-have” cho outfit nam: dễ phối áo thun/sơ mi/hoodie.",
      "Set basic giúp bạn tiết kiệm thời gian phối đồ, hợp đi chơi hoặc mặc thường ngày.",
      "Tip: phối cùng giày trắng và một món phụ kiện tối giản để tổng thể gọn gàng.",
    ],
  },
  {
    id: "p7",
    title: "Gợi ý phối đồ công sở: Váy xanh + blazer",
    tag: "phoi-do",
    date: "2026-04-05",
    img: "../IMG/vayxanhcongso.png",
    excerpt:
      "Công thức thanh lịch: váy xanh + blazer + giày mũi nhọn (hoặc loafer).",
    content: [
      "Chọn blazer màu trung tính (đen/xám/be) để dễ phối.",
      "Nếu muốn trẻ trung, thử sneaker trắng với váy xanh để tạo điểm nhấn casual.",
      "Phụ kiện gợi ý: đồng hồ mặt nhỏ hoặc túi mini tone trầm.",
    ],
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

function isSaved(id) {
  return loadSaved().includes(id);
}

function toggleSave(id) {
  const ids = loadSaved();
  const idx = ids.indexOf(id);
  if (idx >= 0) ids.splice(idx, 1);
  else ids.push(id);
  saveSaved(ids);
  syncSavedCount();
  toast("saveToast");
  render();
}

function syncSavedCount() {
  const el = document.getElementById("savedCount");
  if (el) el.innerText = String(loadSaved().length);
}

function toast(id) {
  const el = document.getElementById(id);
  if (!el || !window.bootstrap?.Toast) return;
  bootstrap.Toast.getOrCreateInstance(el, { delay: 1600 }).show();
}

function copyLink(post) {
  const fake = `${location.origin}${location.pathname}#${post.id}`;
  const doToast = () => toast("shareToast");

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fake).then(doToast).catch(doToast);
      return;
    }
  } catch {}
  doToast();
}

function toText(s) {
  return String(s || "").toLowerCase();
}

function getFiltered() {
  const q = toText(document.getElementById("q").value).trim();
  const tag = document.getElementById("fTag").value;
  const sort = document.getElementById("fSort").value;

  let items = POSTS.slice();

  if (tag) items = items.filter((p) => p.tag === tag);

  if (q) {
    items = items.filter((p) => {
      const blob = toText(
        [p.title, p.excerpt, (p.content || []).join(" ")].join(" "),
      );
      return blob.includes(q);
    });
  }

  if (sort === "newest") items.sort((a, b) => (a.date < b.date ? 1 : -1));
  if (sort === "oldest") items.sort((a, b) => (a.date > b.date ? 1 : -1));
  if (sort === "title")
    items.sort((a, b) => a.title.localeCompare(b.title, "vi"));

  return items;
}

function openPost(post) {
  document.getElementById("pmTitle").innerText = post.title;
  document.getElementById("pmTag").innerText = TAG_LABEL[post.tag] || post.tag;
  document.getElementById("pmDate").innerText = post.date;

  const img = document.getElementById("pmImg");
  img.src = post.img;
  img.alt = post.title;

  const c = document.getElementById("pmContent");
  c.innerHTML = (post.content || [])
    .map((p) => `<p class="mb-2">${p}</p>`)
    .join("");

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("postModal"),
  ).show();
}

function render() {
  const grid = document.getElementById("newsGrid");
  const resultCount = document.getElementById("resultCount");
  const view = document.getElementById("fView").value;
  if (!grid || !resultCount) return;

  const items = getFiltered();
  resultCount.innerText = String(items.length);

  grid.innerHTML = "";
  items.forEach((post) => {
    const saved = isSaved(post.id);

    const col = document.createElement("div");
    col.className = view === "list" ? "col-12" : "col-lg-4 col-md-6";

    col.innerHTML = `
            <div class="card news-card shadow-sm h-100 ${view === "list" ? "flex-md-row" : ""}">
              <img src="${post.img}" class="${view === "list" ? "w-100 w-md-40" : "w-100"}" alt="${post.title}" />
              <div class="card-body p-4 d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <div class="d-flex align-items-center gap-2 flex-wrap">
                    <span class="badge bg-dark rounded-pill tag-pill">${TAG_LABEL[post.tag] || post.tag}</span>
                    <span class="text-muted small">${post.date}</span>
                  </div>
                  <button class="btn btn-outline-dark bookmark-btn ${saved ? "active" : ""}" type="button" data-save="${post.id}" title="Lưu bài">
                    <i class="bi ${saved ? "bi-bookmark-fill" : "bi-bookmark"}"></i>
                  </button>
                </div>

                <h5 class="fw-bold mb-2">${post.title}</h5>
                <p class="text-muted ${view === "list" ? "" : "small"} mb-3">${post.excerpt}</p>

                <div class="mt-auto d-flex gap-2 flex-wrap">
                  <button class="btn btn-dark rounded-pill px-4" type="button" data-open="${post.id}">Đọc bài</button>
                  <button class="btn btn-outline-dark rounded-pill px-4" type="button" data-share="${post.id}">
                    <i class="bi bi-share me-1"></i> Chia sẻ
                  </button>
                </div>
              </div>
            </div>
          `;

    grid.appendChild(col);
  });

  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-open");
      const post = POSTS.find((p) => p.id === id);
      if (post) openPost(post);
    });
  });

  document.querySelectorAll("[data-share]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-share");
      const post = POSTS.find((p) => p.id === id);
      if (post) copyLink(post);
    });
  });

  document.querySelectorAll("[data-save]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-save");
      toggleSave(id);
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
  syncSavedCount();
  render();

  const onChange = () => render();
  ["q", "fTag", "fSort", "fView"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener(id === "q" ? "input" : "change", onChange);
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    document.getElementById("q").value = "";
    document.getElementById("fTag").value = "";
    document.getElementById("fSort").value = "newest";
    document.getElementById("fView").value = "grid";
    render();
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
    render();
  }
  if (e.key === "currentUser") syncHelloUI();
});

window.addEventListener("auth:changed", () => {
  syncHelloUI();
});
