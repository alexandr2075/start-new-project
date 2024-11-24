import {config} from 'dotenv'

config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3000,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        COMMENTS: '/comments',
        AUTH: '/auth',
        TESTING_ALL_DATA: '/testing/all-data'
    },
    NAME_COLLECTIONS: {
        BLOGS: 'blogs',
        POSTS: 'posts',
        USERS: 'users',
        COMMENTS: 'comments',
    },
    ADMIN_AUTH: process.env.ADMIN_AUTH || '',
    MONGO_URL: '123',  //process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    DB_NAME: process.env.DB_NAME || '',
    EXP_TIME: process.env.EXP_TIME || '',
    SECRET_KEY: process.env.SECRET_KEY || '',
    SENDER_EMAIL: process.env.SENDER_EMAIL || '',
    SENDER_PASSWORD: process.env.SENDER_PASSWORD || '',
}

export enum HTTP_STATUS {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,

}