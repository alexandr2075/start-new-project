import {client} from "../../db/dbMongo";
import {SETTINGS} from "../../settings";
import {UserInputDBModel} from "../../models/usersModels";
import {matchPasswords} from "../../helpers/genHashPassword";

export const authDBRepository = {}