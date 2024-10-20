import {PostViewModel} from "../../types/viewModel";
import {dbPosts} from "../../db/dbPosts";
import {blogsRepository} from "../blogs/repository-blogs";

export const postsRepository = {
    getAllPosts(): PostViewModel[] {
        return dbPosts
    },

    createPost(post: Partial<PostViewModel>) {
        const {title, shortDescription, content, blogId} = post;
        let blogName: string | undefined = ''
        if (blogId) {
            blogName = blogsRepository.getBlogById(blogId)?.name;
        }
        const newPost = {
            id: Date.now().toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName
        }

        dbPosts.push(newPost)
        return newPost

    },

    getPostById(id: string): PostViewModel | undefined {
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