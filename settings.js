// Settings.js - Data Management for Heide Park Roblox Booking System

const HeideParkSettings = {
    // Default webhook URL (replace with your own)
    DEFAULT_WEBHOOK_URL: "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",

    // Get settings from localStorage
    getSettings() {
        const stored = localStorage.getItem("heidepark_settings");
        if (stored) {
            return JSON.parse(stored);
        }

        const defaultSettings = {
            maxSlotsPerDay: 4,
            webhookUrl: this.DEFAULT_WEBHOOK_URL,
            closedDays: []
        };

        localStorage.setItem("heidepark_settings", JSON.stringify(defaultSettings));
        return defaultSettings;
    },

    // Save settings to localStorage
    saveSettings(settings) {
        localStorage.setItem("heidepark_settings", JSON.stringify(settings));
    },

    // Get all bookings from localStorage
    getBookings() {
        const stored = localStorage.getItem("heidepark_bookings");
        if (stored) {
            return JSON.parse(stored);
        }
        return [];
    },

    // Save bookings to localStorage
    saveBookings(bookings) {
        localStorage.setItem("heidepark_bookings", JSON.stringify(bookings));
    },

    // Add a new booking
    addBooking(username, date) {
        const bookings = this.getBookings();
        const settings = this.getSettings();

        // Check if user already booked this date
        if (bookings.some(b => b.username === username && b.date === date)) {
            return false;
        }

        // Check if day is full
        const dayBookings = bookings.filter(b => b.date === date);
        if (dayBookings.length >= settings.maxSlotsPerDay) {
            return false;
        }

        bookings.push({
            username: username,
            date: date,
            timestamp: Date.now()
        });

        this.saveBookings(bookings);
        return true;
    },

    // Check if user has booked for a specific date
    hasUserBookedDate(username, date) {
        const bookings = this.getBookings();
        return bookings.some(b => b.username === username && b.date === date);
    },

    // Check if user has any booking
    hasUserAnyBooking(username) {
        const bookings = this.getBookings();
        return bookings.some(b => b.username === username);
    },

    // Get bookings count for a date
    getBookingsCountForDate(date) {
        const bookings = this.getBookings();
        return bookings.filter(b => b.date === date).length;
    },

    // Send booking to Discord webhook
    async sendToDiscordWebhook(username, date) {
        const settings = this.getSettings();

        if (!settings.webhookUrl || settings.webhookUrl === this.DEFAULT_WEBHOOK_URL) {
            console.log("Webhook not configured, skipping Discord notification");
            return true;
        }

        try {
            const formattedDate = new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });

            const response = await fetch(settings.webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    embeds: [{
                        title: "🎢 New Heide Park Roblox Booking",
                        color: 16744192, // Orange color
                        fields: [
                            {
                                name: "Username",
                                value: username,
                                inline: true
                            },
                            {
                                name: "Date",
                                value: formattedDate,
                                inline: true
                            },
                            {
                                name: "Booking Time",
                                value: new Date().toLocaleString("en-US"),
                                inline: false
                            }
                        ],
                        footer: {
                            text: "Heide Park Roblox Reservation System"
                        },
                        timestamp: new Date().toISOString()
                    }]
                })
            });

            return response.ok;
        } catch (error) {
            console.error("Failed to send Discord webhook:", error);
            return false;
        }
    },

    // Clear old bookings (past dates)
    clearOldBookings() {
        const bookings = this.getBookings();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validBookings = bookings.filter(b => {
            const bookingDate = new Date(b.date);
            return bookingDate >= today;
        });

        this.saveBookings(validBookings);
    },

    // Delete a booking (admin function)
    deleteBooking(username, date) {
        const bookings = this.getBookings();
        const filtered = bookings.filter(b => !(b.username === username && b.date === date));

        if (filtered.length < bookings.length) {
            this.saveBookings(filtered);
            return true;
        }

        return false;
    },

    // Get user's current login
    getUserLogin() {
        const stored = localStorage.getItem("heidepark_user");
        if (stored) {
            return JSON.parse(stored);
        }
        return null;
    },

    // Save user login
    saveUserLogin(username, age) {
        const login = {
            username: username,
            age: age,
            loginTime: Date.now()
        };
        localStorage.setItem("heidepark_user", JSON.stringify(login));
    },

    // Clear user login
    clearUserLogin() {
        localStorage.removeItem("heidepark_user");
    }
};
