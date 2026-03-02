// Script.js - Main Logic for Heide Park Roblox Booking System

// Global state
let currentUser = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;

// Hero slider images
const heroImages = [
    "https://images.unsplash.com/photo-1622906880189-c0e969b37495?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    "https://images.unsplash.com/photo-1613058502382-f2c4656638ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    "https://images.unsplash.com/photo-1762583748358-6cd6862282fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920",
    "https://images.unsplash.com/photo-1559640257-8eee30dc0f14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
];

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // Check if user is logged in
    const userLogin = HeideParkSettings.getUserLogin();
    if (userLogin) {
        currentUser = userLogin.username;
        showMainScreen();
    } else {
        showLoginScreen();
    }

    // Clear old bookings
    HeideParkSettings.clearOldBookings();

    // Setup event listeners
    setupEventListeners();

    // Setup admin panel keyboard shortcut
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "A") {
            e.preventDefault();
            openAdminPanel();
        }
    });

    // Create particles
    createParticles();
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    // Logout button
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }

    // Hero book button
    const heroBookBtn = document.getElementById("heroBookBtn");
    if (heroBookBtn) {
        heroBookBtn.addEventListener("click", scrollToCalendar);
    }

    // CTA book button
    const ctaBookBtn = document.getElementById("ctaBookBtn");
    if (ctaBookBtn) {
        ctaBookBtn.addEventListener("click", scrollToCalendar);
    }

    // Calendar navigation
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");
    if (prevMonth) prevMonth.addEventListener("click", () => changeMonth(-1));
    if (nextMonth) nextMonth.addEventListener("click", () => changeMonth(1));

    // Modal close buttons
    const closeModal = document.getElementById("closeModal");
    if (closeModal) closeModal.addEventListener("click", closeBookingModal);

    const closeAdmin = document.getElementById("closeAdmin");
    if (closeAdmin) closeAdmin.addEventListener("click", closeAdminPanelModal);

    // Confirm form
    const confirmForm = document.getElementById("confirmForm");
    if (confirmForm) confirmForm.addEventListener("submit", handleConfirmBooking);

    // Admin save settings
    const saveSettings = document.getElementById("saveSettings");
    if (saveSettings) saveSettings.addEventListener("click", handleSaveSettings);
}

// ============ LOGIN FUNCTIONS ============

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const age = parseInt(document.getElementById("age").value);
    const confirmed = document.getElementById("confirmTerms").checked;

    if (!username) {
        showToast("Please enter your Roblox username", "error");
        return;
    }

    if (!age || age < 8) {
        showToast("You must be at least 8 years old to book tickets", "error");
        return;
    }

    if (!confirmed) {
        showToast("Please confirm that you agree to the terms", "error");
        return;
    }

    // Show loading
    const loginBtn = document.getElementById("loginBtn");
    const btnText = loginBtn.querySelector("span");
    const spinner = loginBtn.querySelector(".spinner");
    btnText.style.display = "none";
    spinner.classList.remove("hidden");
    loginBtn.disabled = true;

    // Simulate loading
    setTimeout(() => {
        HeideParkSettings.saveUserLogin(username, age);
        currentUser = username;
        showToast(`Welcome, ${username}!`, "success");
        showMainScreen();
    }, 1000);
}

function handleLogout() {
    HeideParkSettings.clearUserLogin();
    currentUser = null;
    showToast("Logged out successfully", "success");
    showLoginScreen();
}

function showLoginScreen() {
    document.getElementById("loginScreen").classList.add("active");
    document.getElementById("mainScreen").classList.remove("active");
}

function showMainScreen() {
    document.getElementById("loginScreen").classList.remove("active");
    document.getElementById("mainScreen").classList.add("active");

    // Update username display
    document.getElementById("usernameDisplay").textContent = currentUser;

    // Initialize hero slider
    initHeroSlider();

    // Render calendar
    renderCalendar();
}

// ============ HERO SLIDER ============

let sliderInterval;
let currentSlide = 0;

function initHeroSlider() {
    const sliderTrack = document.getElementById("sliderTrack");
    const sliderDots = document.getElementById("sliderDots");

    if (!sliderTrack || !sliderDots) return;

    // Create slides
    sliderTrack.innerHTML = "";
    heroImages.forEach((img, idx) => {
        const slide = document.createElement("div");
        slide.className = "slide";
        if (idx === 0) slide.classList.add("active");
        slide.style.backgroundImage = `url(${img})`;
        sliderTrack.appendChild(slide);
    });

    // Create dots
    sliderDots.innerHTML = "";
    heroImages.forEach((_, idx) => {
        const dot = document.createElement("div");
        dot.className = "slider-dot";
        if (idx === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(idx));
        sliderDots.appendChild(dot);
    });

    // Auto-play slider
    startSlider();
}

function startSlider() {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % heroImages.length;
        updateSlider();
    }, 4000);
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    startSlider(); // Reset timer
}

function updateSlider() {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".slider-dot");

    slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === currentSlide);
    });

    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentSlide);
    });
}

// ============ CALENDAR FUNCTIONS ============

function renderCalendar() {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    document.getElementById("currentMonth").textContent = monthNames[currentMonth];
    document.getElementById("currentYear").textContent = currentYear;

    const calendarGrid = document.getElementById("calendarGrid");
    calendarGrid.innerHTML = "";

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-day empty";
        calendarGrid.appendChild(emptyCell);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateString = date.toISOString().split("T")[0];
        const dayCell = createDayCell(day, date, dateString);
        calendarGrid.appendChild(dayCell);
    }
}

function createDayCell(day, date, dateString) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";

    const isAvailable = isDateAvailable(date);
    const settings = HeideParkSettings.getSettings();
    const bookingsCount = HeideParkSettings.getBookingsCountForDate(dateString);
    const isFull = bookingsCount >= settings.maxSlotsPerDay;
    const userBooked = HeideParkSettings.hasUserBookedDate(currentUser, dateString);

    // Set cell state
    if (!isAvailable) {
        cell.classList.add("unavailable");
    } else if (userBooked) {
        cell.classList.add("booked");
    } else if (isFull) {
        cell.classList.add("full");
    } else {
        cell.classList.add("available");
        cell.addEventListener("click", () => selectDate(dateString));
    }

    // Day number
    const dayNum = document.createElement("div");
    dayNum.className = "day-number";
    dayNum.textContent = day;
    cell.appendChild(dayNum);

    // Status label
    if (isAvailable) {
        const status = document.createElement("div");
        status.className = "day-status";
        if (userBooked) {
            status.textContent = "BOOKED";
        } else if (isFull) {
            status.textContent = "FULL";
        } else {
            status.textContent = `${bookingsCount}/${settings.maxSlotsPerDay}`;
        }
        cell.appendChild(status);
    }

    return cell;
}

function isDateAvailable(date) {
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    if (!isWeekend) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    if (date < today) return false;

    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
    if (date > twoWeeksLater) return false;

    return true;
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function selectDate(dateString) {
    selectedDate = dateString;
    openBookingModal();
}

function scrollToCalendar() {
    const calendarSection = document.getElementById("calendarSection");
    if (calendarSection) {
        calendarSection.scrollIntoView({ behavior: "smooth" });
    }
}

// ============ BOOKING MODAL ============

function openBookingModal() {
    const modal = document.getElementById("bookingModal");
    const dateElement = document.getElementById("modalDate");

    const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    dateElement.textContent = formattedDate;

    // Reset form
    document.getElementById("confirmForm").reset();

    modal.classList.add("active");
}

function closeBookingModal() {
    document.getElementById("bookingModal").classList.remove("active");
}

function handleConfirmBooking(e) {
    e.preventDefault();

    const confirmUsername = document.getElementById("confirmUsername").value.trim();
    const captchaChecked = document.getElementById("captcha").checked;
    const term1 = document.getElementById("term1").checked;
    const term2 = document.getElementById("term2").checked;
    const term3 = document.getElementById("term3").checked;
    const term4 = document.getElementById("term4").checked;

    if (confirmUsername !== currentUser) {
        showToast("Username does not match!", "error");
        return;
    }

    if (!captchaChecked) {
        showToast("Please complete the CAPTCHA", "error");
        return;
    }

    if (!term1 || !term2 || !term3 || !term4) {
        showToast("Please accept all terms and conditions", "error");
        return;
    }

    // Close booking modal and show loading
    closeBookingModal();
    document.getElementById("loadingModal").classList.add("active");

    // Simulate booking process
    setTimeout(async () => {
        const bookingSuccess = HeideParkSettings.addBooking(currentUser, selectedDate);

        if (!bookingSuccess) {
            document.getElementById("loadingModal").classList.remove("active");
            showToast("Booking failed. This date may be full or already booked.", "error");
            return;
        }

        // Try to send webhook
        try {
            await HeideParkSettings.sendToDiscordWebhook(currentUser, selectedDate);
        } catch (err) {
            console.error("Webhook error:", err);
        }

        // Show success
        document.getElementById("loadingModal").classList.remove("active");
        showSuccessModal();

        // Refresh calendar
        setTimeout(() => {
            renderCalendar();
        }, 2500);
    }, 2000);
}

function showSuccessModal() {
    const modal = document.getElementById("successModal");
    const message = document.getElementById("successMessage");

    const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    message.textContent = `Your reservation for ${formattedDate} has been confirmed. See you at the park!`;

    modal.classList.add("active");

    // Auto close
    setTimeout(() => {
        modal.classList.remove("active");
        showToast("Booking confirmed! Check your calendar.", "success");
    }, 2500);
}

// ============ ADMIN PANEL ============

function openAdminPanel() {
    const settings = HeideParkSettings.getSettings();
    document.getElementById("maxSlots").value = settings.maxSlotsPerDay;
    document.getElementById("webhookUrl").value = settings.webhookUrl;

    renderBookingsList();

    document.getElementById("adminPanel").classList.add("active");
}

function closeAdminPanelModal() {
    document.getElementById("adminPanel").classList.remove("active");
}

function handleSaveSettings() {
    const maxSlots = parseInt(document.getElementById("maxSlots").value);
    const webhookUrl = document.getElementById("webhookUrl").value.trim();

    const settings = HeideParkSettings.getSettings();
    settings.maxSlotsPerDay = maxSlots;
    settings.webhookUrl = webhookUrl;

    HeideParkSettings.saveSettings(settings);
    showToast("Settings saved!", "success");
    renderCalendar(); // Refresh calendar with new settings
}

function renderBookingsList() {
    const bookings = HeideParkSettings.getBookings();
    const bookingsList = document.getElementById("bookingsList");
    const bookingsCount = document.getElementById("bookingsCount");

    bookingsCount.textContent = `(${bookings.length})`;

    if (bookings.length === 0) {
        bookingsList.innerHTML = '<div class="no-bookings">No bookings yet</div>';
        return;
    }

    // Group bookings by date
    const grouped = {};
    bookings.forEach(booking => {
        if (!grouped[booking.date]) {
            grouped[booking.date] = [];
        }
        grouped[booking.date].push(booking);
    });

    // Sort dates
    const sortedDates = Object.keys(grouped).sort();

    bookingsList.innerHTML = "";
    sortedDates.forEach(date => {
        const dateGroup = document.createElement("div");
        dateGroup.className = "booking-date-group";

        const dateHeader = document.createElement("div");
        dateHeader.className = "booking-date-header";
        dateHeader.textContent = new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        dateGroup.appendChild(dateHeader);

        const bookingsContainer = document.createElement("div");
        bookingsContainer.className = "booking-items";

        grouped[date].forEach(booking => {
            const item = document.createElement("div");
            item.className = "booking-item";

            const info = document.createElement("div");
            info.className = "booking-info";

            const username = document.createElement("div");
            username.className = "booking-username";
            username.textContent = booking.username;
            info.appendChild(username);

            const timestamp = document.createElement("div");
            timestamp.className = "booking-timestamp";
            timestamp.textContent = `Booked: ${new Date(booking.timestamp).toLocaleString()}`;
            info.appendChild(timestamp);

            item.appendChild(info);

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn-delete";
            deleteBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            `;
            deleteBtn.addEventListener("click", () => deleteBooking(booking.username, booking.date));
            item.appendChild(deleteBtn);

            bookingsContainer.appendChild(item);
        });

        dateGroup.appendChild(bookingsContainer);
        bookingsList.appendChild(dateGroup);
    });
}

function deleteBooking(username, date) {
    if (confirm(`Delete booking for ${username} on ${date}?`)) {
        HeideParkSettings.deleteBooking(username, date);
        showToast("Booking deleted", "success");
        renderBookingsList();
        renderCalendar();
    }
}

// ============ TOAST NOTIFICATIONS ============

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon = document.createElement("div");
    icon.className = "toast-icon";

    if (type === "success") {
        icon.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        `;
    } else if (type === "error") {
        icon.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        `;
    } else {
        icon.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        `;
    }

    const text = document.createElement("div");
    text.className = "toast-text";
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add("show"), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============ PARTICLES ANIMATION ============

function createParticles() {
    const particlesContainer = document.querySelector(".particles");
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 3}s`;
        particle.style.animationDuration = `${3 + Math.random() * 4}s`;
        particlesContainer.appendChild(particle);
    }
}
