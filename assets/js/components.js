// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;

        // If this is the header, we need to set the active state
        if (elementId === 'header-placeholder') {
            setActiveNavItem();
        }
    } catch (error) {
        console.error(`Error loading component from ${componentPath}:`, error);
    }
}

// Function to set the active navigation item based on current page
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#navmenu a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Load components when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            // Initialize mobile menu after header is loaded
            initMobileMenu();
        });

    // Load footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('main').insertAdjacentHTML('afterend', data);
            // Update current year
            document.getElementById('currentYear').textContent = new Date().getFullYear();
        });
});

function initMobileMenu() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navmenu = document.querySelector('.navmenu');
    
    if (mobileNavToggle && navmenu) {
        mobileNavToggle.addEventListener('click', function(e) {
            navmenu.classList.toggle('navbar-mobile');
            this.classList.toggle('bi-list');
            this.classList.toggle('bi-x');
        });

        // Handle dropdowns in mobile view
        document.querySelectorAll('.navmenu .dropdown > a').forEach(item => {
            item.addEventListener('click', function(e) {
                if (navmenu.classList.contains('navbar-mobile')) {
                    e.preventDefault();
                    this.nextElementSibling.classList.toggle('dropdown-active');
                }
            });
        });
    }
} 