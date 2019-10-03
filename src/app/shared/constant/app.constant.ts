export class AppConstant {

    readonly APP_BASE_URL = 'https://bosahappapi.azurewebsites.net';
    readonly USER_LOGIN = '/api/login';
    readonly CURRENT_USER_URL = '/api/User/uid';
    readonly PROFILE_IMAGE_UPLOAD = '/api/Upload';

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
            default:
                break;
        }
    }
}

export enum UrlKey {
    User_Login,
    Current_User,
    User_Profile_Image_Upload
}

export enum StorageKey {
    UserIdKey = 'userId',
    LocalCurrentUserKey = 'user'
}
