import { SignJWT, jwtVerify } from "jose"

export type AdminTokenPayload = {
    sub: string
    email: string
    name: string
    role: string
}

const DEFAULT_EXPIRY = "1d"

function getSecret() {
    const secret = process.env.ADMIN_JWT_SECRET
    if (!secret) {
        throw new Error("ADMIN_JWT_SECRET is not set")
    }
    return new TextEncoder().encode(secret)
}

export async function signAdminToken(payload: AdminTokenPayload, expiresIn = DEFAULT_EXPIRY) {
    const secret = getSecret()
    return new SignJWT({
        email: payload.email,
        name: payload.name,
        role: payload.role,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(payload.sub)
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(secret)
}

export async function verifyAdminToken(token: string) {
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)
    return {
        sub: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as string,
        exp: payload.exp,
    }
}


