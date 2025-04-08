document.addEventListener('DOMContentLoaded', function() {
    // Dados dos produtos
    const products = [
        {
            id: 1,
            title: "Smartphone Ultra X",
            category: "Smartphones",
            price: 3499.99,
            rating: "★★★★★",
            image: "images/produto1.jpg",
            description: "O mais avançado smartphone com câmera tripla e processador de última geração."
        },
        {
            id: 2,
            title: "Fone de Ouvido Pro",
            category: "Áudio",
            price: 899.99,
            rating: "★★★★☆",
            image: "images/produto2.jpg",
            description: "Cancelamento de ruído ativo com som surround imersivo."
        },
        {
            id: 3,
            title: "Notebook Elite",
            category: "Computadores",
            price: 5299.99,
            rating: "★★★★★",
            image: "images/produto3.jpg",
            description: "Desempenho excepcional para trabalho e jogos com tela 4K."
        },
        {
            id: 4,
            title: "Smartwatch Health+",
            category: "Wearables",
            price: 1299.99,
            rating: "★★★★☆",
            image: "images/produto4.jpg",
            description: "Monitoramento avançado de saúde e atividade física."
        },
        {
            id: 5,
            title: "Tablet Vision",
            category: "Tablets",
            price: 2299.99,
            rating: "★★★☆☆",
            image: "images/produto5.jpg",
            description: "Tela AMOLED de 10.5 polegadas com caneta stylus incluída."
        },
        {
            id: 6,
            title: "Caixa de Som Beat",
            category: "Áudio",
            price: 599.99,
            rating: "★★★★★",
            image: "images/produto6.jpg",
            description: "Som potente com 20W de potência e conectividade Bluetooth 5.0."
        }
    ];

    // Carrinho de compras
    let cart = [];
    
    // Elementos do DOM
    const productsGrid = document.querySelector('.products-grid');
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');
    const overlay = document.querySelector('.overlay');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    // Slider de hero
    const slides = document.querySelectorAll('.slide');
    const prevSlideBtn = document.querySelector('.prev-slide');
    const nextSlideBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    
    // Renderizar produtos
    function renderProducts() {
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                    <div class="product-rating">${product.rating}</div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                        <button class="wishlist"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', addToCart);
        });
        
        document.querySelectorAll('.wishlist').forEach(btn => {
            btn.addEventListener('click', toggleWishlist);
        });
    }
    
    // Adicionar ao carrinho
    function addToCart(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        // Verificar se o produto já está no carrinho
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Animação de confirmação
        const btn = e.target;
        btn.textContent = 'Adicionado!';
        btn.style.backgroundColor = 'var(--success-color)';
        
        setTimeout(() => {
            btn.textContent = 'Adicionar ao Carrinho';
            btn.style.backgroundColor = 'var(--primary-color)';
        }, 1000);
    }
    
    // Atualizar carrinho
    function updateCart() {
        // Atualizar contador
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Atualizar sidebar do carrinho
        renderCartItems();
        
        // Atualizar total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
    
    // Renderizar itens do carrinho
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            return;
        }
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Adicionar eventos aos controles de quantidade
        document.querySelectorAll('.decrease').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.increase').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
    }
    
    // Aumentar quantidade
    function increaseQuantity(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += 1;
            updateCart();
        }
    }
    
    // Diminuir quantidade
    function decreaseQuantity(e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const item = cart.find(item => item.id === productId);
        
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            updateCart();
        }
    }
    
    // Remover item
    function removeItem(e) {
        const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }
    
    // Alternar wishlist
    function toggleWishlist(e) {
        const btn = e.target.closest('button');
        btn.innerHTML = btn.innerHTML.includes('far') ? 
            '<i class="fas fa-heart" style="color: var(--danger-color)"></i>' : 
            '<i class="far fa-heart"></i>';
    }
    
    // Slider de hero
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) newIndex = 0;
        showSlide(newIndex);
    }
    
    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = slides.length - 1;
        showSlide(newIndex);
    }
    
    // Iniciar slider automático
    let slideInterval = setInterval(nextSlide, 5000);
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Event listeners
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeCartBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    
    function closeCart() {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    checkoutBtn.addEventListener('click', () => {
        alert('Compra finalizada com sucesso! Obrigado por sua compra.');
        cart = [];
        updateCart();
        closeCart();
    });
    
    nextSlideBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    prevSlideBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        // Simular envio
        this.querySelector('input').value = '';
        alert(`Obrigado por assinar nossa newsletter! Um e-mail foi enviado para ${email}`);
    });
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simular envio
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        this.reset();
    });
    
    // Smooth scrolling para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Inicializar
    renderProducts();
    showSlide(0);
});
const products = [
    {
        id: 1,
        title: "Smartphone Ultra X Pro",
        category: "Smartphones",
        price: 4299.99,
        rating: "★★★★★",
        image: "images/smartphone.jpg",
        description: "Tela 6.7'' AMOLED, 256GB, Câmera Tripla 108MP"
    },
    {
        id: 2,
        title: "Fone de Ouvido Quantum",
        category: "Áudio",
        price: 1299.99,
        rating: "★★★★☆",
        image: "images/fone.jpg",
        description: "Cancelamento de ruído ativo, bateria 30h"
    },
    {
        id: 3,
        title: "Notebook Gamer Titan",
        category: "Computadores",
        price: 8999.99,
        rating: "★★★★★",
        image: "images/notebook.jpg",
        description: "RTX 4080, 32GB RAM, SSD 1TB, i9 13ª geração"
    },
    {
        id: 4,
        title: "Smartwatch Health Pro",
        category: "Wearables",
        price: 1599.99,
        rating: "★★★★☆",
        image: "images/smartwatch.jpg",
        description: "Monitor cardíaco, oxigenação, GPS integrado"
    },
    {
        id: 5,
        title: "Tablet Vision Pro",
        category: "Tablets",
        price: 3499.99,
        rating: "★★★★★",
        image: "images/tablet.jpg",
        description: "Tela 12.9'' 120Hz, caneta stylus incluída"
    },
    {
        id: 6,
        title: "Caixa de Som Beat Pro",
        category: "Áudio",
        price: 899.99,
        rating: "★★★★☆",
        image: "images/caixa-som.jpg",
        description: "100W RMS, Bluetooth 5.2, à prova d'água"
    },
    {
        id: 7,
        title: "TV OLED 8K 75''",
        category: "TVs",
        price: 12999.99,
        rating: "★★★★★",
        image: "images/tv.jpg",
        description: "Resolução 8K, HDR10+, Dolby Atmos"
    },
    {
        id: 8,
        title: "Câmera Mirrorless Pro",
        category: "Fotografia",
        price: 7999.99,
        rating: "★★★★★",
        image: "images/camera.jpg",
        description: "Sensor full-frame 45MP, 4K 60fps"
    },
    {
        id: 9,
        title: "Drone Aerial 4K",
        category: "Drones",
        price: 4599.99,
        rating: "★★★★☆",
        image: "images/drone.jpg",
        description: "Câmera 4K, 30min de voo, controle por GPS"
    },
    {
        id: 10,
        title: "Console Game Nova",
        category: "Games",
        price: 4499.99,
        rating: "★★★★★",
        image: "images/console.jpg",
        description: "1TB SSD, 4K 120Hz, controle sem fio"
    },
    {
        id: 11,
        title: "Roteador Wi-Fi 6",
        category: "Redes",
        price: 899.99,
        rating: "★★★★☆",
        image: "images/roteador.jpg",
        description: "AX6000, tri-band, 8 antenas"
    },
    {
        id: 12,
        title: "Monitor Gamer 32''",
        category: "Monitores",
        price: 3299.99,
        rating: "★★★★★",
        image: "images/monitor.jpg",
        description: "QHD 240Hz, 1ms, HDR600"
    },
    {
        id: 13,
        title: "Teclado Mecânico Pro",
        category: "Periféricos",
        price: 699.99,
        rating: "★★★★☆",
        image: "images/teclado.jpg",
        description: "Switches Red, RGB, anti-ghosting"
    },
    {
        id: 14,
        title: "Mouse Gamer Elite",
        category: "Periféricos",
        price: 499.99,
        rating: "★★★★★",
        image: "images/mouse.jpg",
        description: "25.000 DPI, sem fio, 70h bateria"
    },
    {
        id: 15,
        title: "Impressora 3D Pro",
        category: "Impressão",
        price: 5999.99,
        rating: "★★★★☆",
        image: "images/impressora.jpg",
        description: "Área 300x300x400mm, resolução 50 microns"
    }
];
// Adicione após a definição do array de produtos
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const resetFiltersBtn = document.getElementById('reset-filters');

function filterProducts() {
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;
    
    let filtered = products;
    
    if (category !== 'all') {
        filtered = filtered.filter(product => product.category === category);
    }
    
    if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        
        if (priceRange.endsWith('+')) {
            filtered = filtered.filter(product => product.price >= 6000);
        } else {
            filtered = filtered.filter(product => 
                product.price >= min && product.price <= max
            );
        }
    }
    
    renderFilteredProducts(filtered);
}

function renderFilteredProducts(filteredProducts) {
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">Nenhum produto encontrado com esses filtros</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <div class="product-rating">${product.rating}</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Adicionar</button>
                    <button class="wishlist"><i class="far fa-heart"></i></button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Reatribuir eventos
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.wishlist').forEach(btn => {
        btn.addEventListener('click', toggleWishlist);
    });
}

categoryFilter.addEventListener('change', filterProducts);
priceFilter.addEventListener('change', filterProducts);
resetFiltersBtn.addEventListener('click', () => {
    categoryFilter.value = 'all';
    priceFilter.value = 'all';
    filterProducts();
});
document.addEventListener('DOMContentLoaded', function() {
    // Array de produtos atualizado
    const products = [
        // Smartphones (3 em promoção)
        {
            id: 1,
            title: "Smartphone Ultra X Pro",
            category: "Smartphones",
            price: 4299.99,
            oldPrice: 4999.99,
            rating: "★★★★★",
            image: "images/smartphone1.jpg",
            description: "Tela 6.7'' AMOLED, 256GB, Câmera Tripla 108MP",
            isPromo: true
        },
        {
            id: 2,
            title: "Galaxy S24 Ultra",
            category: "Smartphones",
            price: 7599.99,
            rating: "★★★★★",
            image: "images/smartphone2.jpg",
            description: "S-Pen integrado, câmera 200MP, bateria 5000mAh"
        },
        {
            id: 3,
            title: "iPhone 15 Pro Max",
            category: "Smartphones",
            price: 8999.99,
            oldPrice: 9999.99,
            rating: "★★★★☆",
            image: "images/smartphone3.jpg",
            description: "Chip A17 Pro, câmera 48MP, iOS 17",
            isPromo: true
        },
        
        // Computadores (2 em promoção)
        {
            id: 4,
            title: "Notebook Gamer Titan",
            category: "Computadores",
            price: 8999.99,
            oldPrice: 10999.99,
            rating: "★★★★★",
            image: "images/notebook1.jpg",
            description: "RTX 4080, 32GB RAM, SSD 1TB, i9 13ª geração",
            isPromo: true
        },
        {
            id: 5,
            title: "PC Gamer Storm",
            category: "Computadores",
            price: 12999.99,
            rating: "★★★★☆",
            image: "images/pc1.jpg",
            description: "Ryzen 9 7900X, RTX 4090, 32GB DDR5, 2TB NVMe"
        },
        
        // Carregadores (1 em promoção)
        {
            id: 6,
            title: "Carregador Turbo 100W",
            category: "Carregadores",
            price: 299.99,
            oldPrice: 399.99,
            rating: "★★★★☆",
            image: "images/carregador1.jpg",
            description: "4 portas USB-C, carregamento rápido PD 3.0",
            isPromo: true
        },
        
        // Fones (2 em promoção)
        {
            id: 7,
            title: "Fone Quantum Elite",
            category: "Fones",
            price: 1299.99,
            oldPrice: 1599.99,
            rating: "★★★★★",
            image: "images/fone1.jpg",
            description: "Cancelamento de ruído ativo, bateria 30h",
            isPromo: true
        },
        {
            id: 8,
            title: "Fone Esportivo Bluetooth",
            category: "Fones",
            price: 349.99,
            rating: "★★★★☆",
            image: "images/fone4.jpg",
            description: "À prova d'água, 12h bateria, design ergonômico"
        },
        
        // Monitores (1 em promoção)
        {
            id: 9,
            title: "Monitor Gamer 32'' QHD",
            category: "Monitores",
            price: 3299.99,
            oldPrice: 3999.99,
            rating: "★★★★★",
            image: "images/monitor1.jpg",
            description: "240Hz, 1ms, HDR600, curva 1500R",
            isPromo: true
        }
    ];

    // Função para calcular desconto
    function calculateDiscount(price, oldPrice) {
        return Math.round(100 - (price / oldPrice * 100));
    }

    // Renderizar promoções
    function renderPromotions() {
        const promoGrid = document.querySelector('.promo-grid');
        const promoProducts = products.filter(product => product.isPromo);
        
        promoGrid.innerHTML = '';
        
        promoProducts.forEach(product => {
            const discount = product.oldPrice ? calculateDiscount(product.price, product.oldPrice) : 0;
            
            const promoCard = document.createElement('div');
            promoCard.className = 'promo-card';
            promoCard.innerHTML = `
                ${product.oldPrice ? `<span class="promo-badge">${discount}% OFF</span>` : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating">${product.rating}</div>
                    <div class="product-price">
                        <span class="current-price">R$ ${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `
                            <span class="old-price">R$ ${product.oldPrice.toFixed(2)}</span>
                            <span class="discount">-${discount}%</span>
                        ` : ''}
                    </div>
                    <button class="btn add-to-cart" data-id="${product.id}">Comprar Agora</button>
                </div>
            `;
            
            promoGrid.appendChild(promoCard);
        });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.promo-card .add-to-cart').forEach(btn => {
            btn.addEventListener('click', addToCart);
        });
    }

    // Função de pesquisa
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filtered = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        renderFilteredProducts(filtered);
    });

    // Função de ordenação
    const sortSelect = document.getElementById('sort-by');
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        let sortedProducts = [...products];
        
        switch(sortValue) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sortedProducts.sort((a, b) => {
                    const aStars = a.rating.replace(/[^★]/g, '').length;
                    const bStars = b.rating.replace(/[^★]/g, '').length;
                    return bStars - aStars;
                });
                break;
            case 'newest':
                // Ordena por ID (simulando produtos mais recentes)
                sortedProducts.sort((a, b) => b.id - a.id);
                break;
        }
        
        renderFilteredProducts(sortedProducts);
    });

    // Inicialização
    renderProducts();
    renderPromotions();
    showSlide(0);

    // ... (restante do JavaScript anterior mantido)
});
document.addEventListener('DOMContentLoaded', function() {
    // Array de produtos exemplo
    const products = [
        {
            id: 1,
            title: "Smartphone Ultra X Pro",
            category: "Smartphones",
            price: 4299.99,
            rating: "★★★★★",
            image: "images/smartphone1.jpg",
            description: "Tela 6.7'' AMOLED, 256GB, Câmera Tripla 108MP"
        },
        {
            id: 2,
            title: "Notebook Gamer Titan",
            category: "Computadores",
            price: 8999.99,
            rating: "★★★★★",
            image: "images/notebook1.jpg",
            description: "RTX 4080, 32GB RAM, SSD 1TB, i9 13ª geração"
        },
        // Adicione mais produtos conforme necessário
    ];

    // Elementos do DOM
    const productsGrid = document.querySelector('.products-grid');

    // Função para renderizar produtos
    function renderProducts() {
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                    <div class="product-rating">${product.rating}</div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                        <button class="wishlist"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });

        // Adicionar eventos após renderizar
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', addToCart);
        });
    }

    // Função para adicionar ao carrinho
    function addToCart(e) {
        const productId = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === productId);
        
        // Lógica do carrinho (mantida igual)
        // ...
        
        console.log(`Produto adicionado: ${product.title}`);
    }

    // Inicialização
    renderProducts();
    // Restante do código...
});