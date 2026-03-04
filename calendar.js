// ====== CALENDAR SYSTEM ======

class CalendarSystem {
    constructor() {
        this.currentMonth = 2; // March (0-indexed)
        this.currentYear = 2026;
        this.selectedFilter = 'all';
    }

    init() {
        this.renderCalendar();
        this.attachEventListeners();
    }

    attachEventListeners() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.changeMonth(-1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.changeMonth(1));
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedFilter = e.target.dataset.filter;
                this.renderCalendar();
            });
        });
    }

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar();
    }

    renderCalendar() {
        const monthName = SETTINGS.booking.months[this.currentMonth];
        const yearStr = this.currentYear.toString();
        
        document.getElementById('calendar-month').textContent = monthName;
        document.getElementById('calendar-year').textContent = yearStr;

        const grid = document.getElementById('calendar-grid');
        if (!grid) return;

        grid.innerHTML = '';

        // Get days in month
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            grid.appendChild(emptyCell);
        }

        // Add day cells
        const monthData = SETTINGS.calendarSettings[yearStr]?.[monthName];

        for (let day = 1; day <= daysInMonth; day++) {
            const dayStr = day.toString().padStart(2, '0');
            const dayData = monthData?.[dayStr];

            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';

            if (dayData && dayData.enabled) {
                const status = this.getDayStatus(dayData);
                dayCell.classList.add(status);

                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = day;

                const statusDot = document.createElement('div');
                statusDot.className = `day-status ${status}`;

                dayCell.appendChild(dayNumber);
                dayCell.appendChild(statusDot);

                // Apply filter
                if (this.shouldShowDay(status)) {
                    dayCell.addEventListener('click', () => {
                        this.onDayClick(yearStr, monthName, dayStr, dayData);
                    });
                } else {
                    dayCell.style.display = 'none';
                }
            } else {
                dayCell.classList.add('disabled');
                dayCell.innerHTML = `<div class="day-number">${day}</div>`;
            }

            grid.appendChild(dayCell);
        }
    }

    shouldShowDay(status) {
        if (this.selectedFilter === 'all') return true;
        if (this.selectedFilter === 'this-month') {
            return this.currentMonth === new Date().getMonth() && 
                   this.currentYear === new Date().getFullYear();
        }
        if (this.selectedFilter === 'next-month') {
            const nextMonth = (new Date().getMonth() + 1) % 12;
            const nextYear = new Date().getFullYear() + (new Date().getMonth() === 11 ? 1 : 0);
            return this.currentMonth === nextMonth && this.currentYear === nextYear;
        }
        return status === this.selectedFilter;
    }

    getDayStatus(dayData) {
        if (dayData.soldOut) return 'soldout';
        
        // Check if all timeslots are full
        const timeslots = dayData.timeslots;
        let allFull = true;
        let hasPending = false;
        let hasBooked = false;

        for (const slot in timeslots) {
            const slotData = timeslots[slot];
            if (slotData.enabled) {
                if (slotData.bookings.length < slotData.limit) {
                    allFull = false;
                }
                slotData.bookings.forEach(booking => {
                    if (booking.status === 'pending') hasPending = true;
                    if (booking.status === 'booked') hasBooked = true;
                });
            }
        }

        if (allFull) return 'soldout';
        if (hasPending) return 'pending';
        if (hasBooked) return 'booked';
        return 'available';
    }

    onDayClick(year, month, day, dayData) {
        // Trigger booking modal
        if (window.bookingSystem) {
            window.bookingSystem.openBookingModal(year, month, day, dayData);
        }
    }

    updateDayData(year, month, day, newData) {
        if (!SETTINGS.calendarSettings[year]) {
            SETTINGS.calendarSettings[year] = {};
        }
        if (!SETTINGS.calendarSettings[year][month]) {
            SETTINGS.calendarSettings[year][month] = {};
        }
        SETTINGS.calendarSettings[year][month][day] = newData;
        
        // Save to localStorage
        this.saveToStorage();
        this.renderCalendar();
    }

    saveToStorage() {
        try {
            localStorage.setItem('calendarSettings', JSON.stringify(SETTINGS.calendarSettings));
            localStorage.setItem('goldenTicket', JSON.stringify(SETTINGS.goldenTicket));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }

    loadFromStorage() {
        try {
            const savedCalendar = localStorage.getItem('calendarSettings');
            const savedGolden = localStorage.getItem('goldenTicket');
            
            if (savedCalendar) {
                SETTINGS.calendarSettings = JSON.parse(savedCalendar);
            }
            if (savedGolden) {
                SETTINGS.goldenTicket = JSON.parse(savedGolden);
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
    }
}

// Initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.CalendarSystem = CalendarSystem;
}
