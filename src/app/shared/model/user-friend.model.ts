export class UserFriends {
    UserId: string;
    FName: string;
    ProfileImagePath: string;
    City: string;
    Age: number;
    Gender: string;
    Status: number;
}

export enum FriendshipStatus {
    Pending,
    Accepted,
    Blocked,
    Unfriended
}
