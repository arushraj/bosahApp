export interface UserFriends {
    UserId: string;
    FName: string;
    ProfileImagePath: string;
    City: string;
    Age: number;
    Gender: string;
    Status: number;
    AboutMe: string;
    LastMessage: any;
    UserPet: string;
    UserDrinking: string;
    UserSmoking: string;
    College: string;
    Job: string;
}

export enum FriendshipStatus {
    Pending,
    Accepted,
    Unfriended,
    Rejected,
    Blocked,
    Cancelled
}
