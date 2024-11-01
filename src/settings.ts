import {config} from 'dotenv'

config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3000,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING_ALL_DATA: '/testing/all-data'
    },
    ADMIN_AUTH: process.env.ADMIN_AUTH || '',
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    DB_NAME: process.env.DB_NAME || '',
}

export const HTTP_STATUS = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

}