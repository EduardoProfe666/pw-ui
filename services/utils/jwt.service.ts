interface Claims {
    username: string;
    role: string;
    email?: string;
    fullName?: string;
    userId?: number;
    studentId?: number;
}

const decodeBase64 = (str: string): string => {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    return atob(base64 + padding);
};

export const extractClaimsFromToken = (token: string): Claims | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid token format');
        }

        const payload = parts[1];
        const decodedPayload = decodeBase64(payload);

        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};