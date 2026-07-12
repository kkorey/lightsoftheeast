document.addEventListener('DOMContentLoaded', () => {
    const isHomepage = !!document.querySelector('.hero');
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
        if (isHomepage) {
            updateNavHighlight();
        }
    });
    if (isHomepage) {
        updateNavHighlight(); // Run once on load
    }


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


    // View More Officers Toggle
    const viewMoreOfficersBtn = document.getElementById('view-more-officers');
    const officersGrid = document.getElementById('officers-grid');

    if (viewMoreOfficersBtn && officersGrid) {
        viewMoreOfficersBtn.addEventListener('click', () => {
            const isCollapsed = officersGrid.classList.contains('collapsed');
            if (isCollapsed) {
                officersGrid.classList.remove('collapsed');
                viewMoreOfficersBtn.textContent = 'View Less';
                // Trigger reveal animations for the newly shown cards
                setTimeout(() => {
                    officersGrid.querySelectorAll('.officer-card.reveal').forEach(el => {
                        el.classList.add('active');
                    });
                }, 50);
            } else {
                officersGrid.classList.add('collapsed');
                viewMoreOfficersBtn.textContent = 'View More';
                // Scroll back to the top of the officers section for better UX
                const section = document.getElementById('leadership');
                if (section) {
                    window.scrollTo({
                        top: section.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
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
    const closeNotifyBtn = notifyModal ? notifyModal.querySelector('.close-modal') : null;

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

    // Supabase Dynamic Gallery Loader
    async function initSupabaseGallery() {
        const galleryGrid = document.getElementById('dynamic-gallery-grid');
        if (!galleryGrid) return;

        try {
            let imageFiles = [];
            let isUsingFallback = false;

            if (!window.supabase) {
                console.warn('Supabase client not loaded. Using fallback gallery images.');
                isUsingFallback = true;
            } else {
                // List files in the 'photos' storage bucket
                const { data, error } = await window.supabase.storage.from('photos').list('', {
                    limit: 100,
                    sortBy: { column: 'name', order: 'asc' }
                });

                if (error) {
                    console.error('Error fetching from Supabase, using fallbacks:', error);
                    isUsingFallback = true;
                } else {
                    imageFiles = (data || []).filter(file => {
                        const ext = file.name.split('.').pop().toLowerCase();
                        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
                    });

                    if (imageFiles.length === 0) {
                        console.log('No photos found in Supabase storage bucket "photos". Using fallback gallery images.');
                        isUsingFallback = true;
                    }
                }
            }

            if (isUsingFallback) {
                // Set up fallback image URLs (free high quality photography from Unsplash representing masonry and lodge activities)
                const fallbackUrls = [
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800'
                ];

                imageFiles = fallbackUrls.map((url, i) => ({
                    name: `Gallery Image ${i + 1}`,
                    isFallback: true,
                    url: url
                }));
            }

            // Clear the existing items
            galleryGrid.innerHTML = '';

            const sizes = ['tall', 'medium', 'wide'];

            imageFiles.forEach((file, index) => {
                let imageUrl;
                if (file.isFallback) {
                    imageUrl = file.url;
                } else {
                    // Get the public URL for the image
                    const { data: urlData } = window.supabase.storage.from('photos').getPublicUrl(file.name);
                    imageUrl = urlData?.publicUrl;
                }

                if (!imageUrl) return;

                const itemDiv = document.createElement('div');
                const sizeClass = sizes[index % 3];
                itemDiv.className = `gallery-item ${sizeClass}`;

                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = file.name.replace(/\.[^/.]+$/, "") || "Lodge Gallery Image";
                img.className = 'gallery-img';

                itemDiv.appendChild(img);
                galleryGrid.appendChild(itemDiv);
            });

            // Set up gallery toggle button
            const DEFAULT_SHOW_COUNT = 6;
            const galleryActions = document.getElementById('gallery-actions');

            if (imageFiles.length > DEFAULT_SHOW_COUNT) {
                if (galleryActions) {
                    galleryActions.style.display = 'flex';
                }
            } else {
                if (galleryActions) {
                    galleryActions.style.display = 'none';
                }
            }

        } catch (err) {
            console.error('Error loading gallery:', err);
        }
    }

    // Google Calendar Dynamic Loader via Supabase Edge Function
    async function initGoogleCalendar() {
        const eventsContainer = document.getElementById('dynamic-events-container');
        if (!eventsContainer) return;

        try {
            if (!window.supabase) {
                console.warn('Supabase client not loaded. Using fallback static events.');
                return;
            }

            console.log('Invoking Supabase Edge Function dynamic-endpoint...');
            const { data, error } = await window.supabase.functions.invoke('dynamic-endpoint', {
                method: 'GET'
            });

            if (error) {
                console.error('Supabase Edge Function invocation error:', error);
                throw error;
            }

            console.log('Edge Function response data:', data);
            const events = data?.events || [];

            if (events.length === 0) {
                eventsContainer.innerHTML = `
                    <div style="text-align: center; padding: 4rem 0; width: 100%;">
                        <i class="fas fa-calendar-times" style="font-size: 3.5rem; color: rgba(212, 175, 55, 0.25); margin-bottom: 1.5rem; display: block;"></i>
                        <p style="color: var(--color-text-muted); font-size: 1.1rem; max-width: 500px; margin: 0 auto;">No upcoming events scheduled at this time. Check back soon!</p>
                    </div>
                `;
                return;
            }

            // Helpers for formatting
            function formatEventDate(start) {
                if (!start) return '';
                const date = new Date(start.dateTime || start.date);
                if (start.date) {
                    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                }
                return date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                }).replace(', at', ' at');
            }

            function getEventIcon(summary) {
                const title = (summary || '').toLowerCase();
                if (title.includes('dinner') || title.includes('meal') || title.includes('feast') || title.includes('breakfast')) return 'fa-utensils';
                if (title.includes('meeting') || title.includes('communication') || title.includes('lodge')) return 'fa-gavel';
                if (title.includes('degree') || title.includes('initiation') || title.includes('work')) return 'fa-scroll';
                if (title.includes('charity') || title.includes('donation') || title.includes('fundraiser')) return 'fa-hand-holding-heart';
                return 'fa-calendar-alt';
            }

            function formatDescription(desc) {
                if (!desc) return 'No description available for this event.';
                let text = desc.replace(/<[^>]*>/g, ''); // Strip simple HTML
                if (text.length > 180) {
                    text = text.substring(0, 180) + '...';
                }
                return text;
            }

            // Clear the container
            eventsContainer.innerHTML = '';

            // 1. Featured Event (First upcoming event)
            const featured = events[0];
            const featuredIcon = getEventIcon(featured.summary);
            const featuredDate = formatEventDate(featured.start);
            const featuredLocation = featured.location || 'Location to be announced';
            const featuredDesc = formatDescription(featured.description);

            const featuredHtml = `
                <div class="event-featured reveal active">
                    <div class="event-image">
                        <div class="image-placeholder">
                            <i class="fas ${featuredIcon}"></i>
                        </div>
                    </div>
                    <div class="event-details">
                        <h3>${featured.summary || 'Stated Communication'}</h3>
                        <p class="event-meta">
                            <span><i class="fas fa-clock"></i> ${featuredDate}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${featuredLocation}</span>
                        </p>
                        <p class="event-description">${featuredDesc}</p>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem;">
                            <a href="#contact" class="btn-primary">RSVP Now</a>
                            <button class="btn-secondary" id="open-share-modal-btn"><i class="fas fa-share-alt" style="margin-right: 8px;"></i>Share</button>
                        </div>
                    </div>
                </div>
            `;
            eventsContainer.innerHTML += featuredHtml;

            // Rebind share modal open event listener to dynamic button
            const dynamicShareBtn = document.getElementById('open-share-modal-btn');
            const shareModal = document.getElementById('share-modal');
            if (dynamicShareBtn && shareModal) {
                dynamicShareBtn.addEventListener('click', () => {
                    const shareCopyError = document.getElementById('share-copy-error');
                    if (shareCopyError) shareCopyError.style.display = 'none';
                    shareModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                });
            }

            // 2. Setup Extra Events Grid (Up to 2 additional events)
            const extraEventsContainer = document.querySelector('.extra-events-container');
            const extraEventsGrid = document.getElementById('extra-events-grid');
            const viewMoreBtn = document.getElementById('view-more-events');

            if (events.length > 1) {
                if (extraEventsGrid) {
                    extraEventsGrid.innerHTML = '';
                    const showCount = Math.min(events.length, 3); // Max 3 events total (1 featured + 2 extra)
                    
                    let gridHtml = '';
                    for (let i = 1; i < showCount; i++) {
                        const event = events[i];
                        const icon = getEventIcon(event.summary);
                        const dateStr = formatEventDate(event.start);
                        const location = event.location || 'Location to be announced';
                        const desc = formatDescription(event.description);
                        const delayClass = i % 2 === 1 ? 'delay-1' : '';

                        gridHtml += `
                            <div class="event-featured small-event reveal active ${delayClass}">
                                <div class="event-image">
                                    <div class="image-placeholder">
                                        <i class="fas ${icon}"></i>
                                    </div>
                                </div>
                                <div class="event-details">
                                    <h3>${event.summary || 'Upcoming Lodge Event'}</h3>
                                    <p class="event-meta">
                                        <span><i class="fas fa-clock"></i> ${dateStr}</span>
                                        <span><i class="fas fa-map-marker-alt"></i> ${location}</span>
                                    </p>
                                    <p class="event-description">${desc}</p>
                                </div>
                            </div>
                        `;
                    }
                    extraEventsGrid.innerHTML = gridHtml;
                }

                if (viewMoreBtn) {
                    viewMoreBtn.style.display = 'inline-block';
                    
                    // Rebind click listener to prevent duplicate handlers
                    const newBtn = viewMoreBtn.cloneNode(true);
                    viewMoreBtn.parentNode.replaceChild(newBtn, viewMoreBtn);

                    newBtn.addEventListener('click', () => {
                        const isShowing = newBtn.textContent === 'View Less';
                        if (isShowing) {
                            if (extraEventsContainer) extraEventsContainer.style.display = 'none';
                            newBtn.textContent = 'View More';
                        } else {
                            if (extraEventsContainer) extraEventsContainer.style.display = 'block';
                            newBtn.textContent = 'View Less';
                        }
                    });
                }
            } else {
                if (viewMoreBtn) {
                    viewMoreBtn.style.display = 'none';
                }
            }

        } catch (err) {
            console.error('Error loading calendar events:', err);
        }
    }

    // Execute initializations
    initSupabaseGallery();
    initGoogleCalendar();
});
