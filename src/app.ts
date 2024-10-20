import express from 'express'
import cors from 'cors'
import {hometaskRouter} from "./features/hometask/hometask-router";
import {blogsRouter} from "./features/blogs/blogs-router";
import {postsRouter} from "./features/posts/posts-router";
import {testingRouter} from "./features/testing/testing-router";

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк

app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({version: '20001.0'})
})

app.use('/', hometaskRouter);


// app.use('/ht_02/api/blogs', blogsRouter);
// app.use('/ht_02/api/posts', postsRouter);
// app.use('/ht_02/api/testing/all-data', testingRouter);
// app.get(SETTINGS.PATH.VIDEOS, getVideosController)
// app.use(SETTINGS.PATH.VIDEOS, videosRouter)