const products = [
  {
    id: 1,
    name: "iphone 15 pro",
    price: 999,
    category: "phones",
    image:
      "https://www.mobalife.co.za/wp-content/uploads/2024/08/Iphone-15-Pro-Max.jpg",
    description: "The latest iPhone with amazing camera and performance",
  },
  {
    id: 2,
    name: "MacBook Air",
    price: 1199,
    category: "laptops",
    image:
      "https://www.istore.co.za/media/catalog/product/cache/7cbfd4bf9761b066f119e95af17e67c5/m/a/macbook_air_13_in_m3_midnight_pdp_image_position_1__wwen.jpg",
    description: "Lightweight laptop perfect for work and creativity",
  },
  {
    id: 3,
    name: "AirPods Pro",
    price: 249,
    category: "accessories",
    image:
      "https://www.digicape.co.za/image/cache/catalog/_products/2024/AirPods/AirPods_4/AirPods_4_1-1000x1000.jpg",
    description: "Wireless earbuds with noise cancellation",
  },
  {
    id: 4,
    name: "Samsung Galaxy S24",
    price: 899,
    category: "phones",
    image:
      "https://www.technomobi.co.za/media/catalog/product/cache/e2a07cde3e161746aa285b73c334c4ba/1/0/104073413_588bec06e9a74b43f487e76f293a522f.png",
    description: "Android phone with incredible features",
  },
  {
    id: 5,
    name: "Dell Laptop",
    price: 799,
    category: "laptops",
    image: "https://tech.co.za/wp-content/uploads/2024/09/Latitude-3450d.png",
    description: "Reliable laptop for everyday computing",
  },
  {
    id: 6,
    name: "Wireless Mouse",
    price: 49,
    category: "accessories",
    image:
      "https://5.imimg.com/data5/SELLER/Default/2022/10/PV/EV/WE/117485675/seenda-wireless-silent-mouse-with-usb-nano-receiver-1600-dpi-ambidextrous-pc-mac-laptop-black-500x500.jpg",
    description: "Ergonomic wireless mouse for productivity",
  },
];

// Setp 2 : creating our shopping cart
//This will store all items the customer whats to buy

let cart = [];

//Step 3: Get refrences to HTML elements
//This connects our Js to specific parts of our webpage

const cartCountElement = document.getElementById("cart-count");
const productsGrid = document.getElementById("products-grid");
const featuredProducts = document.getElementById("featured-products");

//Step 4: Utility function to format prices
//This will make a price look like "R999" instead of "999"

function formatPrice(price) {
  return "R" + price.toFixed(2);
}

function createProductCard(product) {
  return `
        <div class="product-card">
            <img src="${product.image}" alt="${
    product.name
  }" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCart(${
                      product.id
                    })"> Add to Cart </button>
                    <button class="btn btn-secondary btn-small" onclick="viewProducts(${
                      product.id
                    })"> View Details </button>
                </div>
            </div>
        </div>
    `;
}

function displayProducts(productsToShow = products) {
  if (productsGrid) {
    const productsHTML = productsToShow.map(createProductCard).join("");
    productsGrid.innerHTML = productsHTML;
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }

  console.log("cart now has", totalItems);
}

function updateQuantity(productID, newQuantity){
  const item = cart.find(item => item.id === productID)
  if(item){
    if(newQuantity <= 0){
      removeFromCart(productID)
    } else{
      item.quantity = newQuantity;
      updateCartCount();
      saveCart();
      displayCartItems();
      updateCartSummary();
    }
  }

}

function removeFromCart(productID){
  cart = cart.filter(item => item.id !== productID);
  updateCartCount()
  saveCart()
  displayCartItems()
  updateCartSummary()
  showNotification("Item removed from cart")
}

function createCartItemHTML(item){
  return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image"/>
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)}</p>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
          </div>
          <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        
        </div>
      
      
      
      
      </div>
  `
}

function displayCartItems(){
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCartElement = document.getElementById('empty-cart')

  if(!cartItemsContainer) return;

  if(cart.length === 0){
    cartItemsContainer.style.display = 'none';
    if(emptyCartElement) emptyCartElement.style.display = 'block';
    document.querySelector('.cart-summary').style.display = 'none';
  } else {
    cartItemsContainer.style.display = 'block';
    if(emptyCartElement) emptyCartElement.style.display = 'none';
    document.querySelector('.cart-summary').style.display = 'block';
    cartItemsContainer.innerHTML = cart.map(createCartItemHTML).join('');
  }
}

function updateCartSummary(){
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0  ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const subtotalElement = document.getElementById('cart-subtotal');
  const shippingElement = document.getElementById('cart-shipping');
  const taxElement = document.getElementById('cart-tax');
  const totalElement = document.getElementById('cart-total');

  if(subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
  if(shippingElement) shippingElement.textContent = shipping > 0 ? formatPrice(shipping) : 0;
  if(taxElement) taxElement.textContent = formatPrice(tax);
  if(totalElement) totalElement.textContent = formatPrice(total);
}

function goToCheckout(){
  if(cart.length === 0){
    alert('Your cart is empty!')
    return;
  }
  window.location.href = 'checkout.html'
}

function saveCart(){
  localStorage.setItem('techvibe-cart', JSON.stringify(cart))
}

function loadCart(){
  const savedCart = localStorage.getItem('techvibe-cart');
  if(savedCart){
    cart = JSON.parse(savedCart);
    updateCartCount()
    
  }
}

function showNotification(message){
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function addToCart(productID) {
   const product = products.find(p => p.id === productID);
  if(!product){
    console.error('Product not found')
    return;
  }

  const existingItem = cart.find(item => item.id === productID)
  if(existingItem){
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  updateCartCount();
  saveCart();
  showNotification(product.name + ' Added to cart!')
}

function viewProducts(productID) {
  const product = products.find((pro) => pro.id === productID);
  alert(
    "Product: " +
      product.name +
      "\nPrice: " +
      formatPrice(product.price) +
      "\nDescription: " +
      product.description
  );
}

function setupFilters() {
  //Get all filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");

  //Add click event to each button
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      //Remove 'active' class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      //Add 'clicked' class to clicked button
      this.classList.add("active");

      //Get category from the buttons dat-category attribute
      const category = this.getAttribute("data-category");

      //Filter products based on category
      let filteredProducts;
      if (category === "all") {
        filteredProducts = products;
      } else {
        filteredProducts = products.filter(
          (product) => product.category === category
        );
      }
      displayProducts(filteredProducts);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loading, Products");
  loadCart();
  displayProducts();
  setupFilters();
  if(document.getElementById('cart-items')){
    displayCartItems();
    updateCartSummary();
  }
});
