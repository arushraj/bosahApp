export interface UserMessage {
    userId: string;
    message: string;
    datetime: string;
    isRead: boolean;
    readDateTime: string;
}

export interface OnlineUser {
    isOnline?: boolean;
    isTyping?: boolean;
    lastOnlineDateTime?: string;
}
