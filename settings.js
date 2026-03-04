// ====== HEIDE PARK ROBLOX - SETTINGS ======
// All configurable texts and settings

const SETTINGS = {
    // ====== WEBHOOKS ======
    webhooks: {
        normal: 'https://discordapp.com/api/webhooks/1473284499931533438/eZnWVr5ohWSBWLMsGSRNtWC5x3EPGHVnl9HsTjZf7pO9Ayhz-OjH7dNiacpB1ZMhauNS',
        golden: 'https://discordapp.com/api/webhooks/1478765370515914764/MWtoQRSeeujSimtfOBJ8-KOQ7lR7kwd-OCZG1ObXf3tH8FJ-dFqeKwbjG-D3YoJO9JIS'
    },

    // ====== LOGIN PAGE ======
    login: {
        title: 'Welcome to Heide Park Roblox',
        subtitle: 'Please enter your username to continue',
        inputPlaceholder: 'Enter your username',
        buttonText: 'Continue',
        errorEmpty: 'Please enter a username',
        errorTooShort: 'Username must be at least 3 characters'
    },

    // ====== NAVIGATION ======
    nav: {
        home: 'Home',
        booking: 'Booking',
        golden: 'Golden Ticket',
        myBookings: 'My Reservations',
        status: 'Status',
        info: 'Info & Help',
        logout: 'Logout'
    },

    // ====== HOME PAGE ======
    home: {
        heroTitle1: 'Welcome to Heide Park Roblox',
        heroSubtitle1: 'Experience the ultimate theme park adventure',
        heroButton: 'Book Now',
        
        goldenTeaserTitle: 'Golden Ticket Available!',
        goldenTeaserText: 'A legendary experience awaits',
        goldenButton: 'Claim Now',
        
        infoCardBookingTitle: 'Easy Booking',
        infoCardBookingText: 'Reserve your spot in just a few clicks',
        infoCardGoldenTitle: 'Golden Tickets',
        infoCardGoldenText: 'Win exclusive VIP experiences',
        infoCardSecureTitle: 'Secure & Fast',
        infoCardSecureText: 'Your reservations are safe with us',
        
        newsTitle: 'Latest News'
    },

    // ====== BOOKING PAGE ======
    booking: {
        pageTitle: 'Book Your Visit',
        selectDate: 'Select a date to continue',
        
        filterAll: 'All',
        filterAvailable: 'Available',
        filterPending: 'Pending',
        filterBooked: 'Booked',
        filterThisMonth: 'This Month',
        filterNextMonth: 'Next Month',
        
        months: ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'],
        
        modalTitle: 'Book for',
        modalSelectTimeslot: 'Select a time slot',
        modalContact: 'Contact Information',
        modalContactHint: 'Please provide either Discord or TikTok',
        modalDiscordPlaceholder: 'Discord Username',
        modalTiktokPlaceholder: 'TikTok Username',
        modalRules: 'Rules & Guidelines',
        modalRulesText: 'By booking, you agree to follow all park rules and guidelines. Be respectful, arrive on time, and have fun!',
        modalReview: 'Please review your booking',
        modalReviewDate: 'Date',
        modalReviewTimeslot: 'Timeslot',
        modalReviewContact: 'Contact',
        modalReviewStatus: 'Status',
        modalConfirm: 'Confirm Booking',
        modalCancel: 'Cancel',
        modalAccept: 'Accept & Continue',
        
        successTitle: 'Booking Submitted!',
        successMessage: 'Your booking request has been submitted and is now pending approval.',
        successPending: 'Status: Pending',
        
        timeslots: {
            morning: { name: 'Morning', time: '09:00 - 12:00' },
            noon: { name: 'Noon', time: '12:00 - 15:00' },
            evening: { name: 'Evening', time: '15:00 - 18:00' },
            night: { name: 'Night', time: '18:00 - 21:00' }
        }
    },

    // ====== GOLDEN TICKET ======
    golden: {
        mainTitle: 'Golden Ticket',
        mainSubtitle: 'A legendary experience awaits you',
        claimButton: 'Claim Golden Ticket',
        
        winnerTitle: '🎉 YOU WON THE GOLDEN TICKET! 🎉',
        winnerPerks: {
            access: 'Private Park Access',
            stay: 'Overnight Stay',
            support: 'Owner Support',
            inclusive: 'All Inclusive'
        },
        
        modalTitle: 'Claim Golden Ticket',
        modalSelectEvent: 'Select an event date',
        modalLoading: 'Preparing your claim...',
        modalClaimTitle: 'Golden Ticket Claim',
        modalClaimText: 'You are about to claim a legendary golden ticket. Are you ready?',
        modalClaimButton: 'Yes, Claim It!',
        modalContact: 'Contact Information',
        modalRules: 'Golden Ticket Rules',
        modalRulesText: 'This is a special VIP experience. You will have exclusive access to the park with special privileges. Please be punctual and respectful.',
        modalReview: 'Review Your Golden Claim',
        modalWaitingTitle: 'Claim Submitted',
        modalWaitingText: 'Please wait. The winner will be announced soon.',
        
        countdownPrefix: 'Winner in: ',
        countdownEnded: 'Event Ended',
        
        noEventsTitle: 'No Active Events',
        noEventsText: 'There are currently no golden ticket events available. Check back soon!'
    },

    // ====== MY BOOKINGS ======
    myBookings: {
        pageTitle: 'My Reservations',
        noBookings: 'You have no reservations yet',
        noBookingsText: 'Start by booking a visit or claiming a golden ticket!',
        
        normalTicket: 'Regular Booking',
        goldenTicket: 'Golden Ticket',
        
        statusPending: 'Pending',
        statusBooked: 'Confirmed',
        statusExpired: 'Expired',
        statusWinner: 'Winner',
        statusWaiting: 'Waiting'
    },

    // ====== STATUS PAGE ======
    status: {
        pageTitle: 'Booking Status',
        availableText: 'Dates ready for booking',
        pendingText: 'Awaiting confirmation',
        bookedText: 'Successfully reserved',
        expiredText: 'Reservation has expired',
        soldoutText: 'No slots available'
    },

    // ====== INFO PAGE ======
    info: {
        pageTitle: 'Information & Help',
        
        howToBookTitle: 'How to Book',
        bookingSteps: [
            'Navigate to the Booking page',
            'Select an available date',
            'Choose your preferred time slot',
            'Enter your contact information',
            'Review and confirm your booking'
        ],
        
        rulesTitle: 'Rules & Guidelines',
        rulesContent: 'Please follow all park rules for a safe and enjoyable experience. Be respectful to staff and other visitors. No inappropriate behavior will be tolerated. Have fun!',
        
        privacyTitle: 'Privacy & Rules',
        privacyDataUsage: 'Data Usage: Your information is only used for booking management and will not be shared with third parties.',
        privacyFanProject: 'Fan Project: This is a community-driven fan project for Roblox enthusiasts.',
        privacyNoPayments: 'No Payments: All bookings are completely free. We never ask for payment information.',
        
        contactTitle: 'Contact Support',
        contactText: 'Need help? Reach out to us via Discord or TikTok. Our team is here to assist you with any questions or concerns.'
    },

    // ====== ERROR MESSAGES ======
    errors: {
        dateFull: 'This date is fully booked',
        contactMissing: 'Please provide contact information',
        limitReached: 'You have reached the booking limit',
        tryAnotherDate: 'Please try another date',
        invalidTimeslot: 'Please select a valid time slot',
        alreadyBooked: 'You already have a booking for this date',
        goldenActive: 'You already have an active golden ticket claim',
        networkError: 'Network error. Please try again.',
        unknownError: 'An unexpected error occurred'
    },

    // ====== NOTIFICATIONS ======
    notifications: {
        requestReceived: 'Request Received',
        requestReceivedText: 'Your booking request has been submitted',
        statusChanged: 'Status Changed',
        statusChangedText: 'Your booking status has been updated',
        winnerAnnounced: 'Winner Announced',
        winnerAnnouncedText: 'The golden ticket winner has been revealed',
        expired: 'Booking Expired',
        expiredText: 'Your pending booking has expired',
        bookingConfirmed: 'Booking Confirmed',
        bookingConfirmedText: 'Your reservation has been confirmed'
    },

    // ====== LOADING TEXTS ======
    loading: {
        default: 'Loading...',
        processing: 'Processing your request...',
        submitting: 'Submitting...',
        checking: 'Checking availability...',
        preparing: 'Preparing...'
    },

    // ====== CALENDAR SETTINGS ======
    calendarSettings: {
        "2026": {
            "March": {
                "07": {
                    enabled: true,
                    bookedUsers: ["NimmiLo"],
                    pendingUsers: [],
                    soldOut: false,
                    timeslots: {
                        morning: { enabled: true, limit: 5, bookings: [] },
                        noon: { enabled: true, limit: 5, bookings: [] },
                        evening: { enabled: true, limit: 5, bookings: [] },
                        night: { enabled: false, limit: 0, bookings: [] }
                    }
                },
                "12": {
                    enabled: true,
                    bookedUsers: [],
                    pendingUsers: [],
                    soldOut: false,
                    timeslots: {
                        morning: { enabled: true, limit: 5, bookings: [] },
                        noon: { enabled: true, limit: 5, bookings: [] },
                        evening: { enabled: true, limit: 5, bookings: [] },
                        night: { enabled: true, limit: 3, bookings: [] }
                    }
                },
                "15": {
                    enabled: true,
                    bookedUsers: [],
                    pendingUsers: [],
                    soldOut: false,
                    timeslots: {
                        morning: { enabled: true, limit: 5, bookings: [] },
                        noon: { enabled: true, limit: 5, bookings: [] },
                        evening: { enabled: true, limit: 5, bookings: [] },
                        night: { enabled: false, limit: 0, bookings: [] }
                    }
                },
                "20": {
                    enabled: true,
                    bookedUsers: [],
                    pendingUsers: [],
                    soldOut: false,
                    timeslots: {
                        morning: { enabled: true, limit: 5, bookings: [] },
                        noon: { enabled: true, limit: 5, bookings: [] },
                        evening: { enabled: true, limit: 5, bookings: [] },
                        night: { enabled: true, limit: 3, bookings: [] }
                    }
                },
                "25": {
                    enabled: true,
                    bookedUsers: [],
                    pendingUsers: [],
                    soldOut: false,
                    timeslots: {
                        morning: { enabled: true, limit: 5, bookings: [] },
                        noon: { enabled: true, limit: 5, bookings: [] },
                        evening: { enabled: true, limit: 5, bookings: [] },
                        night: { enabled: false, limit: 0, bookings: [] }
                    }
                }
            },
            "April": {
                "05": {
                    enabled: true,
                    bookedUsers: [],
                    pendingUsers: [],
                    soldOut: false,
                    timeslots: {
                        morning: { enabled: true, limit: 5, bookings: [] },
                        noon: { enabled: true, limit: 5, bookings: [] },
                        evening: { enabled: true, limit: 5, bookings: [] },
                        night: { enabled: false, limit: 0, bookings: [] }
                    }
                },
                "10": {
                    enabled: true,
                    bookedUsers: [],
                    pendingUsers: [],
                    soldOut: false,
                    timeslots: {
                        morning: { enabled: true, limit: 5, bookings: [] },
                        noon: { enabled: true, limit: 5, bookings: [] },
                        evening: { enabled: true, limit: 5, bookings: [] },
                        night: { enabled: true, limit: 3, bookings: [] }
                    }
                },
                "18": {
                    enabled: true,
                    bookedUsers: [],
                    pendingUsers: [],
                    soldOut: false,
                    timeslots: {
                        morning: { enabled: true, limit: 5, bookings: [] },
                        noon: { enabled: true, limit: 5, bookings: [] },
                        evening: { enabled: true, limit: 5, bookings: [] },
                        night: { enabled: false, limit: 0, bookings: [] }
                    }
                },
                "24": {
                    enabled: true,
                    bookedUsers: [],
                    pendingUsers: [],
                    soldOut: false,
                    timeslots: {
                        morning: { enabled: true, limit: 5, bookings: [] },
                        noon: { enabled: true, limit: 5, bookings: [] },
                        evening: { enabled: true, limit: 5, bookings: [] },
                        night: { enabled: true, limit: 3, bookings: [] }
                    }
                }
            }
        }
    },

    // ====== GOLDEN TICKET SETTINGS ======
    goldenTicket: {
        enabled: true,
        events: {
            "2026-03-12": {
                pendingUsers: [],
                winner: "NimmiLo",
                completed: true,
                endTime: "2026-03-12T20:00:00"
            },
            "2026-04-10": {
                pendingUsers: [],
                winner: "",
                completed: false,
                endTime: "2026-04-10T20:00:00"
            }
        }
    },

    // ====== GOLDEN COUNTDOWN ======
    goldenCountdown: {
        enabled: true,
        text: 'Winner will be announced soon'
    },

    // ====== EXPIRY SETTINGS ======
    expiry: {
        pendingDays: 7, // Days before pending bookings expire
        autoCleanup: true
    },

    // ====== NEWS ITEMS ======
    news: [
        {
            title: 'Spring Season Opens',
            text: 'Join us for the grand opening of the spring season with special events and attractions!',
            date: '2026-03-01'
        },
        {
            title: 'New Rides Available',
            text: 'Experience our latest thrilling rides and attractions. Book your visit today!',
            date: '2026-03-05'
        },
        {
            title: 'Golden Ticket Events',
            text: 'Special golden ticket events are now live. Claim yours for an exclusive VIP experience!',
            date: '2026-03-10'
        }
    ]
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SETTINGS;
}
