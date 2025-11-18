let cart = {};

        function toggleMenu() {
            const nav = document.getElementById('nav');
            nav.classList.toggle('active');
        }

        function toggleCart() {
            const sidebar = document.getElementById('cartSidebar');
            const overlay = document.getElementById('cartOverlay');
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        }

        function addToCart(item, price, image) {
            if (cart[item]) {
                cart[item].quantity++;
            } else {
                cart[item] = {
                    name: item,
                    price: price,
                    quantity: 1,
                    image: image
                };
            }
            updateCart();
            showNotification(`${item} added to cart!`);
        }

        function updateQuantity(item, change) {
            if (cart[item]) {
                cart[item].quantity += change;
                if (cart[item].quantity <= 0) {
                    delete cart[item];
                }
                updateCart();
            }
        }

        function removeFromCart(item) {
            delete cart[item];
            updateCart();
            showNotification(`${item} removed from cart`);
        }

        function updateCart() {
            const cartItems = document.getElementById('cartItems');
            const cartBadge = document.getElementById('cartBadge');
            const cartTotal = document.getElementById('cartTotal');
            const checkoutBtn = document.getElementById('checkoutBtn');
            
            const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
            const total = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            cartBadge.textContent = itemCount;
            cartTotal.textContent = `₹${total.toLocaleString()}`;
            
            if (itemCount === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Add some items to get started!</p>
                    </div>
                `;
                checkoutBtn.disabled = true;
            } else {
                checkoutBtn.disabled = false;
                cartItems.innerHTML = Object.values(cart).map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                            <div class="cart-item-controls">
                                <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">−</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                                <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        function checkout() {
            const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
            const total = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
            showNotification(`Checkout: ${itemCount} items - ₹${total.toLocaleString()}`);
            cart = {};
            updateCart();
            toggleCart();
        }

        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        function performSearch() {
            const query = document.getElementById('searchInput').value;
            if (query.trim()) {
                showNotification(`Searching for: ${query}`);
            } else {
                showNotification('Please enter a search term');
            }
        }

        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Close cart when clicking outside
        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('cartSidebar');
            const cartBtn = document.querySelector('.cart-btn');
            
            if (!sidebar.contains(e.target) && !cartBtn.contains(e.target) && sidebar.classList.contains('open')) {
                toggleCart();
            }
        });