import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function verifyToken(req) {
    try {
        const token = req.cookies.get('auth_token')?.value ||
            req.headers.get('authorization')?.replace('Bearer ', '');

        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export function generateToken(userId, email) {
    return jwt.sign(
        { userId, email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}
