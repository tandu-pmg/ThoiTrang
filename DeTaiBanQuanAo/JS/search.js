function getKeywordFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("keyword") || "";
}

function removeVietnameseTones(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function updateSearchInput(keywordRaw) {
  const input = document.getElementById("searchInput");
  if (input) input.value = keywordRaw;
}

function updateURLKeyword(keywordRaw) {
  const params = new URLSearchParams(window.location.search);
  if (keywordRaw) {
    params.set("keyword", keywordRaw);
  } else {
    params.delete("keyword");
  }
  const query = params.toString();
  const newUrl = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState({}, "", newUrl);
}

function applySearch(keywordRaw) {
  const keyword = removeVietnameseTones(keywordRaw).trim();
  const products = document.querySelectorAll("#product-grid .product-item");
  let found = false;

  products.forEach((product) => {
    const name = removeVietnameseTones(
      product.querySelector(".proName")?.innerText || "",
    );
    const category = removeVietnameseTones(
      product.querySelector(".proList")?.innerText || "",
    );
    const dataCategory = removeVietnameseTones(
      product.getAttribute("data-category") || "",
    );

    const isMatch =
      !keyword ||
      name.includes(keyword) ||
      category.includes(keyword) ||
      dataCategory.includes(keyword);
    product.style.display = isMatch ? "" : "none";
    if (isMatch) found = true;
  });

  const emptyState = document.getElementById("empty-state");
  if (emptyState) {
    emptyState.classList.toggle("d-none", found);
  }

  const noResultMessage = document.querySelector(
    "#product-grid .no-results-message",
  );
  if (!found) {
    if (!noResultMessage) {
      const message = document.createElement("div");
      message.className = "no-results-message col-12 text-center py-5";
      message.innerHTML =
        "<p class='text-muted'>Không tìm thấy sản phẩm phù hợp.</p>";
      document.getElementById("product-grid")?.appendChild(message);
    }
  } else if (noResultMessage) {
    noResultMessage.remove();
  }
}

function searchProducts(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  const input = document.getElementById("searchInput");
  const keywordRaw = (input ? input.value : getKeywordFromURL() || "").trim();
  updateURLKeyword(keywordRaw);
  applySearch(keywordRaw);
  return false;
}

window.addEventListener("load", function () {
  const keywordRaw = getKeywordFromURL().trim();
  updateSearchInput(keywordRaw);
  if (keywordRaw) {
    applySearch(keywordRaw);
  }
});
function removeVietnameseTones(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function applySearch(keywordRaw) {
  const keyword = removeVietnameseTones(keywordRaw).trim();
  const products = document.querySelectorAll("#product-grid .product-item");
  let found = false;

  products.forEach((product) => {
    // Lấy tên và danh mục
    const name = removeVietnameseTones(
      product.querySelector(".proName")?.innerText || "",
    );
    const proList = removeVietnameseTones(
      product.querySelector(".proList")?.innerText || "",
    );
    const dataCategory = removeVietnameseTones(
      product.getAttribute("data-category") || "",
    );

    // Ghép mọi khía cạnh lại 1 chuỗi lớn (tên, danh mục, loại)
    const allText = `${name} ${proList} ${dataCategory}`;

    // So khớp với keyword
    const isMatch = !keyword || allText.includes(keyword);

    product.style.display = isMatch ? "" : "none";
    if (isMatch) found = true;
  });

  // Ẩn hiện khung trạng thái không có kết quả
  const emptyState = document.getElementById("empty-state");
  if (emptyState) emptyState.classList.toggle("d-none", found);

  // Xử lý hiện/ẩn thông báo không tìm thấy trong #product-grid
  const noResultMessage = document.querySelector(
    "#product-grid .no-results-message",
  );
  if (!found) {
    if (!noResultMessage) {
      const message = document.createElement("div");
      message.className = "no-results-message col-12 text-center py-5";
      message.innerHTML =
        "<p class='text-muted'>Không tìm thấy sản phẩm phù hợp.</p>";
      document.getElementById("product-grid")?.appendChild(message);
    }
  } else if (noResultMessage) {
    noResultMessage.remove();
  }
}

function searchProducts(event) {
  if (event && event.preventDefault) event.preventDefault();
  const input = document.getElementById("searchInput");
  const keywordRaw = (input ? input.value : "").trim();
  applySearch(keywordRaw);
  return false;
}

// Nếu muốn auto lọc lại sau khi reload trang (nếu box search có value)
window.addEventListener("load", function () {
  const input = document.getElementById("searchInput");
  if (input && input.value) {
    applySearch(input.value);
  }
});
