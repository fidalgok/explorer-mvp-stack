import DOMPurify from 'isomorphic-dompurify';

export function sanitizeUserInput(input: string | null): string | null {
    if (!input) return null;

    // Sanitize the input using DOMPurify
    const sanitized = DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [], // Strip all HTML tags
        ALLOWED_ATTR: [], // Strip all attributes
    });

    // Additional URL sanitization for photoURL
    return sanitized.trim();
}

export function sanitizePhotoURL(url: string | null): string | null {
    if (!url) return null;

    try {
        const sanitized = sanitizeUserInput(url);
        if (!sanitized) return null;

        // Create URL object to validate URL structure
        const urlObject = new URL(sanitized);

        // Only allow specific domains (e.g., Google's domains for profile pictures)
        const allowedDomains = [
            'googleusercontent.com',
            'google.com',
            // Add other trusted domains as needed
        ];

        if (!allowedDomains.some(domain => urlObject.hostname.endsWith(domain))) {
            return null;
        }

        return sanitized;
    } catch {
        // If URL parsing fails, return null
        return null;
    }
}