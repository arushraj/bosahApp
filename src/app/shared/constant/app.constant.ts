export class AppConstant {
    readonly APP_BASE_URL = 'https://bosahapi.azurewebsites.net/';
    readonly APP_IMG_BASE_URL = 'https://bosahappstorage.blob.core.windows.net';
    readonly USER_LOGIN = '/api/login';
    readonly USER_LOGOUT = '/api/logout';
    readonly CURRENT_USER_URL = '/api/User/uid';
    readonly PROFILE_IMAGE_UPLOAD = '/api/Upload';
    readonly SEND_OTP = '/api/sendEmail';
    readonly USER_REGISTRATION = '/api/register';
    readonly USER_LOCATIONS = '/api/getAllLocation';
    readonly USER_RELIGIONS = '/api/getAllReligion';
    readonly USER_PREFERRED = '/api/getPreferredUser/uid';
    readonly USER_FRIENDS = '/api/friendandpendinglist/uid';
    readonly REQUESTED_FRIEDNS = '/api/sentfriendrequestlist/uid';
    readonly SEND_FRIEND_REQUEST = '/api/sendFriendRequest';
    readonly ACTION_ON_FRIEND_REQUEST = '/api/actionOnfriendrequest';
    readonly UPCOMING_EVENT = '/api/getAllUpcomingEvent?cityID=cityid&userId=uid';
    readonly REGISTERED_EVENT = '/api/getAllRegisteredEvent?userId=uid';
    readonly EVENT_SUBSCRIBE = '/api/registerDeregisterFromEvent';
    readonly BATHROOMS = '/api/getallbathroom';
    readonly BEDROOMS = '/api/getallbedroom';
    readonly RENTBUDGET = '/api/getallrentbudget';
    readonly FLAT_SEARCH_FORM = '/api/searchform';
    readonly PETS = '/api/getallpets';
    readonly CHECK_VALID_REFERRAL_CODE = '/api/checkvalidityofreferralcode';
    readonly USER_UPDATE = '/api/updateUser';
    readonly UPDATE_USER_PASSWORD = '/api/user/forgotpasswordUpdate';
    readonly PREFERRED_GIFTCARDS = '/api/getallgiftcards';
    readonly SMOKING_OPTIONS = '/api/getallsmokingOptions';
    readonly DRINKING_OPTIONS = '/api/getalldrinkingOptions';
    readonly SEND_NOTIFICATION = '/api/sendMessageNotification';

    /**
     * getURL() funtion to get url
     */
    public getURL(urlType) {
        // console.log(`Calling URL for ${UrlKey[urlType]}`);
        switch (urlType) {
            case UrlKey.User_Login:
                return this.APP_BASE_URL + this.USER_LOGIN;
            case UrlKey.User_Logout:
                return this.APP_BASE_URL + this.USER_LOGOUT;
            case UrlKey.Current_User:
                return this.APP_BASE_URL + this.CURRENT_USER_URL;
            case UrlKey.User_Profile_Image_Upload:
                return this.APP_BASE_URL + this.PROFILE_IMAGE_UPLOAD;
            case UrlKey.Send_Otp:
                return this.APP_BASE_URL + this.SEND_OTP;
            case UrlKey.User_Registration:
                return this.APP_BASE_URL + this.USER_REGISTRATION;
            case UrlKey.User_Locations:
                return this.APP_BASE_URL + this.USER_LOCATIONS;
            case UrlKey.User_Religions:
                return this.APP_BASE_URL + this.USER_RELIGIONS;
            case UrlKey.User_Preferred:
                return this.APP_BASE_URL + this.USER_PREFERRED;
            case UrlKey.User_Friends:
                return this.APP_BASE_URL + this.USER_FRIENDS;
            case UrlKey.Requested_Friends:
                return this.APP_BASE_URL + this.REQUESTED_FRIEDNS;
            case UrlKey.Send_Friend_Request:
                return this.APP_BASE_URL + this.SEND_FRIEND_REQUEST;
            case UrlKey.Action_On_Friend_Request:
                return this.APP_BASE_URL + this.ACTION_ON_FRIEND_REQUEST;
            case UrlKey.Upcoming_Event:
                return this.APP_BASE_URL + this.UPCOMING_EVENT;
            case UrlKey.Registered_Event:
                return this.APP_BASE_URL + this.REGISTERED_EVENT;
            case UrlKey.Event_Subscribe:
                return this.APP_BASE_URL + this.EVENT_SUBSCRIBE;
            case UrlKey.Bathrooms:
                return this.APP_BASE_URL + this.BATHROOMS;
            case UrlKey.Bedrooms:
                return this.APP_BASE_URL + this.BEDROOMS;
            case UrlKey.Rent_Budget:
                return this.APP_BASE_URL + this.RENTBUDGET;
            case UrlKey.Flat_Search_Form:
                return this.APP_BASE_URL + this.FLAT_SEARCH_FORM;
            case UrlKey.Pets:
                return this.APP_BASE_URL + this.PETS;
            case UrlKey.Check_Valid_Referral_Code:
                return this.APP_BASE_URL + this.CHECK_VALID_REFERRAL_CODE;
            case UrlKey.User_Update:
                return this.APP_BASE_URL + this.USER_UPDATE;
            case UrlKey.Update_User_Password:
                return this.APP_BASE_URL + this.UPDATE_USER_PASSWORD;
            case UrlKey.Preferred_Giftcards:
                return this.APP_BASE_URL + this.PREFERRED_GIFTCARDS;
            case UrlKey.Smoking_Options:
                return this.APP_BASE_URL + this.SMOKING_OPTIONS;
            case UrlKey.Drinking_Options:
                return this.APP_BASE_URL + this.DRINKING_OPTIONS;
            case UrlKey.Send_Notification:
                return this.APP_BASE_URL + this.SEND_NOTIFICATION;
            default:
                break;
        }
    }
}

export enum UrlKey {
    User_Login,
    User_Logout,
    Current_User,
    User_Profile_Image_Upload,
    Send_Otp,
    User_Registration,
    User_Locations,
    User_Religions,
    User_Preferred,
    User_Friends,
    Requested_Friends,
    Send_Friend_Request,
    Action_On_Friend_Request,
    Upcoming_Event,
    Registered_Event,
    Event_Subscribe,
    Bathrooms,
    Bedrooms,
    Rent_Budget,
    Pets,
    Flat_Search_Form,
    Check_Valid_Referral_Code,
    User_Update,
    Update_User_Password,
    Preferred_Giftcards,
    Smoking_Options,
    Drinking_Options,
    Send_Notification
}

export enum StorageKey {
    UserIdKey = 'userId',
    LocalCurrentUserKey = 'user',
    LoginTokenkey = 'userToken'
}
