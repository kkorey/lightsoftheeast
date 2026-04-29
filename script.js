document.addEventListener('DOMContentLoaded', () => {
    // Nav scroll effect
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('nav-active');
            const icon = mobileMenuToggle.querySelector('i');
            if (navLinksContainer.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when a link is clicked
        const navLinks = navLinksContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('nav-active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            });
        });
    }

    // Hero animations on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.fade-in-up');
        heroElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Active nav link update on scroll
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a:not(.btn-nav)');

    // Maps sub-sections to their parent nav link
    const sectionNavMap = {
        'history':     '#about',
        'gallery':     '#about',
        'leadership':  '#about',
        'scholarships': '#about',
        'in-memoriam': '#about'
    };

    // Dropdown sub-links (for per-item active highlight inside the dropdown)
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');

    function updateNavHighlight() {
        let current = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        // Resolve sub-sections to their parent nav href
        const activeHref = sectionNavMap[current] || `#${current}`;

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeHref) {
                link.classList.add('active');
            }
        });

        // Highlight the matching dropdown sub-link
        dropdownLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    let isClickScrolling = false;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        if (isClickScrolling) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isClickScrolling = false;
            }, 100);
            return;
        }
        updateNavHighlight();
    });
    updateNavHighlight(); // Run once on load


    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                isClickScrolling = true;

                // Immediately highlight the corresponding nav link
                // Resolve sub-section hrefs to their parent nav href
                const sectionId = targetId.replace('#', '');
                const clickActiveHref = sectionNavMap[sectionId] || targetId;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === clickActiveHref) {
                        link.classList.add('active');
                    }
                });

                // Also highlight the dropdown sub-link immediately on click
                dropdownLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === targetId) {
                        link.classList.add('active');
                    }
                });

                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // View More Events Toggle
    const viewMoreEventsBtn = document.getElementById('view-more-events');
    const pastEventsContainer = document.querySelector('.past-events-container');

    if (viewMoreEventsBtn && pastEventsContainer) {
        viewMoreEventsBtn.addEventListener('click', () => {
            const isShowing = viewMoreEventsBtn.textContent === 'View Less';
            if (isShowing) {
                pastEventsContainer.style.display = 'none';
                viewMoreEventsBtn.textContent = 'View More';
            } else {
                pastEventsContainer.style.display = 'block';
                // Trigger reveal animations inside the container
                setTimeout(() => {
                    pastEventsContainer.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
                }, 50);
                viewMoreEventsBtn.textContent = 'View Less';
            }
        });
    }

    // Share Modal Logic
    const shareModal = document.getElementById('share-modal');
    const openShareBtn = document.getElementById('open-share-modal');
    const closeShareBtn = document.getElementById('close-share-modal');
    const copyShareBtn = document.getElementById('copy-share-link');
    const shareCopyError = document.getElementById('share-copy-error');

    if (shareModal && openShareBtn) {
        openShareBtn.addEventListener('click', () => {
            shareCopyError.style.display = 'none';
            shareModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        closeShareBtn.addEventListener('click', () => {
            shareModal.classList.remove('show');
            document.body.style.overflow = '';
        });

        window.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                shareModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        copyShareBtn.addEventListener('click', () => {
            // Link is intentionally empty — show error
            shareCopyError.style.display = 'block';
        });
    }

    // Modal Logic
    const notifyModal = document.getElementById('notify-modal');
    const openNotifyBtn = document.getElementById('open-notify-modal');
    const closeNotifyBtn = document.querySelector('.close-modal');

    if (notifyModal && openNotifyBtn && closeNotifyBtn) {
        openNotifyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            notifyModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        closeNotifyBtn.addEventListener('click', () => {
            notifyModal.classList.remove('show');
            document.body.style.overflow = '';
        });

        window.addEventListener('click', (e) => {
            if (e.target === notifyModal) {
                notifyModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
});
