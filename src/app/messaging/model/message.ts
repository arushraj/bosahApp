export interface UserMessage {
    userId: string;
    message: string;
    datetime: string;
    isRead?: boolean;
    readDateTime?: string;
}
