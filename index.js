let cart = [];
let products = [];

async function loadProducts() {
    try {
        const response = await fetch("data.json");
        products = await response.json();
        console.log(products)
        displayProducts(products);
    } catch (error) {
        console.error(error)
    }
}

function displayProducts(products) {
    const productsList = document.getElementById("productsList");
    productsList.innerHTML = "";

    products.forEach((product, index) => {
        console.log(product);
        const div = document.createElement("div");
        div.className = "product-card"
        div.innerHTML = `
         <div class ="imgDiv">
          <img src="${product.image.mobile}" alt="" id ="productImg-${index}">
          <button onClick ="showItems(${index})" class ="addCartBtn" id ="addBtn-${index}"><img src="icon/icon-add-to-cart.svg" alt="" class ="addToCartIcon"> Add to Cart</button>

           <!-- Quantity Controls (hidden by default) -->
            <div class="quantity-controls" id="qtyControls-${index}" style="display: none;">
                <button class="qty-btn" onclick="decreaseQuantity('${index}')">
                  <img src="icon/icon-decrement-quantity.svg" alt="-">
                </button>
                <span class="qty-display" id="qty-${index}">1</span>
                <button class="qty-btn" onclick="increaseQuantity('${index}')">
                  <img src="icon/icon-increment-quantity.svg" alt="+">
                </button>
            </div>
         </div> 
         <p>${product.category}</p>
         <h3>${product.name}</h3>
         <p class ="price">$${product.price.toFixed(2)}</p>
        `
        productsList.appendChild(div)
    })
}



//let addCartBtn = document.querySelector(".addCartBtn");
//const cartItems = document.getElementById("cartItems");
//const cartItemsLists = document.getElementById("cartItemsLists")

function showItems(index) {
    const product = products[index];

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === index);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: `${index}`,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image.mobile,
            quantity: 1
        });
    }

    document.getElementById(`productImg-${index}`).style.border = "2px solid hsl(14, 86%, 42%)";
    document.getElementById(`addBtn-${index}`).style.display = 'none';
    document.getElementById(`qtyControls-${index}`).style.display = 'block';
    

    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const emptyCart = document.getElementById('emptyCart');
    const cartItemsList = document.getElementById('cartItemsList');
    const orderTotal = document.getElementById('orderTotal');
    const cartCount = document.getElementById('cartCount');
    
    // Clear cart list
    cartItemsList.innerHTML = '';
    
    
    // If cart is empty
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        orderTotal.style.display = 'none';
        cartCount.textContent = '0';
        return;
    }
    
    // Hide empty state, show cart
    emptyCart.style.display = 'none';
    orderTotal.style.display = 'block';
    
    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;
    
    // Display each cart item
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `  
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-details">
                    <span class="cart-qty">${item.quantity}x</span>
                    <span class="cart-unit-price">@ $${item.price.toFixed(2)}</span>
                    <span class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
            <div><button class="remove-btn" onclick="removeFromCart('${item.id}')">
                <img src="icon/icon-remove-item.svg" alt="Remove">
            </button>
        `;
        
        cartItemsList.appendChild(cartItemDiv);
        const line = document.createElement('hr');
        line.className = 'line'
        cartItemsList.appendChild(line);
    });
    
    // Update cart count and total price
    cartCount.textContent = totalItems;
    document.getElementById('totalPrice').textContent = `$${totalPrice.toFixed(2)}`;
}



// Increase quantity
function increaseQuantity(index) {
    const cartItem = cart.find(item => item.id === index);
    
    if (cartItem) {
        cartItem.quantity += 1;
        document.getElementById(`qty-${index}`).textContent = cartItem.quantity;
        updateCartDisplay();
    }
}

// Decrease quantity
function decreaseQuantity(index) {
    const cartItem = cart.find(item => item.id === index);
    
    if (cartItem) {
        cartItem.quantity -= 1;
        
        if (cartItem.quantity === 0) {
            // Remove from cart
            removeFromCart(index);
        } else {
            // Update quantity display
            document.getElementById(`qty-${index}`).textContent = cartItem.quantity;
            updateCartDisplay();
        }
    }
}

// Remove item from cart
function removeFromCart(index) {
    // Remove from cart array
    cart = cart.filter(item => item.id !== index);
    
    // Show "Add to Cart" button, hide quantity controls and hide the product border line
    document.getElementById(`productImg-${index}`).style.border = 'none';
    document.getElementById(`addBtn-${index}`).style.display = 'flex';
    document.getElementById(`qtyControls-${index}`).style.display = 'none';
    
    updateCartDisplay();
}



// Show confirmation modal
function showConfirmationModal() {
    const modal = document.getElementById('confirmModal');
    const confirmedItemsList = document.getElementById('confirmedItemsList');
    const modalTotalPrice = document.getElementById('modalTotalPrice');
    
    // Clear previous items
    confirmedItemsList.innerHTML = '';
    
    let totalPrice = 0;
    
    // Display each item in the modal
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'confirmed-item';
        itemDiv.innerHTML = `
            <div class="confirmed-item-left">
                <img src="${item.image}" alt="${item.name}" class="confirmed-item-image">
                <div class="confirmed-item-details">
                    <h4>${item.name}</h4>
                    <div class="confirmed-item-price">
                        <span class="confirmed-qty">${item.quantity}x</span>
                        <span class="confirmed-unit-price">@ $${item.price.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <span class="confirmed-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        
        confirmedItemsList.appendChild(itemDiv);
        const line = document.createElement('hr');
        line.className = 'comfirmedLine'
        confirmedItemsList.appendChild(line);
    });
    
    // Update total
    modalTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}



// Start new order (reset everything)
function startNewOrder() {
    // Clear cart array
    cart = [];
    
    // Reset all product buttons
    products.forEach((product, index) => {
        const addBtn = document.getElementById(`addBtn-${index}`);
        const qtyControls = document.getElementById(`qtyControls-${index}`);
        
        if (addBtn && qtyControls) {
            document.getElementById(`productImg-${index}`).style.border = "none";
            addBtn.style.display = 'flex';
            qtyControls.style.display = 'none';
            qtyControls.innerHTML = `
                <button class="qty-btn" onclick="decreaseQuantity('${index}')">
                  <img src="icon/icon-decrement-quantity.svg" alt="-">
                </button>
                <span class="qty-display" id="qty-${index}">1</span>
                <button class="qty-btn" onclick="increaseQuantity('${index}')">
                  <img src="icon/icon-increment-quantity.svg" alt="+">
                </button>
            `;
        }
    });
    
    // Update cart display
    updateCartDisplay();
    
    // Hide modal
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('confirmModal');
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}






loadProducts();

