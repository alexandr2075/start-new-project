import express from "express";
import {refreshTokenGuard} from "../auth-login/guards/refresh.token.guard";
import {securityService} from "./security-service";
import {HTTP_STATUS} from "../../settings";

export const securityRouter = express.Router();

// Получить все устройства
securityRouter.get('/devices',
    refreshTokenGuard,
    async (req, res) => {
        const devices = await securityService.getDevices(req.user.id);
        res.status(HTTP_STATUS.OK).json(devices);
    });

// Удалить все устройства кроме текущего
securityRouter.delete('/devices',
    refreshTokenGuard,
    async (req, res) => {
        const result = await securityService.deleteOtherDevices(
            req.user.id,
            req.user.deviceId!
        );

        if (result) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT);
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND);
        }
    });

// Удалить конкретное устройство
securityRouter.delete('/devices/:deviceId',
    refreshTokenGuard,
    async (req, res) => {
        const result = await securityService.deleteDevice(
            req.params.deviceId,
            req.user.id
        );

        switch (result.status) {
            case HTTP_STATUS.FORBIDDEN:
                res.sendStatus(HTTP_STATUS.FORBIDDEN);
                break
            case HTTP_STATUS.NO_CONTENT:
                res.sendStatus(HTTP_STATUS.NO_CONTENT);
                break
            case HTTP_STATUS.NOT_FOUND:
                res.sendStatus(HTTP_STATUS.NOT_FOUND);
                break
        }
    }); 