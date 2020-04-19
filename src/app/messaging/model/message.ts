export interface UserMessage {
    id?: string;
    type?: string;
    index?: {
        oldIndex?: number,
        newIndex?: number
    };
    document?: any;
    userId: string;
    message: string;
    datetime: string;
    isRead?: boolean;
    readDateTime?: string;
}
