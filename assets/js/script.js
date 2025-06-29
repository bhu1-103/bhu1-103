// JavaScript for interactive elements and SPA-like navigation

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#sidebar-nav ul li a');
    const sections = document.querySelectorAll('main section');
    const homeBtn = document.querySelector('#home .btn');
    const hudTitle = document.getElementById('hud-title');
    const hudPageIndicator = document.getElementById('hud-page-indicator');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarNav = document.getElementById('sidebar-nav');

    // Define the order of sections for the page indicator
    const sectionOrder = [
        { id: 'home', title: 'HOME' },
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
    });

    // Toggle sidebar on menu icon click
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebarNav.classList.toggle('active');
        });
    }

    // Handle home button click
    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('projects'); // Navigate to projects section
        });
    }

    // Project Overlay Logic
    const projectItems = document.querySelectorAll('.project-item');
    const projectOverlay = document.getElementById('project-overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayDescription = document.getElementById('overlay-description');
    const closeButton = document.querySelector('.close-button');

    const projectDetails = {
        'automated-game-player': {
            title: 'Automated Game Player',
            description: 'Designed a servo-controlled gaming system with Raspberry Pi that uses live camera feedback for real-time navigation and converts visual data into automated keyboard inputs.'
        },
        'shadow-casting': {
            title: 'Shadow Casting Simulator',
            description: 'Developed a real-time shadow casting simulator using Pygame and Shapely for geometric calculations, incorporating dynamic player control with mouse input for interactive environments.'
        },
        'ascii-art-converter': {
            title: 'ASCII Art Video Converter',
            description: 'Created a tool that converts video frames into ASCII art using ffmpeg and Python. The project automates the conversion and playback of videos as ASCII art in real-time, combining multimedia processing with creative visual output.'
        },
        'ai-workflow-assistant': {
            title: 'AI-Powered Workflow Assistant',
            description: 'Developed a script integrated with my window manager to serve as a personal assistant, automating text summarization, task management, and media streaming. It includes AI-driven content suggestions and key bindings for an efficient, hands-free workflow.'
        },
        'riscv-led-matrix-driver': {
            title: 'Minimalistic Display Driver for RISC-V 16x16 LED Matrix',
            description: 'Developed a shell script-based interpreter to convert .png images into a format compatible with a 16x16 LED matrix for RISC-V simulators using ImageMagick.'
        },
        'rfid-security': {
            title: 'RFID Security Mechanism',
            description: 'Developed a dynamic RFID card ID-changing system to prevent cloned cards from being used, with real-time alerts for unauthorized access and detailed access logs for security auditing.'
        },
        'image-encryption': {
            title: 'Image Encryption Tool',
            description: 'Developed an image encryption tool using OpenCV by embedding pixel coordinates (x, y) and their inverse (width-x, height-y) into the R, G, B values to create a layered encryption system, where each layer must be decrypted in sequence for secure transmission.'
        },
        'steganography': {
            title: 'Steganography Technique',
            description: 'Implemented a custom steganography technique to covertly embed text within images by encoding 3 bits of data per pixel, using 2 pixels (6 bits) to represent a character. The method minimizes visible color distortion, ensuring discreet data insertion while maintaining image integrity.'
        },
        'usb-rubber-ducky': {
            title: 'USB Rubber Ducky using Raspberry Pi',
            description: 'Configured Raspberry Pi Zero 2 W in USB gadget mode to spoof an Apple Magic Keyboard, undetected by the host. Developed a custom scripting language for rapid, precise input, enabling automation and advanced scripting capabilities.'
        }
    };

    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.dataset.projectId;
            const project = projectDetails[projectId];
            if (project) {
                overlayTitle.textContent = project.title;
                overlayDescription.textContent = project.description;
                projectOverlay.classList.add('active');
            }
        });
    });

    closeButton.addEventListener('click', () => {
        projectOverlay.classList.remove('active');
    });

    // Show the home section by default on load
    showSection('home');
});
