// cart.js - الإصدار النهائي لكل الصفحات

class CartManager {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        console.log('Cart Manager initialized with items:', this.cartItems);
        this.init();
    }

    init() {
        console.log('Initializing cart manager...');
        this.updateCartBadge();
        
        if (this.isCartPage()) {
            this.setupCartPage();
        } else {
            this.setupProductPages();
        }
        
        this.setupNavbarCart();
        
        // إعادة ربط الأزرار بعد تحميل الصفحة
        setTimeout(() => {
            this.rebindCartButtons();
        }, 1000);
    }

    // التحقق إذا كنا في صفحة السلة
    isCartPage() {
        return window.location.pathname.includes('cart.html');
    }

    // تحديث الـ badge
    updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (!cartBadge) {
            console.log('Cart badge element not found');
            return;
        }

        const totalItems = this.getTotalItems();
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        console.log('Cart badge updated to:', totalItems);
    }

    // إضافة منتج للسلة
    addToCart(product) {
        console.log('Adding product to cart:', product);
        
        const existingItem = this.cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartBadge();
        this.showNotification('Product added to cart');
    }

    // إزالة منتج من السلة
    removeFromCart(productId) {
        const id = parseInt(productId);
        this.cartItems = this.cartItems.filter(item => {
            const itemId = typeof item.id === 'string' ? parseInt(item.id) : item.id;
            return itemId !== id;
        });
        
        this.saveCart();
        this.updateCartBadge();
        
        if (this.isCartPage()) {
            this.renderCart();
        }
        
        this.showNotification('Product removed from cart');
    }

    // تحديث كمية المنتج
    updateQuantity(productId, change) {
        const id = parseInt(productId);
        const item = this.cartItems.find(item => {
            const itemId = typeof item.id === 'string' ? parseInt(item.id) : item.id;
            return itemId === id;
        });
        
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCart();
            this.updateCartBadge();
            if (this.isCartPage()) {
                this.renderCart();
            }
        }
    }

    // الحصول على إجمالي العناصر
    getTotalItems() {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    // الحصول على المجموع الكلي
    getTotalPrice() {
        return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // حفظ السلة
    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        console.log('Cart saved to localStorage:', this.cartItems);
    }

    // إظهار إشعار
    showNotification(message) {
        // إزالة الإشعارات القديمة
        const oldNotifications = document.querySelectorAll('.cart-notification');
        oldNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            ">
                <i class="fas fa-check" style="margin-right: 8px;"></i>
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // إعداد صفحات المنتجات
    setupProductPages() {
        console.log('Setting up product pages...');
        
        // إضافة event listeners لأزرار إضافة إلى السلة
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-cart-btn')) {
                e.preventDefault();
                e.stopPropagation();
                
                const button = e.target.closest('.product-cart-btn');
                const productCard = button.closest('.product-card');
                
                if (productCard) {
                    const productId = productCard.getAttribute('data-id');
                    const productName = productCard.querySelector('.product-name')?.textContent || 'Product';
                    const priceElement = productCard.querySelector('.product-price-current');
                    const productPrice = priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;
                    const productImage = productCard.querySelector('img')?.src || '';
                    
                    const product = {
                        id: parseInt(productId) || Date.now(),
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    };
                    
                    console.log('Product cart button clicked:', product);
                    this.addToCart(product);
                }
            }
        });

        // إعادة ربط الأزرار بعد تحميل المحتوى
        this.rebindCartButtons();
    }

    // إعادة ربط أزرار الـ Cart
    rebindCartButtons() {
        console.log('Rebinding cart buttons...');
        const cartButtons = document.querySelectorAll('.product-cart-btn');
        console.log('Found cart buttons:', cartButtons.length);
        
        cartButtons.forEach(button => {
            // إزالة أي event listeners قديمة
            button.replaceWith(button.cloneNode(true));
        });

        // إعادة الحصول على الأزرار بعد الاستبدال
        const newCartButtons = document.querySelectorAll('.product-cart-btn');
        
        newCartButtons.forEach(button => {
            button.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const productCard = button.closest('.product-card');
                if (productCard) {
                    const productId = productCard.getAttribute('data-id');
                    const productName = productCard.querySelector('.product-name')?.textContent || 'Product';
                    const priceElement = productCard.querySelector('.product-price-current');
                    const productPrice = priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;
                    const productImage = productCard.querySelector('img')?.src || '';
                    
                    const product = {
                        id: parseInt(productId) || Date.now(),
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    };
                    
                    console.log('Rebound cart button clicked:', product);
                    this.addToCart(product);
                }
            };
        });
    }

    // إعداد صفحة السلة
    setupCartPage() {
        console.log('Setting up cart page...');
        this.renderCart();
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('.increase-btn')) {
                const button = e.target.closest('.increase-btn');
                const productId = button.getAttribute('data-id');
                this.updateQuantity(productId, 1);
            }
            
            if (e.target.closest('.decrease-btn')) {
                const button = e.target.closest('.decrease-btn');
                const productId = button.getAttribute('data-id');
                this.updateQuantity(productId, -1);
            }
            
            if (e.target.closest('.remove-btn')) {
                const button = e.target.closest('.remove-btn');
                const productId = button.getAttribute('data-id');
                this.removeFromCart(productId);
            }
            
            if (e.target.closest('#checkoutBtn') && !e.target.closest('#checkoutBtn').disabled) {
                e.preventDefault();
                alert('Thank you for your order! This is a demo checkout process.');
            }
        });
    }

    // عرض محتوى السلة
    renderCart() {
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartItemsCount = document.getElementById('cartItemsCount');
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (!cartItemsContainer) return;

        if (cartItemsCount) {
            const totalItems = this.getTotalItems();
            cartItemsCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
        }

        if (this.cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <p class="empty-cart-text">Your cart is empty</p>
                    <a href="index.html" class="continue-shopping-btn">Continue Shopping</a>
                </div>
            `;
            
            if (subtotalElement) subtotalElement.textContent = '$0.00';
            if (shippingElement) shippingElement.textContent = '$0.00';
            if (taxElement) taxElement.textContent = '$0.00';
            if (totalElement) totalElement.textContent = '$0.00';
            if (checkoutBtn) checkoutBtn.disabled = true;
            
            return;
        }

        cartItemsContainer.innerHTML = this.cartItems.map(item => `
            <div class="cart-item animate-fade-in" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x120?text=Product'">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-btn" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn increase-btn" data-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        const subtotal = this.getTotalPrice();
        const shipping = subtotal > 0 ? 5.99 : 0;
        const tax = subtotal * 0.1;
        const total = subtotal + shipping + tax;

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
        if (checkoutBtn) checkoutBtn.disabled = false;
    }

    // إعداد زر السلة في الـ navbar
    setupNavbarCart() {
        const cartBtn = document.querySelector('.cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                if (this.getTotalItems() === 0) {
                    e.preventDefault();
                    alert('Your cart is empty');
                }
            });
        }
    }
}

// تهيئة الـ Cart Manager بشكل عالمي مع تأخير للتأكد من تحميل الـ DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing cart manager...');
        window.cartManager = new CartManager();
    });
} else {
    console.log('DOM already loaded, initializing cart manager...');
    window.cartManager = new CartManager();
}

// إضافة أنيميشن للإشعارات
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// دالة مساعدة يمكن استدعاؤها من الصفحات الأخرى
window.resetCartButtons = function() {
    if (window.cartManager) {
        window.cartManager.rebindCartButtons();
    }
};