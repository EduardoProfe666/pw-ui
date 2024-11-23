import jwt from 'jsonwebtoken';

interface Claims {
    username: string;
    role: string;
    email?: string;
    fullName?: string;
    userId?: number;
    studentId?: number;
}

export const extractClaimsFromToken = (token: string): Claims | null => {
    try {
        const decoded = jwt.decode(token) as Claims;

        if (!decoded) {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error('Error decoding jwt:', error);
        return null;
    }
};