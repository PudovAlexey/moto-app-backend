/**
 * Интерфейс для JWT-токена
 */
export type JwtPayload = {
    sub:string
    email: string
    type: 'refresh' | 'access'
}
