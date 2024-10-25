import {dbBlogs} from "../../db/dbBlogs";
import {dbPosts} from "../../db/dbPosts";

export const deleteAllData = () => {
    dbBlogs.splice(0, dbBlogs.length)
    dbPosts.splice(0, dbPosts.length)
    return true
}