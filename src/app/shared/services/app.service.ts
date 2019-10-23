import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConstant, UrlKey, StorageKey } from '../constant/app.constant';
import { AppHttpService } from './rest.service';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast/ngx';
import { NavController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


// Models
import { CurrentUser, NewUser } from '../model/current-user.model';
import { PreferredUser } from '../model/preferred-user.model';
import { UserFriends, FriendshipStatus } from '../model/user-friend.model';
import { UserLocation } from '../model/location.model';
import { UserReligion } from '../model/religion.model';
import { Event } from '../model/event.model';

@Injectable()
export class AppService {

    public currentUser = new BehaviorSubject<CurrentUser>(this.createUser());
    private userLoactions = new BehaviorSubject<UserLocation[]>(this.createLocation());
    private userReligions = new BehaviorSubject<UserReligion[]>(this.createReligion());

    private upcomingEvent = new BehaviorSubject<Event[]>([]);
    private upcomingEventList: { events: Event[] } = { events: [] };

    private userPreferred = new BehaviorSubject<PreferredUser[]>(this.createuserPreferred());
    private userPreferredList: { users: PreferredUser[] } = { users: [] };

    private userFriends = new BehaviorSubject<UserFriends[]>(this.createFriendList());
    private userFriendsList: { friends: UserFriends[] } = { friends: [] };


    constructor(
        private http: HTTP, private appConstant: AppConstant,
        private appHttp: AppHttpService,
        private loadingController: LoadingController,
        private storage: Storage,
        private toast: Toast,
        private navCtrl: NavController,
        private network: Network,
        private router: Router) {
    }

    public getUsersValueByKey(key: string) {
        return this.currentUser.asObservable()
            .pipe(map(user => {
                if (user && user.UserId !== '') {
                    return user[key];
                } else {
                    return null;
                }
            }));
    }

    private createUser(data?: CurrentUser) {
        return {
            UserId: (data && data.UserId) ? data.UserId : '',
            EmailId: (data && data.EmailId) ? data.EmailId : '',
            FName: (data && data.FName) ? data.FName : '',
            LName: (data && data.LName) ? data.LName : '',
            PhoneNumber: (data && data.PhoneNumber) ? data.PhoneNumber : '',
            College: (data && data.College) ? data.College : '',
            Job: (data && data.Job) ? data.Job : '',
            ProfileImagePath: (data && data.ProfileImagePath) ? data.ProfileImagePath : '',
            GenderName: (data && data.GenderName) ? data.GenderName : '',
            City: (data && data.City) ? data.City : '',
            Country: (data && data.Country) ? data.Country : '',
            Age: (data && data.Age) ? data.Age : null,
            Religion: (data && data.Religion) ? data.Religion : null,
        };
    }

    private createuserPreferred(data?: PreferredUser) {
        return [{
            UserId: (data && data.UserId) ? data.UserId : '',
            EmailId: (data && data.EmailId) ? data.EmailId : '',
            FName: (data && data.FName) ? data.FName : '',
            PhoneNumber: (data && data.PhoneNumber) ? data.PhoneNumber : '',
            College: (data && data.College) ? data.College : '',
            Job: (data && data.Job) ? data.Job : '',
            ProfileImagePath: (data && data.ProfileImagePath) ? data.ProfileImagePath : '',
            GenderName: (data && data.GenderName) ? data.GenderName : '',
            City: (data && data.City) ? data.City : '',
            Country: (data && data.Country) ? data.Country : '',
            Age: (data && data.Age) ? data.Age : null,
            Religion: (data && data.Religion) ? data.Religion : null,
            SendRequest: (data && data.SendRequest) ? data.SendRequest : false
        }];
    }

    private createFriendList() {
        return [];
    }

    private createLocation(data?: UserLocation) {
        return [{
            CityId: data ? data.CityId : null,
            City: data ? data.City : null
        }];
    }

    private createReligion(data?: UserReligion) {
        return [{
            ReligionId: data ? data.ReligionId : null,
            Religion: data ? data.Religion : null
        }];
    }

    public getCurrentUser(): Observable<CurrentUser> {
        return this.currentUser.asObservable();
    }

    private setCurrentUser(user: CurrentUser) {
        this.currentUser.next(user);
    }

    public getLocation(): Observable<UserLocation[]> {
        return this.userLoactions.asObservable();
    }

    private setLocation(location: UserLocation[]) {
        this.userLoactions.next(location);
    }

    public getReligion(): Observable<UserReligion[]> {
        return this.userReligions.asObservable();
    }

    private setReligion(religion: UserReligion[]) {
        this.userReligions.next(religion);
    }

    public getUserPreferred(): Observable<PreferredUser[]> {
        return this.userPreferred.asObservable();
    }

    private setUserPreferred(users: PreferredUser[]) {
        this.userPreferred.next(users);
    }

    public getFriendList(): Observable<UserFriends[]> {
        return this.userFriends.asObservable();
    }

    private setFriendList(friends: UserFriends[]) {
        this.userFriends.next(friends);
    }

    public getUpcomingEvent(): Observable<Event[]> {
        return this.upcomingEvent.asObservable();
    }

    private setUpcomingEvent(events: Event[]) {
        this.upcomingEvent.next(events);
    }

    // functions for HTTP Calling

    public async getCurrentuserFromDB() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        this.storage.get(StorageKey.LocalCurrentUserKey)
            .then((user) => {
                if (user === null || user === undefined) {
                    if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
                        loading.dismiss();
                        this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
                    } else {
                        this.getCurrentUserIdfromLocalStorage()
                            .then(value => {
                                if (value === null || value === undefined) {
                                    loading.dismiss();
                                    this.toast.show(`Session expired`, `short`, 'bottom').subscribe(() => { });
                                    // this.navCtrl.navigateForward('/userlogin', { animated: true, animationDirection: 'forward' });
                                    this.router.navigate(['/userlogin']);
                                } else {
                                    const url = this.appConstant.getURL(UrlKey.Current_User).replace('uid', value);
                                    this.http.get(url, {}, {})
                                        .then(res => {
                                            loading.dismiss();
                                            const resUser: CurrentUser = JSON.parse(res.data);
                                            resUser.UserId = value.toString();
                                            if (resUser.ProfileImagePath !== '') {
                                                resUser.ProfileImagePath = this.appConstant.APP_BASE_URL
                                                    + resUser.ProfileImagePath + `?random=` + Math.random();
                                            }
                                            this.setCurrentUser(this.createUser(resUser));
                                            this.storage.set(StorageKey.LocalCurrentUserKey, resUser);
                                        })
                                        .catch(error => {
                                            loading.dismiss();
                                            this.setCurrentUser(this.createUser());
                                            this.router.navigate(['/userlogin']);
                                            this.toast.show(`Invalid User`, `short`, 'bottom').subscribe(() => { });
                                        })
                                        .finally(() => {
                                            loading.dismiss();
                                        });
                                }
                            });
                    }
                } else {
                    loading.dismiss();
                    if (user.ProfileImagePath !== '') {
                        user.ProfileImagePath = user.ProfileImagePath
                            .substr(0, user.ProfileImagePath.indexOf('=') + 1) + Math.random();
                    }
                    this.setCurrentUser(this.createUser(user));
                }
            })
            .catch(() => {
                loading.dismiss();
            });
    }

    public getUserLocationsFromDB() {
        const url = this.appConstant.getURL(UrlKey.User_Locations);
        this.http.get(url, {}, {})
            .then(res => {
                const resLocation: UserLocation[] = JSON.parse(res.data);
                this.setLocation(resLocation);
            })
            .catch(error => {
                this.setLocation(this.createLocation());
            })
            .finally(() => { });
    }

    public getUserReligionsFromDB() {
        const url = this.appConstant.getURL(UrlKey.User_Religions);
        this.http.get(url, {}, {})
            .then(res => {
                const resReligions: UserReligion[] = JSON.parse(res.data);
                this.setReligion(resReligions);
            })
            .catch(error => {
                this.setReligion(this.createReligion());
            })
            .finally(() => { });
    }

    public async getUserPreferredFromDB() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        // Setting Value null
        this.setUserPreferred(this.createuserPreferred());
        loading.present();
        this.getCurrentUserIdfromLocalStorage()
            .then(async (userId) => {
                if (userId) {
                    const url = this.appConstant.getURL(UrlKey.User_Preferred).replace('uid', userId);
                    await this.http.get(url, {}, {})
                        .then(res => {
                            loading.dismiss();
                            const resdata = JSON.parse(res.data);
                            const resPreferred: PreferredUser[] = resdata.PreferredUserList;
                            this.userPreferredList.users = resPreferred;
                            this.setUserPreferred(Object.assign({}, this.userPreferredList).users);
                        })
                        .catch(error => {
                            loading.dismiss();
                            this.userPreferredList.users = [];
                            this.setUserPreferred(this.createuserPreferred());
                        })
                        .finally(() => {
                            loading.dismiss();
                        });
                }
            })
            .catch((err) => {
                this.toast.showLongBottom(JSON.stringify(err)).subscribe(() => { });
                loading.dismiss();
            })
            .finally(() => {
                loading.dismiss();
            });
    }

    public async getUserFriendsFromDB() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        this.setFriendList(this.createFriendList());
        loading.present();
        this.getCurrentUserIdfromLocalStorage()
            .then((userId) => {
                if (userId) {
                    const url = this.appConstant.getURL(UrlKey.User_Friends).replace('uid', userId);
                    this.http.get(url, {}, {})
                        .then(res => {
                            const resdata = JSON.parse(res.data);
                            const friendList: UserFriends[] = resdata.FriendandPendingList;
                            this.userFriendsList.friends = friendList;
                            this.setFriendList(Object.assign({}, this.userFriendsList).friends);
                            loading.dismiss();
                        })
                        .catch(error => {
                            this.userFriendsList.friends = [];
                            this.setFriendList(this.createFriendList());
                            loading.dismiss();
                        })
                        .finally(() => {
                            loading.dismiss();
                        });
                }
            })
            .catch((err) => {
                loading.dismiss();
            });
    }

    public async getUpcomingEventListFromDB(CtityId: number) {
        if (!CtityId) {
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        this.setUpcomingEvent([]);
        loading.present();
        const url = this.appConstant.getURL(UrlKey.Upcoming_Event).replace('cityid', CtityId.toString());
        this.http.get(url, {}, {})
            .then(res => {
                const resdata = JSON.parse(res.data);
                const events: Event[] = resdata.UpcomingEventList;
                this.upcomingEventList.events = events;
                this.setUpcomingEvent(Object.assign({}, this.upcomingEventList).events);
                loading.dismiss();
            })
            .catch(error => {
                this.upcomingEventList.events = [];
                this.setUpcomingEvent([]);
                loading.dismiss();
            })
            .finally(() => {
                loading.dismiss();
            });
    }

    public async userLogin(email?: string, password?: string) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        const url = this.appConstant.getURL(UrlKey.User_Login);
        const data = { EmailID: email, Password: password };
        return await this.http.post(url, data, {})
            .then(res => {
                const resData = JSON.parse(res.data);
                if (resData.UserId > 0) {
                    this.storage.set(StorageKey.UserIdKey, resData.UserId).then(() => {
                        this.getCurrentuserFromDB();
                        this.getUserPreferredFromDB();
                    });
                }
                loading.dismiss();
                return resData;
            })
            .catch(err => {
                this.toast.show(`${err}`, `short`, `bottom`).subscribe(() => { });
                loading.dismiss();
            })
            .finally(() => {
                loading.dismiss();
            });
    }

    public async uploadProfileImage(imagePath, currentUser: CurrentUser) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        const data = {
            UserId: currentUser.UserId,
            ProfileFileName: currentUser.ProfileImagePath ? currentUser.ProfileImagePath.split('/')[4].split('?')[0] : ''
        };
        this.http.uploadFile(this.appConstant.getURL(UrlKey.User_Profile_Image_Upload),
            data, {}, imagePath, 'ProfilePics')
            .then(res => {
                loading.dismiss();
                const resdata = JSON.parse(res.data);
                if (data.ProfileFileName === '') {
                    this.storage.remove(StorageKey.LocalCurrentUserKey).then(value => {
                        this.getCurrentuserFromDB();
                    });
                } else {
                    // Update the Random number.
                    currentUser.ProfileImagePath = currentUser.ProfileImagePath
                        .substr(0, currentUser.ProfileImagePath.indexOf('=') + 1) + Math.random();
                    this.setCurrentUser(this.createUser(currentUser));
                }
                this.toast.show(`${resdata.Message}`, `short`, 'bottom').subscribe(() => { });
            }).catch((err) => {
                loading.dismiss();
                this.toast.show(`Upload catch Error: ${JSON.stringify(err)}`, `short`, 'bottom').subscribe(() => { });
            })
            .finally(() => {
                loading.dismiss();
            });
    }

    public userLogout() {
        this.toast.show(`Logout Success`, `short`, 'bottom').subscribe(() => { });
        this.storage.remove(StorageKey.UserIdKey)
            .then(() => {
                this.storage.remove(StorageKey.LocalCurrentUserKey);
                this.setCurrentUser(this.createUser());
                this.setUserPreferred(this.createuserPreferred());
                // this.navCtrl.navigateForward('/userlogin', { animated: true, animationDirection: 'forward' });
                this.router.navigate(['/userlogin']);
            })
            .catch(() => { })
            .finally(() => {
            });
    }

    public async getCurrentUserIdfromLocalStorage() {
        return await this.storage.get(StorageKey.UserIdKey);
    }

    public async sentotp(otp: string, emailId: string) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
            return;
        }
        const url = this.appConstant.getURL(UrlKey.Send_Otp);
        const data = { otp, emailId };
        return this.http.post(url, data, {});

    }

    public async userRegistration(newUser: NewUser) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        const url = this.appConstant.getURL(UrlKey.User_Registration);
        const userImagePath = newUser.ProfileImagePath;
        this.http.post(url, newUser, {})
            .then(async res => {
                const resData = JSON.parse(res.data);
                loading.dismiss();
                if (userImagePath) {
                    this.toast.show(`${resData.ResponseMessage}`, `short`, `bottom`).subscribe(() => { });
                    await this.uploadUserRegistrationImage(resData.UserId, userImagePath);
                    this.router.navigate(['/userlogin']);
                } else {
                    this.toast.show(`${resData.ResponseMessage}`, `short`, `bottom`).subscribe(() => { });
                    this.router.navigate(['/userlogin']);
                }
            })
            .catch(err => {
                this.toast.show(`${JSON.stringify(err)}`, `short`, `bottom`).subscribe(() => { });
                loading.dismiss();
            })
            .finally(() => {
                loading.dismiss();
            });
    }

    public async uploadUserRegistrationImage(userId, ImagePath) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        const data = {
            UserId: userId.toString()
        };
        this.http.uploadFile(this.appConstant.getURL(UrlKey.User_Profile_Image_Upload),
            data, {}, ImagePath, '')
            .then(uploadRes => {
                loading.dismiss();
                // this.router.navigate(['/userlogin']);
                const resdata = JSON.parse(uploadRes.data);
                // this.toast.show(`Reg Upload catch Error: ${resdata.Message}`, `short`, 'bottom').subscribe(() => { });
            }).catch((err) => {
                loading.dismiss();
                // this.router.navigate(['/userlogin']);
                this.toast.show(`Reg Upload catch Error: ${JSON.stringify(err)}`, `short`, 'bottom').subscribe(() => { });
            })
            .finally(() => {
                loading.dismiss();
            });
    }

    public async sendFriendRequest(friendUser: PreferredUser) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        await this.getCurrentUserIdfromLocalStorage()
            .then(async (userId) => {
                if (userId) {
                    const url = this.appConstant.getURL(UrlKey.Send_Friend_Request);
                    const data = {
                        FromFriendRequestID: userId.toString(),
                        ToFriendRequestID: friendUser.UserId.toString()
                    };
                    this.http.post(url, data, {})
                        .then((res) => {
                            loading.dismiss();
                            const resData = JSON.parse(res.data);
                            if (resData.Status) {
                                friendUser.SendRequest = !friendUser.SendRequest;
                                this.userPreferredList.users.forEach((value, key) => {
                                    if (value.UserId === friendUser.UserId) {
                                        this.userPreferredList.users.splice(key, 1);
                                    }
                                });
                                this.setUserPreferred(Object.assign({}, this.userPreferredList).users);
                            }
                            this.toast.show(`${resData.ResponseMessage}`, `short`, 'bottom').subscribe(() => { });
                        })
                        .catch((err) => {
                            loading.dismiss();
                            this.toast.show(`${JSON.parse(err.error).ResponseMessage}`, `short`, 'bottom').subscribe(() => { });
                        })
                        .finally(() => {
                            loading.dismiss();
                        });
                } else {
                    loading.dismiss();
                    this.toast.show(`UserId not found for request!`, `short`, 'bottom').subscribe(() => { });
                }
            })
            .catch((err) => { loading.dismiss(); });
    }

    public async actionOnFriendRequest(friendUser: UserFriends, friendshipStatus: number) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        await this.getCurrentUserIdfromLocalStorage()
            .then(async (userId) => {
                if (userId) {
                    const url = this.appConstant.getURL(UrlKey.Action_On_Friend_Request);
                    const data = {
                        FromFriendRequestID: friendUser.UserId.toString(),
                        ToFriendRequestID: userId.toString(),
                        Status: friendshipStatus.toString()
                    };
                    this.http.post(url, data, {})
                        .then((res) => {
                            loading.dismiss();
                            const resData = JSON.parse(res.data);
                            if (resData.Status) {
                                this.userFriendsList.friends.forEach((value, key) => {
                                    if (value.UserId === friendUser.UserId) {
                                        value.Status = friendshipStatus;
                                    }
                                });
                                this.setFriendList(Object.assign({}, this.userFriendsList).friends);
                            }
                            this.toast.show(`${resData.ResponseMessage}`, `short`, 'bottom').subscribe(() => { });
                        })
                        .catch((err) => {
                            loading.dismiss();
                            this.toast
                                .showShortBottom(`${err.message || JSON.parse(err.error).ResponseMessage}`)
                                .subscribe(() => { });
                        })
                        .finally(() => {
                            loading.dismiss();
                        });
                } else {
                    loading.dismiss();
                    this.toast.show(`Request from userId not found!`, `short`, 'bottom').subscribe(() => { });
                }
            })
            .catch((err) => { loading.dismiss(); });
    }
}
