// ====== BOOKING SYSTEM ======

class BookingSystem {
    constructor() {
        this.currentUser = null;
        this.userBookings = [];
        this.currentBookingData = null;
    }

    init(username) {
        this.currentUser = username;
        this.loadUserBookings();
        this.checkExpiredBookings();
    }

    loadUserBookings() {
        try {
            const saved = localStorage.getItem(`bookings_${this.currentUser}`);
            if (saved) {
                this.userBookings = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load bookings:', e);
        }
    }

    saveUserBookings() {
        try {
            localStorage.setItem(`bookings_${this.currentUser}`, JSON.stringify(this.userBookings));
        } catch (e) {
            console.error('Failed to save bookings:', e);
        }
    }

    openBookingModal(year, month, day, dayData) {
        this.currentBookingData = { year, month, day, dayData };
        
        const modal = document.getElementById('modal-overlay');
        const content = document.getElementById('modal-content');

        // Step 1: Show timeslot selection
        content.innerHTML = `
            <div class="modal-header">
                <h2>${SETTINGS.booking.modalTitle} ${month} ${day}, ${year}</h2>
                <button class="modal-close" onclick="window.bookingSystem.closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <h3 class="mb-16">${SETTINGS.booking.modalSelectTimeslot}</h3>
                <div class="timeslot-grid" id="timeslot-grid">
                    ${this.renderTimeslots(dayData.timeslots)}
                </div>
            </div>
        `;

        modal.classList.add('active');

        // Attach timeslot listeners
        document.querySelectorAll('.timeslot-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.timeslot-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.currentBookingData.selectedTimeslot = btn.dataset.slot;
                this.showContactStep();
            });
        });
    }

    renderTimeslots(timeslots) {
        let html = '';
        for (const slotKey in timeslots) {
            const slot = timeslots[slotKey];
            const slotInfo = SETTINGS.booking.timeslots[slotKey];
            const isFull = slot.bookings.length >= slot.limit;
            const isDisabled = !slot.enabled || isFull;

            html += `
                <div class="timeslot-btn ${isDisabled ? 'disabled' : ''}" data-slot="${slotKey}">
                    <div class="timeslot-name">${slotInfo.name}</div>
                    <div class="timeslot-time">${slotInfo.time}</div>
                    <div class="timeslot-capacity">${slot.bookings.length}/${slot.limit}</div>
                </div>
            `;
        }
        return html;
    }

    showContactStep() {
        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-header">
                <h2>${SETTINGS.booking.modalContact}</h2>
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
                    <input type="text" id="discord-input" placeholder="${SETTINGS.booking.modalDiscordPlaceholder}">
                </div>
                <div class="input-group">
                    <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                    <input type="text" id="tiktok-input" placeholder="${SETTINGS.booking.modalTiktokPlaceholder}">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-ghost" onclick="window.bookingSystem.closeModal()">${SETTINGS.booking.modalCancel}</button>
                <button class="btn-primary" onclick="window.bookingSystem.showRulesStep()">${SETTINGS.booking.modalAccept}</button>
            </div>
        `;
    }

    showRulesStep() {
        const discord = document.getElementById('discord-input')?.value.trim();
        const tiktok = document.getElementById('tiktok-input')?.value.trim();

        if (!discord && !tiktok) {
            this.showNotification('error', SETTINGS.errors.contactMissing, SETTINGS.errors.contactMissing);
            return;
        }

        this.currentBookingData.contact = {
            discord: discord || 'Not provided',
            tiktok: tiktok || 'Not provided'
        };

        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-header">
                <h2>${SETTINGS.booking.modalRules}</h2>
                <button class="modal-close" onclick="window.bookingSystem.closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <p>${SETTINGS.booking.modalRulesText}</p>
            </div>
            <div class="modal-footer">
                <button class="btn-ghost" onclick="window.bookingSystem.closeModal()">${SETTINGS.booking.modalCancel}</button>
                <button class="btn-primary" onclick="window.bookingSystem.showReviewStep()">${SETTINGS.booking.modalAccept}</button>
            </div>
        `;
    }

    showReviewStep() {
        const { year, month, day, selectedTimeslot, contact } = this.currentBookingData;
        const timeslotInfo = SETTINGS.booking.timeslots[selectedTimeslot];

        const content = document.getElementById('modal-content');
        
        content.innerHTML = `
            <div class="modal-header">
                <h2>${SETTINGS.booking.modalReview}</h2>
                <button class="modal-close" onclick="window.bookingSystem.closeModal()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="booking-detail mb-16">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <strong>${SETTINGS.booking.modalReviewDate}:</strong> ${month} ${day}, ${year}
                </div>
                <div class="booking-detail mb-16">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <strong>${SETTINGS.booking.modalReviewTimeslot}:</strong> ${timeslotInfo.name} (${timeslotInfo.time})
                </div>
                <div class="booking-detail mb-16">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <strong>${SETTINGS.booking.modalReviewContact}:</strong> Discord: ${contact.discord}, TikTok: ${contact.tiktok}
                </div>
                <div class="booking-detail mb-16">
                    <span class="status-badge status-pending">${SETTINGS.myBookings.statusPending}</span>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-ghost" onclick="window.bookingSystem.closeModal()">${SETTINGS.booking.modalCancel}</button>
                <button class="btn-primary" onclick="window.bookingSystem.confirmBooking()">${SETTINGS.booking.modalConfirm}</button>
            </div>
        `;
    }

    async confirmBooking() {
        this.showLoading(SETTINGS.loading.submitting);

        const { year, month, day, selectedTimeslot, contact, dayData } = this.currentBookingData;

        // Create booking object
        const booking = {
            id: Date.now().toString(),
            type: 'normal',
            date: `${year}-${month}-${day}`,
            timeslot: selectedTimeslot,
            contact: contact,
            status: 'pending',
            createdAt: new Date().toISOString(),
            username: this.currentUser
        };

        // Add to user bookings
        this.userBookings.push(booking);
        this.saveUserBookings();

        // Update calendar data
        const timeslotData = dayData.timeslots[selectedTimeslot];
        timeslotData.bookings.push(booking);

        if (window.calendarSystem) {
            window.calendarSystem.updateDayData(year, month, day.padStart(2, '0'), dayData);
        }

        // Send webhook
        await this.sendWebhook(booking, 'normal');

        this.hideLoading();
        this.closeModal();

        // Show success notification
        this.showNotification('success', SETTINGS.booking.successTitle, SETTINGS.booking.successMessage);

        // Refresh calendar if on booking page
        if (window.calendarSystem) {
            window.calendarSystem.renderCalendar();
        }
    }

    async sendWebhook(booking, type) {
        const webhookUrl = type === 'golden' ? SETTINGS.webhooks.golden : SETTINGS.webhooks.normal;
        
        const embed = {
            title: type === 'golden' ? '🌟 Golden Ticket Claim' : '📅 New Booking Request',
            color: type === 'golden' ? 16766720 : 16737843,
            fields: [
                { name: 'Username', value: booking.username, inline: true },
                { name: 'Date', value: booking.date, inline: true },
                { name: 'Timeslot', value: booking.timeslot || 'N/A', inline: true },
                { name: 'Discord', value: booking.contact.discord, inline: true },
                { name: 'TikTok', value: booking.contact.tiktok, inline: true },
                { name: 'Status', value: booking.status, inline: true }
            ],
            timestamp: new Date().toISOString()
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
        } catch (e) {
            console.error('Webhook failed:', e);
        }
    }

    checkExpiredBookings() {
        if (!SETTINGS.expiry.autoCleanup) return;

        const now = new Date();
        const expiryMs = SETTINGS.expiry.pendingDays * 24 * 60 * 60 * 1000;

        this.userBookings.forEach(booking => {
            if (booking.status === 'pending') {
                const createdAt = new Date(booking.createdAt);
                if (now - createdAt > expiryMs) {
                    booking.status = 'expired';
                    this.showNotification('warning', SETTINGS.notifications.expired, SETTINGS.notifications.expiredText);
                }
            }
        });

        this.saveUserBookings();
    }

    renderMyBookings() {
        const container = document.getElementById('bookings-container');
        if (!container) return;

        if (this.userBookings.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="grid-column: 1/-1;">
                    <h3 class="mb-16">${SETTINGS.myBookings.noBookings}</h3>
                    <p>${SETTINGS.myBookings.noBookingsText}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.userBookings.map(booking => {
            const isGolden = booking.type === 'golden';
            const statusClass = booking.status === 'pending' ? 'status-pending' : 
                               booking.status === 'booked' ? 'status-booked' : 'status-expired';

            return `
                <div class="booking-card ${isGolden ? 'golden' : ''}">
                    <h3>${isGolden ? SETTINGS.myBookings.goldenTicket : SETTINGS.myBookings.normalTicket}</h3>
                    <div class="booking-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${booking.date}
                    </div>
                    ${booking.timeslot ? `
                        <div class="booking-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${SETTINGS.booking.timeslots[booking.timeslot]?.name || booking.timeslot}
                        </div>
                    ` : ''}
                    <div class="booking-detail">
                        <span class="status-badge ${statusClass}">
                            ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }

    closeModal() {
        const modal = document.getElementById('modal-overlay');
        modal.classList.remove('active');
        this.currentBookingData = null;
    }

    showLoading(text = SETTINGS.loading.default) {
        const loading = document.getElementById('loading-screen');
        const loadingText = document.getElementById('loading-text');
        if (loadingText) loadingText.textContent = text;
        loading.classList.add('active');
    }

    hideLoading() {
        const loading = document.getElementById('loading-screen');
        loading.classList.remove('active');
    }

    showNotification(type, title, message) {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.BookingSystem = BookingSystem;
}
