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
            initMobileNav();
            // Set active nav item
            setActiveNavItem();
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('main').insertAdjacentHTML('afterend', data);
            // Update current year
            document.getElementById('currentYear').textContent = new Date().getFullYear();
        })
        .catch(error => console.error('Error loading footer:', error));
});

function initMobileNav() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const body = document.querySelector('body');
    const navmenu = document.querySelector('#navmenu');
    
    if (mobileNavToggle && navmenu) {
        // Remove any existing event listeners
        const newMobileNavToggle = mobileNavToggle.cloneNode(true);
        mobileNavToggle.parentNode.replaceChild(newMobileNavToggle, mobileNavToggle);
        
        // Handle mobile menu toggle
        newMobileNavToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            body.classList.toggle('mobile-nav-active');
            this.classList.toggle('bi-list');
            this.classList.toggle('bi-x');
        });

        // Handle dropdown menus
        const dropdownLinks = document.querySelectorAll('.navmenu .dropdown > a');
        dropdownLinks.forEach(link => {
            // Remove existing listeners
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', function(e) {
                if (window.innerWidth < 1200) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closest('.dropdown').classList.toggle('dropdown-active');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (body.classList.contains('mobile-nav-active') && 
                !e.target.closest('#navmenu') && 
                !e.target.closest('.mobile-nav-toggle')) {
                body.classList.remove('mobile-nav-active');
                newMobileNavToggle.classList.remove('bi-x');
                newMobileNavToggle.classList.add('bi-list');
            }
        });

        // Close mobile menu when clicking on a nav link (except dropdowns)
        navmenu.querySelectorAll('a:not(.dropdown > a)').forEach(link => {
            link.addEventListener('click', () => {
                if (body.classList.contains('mobile-nav-active')) {
                    body.classList.remove('mobile-nav-active');
                    newMobileNavToggle.classList.remove('bi-x');
                    newMobileNavToggle.classList.add('bi-list');
                }
            });
        });
    }
} 