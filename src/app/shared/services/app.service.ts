import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable, BehaviorSubject } from 'rxjs';
import { CurrentUser, NewUser } from '../model/current-user.model';
import { UserLocation } from '../model/location.model';
import { UserReligion } from '../model/religion.model';
import { AppConstant, UrlKey, StorageKey } from '../constant/app.constant';
import { AppHttpService } from './rest.service';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast/ngx';
import { NavController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';

@Injectable()
export class AppService {

    public currentUser = new BehaviorSubject<CurrentUser>(this.createUser());
    private userLoactions = new BehaviorSubject<UserLocation>(this.createLocation());
    private userReligions = new BehaviorSubject<UserReligion>(this.createReligion());


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

    private createUser(data?: CurrentUser) {
        return {
            UserId: data ? data.UserId : '',
            EmailId: data ? data.EmailId : '...',
            FName: data ? data.FName : '...',
            LastName: data ? data.LastName : '...',
            PhoneNumber: data ? data.PhoneNumber : '...',
            College: data ? data.College : '...',
            Job: data ? data.Job : '...',
            ProfileImagePath: data ? data.ProfileImagePath : '...',
            GenderName: data ? data.GenderName : '...',
            City: (data && data.City) ? data.City : 'Texas',
            Country: (data && data.Country) ? data.Country : 'USA',
            Age: (data && data.Age) ? data.Age : 25,
            Religion: (data && data.Religion) ? data.Religion : '3',
        };
    }

    private createLocation(data?: UserLocation) {
        return {
            CityId: data ? data.CityId : 0,
            City: data ? data.City : ''
        };
    }

    private createReligion(data?: UserReligion) {
        return {
            ReligionId: data ? data.ReligionId : 0,
            Religion: data ? data.Religion : ''
        };
    }

    public getCurrentUser(): Observable<CurrentUser> {
        return this.currentUser.asObservable();
    }

    private setCurrentUser(user: CurrentUser) {
        this.currentUser.next(user);
    }

    public getLocation(): Observable<UserLocation> {
        return this.userLoactions.asObservable();
    }

    private setLocation(location: UserLocation) {
        this.userLoactions.next(location);
    }

    public getReligion(): Observable<UserReligion> {
        return this.userReligions.asObservable();
    }

    private setReligion(religion: UserReligion) {
        this.userReligions.next(religion);
    }


    public async getCurrentuserFromDB() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        try {
            this.storage.get(StorageKey.LocalCurrentUserKey).then((user) => {
                if (user === null || user === undefined) {
                    if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
                        loading.dismiss();
                        this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
                        return;
                    }
                    this.getCurrentUserIdfromLocalStorage()
                        .then(value => {
                            if (value === null || value === undefined) {
                                this.toast.show(`Session expired`, `short`, 'bottom').subscribe(() => { });
                                loading.dismiss();
                                // this.navCtrl.navigateForward('/userlogin', { animated: true, animationDirection: 'forward' });
                                this.router.navigate(['/userlogin']);
                            } else {
                                const url = this.appConstant.getURL(UrlKey.Current_User).replace('uid', value);
                                this.http.get(url, {}, {})
                                    .then(res => {
                                        const resUser: CurrentUser = JSON.parse(res.data);
                                        resUser.UserId = value.toString();
                                        if (resUser.ProfileImagePath !== '') {
                                            resUser.ProfileImagePath = this.appConstant.APP_BASE_URL
                                                + resUser.ProfileImagePath + `?random=` + Math.random();
                                        }
                                        this.setCurrentUser(this.createUser(resUser));
                                        this.storage.set(StorageKey.LocalCurrentUserKey, resUser);
                                        loading.dismiss();
                                    })
                                    .catch(error => {
                                        this.setCurrentUser(this.createUser());
                                        loading.dismiss();
                                        // this.navCtrl.navigateForward('/userlogin', { animated: true, animationDirection: 'forward' });
                                        this.router.navigate(['/userlogin']);
                                        this.toast.show(`Invalid User`, `short`, 'bottom').subscribe(() => { });
                                    });
                            }
                        });
                } else {
                    loading.dismiss();
                    if (user.ProfileImagePath !== '') {
                        user.ProfileImagePath = user.ProfileImagePath
                            .substr(0, user.ProfileImagePath.indexOf('=') + 1) + Math.random();
                    }
                    this.setCurrentUser(this.createUser(user));
                }
            });
        } catch (ex) {
            console.log(ex);
            loading.dismiss();
        }
    }

    public getUserLocationsFromDB() {
        const url = this.appConstant.getURL(UrlKey.Current_User);
        this.http.get(url, {}, {})
            .then(res => {
                const resLocation: UserLocation = JSON.parse(res.data);
                this.setLocation(this.createLocation(resLocation));
            })
            .catch(error => {
                this.setLocation(this.createLocation());
            });
    }

    public getUserReligionsFromDB() {
        const url = this.appConstant.getURL(UrlKey.Current_User);
        this.http.get(url, {}, {})
            .then(res => {
                const resLocation: UserLocation = JSON.parse(res.data);
                this.setLocation(this.createLocation(resLocation));
            })
            .catch(error => {
                this.setLocation(this.createLocation());
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
                    });
                }
                loading.dismiss();
                return resData;
            })
            .catch(err => {
                this.toast.show(`${err}`, `short`, `bottom`).subscribe(() => { });
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
            });
    }

    public userLogout() {
        this.toast.show(`Logout Success`, `short`, 'bottom').subscribe(() => { });
        this.storage.remove(StorageKey.UserIdKey).then(() => {
            this.storage.remove(StorageKey.LocalCurrentUserKey);
            this.setCurrentUser(this.createUser());
            // this.navCtrl.navigateForward('/userlogin', { animated: true, animationDirection: 'forward' });
            this.router.navigate(['/userlogin']);
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
            .then(res => {
                const resData = JSON.parse(res.data);
                loading.dismiss();
                if (userImagePath) {
                    this.toast.show(`${resData.ResponseMessage}`, `short`, `bottom`).subscribe(() => { });
                    this.toast.show(`User ID: ${resData.UserId}`, `long`, `top`).subscribe(() => { });
                    this.uploadUserRegistrationImage(resData.UserId, userImagePath);
                    this.router.navigate(['/userlogin']);
                } else {
                    this.toast.show(`${resData.ResponseMessage}`, `short`, `bottom`).subscribe(() => { });
                    this.router.navigate(['/userlogin']);
                }
            })
            .catch(err => {
                this.toast.show(`${JSON.stringify(err)}`, `short`, `bottom`).subscribe(() => { });
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
            UserId: userId
        };
        this.http.uploadFile(this.appConstant.getURL(UrlKey.User_Profile_Image_Upload),
            data, {}, ImagePath, '')
            .then(uploadRes => {
                loading.dismiss();
                // this.router.navigate(['/userlogin']);
                const resdata = JSON.parse(uploadRes.data);
                this.toast.show(`Reg Upload catch Error: ${JSON.stringify(resdata)}`, `short`, 'bottom').subscribe(() => { });
            }).catch((err) => {
                loading.dismiss();
                // this.router.navigate(['/userlogin']);
                this.toast.show(`Reg Upload catch Error: ${JSON.stringify(err)}`, `short`, 'bottom').subscribe(() => { });
            });
    }
}
