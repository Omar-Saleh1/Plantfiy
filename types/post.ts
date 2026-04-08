export default interface Post {
    _id: string;
    title: string;
    content: string;
    imageUrl ?: string;
    createdAt: string;
    commentsCount: number;
    likes: string[];
    user: {
        _id?: string;
        name ?: string;
    };
}