export interface CurrentUser {
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
    DOB: string;
    Religion: string;
    AboutMe: string;
    AgreementImagePath: string;
    ReferralCode: string;
    RoommatePreferences: RoommatePreferences;
    IsNotificationEnabled: boolean;
    IsProfileHidden: boolean;
    IsUserDeactivated: boolean;
    ReferralMessage: string;
    SelectedGiftCardID: number;
    SelectedPetId: number;
    SelectedDrinkingId: number;
    SelectedSmokingId: number;
}

export interface RoommatePreferences {
    GenderIds: Array<number>;
    CityId: number;
    MinAge: number;
    MaxAge: number;
    ReligionIds: Array<number>;
    PetIds: Array<number>;
}

export interface NewUser {
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
    DOB: string;
    UserSelectedSmokingId: number;
    UserSelectedDrinkingId: number;
    UserSelectedPetId: number;
    MinAge: number;
    MaxAge: number;
    UsedReferralCode: string;
    AboutMe: string;
    PreferredPetIds: string;
}
