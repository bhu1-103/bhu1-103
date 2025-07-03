

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
        { id: 'resume', title: 'RESUME' },
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
        'cappy': {
            title: 'Cappy: Wireless Network Simulator',
            description: 'A 3D Wi-Fi network simulator powered by Komondor, shell scripts, and ML. Integrates OpenGL visualizations, custom map generation, throughput prediction, and real-time interactive exploration.'
        },
        'synthwave-h': {
            title: 'synthwave.h',
            description: 'Custom OpenGL header-only library for generating vaporwave-style visuals — grids, pyramids, suns — used in data visualization and personal projects. It has been cross-compiled and ported to platforms like the Nintendo DSi and PS Vita.'
        },
        'yt-tui': {
            title: 'yt-tui',
            description: 'A terminal-first YouTube downloader written in zsh. Supports fuzzy searching, batch downloading via text file, conversion to MP3, and syncing to iPod/PS Vita.'
        },
        'automated-game-player': {
            title: 'Automated Game Player',
            description: 'Designed a servo-controlled gaming system with Raspberry Pi that uses live camera feedback for real-time navigation and converts visual data into automated keyboard inputs.'
        },
        'usb-rubber-ducky': {
            title: 'USB Rubber Ducky',
            description: 'Configured Raspberry Pi Zero 2 W in USB gadget mode to spoof an Apple Magic Keyboard, undetected by the host. Developed a custom scripting language for rapid, precise input, enabling automation and advanced scripting capabilities.'
        },
        'ai-workflow-assistant': {
            title: 'AI Workflow Assistant',
            description: 'Developed a script integrated with my window manager to serve as a personal assistant, automating text summarization, task management, and media streaming. It includes AI-driven content suggestions and key bindings for an efficient, hands-free workflow.'
        },
        'rfid-security': {
            title: 'RFID Security',
            description: 'Developed a dynamic RFID card ID-changing system to prevent cloned cards from being used, with real-time alerts for unauthorized access and detailed access logs for security auditing.'
        },
        'terminal-video-player': {
            title: 'Terminal Video Player',
            description: 'Built a video-to-ASCII player using ffmpeg and shell scripting to convert video frames to ASCII and stream them in real-time inside the terminal.'
        },
        'gif-clock': {
            title: 'GIF Clock',
            description: 'A simple SDL2-based clock that displays time using animated GIF digits. Built in C, it has been cross-compiled for ARM to run on platforms like the Raspberry Pi, with support for custom themes and real-time rendering.'
        },
        'wii-homebrew': {
            title: 'Wii Homebrew & Motion Control',
            description: 'Explored Wii homebrew, connecting Wiimotes via bluetoothctl and using kernel modules to emulate mouse control with accelerometer data. Repo includes setup scripts, motion control experiments, and WBFS automation for RVZ/ISO to SD deployment.'
        }
    };

    projectItems.forEach(item => {
        const projectId = item.dataset.projectId;
        item.style.backgroundImage = `url(assets/images/${projectId}.jpg)`;

        item.addEventListener('click', () => {
            const project = projectDetails[projectId];
            if (project) {
                overlayTitle.textContent = project.title;
                overlayDescription.textContent = project.description;
                projectOverlay.classList.add('active');
                projectOverlay.focus(); // Focus the overlay when it opens
            }
        });

        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                item.click(); // Simulate click to open overlay
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const currentItemIndex = Array.from(projectItems).indexOf(item);
                let nextItemIndex = currentItemIndex;

                if (e.key === 'ArrowDown') {
                    nextItemIndex = (currentItemIndex + 1) % projectItems.length;
                } else if (e.key === 'ArrowUp') {
                    nextItemIndex = (currentItemIndex - 1 + projectItems.length) % projectItems.length;
                }
                projectItems[nextItemIndex].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                // Move focus back to the last active navigation link or first if none
                const activeNavLink = document.querySelector('#sidebar-nav ul li a.active-nav');
                if (activeNavLink) {
                    activeNavLink.focus();
                } else {
                    navLinks[0].focus();
                }
            }
        });
    });

    closeButton.addEventListener('click', () => {
        projectOverlay.classList.remove('active');
    });

    // Close overlay with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectOverlay.classList.contains('active')) {
            projectOverlay.classList.remove('active');
            // Return focus to the project item that opened the overlay
            const focusedProjectItem = document.querySelector('.project-item:focus');
            if (focusedProjectItem) {
                focusedProjectItem.focus();
            }
        }
    });

    // Show the home section by default on load
    showSection('home');

    // Set initial focus to the first navigation link
    navLinks[0].focus();
});
