class ZimbabwePhoneNumberChecker {
    constructor(phoneNumber) {
        this.phoneNumber = phoneNumber;
        this.normalizedPhoneNumber = this.normalizePhoneNumber(phoneNumber);
    }

    normalizePhoneNumber(phoneNumber) {
        // Remove any non-digit characters
        let cleaned = phoneNumber.replace(/\D/g, '');
        
        // Check if it starts with 0 and convert to international format
        if (cleaned.startsWith('0')) {
            cleaned = '263' + cleaned.substring(1);
        }
        
        // Check if it starts with +263 and convert to 263
        if (cleaned.startsWith('263')) {
            cleaned = '263' + cleaned.substring(3);
        }
        
        return cleaned;
    }

    getServiceProvider() {
        const normalized = this.normalizedPhoneNumber;
        
        if (normalized.startsWith('26377') || normalized.startsWith('26378')) {
            return "Econet";
        } else if (normalized.startsWith('26371') || normalized.startsWith('26373')) {
            return "NetOne";
        } else if (normalized.startsWith('26375') || normalized.startsWith('26376')) {
            return "Telecel";
        } else {
            return "Unknown";
        }
    }

    getNormalizedPhoneNumber() {
        return this.normalizedPhoneNumber;
    }

    isValidZimbabweanNumber() {
        const normalized = this.normalizedPhoneNumber;
        return normalized.length === 12 && normalized.startsWith('2637');
    }
}

module.exports = { ZimbabwePhoneNumberChecker };