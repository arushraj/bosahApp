export interface UserFriends {
    UserId: string;
    FName: string;
    ProfileImagePath: string;
    City: string;
    Age: number;
    Gender: string;
    Status: number;
    AboutMe: string;
}

export enum FriendshipStatus {
    Pending,
    Accepted,
    Unfriended,
    Rejected,
    Blocked,
    Cancelled
}
