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
            // Set active nav item
            setActiveNavItem();
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('main').insertAdjacentHTML('afterend', data);
        })
        .catch(error => console.error('Error loading footer:', error));
});

function initMobileMenu() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navmenu = document.querySelector('#navmenu');
    
    if (mobileNavToggle && navmenu) {
        // Handle mobile menu toggle
        mobileNavToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('mobile-nav-active');
            navmenu.classList.toggle('navbar-mobile');
            this.classList.toggle('bi-list');
            this.classList.toggle('bi-x');
        });

        // Handle dropdown menus
        const dropdownLinks = document.querySelectorAll('.navmenu .dropdown > a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (document.body.classList.contains('mobile-nav-active')) {
                    e.preventDefault();
                    this.closest('.dropdown').classList.toggle('dropdown-active');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (document.body.classList.contains('mobile-nav-active') && 
                !e.target.closest('#navmenu') && 
                !e.target.closest('.mobile-nav-toggle')) {
                document.body.classList.remove('mobile-nav-active');
                navmenu.classList.remove('navbar-mobile');
                mobileNavToggle.classList.remove('bi-x');
                mobileNavToggle.classList.add('bi-list');
            }
        });
    }
} 