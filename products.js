
async function loadProducts() {
    try {
        // Fetch JSON file
        const response = await fetch("naturally_a_deal_products.json");

        if (!response.ok) {
            throw new Error("Could not load products.json");
        }

        const data = await response.json();

        // Group products by storage type
        const groups = groupProducts(data);

        // Display products
        displayProducts(groups);

    } catch (error) {
        console.error("Error loading products:", error);
    }
}


// Group products by storage type

function groupProducts(products) {
    const groups = {};

    // Categories that should be moved out of Dry
    const nonFoodCategories = [
        "General Merchandise",
        "Garden Seeds",
        "Gardening Supplies",
        "Kitchen Items",
        "Soap & Skincare",
        "Health & Beauty Aids",
        "Pet Food & Supplies",
        "Livestock Feed",
        "Clearance - Other",
        "Essential Oils"
    ];

    products.forEach(product => {

        // Start with the original storage type
        let category = product.storage_type || "Other";
        const productCategory = product.categories || ""

        if (productCategory.startsWith("Featured Products")) {
            category = "Featured Products";
        }

        // Move non-food Dry products into Other
        else if (
            category === "Dry" &&
            nonFoodCategories.includes(productCategory) ||
            productCategory.startsWith("Book") ||
            productCategory.startsWith("Household")
        ) {
            category = "Other";
        }



        // Create category if it doesn't exist
        if (!groups[category]) {
            groups[category] = [];
        }

        // Add product to its category
        groups[category].push(product);
    });

    return groups;
}



// Display product categories and cards
function displayProducts(groups) {
    const container = document.getElementById("product-container");
    const categoryTemplate = document.getElementById("category-template");
    const productTemplate = document.getElementById("product-template");

    container.innerHTML = "";

    // Sort categories, keeping Featured Products first and Other last
    const categories = Object.keys(groups).sort((a, b) => {
        if (a === "Featured Products") return -1;
        if (b === "Featured Products") return 1;

        if (a === "Other") return 1;
        if (b === "Other") return -1;

        return a.localeCompare(b);
    });

    categories.forEach(category => {
        const categoryClone = categoryTemplate.content.cloneNode(true);

        categoryClone.querySelector(".category-title").textContent = category;

        const itemsContainer = categoryClone.querySelector(".items");

        groups[category].forEach(product => {
            const productClone = productTemplate.content.cloneNode(true);

            productClone.querySelector(".product-image").src = product.image_url;
            productClone.querySelector(".product-image").alt = product.product_name;
            productClone.querySelector(".title").textContent = product.product_name;
            productClone.querySelector(".price").textContent =
                `$${Number(product.price).toFixed(2)}`;
            productClone.querySelector(".unit").textContent = product.package_size;
            productClone.querySelector(".date").textContent =
                product.best_by_date || product.date_label || "-";

            productClone.querySelector(".cart-button").dataset.productId =
                product.product_id;

            itemsContainer.appendChild(productClone);
        });

        container.appendChild(categoryClone);
    });
}


// Load products when page opens
loadProducts();