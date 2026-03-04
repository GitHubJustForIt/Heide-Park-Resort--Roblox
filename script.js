// ====== MAIN APPLICATION SCRIPT ======

class App {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.calendarSystem = null;
        this.bookingSystem = null;
        this.goldenSystem = null;
    }

    init() {
        // Check if user is logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.login(savedUser);
        } else {
            this.showLoginPage();
        }

        this.attachLoginListeners();
    }

    showLoginPage() {
        document.getElementById('login-page').classList.add('active');
        document.getElementById('main-app').classList.remove('active');
    }

    attachLoginListeners() {
        const loginBtn = document.getElementById('login-btn');
        const usernameInput = document.getElementById('username-input');

        if (usernameInput) {
            usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleLogin();
                }
            });
        }

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLogin());
        }
    }

    handleLogin() {
        const input = document.getElementById('username-input');
        const username = input.value.trim();

        if (!username) {
            alert(SETTINGS.login.errorEmpty);
            return;
        }

        if (username.length < 3) {
            alert(SETTINGS.login.errorTooShort);
            return;
        }

        this.login(username);
    }

    login(username) {
        this.currentUser = username;
        localStorage.setItem('currentUser', username);

        // Hide login, show main app
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('main-app').classList.add('active');

        // Update UI
        document.getElementById('nav-username').textContent = username;

        // Initialize systems
        this.initSystems();
        this.attachNavigationListeners();
        this.loadHomePage();
        this.checkGoldenTicket();
    }

    initSystems() {
        // Initialize calendar
        this.calendarSystem = new CalendarSystem();
        this.calendarSystem.loadFromStorage();
        window.calendarSystem = this.calendarSystem;

        // Initialize booking
        this.bookingSystem = new BookingSystem();
        this.bookingSystem.init(this.currentUser);
        window.bookingSystem = this.bookingSystem;

        // Initialize golden ticket
        this.goldenSystem = new GoldenTicketSystem();
        this.goldenSystem.init(this.currentUser);
        window.goldenSystem = this.goldenSystem;
    }

    attachNavigationListeners() {
        // Nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Data-navigate buttons
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-navigate')) {
                const page = e.target.getAttribute('data-navigate');
                this.navigateToPage(page);
            }
        });

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    navigateToPage(page) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

        // Show target section
        const sectionMap = {
            'home': 'home-section',
            'booking': 'booking-section',
            'golden': 'golden-section',
            'my-bookings': 'my-bookings-section',
            'status': 'status-section',
            'info': 'info-section'
        };

        const targetSection = document.getElementById(sectionMap[page]);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentPage = page;

        // Page-specific initializations
        if (page === 'booking') {
            this.calendarSystem.init();
        } else if (page === 'golden') {
            this.goldenSystem.render();
        } else if (page === 'my-bookings') {
            this.bookingSystem.renderMyBookings();
        }
    }

    loadHomePage() {
        // Apply texts
        document.getElementById('hero-title-1').textContent = SETTINGS.home.heroTitle1;
        document.getElementById('hero-subtitle-1').textContent = SETTINGS.home.heroSubtitle1;

        // Info cards
        document.getElementById('info-card-booking-title').textContent = SETTINGS.home.infoCardBookingTitle;
        document.getElementById('info-card-booking-text').textContent = SETTINGS.home.infoCardBookingText;
        document.getElementById('info-card-golden-title').textContent = SETTINGS.home.infoCardGoldenTitle;
        document.getElementById('info-card-golden-text').textContent = SETTINGS.home.infoCardGoldenText;
        document.getElementById('info-card-secure-title').textContent = SETTINGS.home.infoCardSecureTitle;
        document.getElementById('info-card-secure-text').textContent = SETTINGS.home.infoCardSecureText;

        // News
        document.getElementById('news-title').textContent = SETTINGS.home.newsTitle;
        this.loadNews();
    }

    loadNews() {
        const container = document.getElementById('news-container');
        if (!container) return;

        container.innerHTML = SETTINGS.news.map(item => `
            <div class="news-card">
                <h3>${item.title}</h3>
                <p>${item.text}</p>
                <small style="color: var(--gray-dark);">${item.date}</small>
            </div>
        `).join('');
    }

    checkGoldenTicket() {
        if (!SETTINGS.goldenTicket.enabled) {
            document.getElementById('golden-teaser').style.display = 'none';
            return;
        }

        // Check if there are active events
        const hasActiveEvents = Object.keys(SETTINGS.goldenTicket.events).some(eventDate => {
            const event = SETTINGS.goldenTicket.events[eventDate];
            return !event.completed;
        });

        if (hasActiveEvents) {
            document.getElementById('golden-teaser').style.display = 'block';
            document.getElementById('golden-teaser-title').textContent = SETTINGS.home.goldenTeaserTitle;
            document.getElementById('golden-teaser-text').textContent = SETTINGS.home.goldenTeaserText;

            // Show countdown for nearest event
            this.updateGoldenCountdown();
        } else {
            document.getElementById('golden-teaser').style.display = 'none';
        }
    }

    updateGoldenCountdown() {
        if (!SETTINGS.goldenCountdown.enabled) return;

        // Find nearest event
        const now = new Date();
        let nearestEvent = null;
        let nearestDate = null;

        for (const eventDate in SETTINGS.goldenTicket.events) {
            const event = SETTINGS.goldenTicket.events[eventDate];
            if (!event.completed && event.endTime) {
                const endTime = new Date(event.endTime);
                if (endTime > now && (!nearestDate || endTime < nearestDate)) {
                    nearestDate = endTime;
                    nearestEvent = event;
                }
            }
        }

        if (nearestDate) {
            const display = document.getElementById('golden-countdown-display');
            if (display) {
                const updateCountdown = () => {
                    const now = new Date();
                    const diff = nearestDate - now;

                    if (diff <= 0) {
                        display.textContent = SETTINGS.golden.countdownEnded;
                        return;
                    }

                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                    display.textContent = `${SETTINGS.golden.countdownPrefix}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                };

                updateCountdown();
                setInterval(updateCountdown, 1000);
            }
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        location.reload();
    }
}

// ====== GOLDEN TICKET SYSTEM ======
class GoldenTicketSystem {
    constructor() {
        this.currentUser = null;
        this.userGoldenBookings = [];
    }

    init(username) {
        this.currentUser = username;
        this.loadUserGoldenBookings();
    }

    loadUserGoldenBookings() {
        try {
            const saved = localStorage.getItem(`golden_${this.currentUser}`);
            if (saved) {
                this.userGoldenBookings = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load golden bookings:', e);
        }
    }

    saveUserGoldenBookings() {
        try {
            localStorage.setItem(`golden_${this.currentUser}`, JSON.stringify(this.userGoldenBookings));
        } catch (e) {
            console.error('Failed to save golden bookings:', e);
        }
    }

    render() {
        // Check if user is a winner
        let isWinner = false;
        let winnerEventDate = null;

        for (const eventDate in SETTINGS.goldenTicket.events) {
            const event = SETTINGS.goldenTicket.events[eventDate];
            if (event.winner === this.currentUser) {
                isWinner = true;
                winnerEventDate = eventDate;
                break;
            }
        }

        // Show/hide winner banner
        const banner = document.getElementById('golden-winner-banner');
        if (isWinner) {
            banner.style.display = 'block';
        } else {
            banner.style.display = 'none';
        }

        // Render available events
        this.renderEvents();

        // Update countdown
        this.updatePageCountdown();

        // Attach claim button
        const claimBtn = document.getElementById('claim-golden-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => this.openClaimModal());
        }
    }

    renderEvents() {
        const container = document.getElementById('golden-event-list');
        if (!container) return;

        const events = Object.keys(SETTINGS.goldenTicket.events).filter(eventDate => {
            return !SETTINGS.goldenTicket.events[eventDate].completed;
        });

        if (events.length === 0) {
            container.innerHTML = `
                <div class="golden-event-item">
                    <strong>${SETTINGS.golden.noEventsTitle}</strong>
                    <p>${SETTINGS.golden.noEventsText}</p>
                </div>
            `;
        } else {
            container.innerHTML = events.map(eventDate => `
                <div class="golden-event-item">
                    <strong>${eventDate}</strong>
                </div>
            `).join('');
        }
    }

    updatePageCountdown() {
        const display = document.getElementById('golden-page-countdown');
        if (!display) return;

        // Find nearest event
        const now = new Date();
        let nearestDate = null;

        for (const eventDate in SETTINGS.goldenTicket.events) {
            const event = SETTINGS.goldenTicket.events[eventDate];
            if (!event.completed && event.endTime) {
                const endTime = new Date(event.endTime);
                if (endTime > now && (!nearestDate || endTime < nearestDate)) {
                    nearestDate = endTime;
                }
            }
        }

        if (nearestDate) {
            const updateCountdown = () => {
                const now = new Date();
                const diff = nearestDate - now;

                if (diff <= 0) {
                    display.textContent = SETTINGS.golden.countdownEnded;
                    return;
                }

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                display.textContent = `${SETTINGS.golden.countdownPrefix}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            };

            updateCountdown();
            setInterval(updateCountdown, 1000);
        }
    }

    openClaimModal() {
        // Check if user already has an active claim
        const hasActiveClaim = this.userGoldenBookings.some(b => b.status === 'pending' || b.status === 'winner');
        if (hasActiveClaim) {
            window.bookingSystem.showNotification('warning', SETTINGS.errors.goldenActive, SETTINGS.errors.goldenActive);
            return;
        }

        const modal = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');

        // Get available events
        const availableEvents = Object.keys(SETTINGS.goldenTicket.events).filter(eventDate => {
            return !SETTINGS.goldenTicket.events[eventDate].completed;
        });

        if (availableEvents.length === 0) {
            window.bookingSystem.showNotification('info', SETTINGS.golden.noEventsTitle, SETTINGS.golden.noEventsText);
            return;
        }

        // Show loading animation
        window.bookingSystem.showLoading(SETTINGS.golden.modalLoading);
        
        setTimeout(() => {
            window.bookingSystem.hideLoading();

            // Show claim confirmation
            content.innerHTML = `
                <div class="modal-header">
                    <h2>${SETTINGS.golden.modalClaimTitle}</h2>
                    <button class="modal-close" onclick="window.bookingSystem.closeModal()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="modal-body text-center">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--golden); margin: 0 auto 16px;">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <h3 class="mb-16">${SETTINGS.golden.modalClaimText}</h3>
                    
                    <div style="margin: 24px 0;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">${SETTINGS.golden.modalSelectEvent}</label>
                        <select id="golden-event-select" style="width: 100%; padding: 12px; border: 2px solid var(--gray-medium); border-radius: var(--radius-md); font-size: 16px;">
                            ${availableEvents.map(date => `<option value="${date}">${date}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-ghost" onclick="window.bookingSystem.closeModal()">${SETTINGS.booking.modalCancel}</button>
                    <button class="btn-golden" onclick="window.goldenSystem.showContactStep()">${SETTINGS.golden.modalClaimButton}</button>
                </div>
            `;

            modal.classList.add('active');
        }, 1500);
    }

    showContactStep() {
        const selectedEvent = document.getElementById('golden-event-select').value;
        
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-header">
                <h2>${SETTINGS.golden.modalContact}</h2>
                <button class="modal-close" onclick="window.bookingSystem.closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p class="mb-16">${SETTINGS.booking.modalContactHint}</p>
                <div class="input-group">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <input type="text" id="golden-discord-input" placeholder="${SETTINGS.booking.modalDiscordPlaceholder}">
                </div>
                <div class="input-group">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                    <input type="text" id="golden-tiktok-input" placeholder="${SETTINGS.booking.modalTiktokPlaceholder}">
                </div>
                <input type="hidden" id="golden-selected-event" value="${selectedEvent}">
            </div>
            <div class="modal-footer">
                <button class="btn-ghost" onclick="window.bookingSystem.closeModal()">${SETTINGS.booking.modalCancel}</button>
                <button class="btn-primary" onclick="window.goldenSystem.showRulesStep()">${SETTINGS.booking.modalAccept}</button>
            </div>
        `;
    }

    showRulesStep() {
        const discord = document.getElementById('golden-discord-input')?.value.trim();
        const tiktok = document.getElementById('golden-tiktok-input')?.value.trim();
        const selectedEvent = document.getElementById('golden-selected-event')?.value;

        if (!discord && !tiktok) {
            window.bookingSystem.showNotification('error', SETTINGS.errors.contactMissing, SETTINGS.errors.contactMissing);
            return;
        }

        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-header">
                <h2>${SETTINGS.golden.modalRules}</h2>
                <button class="modal-close" onclick="window.bookingSystem.closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p>${SETTINGS.golden.modalRulesText}</p>
                <input type="hidden" id="golden-discord-final" value="${discord}">
                <input type="hidden" id="golden-tiktok-final" value="${tiktok}">
                <input type="hidden" id="golden-event-final" value="${selectedEvent}">
            </div>
            <div class="modal-footer">
                <button class="btn-ghost" onclick="window.bookingSystem.closeModal()">${SETTINGS.booking.modalCancel}</button>
                <button class="btn-golden" onclick="window.goldenSystem.confirmClaim()">${SETTINGS.booking.modalAccept}</button>
            </div>
        `;
    }

    async confirmClaim() {
        const discord = document.getElementById('golden-discord-final')?.value;
        const tiktok = document.getElementById('golden-tiktok-final')?.value;
        const eventDate = document.getElementById('golden-event-final')?.value;

        window.bookingSystem.showLoading(SETTINGS.loading.submitting);

        // Create golden booking
        const booking = {
            id: Date.now().toString(),
            type: 'golden',
            date: eventDate,
            contact: {
                discord: discord || 'Not provided',
                tiktok: tiktok || 'Not provided'
            },
            status: 'pending',
            createdAt: new Date().toISOString(),
            username: this.currentUser
        };

        // Add to user golden bookings
        this.userGoldenBookings.push(booking);
        this.saveUserGoldenBookings();

        // Add to event pending users
        SETTINGS.goldenTicket.events[eventDate].pendingUsers.push(this.currentUser);
        if (window.calendarSystem) {
            window.calendarSystem.saveToStorage();
        }

        // Send webhook
        await window.bookingSystem.sendWebhook(booking, 'golden');

        window.bookingSystem.hideLoading();
        
        // Show waiting message
        const content = document.getElementById('modal-content');
        content.innerHTML = `
            <div class="modal-body text-center">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--golden); margin: 0 auto 16px;">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <h2 class="mb-16">${SETTINGS.golden.modalWaitingTitle}</h2>
                <p>${SETTINGS.golden.modalWaitingText}</p>
                <div style="margin-top: 24px;">
                    <button class="btn-primary" onclick="window.bookingSystem.closeModal()">OK</button>
                </div>
            </div>
        `;

        window.bookingSystem.showNotification('success', SETTINGS.golden.modalWaitingTitle, SETTINGS.golden.modalWaitingText);
    }
}

// ====== INITIALIZE APP ======
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
    window.app = app;
});
