export interface UserMessage {
    userId: string;
    message: string;
    datetime: string;
}

export interface OnlineUser {
    isOnline?: boolean;
    isTyping?: boolean;
    lastOnlineDateTime?: string;
}
