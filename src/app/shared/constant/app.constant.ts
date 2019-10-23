export class AppConstant {

    readonly APP_BASE_URL = 'https://bosahappservices.azurewebsites.net';
    readonly USER_LOGIN = '/api/login';
    readonly CURRENT_USER_URL = '/api/User/uid';
    readonly PROFILE_IMAGE_UPLOAD = '/api/Upload';
    readonly SEND_OTP = '/api/sendEmail';
    readonly USER_REGISTRATION = '/api/register';
    readonly USER_LOCATIONS = '/api/getAllLocation';
    readonly USER_RELIGIONS = '/api/getAllReligion';
    readonly USER_PREFERRED = '/api/getPreferredUser/uid';
    readonly USER_FRIENDS = '/api/friendandpendinglist/uid';
    readonly SEND_FRIEND_REQUEST = '/api/sendFriendRequest';
    readonly ACTION_ON_FRIEND_REQUEST = '/api/actionOnfriendrequest';
    readonly UPCOMING_EVENT = '/api/getAllUpcomingEvent?cityID=cityid';

    /**
     * getURL() funtion to get url
     */
    public getURL(urlType) {
        // console.log(`Calling URL for ${UrlKey[urlType]}`);
        switch (urlType) {
            case UrlKey.User_Login:
                return this.APP_BASE_URL + this.USER_LOGIN;
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
            case UrlKey.Send_Friend_Request:
                return this.APP_BASE_URL + this.SEND_FRIEND_REQUEST;
            case UrlKey.Action_On_Friend_Request:
                return this.APP_BASE_URL + this.ACTION_ON_FRIEND_REQUEST;
            case UrlKey.Upcoming_Event:
                return this.APP_BASE_URL + this.UPCOMING_EVENT;
            default:
                break;
        }
    }
}

export enum UrlKey {
    User_Login,
    Current_User,
    User_Profile_Image_Upload,
    Send_Otp,
    User_Registration,
    User_Locations,
    User_Religions,
    User_Preferred,
    User_Friends,
    Send_Friend_Request,
    Action_On_Friend_Request,
    Upcoming_Event
}

export enum StorageKey {
    UserIdKey = 'userId',
    LocalCurrentUserKey = 'user'
}
