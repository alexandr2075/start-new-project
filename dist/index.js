"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const settings_1 = require("./settings");
const db_1 = require("./db/db");
const createApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.run(settings_1.SETTINGS.MONGO_URL);
    app_1.app.listen(settings_1.SETTINGS.PORT, () => {
        console.log('...server started in port ' + settings_1.SETTINGS.PORT);
    });
});
createApp();
//# sourceMappingURL=index.js.map