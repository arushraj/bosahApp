export interface UserMessage {
    id?: string;
    type?: string;
    index?: {
        oldIndex?: number,
        newIndex?: number
    };
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
