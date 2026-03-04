// Main Script for Heide Park Roblox Booking System

// Global Variables
let currentUser = null;
let selectedDate = null;
let selectedGoldenDate = null;
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('heideParkUser');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainWebsite();
    } else {
        showLoginScreen();
    }
    
    // Setup Event Listeners
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Calendar Controls
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    if (monthSelect) {
        monthSelect.addEventListener('change', updateCalendar);
    }
    
    if (yearSelect) {
        yearSelect.addEventListener('change', updateCalendar);
    }
    
    // Booking Modal
    const confirmBookingBtn = document.getElementById('confirmBookingBtn');
    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', handleBookingConfirmation);
    }
    
    // Golden Ticket
    const claimGoldenBtn = document.getElementById('claimGoldenBtn');
    if (claimGoldenBtn) {
        claimGoldenBtn.addEventListener('click', startGoldenTicketFlow);
    }
    
    const goldenContinue1 = document.getElementById('goldenContinue1');
    if (goldenContinue1) {
        goldenContinue1.addEventListener('click', showGoldenStep2);
    }
    
    const goldenContinue2 = document.getElementById('goldenContinue2');
    if (goldenContinue2) {
        goldenContinue2.addEventListener('click', showGoldenStep3);
    }
    
    const goldenConfirm = document.getElementById('goldenConfirm');
    if (goldenConfirm) {
        goldenConfirm.addEventListener('click', handleGoldenTicketConfirmation);
    }
}

// Login Handler
function handleLogin() {
    const username = document.getElementById('robloxUsername').value.trim();
    const age = parseInt(document.getElementById('userAge').value);
    const confirmTerms = document.getElementById('confirmTerms').checked;
    const errorElement = document.getElementById('loginError');
    
    // Validation
    if (!username) {
        errorElement.textContent = 'Please enter your Roblox username';
        return;
    }
    
    if (!age || age < systemSettings.minAge) {
        errorElement.textContent = `You must be at least ${systemSettings.minAge} years old`;
        return;
    }
    
    if (!confirmTerms) {
        errorElement.textContent = 'Please confirm that all information is correct';
        return;
    }
    
    // Save user
    currentUser = {
        username: username,
        age: age,
        loginDate: new Date().toISOString()
    };
    
    localStorage.setItem('heideParkUser', JSON.stringify(currentUser));
    
    // Show loading
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showMainWebsite();
    }, 1500);
}

// Logout Handler
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('heideParkUser');
        currentUser = null;
        location.reload();
    }
}

// Show Login Screen
function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const mainWebsite = document.getElementById('mainWebsite');
    
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (mainWebsite) mainWebsite.classList.add('hidden');
}

// Show Main Website
function showMainWebsite() {
    const loginScreen = document.getElementById('loginScreen');
    const mainWebsite = document.getElementById('mainWebsite');
    
    if (loginScreen) loginScreen.classList.add('hidden');
    if (mainWebsite) mainWebsite.classList.remove('hidden');
    
    // Update header with username
    const headerUsername = document.getElementById('headerUsername');
    if (headerUsername && currentUser) {
        headerUsername.textContent = `Welcome, ${currentUser.username}!`;
    }
    
    // Initialize components
    initializeComponents();
}

// Initialize Components
function initializeComponents() {
    // Update visitor counter
    updateVisitorCounter();
    
    // Display random fun fact
    displayRandomFunFact();
    
    // Set calendar to current month/year
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    if (monthSelect) monthSelect.value = currentCalendarMonth;
    if (yearSelect) yearSelect.value = currentCalendarYear;
    
    // Generate calendar
    updateCalendar();
    
    // Check for pending/confirmed bookings
    checkUserBookings();
    
    // Check Golden Ticket status
    checkGoldenTicketStatus();
    
    // Rotate fun facts every 10 seconds
    setInterval(displayRandomFunFact, 10000);
}

// Update Visitor Counter
function updateVisitorCounter() {
    const visitorCount = document.getElementById('visitorCount');
    if (visitorCount) {
        let count = systemSettings.visitorCounterStart;
        const savedCount = localStorage.getItem('visitorCount');
        
        if (savedCount) {
            count = parseInt(savedCount);
        } else {
            localStorage.setItem('visitorCount', count);
        }
        
        // Animate counter
        animateCounter(visitorCount, count);
    }
}

// Animate Counter
function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 50);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toLocaleString();
    }, 30);
}

// Display Random Fun Fact
function displayRandomFunFact() {
    const funFactText = document.getElementById('funFactText');
    if (funFactText && funFacts.length > 0) {
        const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
        funFactText.textContent = randomFact;
        funFactText.style.animation = 'none';
        setTimeout(() => {
            funFactText.style.animation = 'fadeIn 1s ease';
        }, 10);
    }
}

// Update Calendar
function updateCalendar() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const calendarElement = document.getElementById('calendar');
    
    if (!monthSelect || !yearSelect || !calendarElement) return;
    
    currentCalendarMonth = parseInt(monthSelect.value);
    currentCalendarYear = parseInt(yearSelect.value);
    
    calendarElement.innerHTML = '';
    
    // Get month name
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[currentCalendarMonth];
    
    // Get days in month
    const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    
    // Get today's date
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    
    // Get max booking date (2 weeks ahead)
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + systemSettings.maxBookingDaysAhead);
    
    // Create calendar days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const dayStr = day.toString().padStart(2, '0');
        const dateKey = `${currentCalendarYear}-${(currentCalendarMonth + 1).toString().padStart(2, '0')}-${dayStr}`;
        const currentDate = new Date(currentCalendarYear, currentCalendarMonth, day);
        
        // Check if date is in settings
        const yearSettings = calendarSettings[currentCalendarYear];
        const monthSettings = yearSettings ? yearSettings[monthName] : null;
        const daySettings = monthSettings ? monthSettings[dayStr] : null;
        
        // Check if date is in the past
        if (currentDate < today.setHours(0, 0, 0, 0)) {
            dayElement.classList.add('disabled');
        }
        // Check if date is beyond max booking date
        else if (currentDate > maxDate) {
            dayElement.classList.add('disabled');
        }
        // Check if date is enabled in settings
        else if (daySettings && daySettings.enabled) {
            // Check user's booking status for this date
            const userBooking = getUserBookingForDate(dateKey);
            
            if (userBooking) {
                if (userBooking.status === 'pending') {
                    dayElement.classList.add('pending');
                    dayElement.textContent = `${day} ⏳`;
                } else if (userBooking.status === 'booked') {
                    dayElement.classList.add('booked');
                    dayElement.textContent = `${day} ✓`;
                }
            } else if (daySettings.soldOut) {
                dayElement.classList.add('sold-out');
                dayElement.textContent = `${day} ✖`;
            } else {
                // Available for booking
                dayElement.addEventListener('click', () => openBookingModal(dateKey));
            }
        } else {
            dayElement.classList.add('disabled');
        }
        
        calendarElement.appendChild(dayElement);
    }
}

// Get User Booking for Date
function getUserBookingForDate(date) {
    if (!currentUser) return null;
    
    const bookingsKey = `bookings_${currentUser.username}`;
    const bookings = JSON.parse(localStorage.getItem(bookingsKey) || '[]');
    
    return bookings.find(booking => booking.date === date);
}

// Check User Bookings
function checkUserBookings() {
    if (!currentUser) return;
    
    const bookingsKey = `bookings_${currentUser.username}`;
    const bookings = JSON.parse(localStorage.getItem(bookingsKey) || '[]');
    
    const pendingContainer = document.getElementById('pendingBookings');
    const confirmedContainer = document.getElementById('confirmedBookings');
    const pendingInfo = document.getElementById('pendingInfo');
    const confirmedInfo = document.getElementById('confirmedInfo');
    
    const pendingBookings = bookings.filter(b => b.status === 'pending' && b.type === 'normal');
    const confirmedBookings = bookings.filter(b => b.status === 'booked' && b.type === 'normal');
    
    if (pendingBookings.length > 0 && pendingContainer && pendingInfo) {
        const booking = pendingBookings[0];
        pendingInfo.textContent = `Your booking for ${booking.date} is pending approval. You will be notified once approved.`;
        pendingContainer.classList.remove('hidden');
    } else if (pendingContainer) {
        pendingContainer.classList.add('hidden');
    }
    
    if (confirmedBookings.length > 0 && confirmedContainer && confirmedInfo) {
        const booking = confirmedBookings[0];
        confirmedInfo.textContent = `Your booking for ${booking.date} has been confirmed! See you at the park!`;
        confirmedContainer.classList.remove('hidden');
    } else if (confirmedContainer) {
        confirmedContainer.classList.add('hidden');
    }
}

// Open Booking Modal
function openBookingModal(date) {
    selectedDate = date;
    
    const modal = document.getElementById('bookingModal');
    const selectedDateElement = document.getElementById('selectedDate');
    const bookingUsername = document.getElementById('bookingUsername');
    
    if (!modal) return;
    
    // Show loading
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        if (selectedDateElement) {
            selectedDateElement.textContent = date;
        }
        
        if (bookingUsername && currentUser) {
            bookingUsername.value = currentUser.username;
        }
        
        modal.classList.remove('hidden');
    }, 800);
}

// Close Booking Modal
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('hidden');
        
        // Reset form
        document.getElementById('contactType').value = '';
        document.getElementById('contactUsername').value = '';
        document.getElementById('acceptRules').checked = false;
    }
}

// Handle Booking Confirmation
function handleBookingConfirmation() {
    const username = document.getElementById('bookingUsername').value.trim();
    const contactType = document.getElementById('contactType').value;
    const contactUsername = document.getElementById('contactUsername').value.trim();
    const acceptRules = document.getElementById('acceptRules').checked;
    
    // Validation
    if (!username || username !== currentUser.username) {
        showToast('Please confirm your username correctly', 'error');
        return;
    }
    
    if (!contactType) {
        showToast('Please select a contact platform (Discord or TikTok)', 'error');
        return;
    }
    
    if (!contactUsername) {
        showToast('Please enter your contact username', 'error');
        return;
    }
    
    // Validate contact username format
    if (contactType === 'discord' && !validateDiscordUsername(contactUsername)) {
        showToast('Invalid Discord username format', 'error');
        return;
    }
    
    if (contactType === 'tiktok' && !validateTikTokUsername(contactUsername)) {
        showToast('Invalid TikTok username format', 'error');
        return;
    }
    
    if (!acceptRules) {
        showToast('Please accept the booking rules', 'error');
        return;
    }
    
    // Show loading
    closeBookingModal();
    showLoading();
    
    setTimeout(() => {
        // Save booking
        const booking = {
            date: selectedDate,
            username: username,
            contactType: contactType,
            contactUsername: contactUsername,
            status: 'pending',
            type: 'normal',
            timestamp: new Date().toISOString()
        };
        
        const bookingsKey = `bookings_${currentUser.username}`;
        const bookings = JSON.parse(localStorage.getItem(bookingsKey) || '[]');
        bookings.push(booking);
        localStorage.setItem(bookingsKey, JSON.stringify(bookings));
        
        // Send webhook
        sendWebhook(webhooks.normalBooking, {
            username: username,
            date: selectedDate,
            contactType: contactType,
            contactUsername: contactUsername,
            status: 'PENDING'
        });
        
        hideLoading();
        showToast('Booking request submitted! Status: PENDING', 'success');
        
        // Refresh UI
        checkUserBookings();
        updateCalendar();
    }, 1500);
}

// Validate Discord Username
function validateDiscordUsername(username) {
    // Discord username can contain letters, numbers, underscores, and periods
    return username.length >= 2 && username.length <= 32;
}

// Validate TikTok Username
function validateTikTokUsername(username) {
    // TikTok username starts with @ and contains letters, numbers, underscores, and periods
    return username.length >= 2 && username.length <= 24;
}

// Check Golden Ticket Status
function checkGoldenTicketStatus() {
    if (!goldenTicket.enabled) return;
    
    const goldenSection = document.getElementById('goldenTicketSection');
    const winnerBanner = document.getElementById('winnerBanner');
    
    // Check if there are any available golden ticket events
    const availableEvents = Object.keys(goldenTicket.events).filter(date => {
        const event = goldenTicket.events[date];
        return !event.completed && event.winner === '';
    });
    
    if (availableEvents.length > 0 && goldenSection) {
        goldenSection.classList.remove('hidden');
    }
    
    // Check if current user is a winner
    if (currentUser) {
        const winnerEvents = Object.keys(goldenTicket.events).filter(date => {
            const event = goldenTicket.events[date];
            return event.winner === currentUser.username;
        });
        
        if (winnerEvents.length > 0 && winnerBanner) {
            winnerBanner.classList.remove('hidden');
            createConfetti();
        }
    }
}

// Create Confetti
function createConfetti() {
    const container = document.querySelector('.confetti-container');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = ['#ff6b35', '#ffd700', '#ff8c42', '#764ba2'][Math.floor(Math.random() * 4)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = Math.random();
        confetti.style.animation = `float ${2 + Math.random() * 3}s linear infinite`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(confetti);
    }
}

// Start Golden Ticket Flow
function startGoldenTicketFlow() {
    const modal = document.getElementById('goldenModal');
    if (!modal) return;
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        // Reset all steps
        document.getElementById('goldenStep1').classList.remove('hidden');
        document.getElementById('goldenStep2').classList.add('hidden');
        document.getElementById('goldenStep3').classList.add('hidden');
        document.getElementById('goldenStep4').classList.add('hidden');
        
        modal.classList.remove('hidden');
    }, 1000);
}

// Show Golden Step 2
function showGoldenStep2() {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        document.getElementById('goldenStep1').classList.add('hidden');
        document.getElementById('goldenStep2').classList.remove('hidden');
        
        // Generate golden calendar
        generateGoldenCalendar();
    }, 1500);
}

// Generate Golden Calendar
function generateGoldenCalendar() {
    const calendarElement = document.getElementById('goldenCalendar');
    if (!calendarElement) return;
    
    calendarElement.innerHTML = '';
    
    // Get available golden ticket events
    const availableEvents = Object.keys(goldenTicket.events).filter(date => {
        const event = goldenTicket.events[date];
        return !event.completed && event.winner === '';
    });
    
    availableEvents.forEach(date => {
        const dateElement = document.createElement('div');
        dateElement.className = 'golden-date';
        dateElement.textContent = date;
        
        dateElement.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('.golden-date').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Select this date
            dateElement.classList.add('selected');
            selectedGoldenDate = date;
            
            // Show continue button
            document.getElementById('goldenContinue2').classList.remove('hidden');
        });
        
        calendarElement.appendChild(dateElement);
    });
}

// Show Golden Step 3
function showGoldenStep3() {
    if (!selectedGoldenDate) {
        showToast('Please select a date', 'error');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        document.getElementById('goldenStep2').classList.add('hidden');
        document.getElementById('goldenStep3').classList.remove('hidden');
    }, 1000);
}

// Handle Golden Ticket Confirmation
function handleGoldenTicketConfirmation() {
    const contactType = document.getElementById('goldenContactType').value;
    const contactUsername = document.getElementById('goldenContactUsername').value.trim();
    const acceptRules = document.getElementById('goldenAcceptRules').checked;
    
    // Validation
    if (!contactType) {
        showToast('Please select a contact platform', 'error');
        return;
    }
    
    if (!contactUsername) {
        showToast('Please enter your contact username', 'error');
        return;
    }
    
    if (!acceptRules) {
        showToast('Please accept the rules', 'error');
        return;
    }
    
    // Show loading
    showLoading();
    
    setTimeout(() => {
        // Save golden ticket claim
        const claim = {
            date: selectedGoldenDate,
            username: currentUser.username,
            contactType: contactType,
            contactUsername: contactUsername,
            status: 'pending',
            type: 'golden',
            timestamp: new Date().toISOString()
        };
        
        const bookingsKey = `bookings_${currentUser.username}`;
        const bookings = JSON.parse(localStorage.getItem(bookingsKey) || '[]');
        bookings.push(claim);
        localStorage.setItem(bookingsKey, JSON.stringify(bookings));
        
        // Add to pending users in golden ticket event
        if (goldenTicket.events[selectedGoldenDate]) {
            goldenTicket.events[selectedGoldenDate].pendingUsers.push(currentUser.username);
        }
        
        // Send webhook
        sendWebhook(webhooks.goldenTicket, {
            username: currentUser.username,
            date: selectedGoldenDate,
            contactType: contactType,
            contactUsername: contactUsername,
            status: 'PENDING GOLDEN TICKET',
            type: 'GOLDEN TICKET CLAIM'
        });
        
        hideLoading();
        
        // Show final step
        document.getElementById('goldenStep3').classList.add('hidden');
        document.getElementById('goldenStep4').classList.remove('hidden');
    }, 2000);
}

// Close Golden Modal
function closeGoldenModal() {
    const modal = document.getElementById('goldenModal');
    if (modal) {
        modal.classList.add('hidden');
        
        // Reset form
        document.getElementById('goldenContactType').value = '';
        document.getElementById('goldenContactUsername').value = '';
        document.getElementById('goldenAcceptRules').checked = false;
        selectedGoldenDate = null;
        
        // Refresh UI
        checkGoldenTicketStatus();
    }
}

// Send Webhook
async function sendWebhook(webhookUrl, data) {
    try {
        const embed = {
            title: data.type || 'New Booking Request',
            color: data.type === 'GOLDEN TICKET CLAIM' ? 0xFFD700 : 0xFF6B35,
            fields: [
                {
                    name: 'Username',
                    value: data.username,
                    inline: true
                },
                {
                    name: 'Date',
                    value: data.date,
                    inline: true
                },
                {
                    name: 'Status',
                    value: data.status,
                    inline: true
                },
                {
                    name: 'Contact Type',
                    value: data.contactType.toUpperCase(),
                    inline: true
                },
                {
                    name: 'Contact Username',
                    value: data.contactUsername,
                    inline: true
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: 'Heide Park Roblox Booking System'
            }
        };
        
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });
    } catch (error) {
        console.error('Webhook error:', error);
    }
}

// Show Loading
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

// Hide Loading
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Show Toast
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 4000);
}

// Scroll to Booking
function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navigation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-link')) {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        e.target.classList.add('active');
        
        // Scroll to section
        const href = e.target.getAttribute('href');
        if (href === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href === '#booking') {
            scrollToBooking();
        }
    }
});
