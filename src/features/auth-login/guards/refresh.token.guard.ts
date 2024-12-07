import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../../helpers/jwtService";
import {SETTINGS} from "../../../settings";
import {securityRepository} from "../../security/security-repository";

export const refreshTokenGuard = async (req: Request,
                                        res: Response,
                                        next: NextFunction) => {
    if (!req.cookies.refreshToken) {
        res.sendStatus(401);
        return
    }
    const payload = await jwtService.verifyToken(req.cookies.refreshToken, SETTINGS.SECRET_KEY_FOR_REFRESH_TOKEN);

    if (!payload) {
        res.sendStatus(401);
        return
    }
    const devices = await securityRepository.findDevicesByUserIdIat(payload.userId, payload.iat);
    console.log('devices', devices);
    if (!devices) {
        res.sendStatus(401);
        return
    }
    req.user = {id: payload.userId, deviceId: payload.deviceId}
    return next();
}

