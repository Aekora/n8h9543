function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        if (tab.classList.contains('active')) {
            tab.style.opacity = 0;
            setTimeout(() => {
                tab.classList.remove('active');
            }, 200);
        }
    });

    const activeTab = document.getElementById(tabId);
    setTimeout(() => {
        activeTab.classList.add('active');
        activeTab.style.opacity = 1;
    }, 200);

    document.querySelectorAll('.tabs a').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelector(`[href="#${tabId}"]`).classList.add('active');
}

function toggleSection(header) {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
    header.classList.toggle('active');
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, duration, price) {
    const existingItem = cart.find(item => item.id === productId && item.duration === duration);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = getProductDetails(productId);
        const cartItem = {
            id: productId,
            name: product.name,
            duration: duration,
            price: price,
            quantity: 1
        };
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartModal();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;
    cartCount.textContent = cart.length;
}

function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const product = getProductDetails(item.id);

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">
                    <div class="cart-item-duration">${item.duration}</div>
                    <div class="cart-item-price">${item.price}</div>
                    <div class="cart-item-quantity">Qty: ${item.quantity}</div>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">X</button>
        `;
        cartItems.appendChild(itemElement);
    });

    const totalPrice = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace('€', ''));
        return total + price * item.quantity;
    }, 0);

    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.innerHTML = `<strong>Total: \u20AC${totalPrice.toFixed(2)}</strong>`;
    cartItems.appendChild(totalElement);

    const checkoutButton = document.createElement('button');
    checkoutButton.className = 'checkout-button';
    checkoutButton.textContent = 'Proceed to Checkout';
    checkoutButton.onclick = () => window.location.href = 'checkout.html';
    cartItems.appendChild(checkoutButton);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    if (window.location.pathname.includes('checkout.html')) {
        displayCheckoutItems();
    } else {
        updateCartModal();
    }
}

function openCart() {
    const cartModal = document.getElementById('cart-modal');
    if (!cartModal) return;
    cartModal.style.display = 'flex';
}

function closeCart() {
    const cartModal = document.getElementById('cart-modal');
    if (!cartModal) return;
    cartModal.style.display = 'none';
}

function getProductDetails(productId) {
    const products = {
        'rust-cheat-software': {
            image: 'images/rust.png',
            name: 'Rust External',
            description: 'Undetected cheat software for Rust with advanced features. Enjoy aimbot, ESP, and more!',
            features: [
                'Works on Windows 10 & 11',
                'Intel/AMD',
                'Stream Proof',
                'No USB Required'
            ],
            durations: [
                { duration: '1 Day', price: '€7.99' },
                { duration: '3 Days', price: '€15.99' },
                { duration: '1 Week', price: '€29.99' },
                { duration: '1 Month', price: '€59.99' }
            ]
        },
        'fortnite-cheat-software': {
            image: 'images/fn.png',
            name: 'FN External',
            description: 'Premium cheat software for Fortnite with aimbot, ESP, and more!',
            features: [
                'Works on Windows 10 & 11',
                'Intel/AMD',
                'Stream Proof',
                'No USB Required'
            ],
            durations: [
                { duration: '1 Day', price: '€7.99' },
                { duration: '3 Days', price: '€15.99' },
                { duration: '1 Week', price: '€29.99' },
                { duration: '1 Month', price: '€59.99' }
            ]
        },
        'spoofer-software': {
            image: 'images/spoofer.png',
            name: 'HWID Spoofer',
            description: 'Spoof your hardware ID to bypass bans and stay undetected.',
            features: [
                'Works on Windows 10 & 11',
                'Intel/AMD',
                'Stream Proof',
                'No USB Required'
            ],
            durations: [
                { duration: '1 Time', price: '€20.00' },
                { duration: 'Lifetime', price: '€50.00' }
            ]
        }
    };
    return products[productId];
}

function openProductModal(productId) {
    const product = getProductDetails(productId);
    const modal = document.getElementById('product-modal');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductImage = document.getElementById('modal-product-image');
    const modalProductDescription = document.getElementById('modal-product-description');
    const durationButtons = document.getElementById('duration-buttons');
    const featureList = document.getElementById('feature-list');

    modalProductName.textContent = product.name;
    modalProductImage.src = product.image;
    modalProductDescription.textContent = product.description;

    durationButtons.innerHTML = '';

    product.durations.forEach(duration => {
        const button = document.createElement('button');
        button.className = 'duration-button';
        button.setAttribute('data-duration', duration.duration);
        button.setAttribute('data-price', duration.price);
        button.innerHTML = `
            <span class="duration">${duration.duration}</span>
            <span class="price">${duration.price}</span>
        `;
        button.addEventListener('click', handleDurationButtonClick);
        durationButtons.appendChild(button);
    });

    featureList.innerHTML = '';
    product.features.forEach(feature => {
        const featureItem = document.createElement('li');
        featureItem.textContent = feature;
        featureList.appendChild(featureItem);
    });

    modal.style.display = 'flex';
}

function handleDurationButtonClick(event) {
    const buttons = document.querySelectorAll('.duration-button');
    buttons.forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
}

function addToCartFromModal() {
    const productName = document.getElementById('modal-product-name').textContent;
    let productId;

    switch (productName) {
        case 'Rust External':
            productId = 'rust-cheat-software';
            break;
        case 'FN External':
            productId = 'fortnite-cheat-software';
            break;
        case 'HWID Spoofer':
            productId = 'spoofer-software';
            break;
        default:
            alert('Invalid product selected.');
            return;
    }

    const activeButton = document.querySelector('.duration-button.active');

    if (!activeButton) {
        alert('Please select a duration.');
        return;
    }

    const duration = activeButton.getAttribute('data-duration');
    const price = activeButton.getAttribute('data-price');

    addToCart(productId, duration, price);
    closeProductModal();
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none';
}

function displayCheckoutItems() {
    const checkoutItems = document.querySelector('#checkout-items tbody');
    const checkoutTotal = document.getElementById('checkout-total');

    if (!checkoutItems || !checkoutTotal) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    checkoutItems.innerHTML = '';

    cart.forEach((item, index) => {
        const product = getProductDetails(item.id);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" class="checkout-product-icon"></td>
            <td>
                <div class="product-name-duration">
                    <div class="product-name">${item.name}</div>
                    <div class="duration">${item.duration}</div>
                </div>
            </td>
            <td>
                <div class="price-label">Price</div>
                <div class="price-value">${item.price}</div>
            </td>
            <td>
                <div class="quantity-label">Quantity</div>
                <div class="quantity-value">${item.quantity}</div>
            </td>
            <td><button class="remove-item" onclick="removeFromCart(${index})">X</button></td>
        `;
        checkoutItems.appendChild(row);
    });

    const totalPrice = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace('€', ''));
        return total + price * item.quantity;
    }, 0);

    checkoutTotal.innerHTML = `<strong>Total: \u20AC${totalPrice.toFixed(2)}</strong>`;
}

function handlePaymentSelection() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const completePurchaseButton = document.getElementById('complete-purchase');
    const errorMessage = document.getElementById('error-message');

    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            if (method.checked) {
                completePurchaseButton.disabled = false;
                errorMessage.style.display = 'none';
            }
        });
    });

    completePurchaseButton.addEventListener('click', () => {
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!selectedPaymentMethod) {
            errorMessage.style.display = 'block';
            return;
        }

        completePurchaseButton.disabled = true;
        const loadingSpinner = document.getElementById('loading-spinner');
        loadingSpinner.style.display = 'block';

        setTimeout(() => {
            loadingSpinner.style.display = 'none';
            completePurchaseButton.disabled = false;

            const paymentMethod = selectedPaymentMethod.value;

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const totalAmount = cart.reduce((total, item) => {
                const price = parseFloat(item.price.replace('€', ''));
                return total + price * item.quantity;
            }, 0);

            window.location.href = `payment.html?method=${paymentMethod}&total=${totalAmount.toFixed(2)}`;
        }, 2000);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayCheckoutItems();
    handlePaymentSelection();
});