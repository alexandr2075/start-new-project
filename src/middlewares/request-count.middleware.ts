import {NextFunction, Request, Response} from "express";
import {requestsRepository} from "../features/requests/requests-repository";
import {HTTP_STATUS} from "../settings";

const MAX_ATTEMPTS = 5; // Максимальное количество попыток
const WINDOW_SECONDS = 10; // Окно в секундах

export const requestCountMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || '';
    const url = req.originalUrl;

    // Сохраняем текущий запрос
    await requestsRepository.saveRequest({
        ip,
        url,
        date: new Date()
    });

    // Проверяем количество запросов за последние 10 секунд
    const attemptsCount = await requestsRepository.countRecentAttempts(
        ip,
        url,
        WINDOW_SECONDS
    );

    if (attemptsCount > MAX_ATTEMPTS) {
        res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS);
        return;
    }

    next();
}