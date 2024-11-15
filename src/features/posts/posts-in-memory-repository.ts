import {dbPosts} from "../../db/dbPosts";
import {blogsRepository} from "../blogs/blogs-in-memory-repository";
import {PostInputModel, PostViewModel} from "../../models/postsModels";

export const postsRepository = {
    getAllPosts(): PostViewModel[] {
        return dbPosts
    },

    async createPost(post: PostInputModel) {
        const {title, shortDescription, content, blogId} = post;
        let blog
        if (blogId) {
            blog = await blogsRepository.getBlogById(blogId);
        }
        const newPost = {
            id: Date.now().toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog?.name,
            createdAt: new Date().toISOString(),
        }

        dbPosts.push(newPost)
        return newPost

    },

    getPostById(id: string) {
        return dbPosts.find(p => p.id === id);
    },

    updatePostById(id: string, updatedPost: PostViewModel) {
        let findedPost = dbPosts.find(b => b.id === id)
        if (findedPost) {
            findedPost.title = updatedPost.title;
            findedPost.shortDescription = updatedPost.shortDescription;
            findedPost.content = updatedPost.content;
            findedPost.blogId = updatedPost.blogId;

            return true
        } else {
            return false
        }

    },

    deletePostById(id: string) {
        for (let i = 0; i < dbPosts.length; i++) {
            if (dbPosts[i].id === id) {
                dbPosts.splice(i, 1);
                return true
            }
        }
        return false
    }
}