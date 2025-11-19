

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#sidebar-nav ul li a');
    const sections = document.querySelectorAll('main section');
    const hudTitle = document.getElementById('hud-title');
    const hudPageIndicator = document.getElementById('hud-page-indicator');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarNav = document.getElementById('sidebar-nav');

    // Define the order of sections for the page indicator
    const sectionOrder = [
        { id: 'dashboard', title: 'DASHBOARD' },
        { id: 'about', title: 'ABOUT ME' },
        { id: 'projects', title: 'PROJECTS' },
        { id: 'contact', title: 'CONTACT' }
    ];

    // Function to show a specific section and hide others with transitions
    const showSection = (id) => {
        const currentActiveSection = document.querySelector('main section.active');
        if (currentActiveSection && currentActiveSection.id === id) {
            return; // Already on this section, do nothing
        }

        // Deactivate current active section (if any)
        if (currentActiveSection) {
            currentActiveSection.classList.remove('active');
            // Add a transitionend listener to hide the old section after its transition out
            const hideOldSection = () => {
                currentActiveSection.style.display = 'none';
                currentActiveSection.removeEventListener('transitionend', hideOldSection);
            };
            currentActiveSection.addEventListener('transitionend', hideOldSection, { once: true });
        }

        const targetSection = document.getElementById(id);
        if (targetSection) {
            targetSection.style.display = 'block'; // Make it block to start transition
            // Force reflow to ensure the browser registers the display: block before applying active
            targetSection.offsetHeight; 
            
            // Reset staggered elements' transition delays for the new section
            const staggeredElements = targetSection.querySelectorAll('.stagger-in');
            staggeredElements.forEach(element => {
                element.style.transitionDelay = '0s'; // Reset any previous delays
                // Force reflow for each element to ensure reset styles are applied
                element.offsetHeight;
            });

            // A small timeout to ensure the browser registers the reset styles before applying 'active'
            setTimeout(() => {
                targetSection.classList.add('active');

                // Re-apply staggered animation delays for elements within the active section
                staggeredElements.forEach((element, index) => {
                    element.style.transitionDelay = `${index * 0.1}s`; // 100ms delay per element
                });

            }, 50); // Small delay, increased for better transition reliability

            // Update HUD
            const sectionData = sectionOrder.find(s => s.id === id);
            if (sectionData) {
                hudTitle.textContent = `CURRENT MODULE: ${sectionData.title}`;
                const currentSectionIndex = sectionOrder.findIndex(s => s.id === id);
                hudPageIndicator.textContent = `${(currentSectionIndex + 1).toString().padStart(2, '0')} OF ${sectionOrder.length.toString().padStart(2, '0')}`;
            }
        }

        // Update active navigation link
        navLinks.forEach(link => {
            link.classList.remove('active-nav');
            if (link.getAttribute('href').substring(1) === id) {
                link.classList.add('active-nav');
            }
        });
    };

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            const targetId = link.getAttribute('href').substring(1); // Get section ID from href
            showSection(targetId);
            // Close sidebar after clicking a link on mobile
            if (sidebarNav.classList.contains('active')) {
                sidebarNav.classList.remove('active');
            }
        });

        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                showSection(targetId);
                if (sidebarNav.classList.contains('active')) {
                    sidebarNav.classList.remove('active');
                }
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const currentIndex = Array.from(navLinks).indexOf(link);
                let nextIndex = currentIndex;

                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % navLinks.length;
                } else if (e.key === 'ArrowUp') {
                    nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
                }
                navLinks[nextIndex].focus();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (sidebarNav.classList.contains('active')) {
                    sidebarNav.classList.remove('active');
                }
                const projectsLink = document.querySelector('#sidebar-nav a[href="#projects"]');
                if (projectsLink && document.querySelector('main section#projects').classList.contains('active')) {
                    const firstProjectItem = document.querySelector('.project-item');
                    if (firstProjectItem) {
                        firstProjectItem.focus();
                    }
                }
            }
        });
    });

    // Toggle sidebar on menu icon click
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebarNav.classList.toggle('active');
        });
    }

    // Show the dashboard section by default on load
    showSection('dashboard');

    // Set initial focus to the first navigation link
    navLinks[0].focus();
});
