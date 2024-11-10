const bcrypt = require('bcrypt');


export const genHashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

export const matchPasswords = async (password: string, passwordHash: string) => {
    return await bcrypt.compare(password, passwordHash);
}
