import {cookie} from "express-validator";

export const checkRefreshTokenCookieMiddleware = cookie('refreshToken')
    .exists() // Проверяем, что поле существует
    .not().isEmpty()
    .withMessage('refresh token required')
    .bail() // Останавливаем дальнейшие проверки, если токен отсутствует
    .isJWT()
    .withMessage('not a valid JWT');

