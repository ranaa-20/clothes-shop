// navbar.js

// نظام الترجمة للنافبار
const navbarTranslations = {
    en: {
        women: "Women",
        men: "Men", 
        girls: "Girls",
        boys: "Boys",
        babies: "Babies",
        offers: "Offers"
    },
    ar: {
        women: "نسائي",
        men: "رجالي",
        girls: "بنات", 
        boys: "أولاد",
        babies: "أطفال",
        offers: "العروض"
    }
};

// دالة لعمل الـ Navbar
function createNavbar(currentLang = 'en') {
    const t = navbarTranslations[currentLang];
    
    return `
    <nav class="navbar">
        <div class="nav-container">
            <!-- Logo -->
            <a href="index.html" class="nav-logo">
                STYLE<span>SHOP</span>
            </a>

            <!-- Desktop Navigation -->
            <div class="nav-menu">
                <a href="women.html" class="nav-link" data-translate="women">${t.women}</a>
                <a href="men.html" class="nav-link" data-translate="men">${t.men}</a>
                <a href="girls.html" class="nav-link" data-translate="girls">${t.girls}</a>
                <a href="boys.html" class="nav-link" data-translate="boys">${t.boys}</a>
                <a href="babies.html" class="nav-link" data-translate="babies">${t.babies}</a>
                <a href="offers.html" class="nav-link" data-translate="offers">${t.offers}</a>
            </div>

            <!-- Right side elements -->
            <div class="nav-right">
                <!-- Dark Mode Toggle -->
                <button class="dark-mode-btn" id="darkModeBtn">
                    <i class="fas fa-moon"></i>
                </button>

                <!-- Language Button -->
                <button class="language-btn" id="languageBtn">
                    <span class="lang-text">${currentLang === 'en' ? 'AR' : 'EN'}</span>
                    <i class="fas fa-globe"></i>
                </button>

                <!-- Cart Icon with Badge -->
                <a href="cart.html" class="cart-btn">
                    <i class="fas fa-shopping-bag"></i>
                    <span class="cart-badge" id="cartBadge">0</span>
                </a>
            </div>

            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-btn" id="mobileMenuBtn">
                <i class="fas fa-bars"></i>
            </button>
        </div>

        <!-- Mobile Menu -->
        <div class="mobile-menu" id="mobileMenu">
            <div class="mobile-links">
                <a href="women.html" class="mobile-link" data-translate="women">${t.women}</a>
                <a href="men.html" class="mobile-link" data-translate="men">${t.men}</a>
                <a href="girls.html" class="mobile-link" data-translate="girls">${t.girls}</a>
                <a href="boys.html" class="mobile-link" data-translate="boys">${t.boys}</a>
                <a href="babies.html" class="mobile-link" data-translate="babies">${t.babies}</a>
                <a href="offers.html" class="mobile-link" data-translate="offers">${t.offers}</a>
            </div>
        </div>
    </nav>
    `;
}

// دالة لتحديث النافبار عند تغيير اللغة
function updateNavbarLanguage(lang) {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = createNavbar(lang);
        // إعادة ربط الأحداث بعد تحديث النافبار
        attachNavbarEvents();
    }
}

// دالة لربط الأحداث في النافبار
function attachNavbarEvents() {
    // إعداد القائمة المتنقلة
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.style.display === 'block';
            mobileMenu.style.display = isOpen ? 'none' : 'block';
            mobileMenuBtn.innerHTML = isOpen ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
        });
    }
    
    // إضافة مستمعي الأحداث للأزرار
    const languageBtn = document.getElementById('languageBtn');
    if (languageBtn) {
        languageBtn.addEventListener('click', function() {
            // إرسال حدث لتغيير اللغة في الصفحة الرئيسية
            const event = new CustomEvent('languageToggle');
            document.dispatchEvent(event);
        });
    }
    
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', function() {
            // إرسال حدث لتغيير الوضع الداكن في الصفحة الرئيسية
            const event = new CustomEvent('darkModeToggle');
            document.dispatchEvent(event);
        });
    }
}

// دالة علشان نحط الـ Navbar في الصفحة
function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        navbarContainer.innerHTML = createNavbar(savedLang);
        attachNavbarEvents();
    }
}

// لما الصفحه تتحمل، ننادي loadNavbar
document.addEventListener('DOMContentLoaded', loadNavbar);