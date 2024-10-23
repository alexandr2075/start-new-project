export type BlogViewModel = {
    id: string;
    name: string | undefined;
    description: string | undefined;
    websiteUrl: string | undefined;
    createdAt: string;
    isMembership: boolean;
}

export type PostViewModel = {
    id: string
    title: string | undefined;
    shortDescription: string | undefined;
    content: string | undefined;
    blogId: string | undefined;
    blogName: string | undefined;
    createdAt: string;
}