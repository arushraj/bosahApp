export class CurrentUser {
    UserId: string;
    EmailId: string;
    FName: string;
    LName: string;
    PhoneNumber: string;
    College: string;
    Job: string;
    GenderName: string;
    ProfileImagePath: string;
    City: string;
    Country: string;
    Age: number;
    Religion: string;
}

export class NewUser {
    FirstName: string;
    LastName: string;
    Password: string;
    EmailId: string;
    PhoneNumber: string;
    College: string;
    Job: string;
    ProfileImagePath: string;
    GenderId: number;
    ReligionId: number;
    CityId: number;
    PreferredGenderIds: string;
    PreferredReligionIds: string;
    Age: number;
    MinAge: number;
    MaxAge: number;
}
