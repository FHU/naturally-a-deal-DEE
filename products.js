const API_URL = "naturally_a_deal_products.json";
const CATEGORIES = ["Frozen", "Dry", "Refrigerated"];

async function fetchProducts() {
  const result = await fetch(API_URL);
  const data = await result.json();

  const products = [];
  for (const raw of data) {
    const product = normalize(raw);

    if (product.product_name && Number.isFinite(product.price)) {
      products.push(product);
    }
  }
  return products;
}

function makeCard(product) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  // Becomes data-product-id="..." on the <li>, so code like an "Add to cart"
  // handler can tell which product a card belongs to.
  card.dataset.productId = product.product_id;

  const media = card.querySelector(".media");
  const img = card.querySelector("img");
  media.dataset.initial = product.product_name.charAt(0);
  img.addEventListener("error", () => media.classList.add("no-img"));
  if (product.image_url) {
    img.src = product.image_url;
    img.alt = product.product_name;
  } else {
    media.classList.add("no-img");
  }

  const storage = card.querySelector(".storage");
  storage.textContent = product.storage_type;
  storage.dataset.type = product.storage_type;
  storage.hidden = !product.storage_type;

  const pack = card.querySelector(".pack");
  pack.textContent = product.package_size
    ? `Case · ${product.package_size}`
    : "";
  pack.hidden = !product.package_size;

  const name = card.querySelector(".name a");
  name.href = product.source_url;
  name.textContent = product.product_name;

  card.querySelector(".amount").innerHTML = formatPrice(product.price);
  card.querySelector(".unit").textContent = product.unit_price
    ? `($${product.unit_price})`
    : "";

  const date = card.querySelector(".date");
  date.textContent = dateText(product);
  date.hidden = !date.textContent;

  card
    .querySelector(".add")
    .setAttribute("aria-label", `Add ${product.product_name} to cart`);
  return card;
}

async function loadProducts() {
  const products = await fetchProducts();

  for (const category of CATEGORIES) {
    const items = products.filter((product) => product.category === category);
    if (items.length === 0) {
      continue;
    }

    const cards = [];
    for (const product of items) {
      cards.push();
    }
  }
}
