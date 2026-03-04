// Settings Configuration File
// This file contains all configurable settings for the Heide Park Roblox booking system

// Fun Facts System
const funFacts = [
    "Did you know? Heide Park Roblox has over 25 thrilling attractions!",
    "Tip: Arrive early to experience the most popular rides with shorter wait times!",
    "Did you know? Our park opens at 10:00 AM and closes at 10:00 PM!",
    "Tip: Don't forget to stay hydrated throughout your visit!",
    "Did you know? We have special VIP experiences available for Golden Ticket winners!",
    "Tip: Check the weather forecast before your visit to plan accordingly!",
    "Did you know? Our fastest roller coaster reaches speeds of up to 120 km/h!",
    "Tip: Download the park map to navigate easily between attractions!",
    "Did you know? We host special events throughout the year!",
    "Tip: Booking in advance guarantees your preferred date!",
    "Did you know? Our park has won multiple awards for best virtual theme park!",
    "Tip: Follow us on social media for exclusive updates and promotions!",
    "Did you know? We have family-friendly rides for all ages!",
    "Tip: Wear comfortable shoes for walking around the park!",
    "Did you know? Our Golden Ticket is one of the rarest experiences in Roblox!",
    "Tip: Visit during weekdays for a less crowded experience!",
    "Did you know? We offer all-inclusive food packages for VIP guests!",
    "Tip: Make sure to check all the shows scheduled for your visit day!",
    "Did you know? Our park was inspired by real-world theme parks!",
    "Tip: Contact information is required for all bookings - Discord or TikTok!"
];

// Calendar Settings
// Configure available dates, bookings, and sold-out dates
const calendarSettings = {
    "2026": {
        "March": {
            "07": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "08": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "09": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "10": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "11": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "12": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "13": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "14": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "15": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "16": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "17": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "18": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            }
        },
        "April": {
            "01": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "02": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "03": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "04": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "05": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            }
        }
    },
    "2027": {
        "January": {
            "15": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            },
            "16": {
                enabled: true,
                bookedUsers: [],
                pendingUsers: [],
                soldOut: false
            }
        }
    }
};

// Golden Ticket System
// Configure golden ticket events and winners
const goldenTicket = {
    enabled: true, // Set to false to disable golden ticket system
    events: {
        "2026-03-12": {
            pendingUsers: [],
            winner: "", // Username of the winner (empty = no winner yet)
            completed: false // Set to true when winner is chosen
        },
        "2026-03-15": {
            pendingUsers: [],
            winner: "",
            completed: false
        },
        "2026-04-01": {
            pendingUsers: [],
            winner: "",
            completed: false
        }
    }
};

// Webhook URLs
const webhooks = {
    normalBooking: "https://discordapp.com/api/webhooks/1473284499931533438/eZnWVr5ohWSBWLMsGSRNtWC5x3EPGHVnl9HsTjZf7pO9Ayhz-OjH7dNiacpB1ZMhauNS",
    goldenTicket: "https://discordapp.com/api/webhooks/1478765370515914764/MWtoQRSeeujSimtfOBJ8-KOQ7lR7kwd-OCZG1ObXf3tH8FJ-dFqeKwbjG-D3YoJO9JIS"
};

// System Settings
const systemSettings = {
    minAge: 8, // Minimum age requirement
    maxBookingDaysAhead: 14, // Maximum days ahead for booking (2 weeks)
    visitorCounterStart: 15420 // Starting visitor count
};

// Export settings for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        funFacts,
        calendarSettings,
        goldenTicket,
        webhooks,
        systemSettings
    };
}
