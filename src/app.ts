import express from 'express'
import cors from 'cors'
// import {hometaskRouter} from "./features/hometask/hometask-router";
import {blogsRouter} from "./features/blogs/blogs-router";
import {postsRouter} from "./features/posts/posts-router";
import {testingRouter} from "./features/testing/testing-router";
import {SETTINGS} from "./settings";

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк

app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({version: '20001.0'})
})

// app.use('/', hometaskRouter);


app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.TESTING_ALL_DATA, testingRouter);
// app.get(SETTINGS.PATH.VIDEOS, getVideosController)
// app.use(SETTINGS.PATH.VIDEOS, videosRouter)