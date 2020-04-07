import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppConstant, UrlKey, StorageKey } from '../constant/app.constant';
import { AppHttpService } from './rest.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast/ngx';
import { NavController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { PushNotificationService } from './push-notification.service';
import { PushDevice } from '../model/push-notification.model';


// Models
import { CurrentUser, NewUser } from '../model/current-user.model';
import { PreferredUser } from '../model/preferred-user.model';
import { UserFriends, FriendshipStatus } from '../model/user-friend.model';
import { UserLocation } from '../model/location.model';
import { UserReligion } from '../model/religion.model';
import { Event } from '../model/event.model';
import { Bathroom } from '../model/bathroom.model';
import { Bedroom } from '../model/bedroom.model';
import { RentBudget } from '../model/rent-budget.model';
import { Pet } from '../model/pet.model';
import { Smoking } from '../model/smoking.model';
import { Drinking } from '../model/drinking.model';

// Message Service
import { FirebasedbService } from './firebasedb.service';
import { PreferredGiftCards } from '../model/preferredGiftCards.model';
import { async } from '@angular/core/testing';

@Injectable()
export class AppService {

    public currentUser = new BehaviorSubject<CurrentUser>(this.createUser());
    private userLoactions = new BehaviorSubject<UserLocation[]>(this.createLocation());
    private userReligions = new BehaviorSubject<UserReligion[]>(this.createReligion());
    private bathrooms = new BehaviorSubject<Bathroom[]>([]);
    private bedrooms = new BehaviorSubject<Bedroom[]>([]);
    private rentBudget = new BehaviorSubject<RentBudget[]>([]);
    private pets = new BehaviorSubject<Pet[]>([]);
    private smokingOptions = new BehaviorSubject<Smoking[]>([]);
    private drinkingOptions = new BehaviorSubject<Drinking[]>([]);

    private upcomingEvent = new BehaviorSubject<Event[]>([]);
    private upcomingEventList: { events: Event[] } = { events: [] };

    private registeredEvent = new BehaviorSubject<Event[]>([]);
    private registeredEventList: { events: Event[] } = { events: [] };

    private userPreferred = new BehaviorSubject<PreferredUser[]>(this.createuserPreferred());
    private userPreferredList: { users: PreferredUser[] } = { users: [] };

    private userFriends = new BehaviorSubject<UserFriends[]>(this.createFriendList());
    private userFriendsList: { friends: UserFriends[] } = { friends: [] };

    private requestedFriends = new BehaviorSubject<UserFriends[]>([]);
    private requestedFriendsList: { friends: UserFriends[] } = { friends: [] };

    private preferredGiftcards = new BehaviorSubject<PreferredGiftCards[]>([]);

    private pushDevice: PushDevice;

    private header = {
        token: '',
        userid: ''
    };

    constructor(
        private http: HTTP, private appConstant: AppConstant,
        private appHttp: AppHttpService,
        private loadingController: LoadingController,
        private storage: Storage,
        private toast: Toast,
        private navCtrl: NavController,
        private network: Network,
        private router: Router,
        private firebasedb: FirebasedbService,
        private pushNotificationService: PushNotificationService,
        private alertController: AlertController) {
        this.pushNotificationService.getPushDevice().subscribe((value) => {
            this.pushDevice = value;
        });
    }

    public async showAlert(message: string, messageHeader: string) {
        const alert = await this.alertController.create({
            header: `${messageHeader}`,
            message: `${message}`,
            buttons: [
                {
                    text: 'Ok',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel');
                    }
                }
            ]
        });
        await alert.present();
    }

    public setHTTPHeader(data: any) {
        this.header = {
            token: data.token,
            userid: data.userId.toString()
        };
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
            RoleId: (data && data.RoleId) ? data.RoleId : 1,
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
            DOB: (data && data.DOB) ? data.DOB : '',
            Religion: (data && data.Religion) ? data.Religion : null,
            AboutMe: (data && data.AboutMe) ? data.AboutMe : '',
            AgreementImagePath: (data && data.AgreementImagePath) ? data.AgreementImagePath : '',
            ReferralCode: (data && data.ReferralCode) ? data.ReferralCode : '',
            IsNotificationEnabled: (data && data.IsNotificationEnabled) ? data.IsNotificationEnabled : false,
            IsProfileHidden: (data && data.IsProfileHidden) ? data.IsProfileHidden : false,
            IsUserDeactivated: (data && data.IsUserDeactivated) ? data.IsUserDeactivated : false,
            ReferralMessage: (data && data.ReferralMessage) ? data.ReferralMessage : '',
            SelectedGiftCardID: (data && data.SelectedGiftCardID) ? data.SelectedGiftCardID : null,
            SelectedPetId: (data && data.SelectedPetId) ? data.SelectedPetId : null,
            SelectedDrinkingId: (data && data.SelectedDrinkingId) ? data.SelectedDrinkingId : null,
            SelectedSmokingId: (data && data.SelectedSmokingId) ? data.SelectedSmokingId : null,
            RoommatePreferences: {
                GenderIds: (data && data.RoommatePreferences && data.RoommatePreferences.GenderIds) ?
                    data.RoommatePreferences.GenderIds.toString().split(',').map(Number) : [],
                CityId: (data && data.RoommatePreferences && data.RoommatePreferences.CityId) ?
                    data.RoommatePreferences.CityId : null,
                MinAge: (data && data.RoommatePreferences && data.RoommatePreferences.MinAge) ?
                    data.RoommatePreferences.MinAge : null,
                MaxAge: (data && data.RoommatePreferences && data.RoommatePreferences.MaxAge) ?
                    data.RoommatePreferences.MaxAge : null,
                ReligionIds: (data && data.RoommatePreferences && data.RoommatePreferences.ReligionIds) ?
                    data.RoommatePreferences.ReligionIds.toString().split(',').map(Number) : [],
                PetIds: (data && data.RoommatePreferences && data.RoommatePreferences.PetIds) ?
                    data.RoommatePreferences.PetIds.toString().split(',').map(Number) : [],
            }
            // (data && data.RoommatePreferences) ? data.RoommatePreferences : null

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
            SendRequest: (data && data.SendRequest) ? data.SendRequest : false,
            AboutMe: (data && data.AboutMe) ? data.AboutMe : '',
            UserPet: (data && data.UserPet) ? data.UserPet : '',
            UserDrinking: (data && data.UserDrinking) ? data.UserDrinking : '',
            UserSmoking: (data && data.UserSmoking) ? data.UserSmoking : ''

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

    public getBathrooms(): Observable<Bathroom[]> {
        return this.bathrooms.asObservable();
    }

    private setBathrooms(bathrooms: Bathroom[]) {
        this.bathrooms.next(bathrooms);
    }

    public getBedrooms(): Observable<Bedroom[]> {
        return this.bedrooms.asObservable();
    }

    private setBedrooms(bedrooms: Bedroom[]) {
        this.bedrooms.next(bedrooms);
    }

    public getRentBudget(): Observable<RentBudget[]> {
        return this.rentBudget.asObservable();
    }

    private setRentBudget(budget: RentBudget[]) {
        this.rentBudget.next(budget);
    }

    public getPets(): Observable<Pet[]> {
        return this.pets.asObservable();
    }

    private setPets(pets: Pet[]) {
        this.pets.next(pets);
    }

    public getdrinkingOptions(): Observable<Drinking[]> {
        return this.drinkingOptions.asObservable();
    }

    private setdrinkingOptions(drinkingOptions: Drinking[]) {
        this.drinkingOptions.next(drinkingOptions);
    }

    public getsmokingOptions(): Observable<Smoking[]> {
        return this.smokingOptions.asObservable();
    }

    private setsmokingOptions(smokingOptions: Smoking[]) {
        this.smokingOptions.next(smokingOptions);
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

    public getRequestedFriendList(): Observable<UserFriends[]> {
        return this.requestedFriends.asObservable();
    }

    private setRequestedFriendList(friends: UserFriends[]) {
        this.requestedFriends.next(friends);
    }

    public getUpcomingEvent(): Observable<Event[]> {
        return this.upcomingEvent.asObservable();
    }

    private setUpcomingEvent(events: Event[]) {
        this.upcomingEvent.next(events);
    }

    public getRegisteredEvent(): Observable<Event[]> {
        return this.registeredEvent.asObservable();
    }

    private setRegisteredEvent(events: Event[]) {
        this.registeredEvent.next(events);
    }

    public getPreferredGiftcards(): Observable<PreferredGiftCards[]> {
        return this.preferredGiftcards.asObservable();
    }

    private setPreferredGiftcards(preferredGiftcards: PreferredGiftCards[]) {
        this.preferredGiftcards.next(preferredGiftcards);
    }

    // functions for HTTP Calling

    public async getCurrentuserFromDB(updateOnline?: boolean) {
        // const loading = await this.loadingController.create({
        //     message: 'Please wait...',
        //     translucent: true,
        //     cssClass: ''
        // });
        // loading.present();
        await this.storage.get(StorageKey.LocalCurrentUserKey)
            .then(async (user) => {
                if ((user === null || user === undefined) || updateOnline) {
                    if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
                        this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
                        // loading.dismiss().then(() => {
                        //     this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
                        // });

                    } else {
                        await this.getCurrentUserIdfromLocalStorage()
                            .then(async value => {
                                if (value === null || value === undefined) {
                                    this.toast.show(`Session expired`, `short`, 'bottom').subscribe(() => { });
                                    // loading.dismiss().then(() => {

                                    //     this.toast.show(`Session expired`, `short`, 'bottom').subscribe(() => { });
                                    // });

                                    this.navCtrl.navigateRoot('/userlogin', { animated: true, animationDirection: 'forward' });
                                } else {
                                    const url = this.appConstant.getURL(UrlKey.Current_User).replace('uid', value);
                                    await this.http.get(url, {}, this.header)
                                        .then((res: any) => {
                                            // loading.dismiss();

                                            const resUser: CurrentUser = JSON.parse(res.data);
                                            resUser.UserId = value.toString();
                                            this.setCurrentUser(this.createUser(resUser));
                                            this.storage.set(StorageKey.LocalCurrentUserKey, resUser);
                                        })
                                        .catch(error => {
                                            // loading.dismiss();
                                            this.setCurrentUser(this.createUser());
                                            this.navCtrl.navigateRoot('/userlogin', { animated: true, animationDirection: 'forward' });
                                            const msg = error.error || 'Invalid User';
                                            this.toast.show(`${msg}`, `short`, 'bottom').subscribe(() => { });
                                        })
                                        .finally(() => {
                                            // loading.dismiss();
                                        });
                                }
                            });
                    }
                } else {
                    // loading.dismiss();
                    this.setCurrentUser(this.createUser(user));
                }
            })
            .catch(() => {
                // loading.dismiss();
            });
    }

    public getUserLocationsFromDB() {
        const url = this.appConstant.getURL(UrlKey.User_Locations);
        this.http.get(url, {}, this.header)
            .then(res => {
                const resLocation: UserLocation[] = JSON.parse(res.data);
                this.setLocation(resLocation);
            })
            .catch(error => {
                // this.setLocation(this.createLocation());
            })
            .finally(() => { });
    }

    public getUserReligionsFromDB() {
        const url = this.appConstant.getURL(UrlKey.User_Religions);
        this.http.get(url, {}, this.header)
            .then(res => {
                const resReligions: UserReligion[] = JSON.parse(res.data);
                this.setReligion(resReligions);
            })
            .catch(error => {
                // this.setReligion(this.createReligion());
            })
            .finally(() => { });
    }

    public getBathroomsFromDB() {
        const url = this.appConstant.getURL(UrlKey.Bathrooms);
        this.http.get(url, {}, this.header)
            .then(res => {
                const bathrooms: Bathroom[] = JSON.parse(res.data);
                this.setBathrooms(bathrooms);
            })
            .catch(error => {
                // this.setBathrooms([]);
            })
            .finally(() => { });
    }

    public getBedroomsFromDB() {
        const url = this.appConstant.getURL(UrlKey.Bedrooms);
        this.http.get(url, {}, this.header)
            .then(res => {
                const bedrooms: Bedroom[] = JSON.parse(res.data);
                this.setBedrooms(bedrooms);
            })
            .catch(error => {
                // this.setBathrooms([]);
            })
            .finally(() => { });
    }

    public getRentBudgetFromDB() {
        const url = this.appConstant.getURL(UrlKey.Rent_Budget);
        this.http.get(url, {}, this.header)
            .then(res => {
                const rentBudget: RentBudget[] = JSON.parse(res.data);
                this.setRentBudget(rentBudget);
            })
            .catch(error => {
                // this.setBathrooms([]);
            })
            .finally(() => { });
    }

    public getPetsFromDB() {
        const url = this.appConstant.getURL(UrlKey.Pets);
        this.http.get(url, {}, this.header)
            .then(res => {
                const pets: Pet[] = JSON.parse(res.data);
                this.setPets(pets);
            })
            .catch(error => {
                // this.setPets([]);
            })
            .finally(() => { });
    }

    public getdrinkingOptionsFromDB() {
        const url = this.appConstant.getURL(UrlKey.Drinking_Options);
        this.http.get(url, {}, this.header)
            .then(res => {
                const drinkingOptions: Drinking[] = JSON.parse(res.data);
                this.setdrinkingOptions(drinkingOptions);
            })
            .catch(error => {
                // this.setPets([]);
            })
            .finally(() => { });
    }

    public getsmokingOptionsFromDB() {
        const url = this.appConstant.getURL(UrlKey.Smoking_Options);
        this.http.get(url, {}, this.header)
            .then(res => {
                const smokingOptions: Smoking[] = JSON.parse(res.data);
                this.setsmokingOptions(smokingOptions);
            })
            .catch(error => {
                // this.setPets([]);
            })
            .finally(() => { });
    }

    public getPreferredGiftcardsFromDB() {
        const url = this.appConstant.getURL(UrlKey.Preferred_Giftcards);
        this.http.get(url, {}, this.header)
            .then(res => {
                const preferredGiftcards: PreferredGiftCards[] = JSON.parse(res.data);
                this.setPreferredGiftcards(preferredGiftcards);
            })
            .catch(error => {
                // this.setPets([]);
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
        // loading.present();
        await this.getCurrentUserIdfromLocalStorage()
            .then(async (userId) => {
                if (userId) {
                    const url = this.appConstant.getURL(UrlKey.User_Preferred).replace('uid', userId);
                    await this.http.get(url, {}, this.header)
                        .then(res => {
                            console.log('response', res);
                            // loading.dismiss();
                            const resdata = JSON.parse(res.data);
                            const resPreferred: PreferredUser[] = resdata.PreferredUserList;
                            this.userPreferredList.users = resPreferred;
                            this.setUserPreferred(Object.assign({}, this.userPreferredList).users);
                        })
                        .catch(error => {

                            console.log('error', error);
                            // loading.dismiss();
                            this.userPreferredList.users = [];
                            this.setUserPreferred(this.createuserPreferred());
                            if (error.status === 401) {
                                this.userLogout();
                            }
                        })
                        .finally(() => {
                            // loading.dismiss();
                        });
                }
            })
            .catch((err) => {
                this.toast.showLongBottom(JSON.stringify(err)).subscribe(() => { });
                // loading.dismiss();
            })
            .finally(() => {
                // loading.dismiss();
            });
    }

    public async getUserFriendsFromDB() {
        // const loading = await this.loadingController.create({
        //     message: 'Please wait...',
        //     translucent: true,
        //     cssClass: ''
        // });
        this.setFriendList(this.createFriendList());
        // loading.present();
        await this.getCurrentUserIdfromLocalStorage()
            .then(async (userId) => {
                if (userId) {
                    const url = this.appConstant.getURL(UrlKey.User_Friends).replace('uid', userId);
                    await this.http.get(url, {}, this.header)
                        .then(res => {
                            const resdata = JSON.parse(res.data);
                            const friendList: UserFriends[] = resdata.FriendandPendingList;
                            this.userFriendsList.friends = friendList;
                            this.setFriendList(Object.assign({}, this.userFriendsList).friends);
                            // loading.dismiss();
                        })
                        .catch(error => {
                            this.userFriendsList.friends = [];
                            this.setFriendList(this.createFriendList());
                            // loading.dismiss();
                        })
                        .finally(() => {
                            // loading.dismiss();
                        });
                }
            })
            .catch((err) => {
                //  loading.dismiss();
                if (err.status === 401) {
                    this.userLogout();
                }
            });
    }

    public async getRequestedFriendsFromDB() {
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        this.setRequestedFriendList([]);
        loading.present();
        this.getCurrentUserIdfromLocalStorage()
            .then((userId) => {
                if (userId) {
                    const url = this.appConstant.getURL(UrlKey.Requested_Friends).replace('uid', userId);
                    this.http.get(url, {}, this.header)
                        .then(res => {
                            const resdata = JSON.parse(res.data);
                            const friendList: UserFriends[] = resdata.FriendandPendingList;
                            this.requestedFriendsList.friends = friendList;
                            this.setRequestedFriendList(Object.assign({}, this.requestedFriendsList).friends);
                            loading.dismiss();
                        })
                        .catch(error => {
                            this.requestedFriendsList.friends = [];
                            this.setRequestedFriendList([]);
                            loading.dismiss();
                            if (error.status === 401) {
                                this.userLogout();
                            }
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

    public async getUpcomingEventListFromDB(CtityId: number, UserId: string) {
        if (!CtityId) {
            return;
        }
        // const loading = await this.loadingController.create({
        //     message: 'Please wait...',
        //     translucent: true,
        //     cssClass: ''
        // });
        this.setUpcomingEvent([]);
        // loading.present();
        const url = this.appConstant.getURL(UrlKey.Upcoming_Event).replace('cityid', CtityId.toString()).replace('uid', UserId);
        await this.http.get(url, {}, this.header)
            .then(res => {
                const resdata = JSON.parse(res.data);
                const events: Event[] = resdata.UpcomingEventList;
                this.upcomingEventList.events = events;
                this.setUpcomingEvent(Object.assign({}, this.upcomingEventList).events);
                // loading.dismiss();
            })
            .catch(error => {
                this.upcomingEventList.events = [];
                this.setUpcomingEvent([]);
                // loading.dismiss();
                if (error.status === 401) {
                    this.userLogout();
                }
            })
            .finally(() => {
                // loading.dismiss();
            });
    }

    public async getRegisteredEventListFromDB(UserId: string) {
        if (!UserId) {
            return;
        }
        // const loading = await this.loadingController.create({
        //     message: 'Please wait...',
        //     translucent: true,
        //     cssClass: ''
        // });
        this.setRegisteredEvent([]);
        // loading.present();
        const url = this.appConstant.getURL(UrlKey.Registered_Event).replace('uid', UserId);
        this.http.get(url, {}, this.header)
            .then(res => {
                const resdata = JSON.parse(res.data);
                const events: Event[] = resdata;
                this.registeredEventList.events = events;
                this.setRegisteredEvent(Object.assign({}, this.registeredEventList).events);
                //  loading.dismiss();
            })
            .catch(error => {
                this.registeredEventList.events = [];
                this.setRegisteredEvent([]);
                // loading.dismiss();
                if (error.status === 401) {
                    this.userLogout();
                }
            })
            .finally(() => {
                // loading.dismiss();
            });
    }

    public async userLogin(email?: string, password?: string) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Authenticating...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        const url = this.appConstant.getURL(UrlKey.User_Login);
        const data = { EmailID: email, Password: password, deviceid: this.pushDevice.registrationId };
        return await this.http.post(url, data, this.header)
            .then(res => {
                const resData = JSON.parse(res.data);
                if (resData.UserId > 0) {
                    this.setHTTPHeader({ token: resData.Token, userId: resData.UserId });
                    this.storage.set(StorageKey.UserIdKey, resData.UserId).then(() => {
                        this.storage.set(StorageKey.LoginTokenkey, resData.Token).then(() => { });

                        // set user online for messaging
                        this.firebasedb.setUserOnline(resData.UserId);

                        // Get User Details from DB
                        this.getCurrentuserFromDB();
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
        // const loading = await this.loadingController.create({
        //     message: 'Please wait...',
        //     translucent: true,
        //     cssClass: ''
        // });
        // loading.present();
        const data = {
            UserId: currentUser.UserId,
            ProfileFileName: currentUser.ProfileImagePath ? currentUser.ProfileImagePath.split('/')[2].replace('thumbnail_', '') : ''
        };
        this.http.uploadFile(this.appConstant.getURL(UrlKey.User_Profile_Image_Upload),
            data, this.header, imagePath, 'ProfilePics')
            .then(res => {

                const resdata = JSON.parse(res.data);
                // loading.dismiss().then(() => {
                this.toast.show(`${resdata.Message}`, `short`, 'bottom').subscribe(() => { });
                // });
                // if (data.ProfileFileName === '') {
                //     this.storage.remove(StorageKey.LocalCurrentUserKey).then(value => {
                //         this.getCurrentuserFromDB();
                //     });
                // } else {
                //     // Update the Random number.
                //     // currentUser.ProfileImagePath = '/' + currentUser.ProfileImagePath.split('/')[1] + data.ProfileFileName;
                //     currentUser.ProfileImagePath = currentUser.ProfileImagePath
                //         .replace(currentUser.ProfileImagePath.split('/')[2], data.ProfileFileName);
                //     this.setCurrentUser(this.createUser(currentUser));
                // }
                this.storage.remove(StorageKey.LocalCurrentUserKey).then(value => {
                    this.getCurrentuserFromDB();
                });
                // loading.dismiss();
            }).catch((err) => {
                // loading.dismiss().then(() => {
                if (err.status === 401) {
                    this.userLogout();
                }
                this.toast.show(`Upload catch Error: ${JSON.stringify(err)}`, `short`, 'bottom').subscribe(() => { });
                // });

            })
            .finally(() => {
                // loading.dismiss();
            });
    }

    public userLogout() {
        this.storage.get(StorageKey.UserIdKey).then((value) => {
            // Set User Ofline for message
            this.firebasedb.setUserOffline(value.toString());

            this.storage.get(StorageKey.LoginTokenkey).then(async (token) => {
                const loading = await this.loadingController.create({
                    message: 'Please wait...',
                    translucent: true,
                    cssClass: ''
                });
                loading.present();
                const url = this.appConstant.getURL(UrlKey.User_Logout);
                const data = { UserId: value, Token: token };
                this.http.post(url, data, this.header)
                    .then((res) => {
                        this.storage.remove(StorageKey.UserIdKey)
                            .then(() => {
                                this.storage.remove(StorageKey.LocalCurrentUserKey)
                                    .then(() => {
                                        this.setCurrentUser(this.createUser());
                                        this.setUserPreferred(this.createuserPreferred());

                                        // Empty List of Users Friends.
                                        this.userFriendsList.friends = [];
                                        this.setFriendList(Object.assign({}, this.userFriendsList).friends);
                                    })
                                    .catch(() => { });
                            })
                            .catch(() => { })
                            .finally(() => {
                                this.toast.show(`Logout Success`, `short`, 'bottom').subscribe(() => { });
                                this.navCtrl.navigateRoot('/userlogin', { animated: true, animationDirection: 'forward' });
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        loading.dismiss();
                    });
            });
        });
    }

    public async getCurrentUserIdfromLocalStorage() {
        return await this.storage.get(StorageKey.UserIdKey);
    }

    public async getTokenfromLocalStorage() {
        return await this.storage.get(StorageKey.LoginTokenkey);
    }

    public async sentotp(otp: string, emailId: string, isForgotPassword?: number) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
            return;
        }
        const url = this.appConstant.getURL(UrlKey.Send_Otp);
        const data = { otp, emailId, isForgotPassword };
        return this.http.post(url, data, this.header);
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
                    this.toast.showShortBottom(`${resData.ResponseMessage}`).subscribe(() => { });
                    await this.uploadUserRegistrationImage(resData.UserId, userImagePath);
                    // this.navCtrl.navigateRoot('/userlogin', { animated: true, animationDirection: 'forward' });
                } else {
                    this.toast.showShortBottom(`${resData.ResponseMessage}`).subscribe(() => { });
                    // this.navCtrl.navigateRoot('/userlogin', { animated: true, animationDirection: 'forward' });
                }
                this.storage.set(StorageKey.UserIdKey, resData.UserId).then(() => {
                    // this.getCurrentuserFromDB();
                    // this.navCtrl.navigateRoot('/userlogin', { animated: true, animationDirection: 'forward' });
                    this.userLogin(newUser.EmailId, newUser.Password)
                        .then((data) => {
                            this.toast.showShortBottom(
                                `${data.ResponseMessage}`
                            ).subscribe(toast => { });
                            if (data.UserId > 0) {
                                this.navCtrl.navigateRoot('/tabs', { animated: true, animationDirection: 'forward' });
                                // this.router.navigate(['/tabs']);
                            }
                        });
                });
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
        // loading.present();
        await this.getCurrentUserIdfromLocalStorage()
            .then(async (userId) => {
                if (userId) {
                    const url = this.appConstant.getURL(UrlKey.Send_Friend_Request);
                    const data = {
                        FromFriendRequestID: userId.toString(),
                        ToFriendRequestID: friendUser.UserId.toString()
                    };
                    this.http.post(url, data, this.header)
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
                            if (err.status === 401) {
                                this.userLogout();
                            }
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

        await this.getCurrentUserIdfromLocalStorage()
            .then(async (userId) => {
                if (userId) {
                    const url = this.appConstant.getURL(UrlKey.Action_On_Friend_Request);
                    let friendUserId: string;
                    let currentuserId: string;
                    // If someone cancel the request,Interchanging the user for convention
                    if (friendshipStatus === FriendshipStatus.Cancelled) {
                        friendUserId = userId.toString();
                        currentuserId = friendUser.UserId.toString();
                    } else {
                        friendUserId = friendUser.UserId.toString();
                        currentuserId = userId.toString();
                    }

                    const data = {
                        FromFriendRequestID: friendUserId.toString(),
                        ToFriendRequestID: currentuserId.toString(),
                        Status: friendshipStatus.toString()
                    };
                    loading.present();
                    this.http.post(url, data, this.header)
                        .then((res) => {
                            const resData = JSON.parse(res.data);
                            loading.dismiss().then(() => {
                                let message: string;
                                // Success Alert
                                if (FriendshipStatus.Unfriended === friendshipStatus && resData.ResponseMessage === 'Success') {
                                    message = `You're all set. You've successfully unfriended.`;
                                    this.toast.showShortBottom(`${message}`).subscribe(() => { });
                                } else if (FriendshipStatus.Blocked === friendshipStatus && resData.ResponseMessage === 'Success') {
                                    message = `You're all set. You've successfully blocked.`;
                                    this.toast.showShortBottom(`${message}`).subscribe(() => { });
                                } else if (FriendshipStatus.Accepted === friendshipStatus && resData.ResponseMessage === 'Success') {
                                    message = `Success.`;
                                    this.toast.showShortBottom(`${message}`).subscribe(() => { });
                                } else {
                                    this.toast.showShortBottom(`${resData.ResponseMessage}`).subscribe(() => { });
                                }
                                if (resData.Status) {
                                    this.userFriendsList.friends.forEach((value, key) => {
                                        if (value.UserId === friendUser.UserId) {
                                            value.Status = friendshipStatus;
                                        }
                                    });
                                    this.setFriendList(Object.assign({}, this.userFriendsList).friends);
                                }
                            });
                        })
                        .catch((err) => {
                            loading.dismiss();
                            if (err.status === 401) {
                                this.userLogout();
                            }
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

    public async eventSubscribe(userId: number, event: Event) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.showShortBottom(`Please connect to internet.`).subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        const url = this.appConstant.getURL(UrlKey.Event_Subscribe);
        const data = {
            UserID: userId.toString(),
            EventID: event.EventId.toString(),
            RegisterStatus: !event.isSubscribe === true ? 1 : 0
        };
        this.http.post(url, data, this.header)
            .then((res) => {
                loading.dismiss();
                const resData = JSON.parse(res.data);
                if (resData.Status) {
                    if (!event.isSubscribe) {
                        this.upcomingEventList.events.splice(this.upcomingEventList.events.indexOf(event), 1);
                        this.registeredEventList.events.push(event);

                        this.setUpcomingEvent(Object.assign({}, this.upcomingEventList).events);
                        this.setRegisteredEvent(Object.assign({}, this.registeredEventList).events);
                    } else {
                        this.registeredEventList.events.splice(this.registeredEventList.events.indexOf(event), 1);
                        this.upcomingEventList.events.push(event);

                        this.setRegisteredEvent(Object.assign({}, this.registeredEventList).events);
                        this.setUpcomingEvent(Object.assign({}, this.upcomingEventList).events);
                    }
                }
                this.toast.showShortBottom(`${resData.ResponseMessage}`).subscribe(() => { });
            })
            .catch((err) => {
                loading.dismiss();
                if (err.status === 401) {
                    this.userLogout();
                }
                this.toast
                    .showShortBottom(`${err.message || JSON.parse(err.error).ResponseMessage}`)
                    .subscribe(() => { });
            })
            .finally(() => {
                loading.dismiss();
            });
    }

    public async submitFlatSearchForm(form: any) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.showShortBottom(`Please connect to internet.`).subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        const url = this.appConstant.getURL(UrlKey.Flat_Search_Form);
        const data = form;
        return this.http.post(url, data, this.header)
            .then((res) => {
                loading.dismiss();
                const resData = JSON.parse(res.data);
                this.toast.showShortBottom(`${resData.ResponseMessage}`).subscribe(() => { });
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
    }

    public async checkValidReferralCode(referralCode: string) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.show(`Please connect to internet.`, `short`, 'bottom').subscribe(() => { });
            return;
        }
        const url = this.appConstant.getURL(UrlKey.Check_Valid_Referral_Code);
        return this.http.get(url, { referralCode }, this.header);

    }

    public async updateUser(form: any) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.showShortBottom(`Please connect to internet.`).subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        const url = this.appConstant.getURL(UrlKey.User_Update);
        const data = form;
        return this.http.post(url, data, this.header)
            .then((res) => {
                loading.dismiss();
                const resData = JSON.parse(res.data);
                this.toast.showShortBottom(`${resData.ResponseMessage}`).subscribe(() => { });
                this.getCurrentuserFromDB(true);
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
    }

    public async updateUserPassword(form: any) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.showShortBottom(`Please connect to internet.`).subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        const url = this.appConstant.getURL(UrlKey.Update_User_Password);
        const data = form;
        return this.http.post(url, data, this.header)
            .then((res) => {

                loading.dismiss().then(() => {
                    this.toast.showShortBottom(`${resData.ResponseMessage}`).subscribe(() => { });
                });
                const resData = JSON.parse(res.data);

                this.navCtrl.navigateRoot('/userlogin', { animated: true, animationDirection: 'forward' });
            })
            .catch((err) => {
                loading.dismiss().then(() => {
                    this.toast
                        .showShortBottom(`${err.message || JSON.parse(err.error).ResponseMessage}`)
                        .subscribe(() => { });
                });

            })
            .finally(() => {
                loading.dismiss();
            });
    }

    public async deactivateUser(form: any) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            this.toast.showShortBottom(`Please connect to internet.`).subscribe(() => { });
            return;
        }
        const loading = await this.loadingController.create({
            message: 'Please wait...',
            translucent: true,
            cssClass: ''
        });
        loading.present();
        const url = this.appConstant.getURL(UrlKey.User_Update);
        const data = form;
        return this.http.post(url, data, this.header)
            .then(async (res) => {
                loading.dismiss();
                const resData = JSON.parse(res.data);
                this.toast.showShortBottom(`${resData.ResponseMessage}`).subscribe(() => { });

                const alert = await this.alertController.create({
                    header: `Success Message`,
                    message: `Your account is now deactivated. When you log in again, your account will be reactivated.`,
                    buttons: [
                        {
                            text: 'Ok',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: (blah) => {
                                console.log('Confirm Cancel');
                                this.userLogout();
                            }
                        }
                    ]
                });
                await alert.present();

            })
            .catch((err) => {
                loading.dismiss();
                if (err.status === 401) {
                    this.userLogout();
                }
                this.toast
                    .showShortBottom(`${err.message || JSON.parse(err.error).ResponseMessage}`)
                    .subscribe(() => { });
            })
            .finally(() => {
                loading.dismiss();
            });
    }

    public async sendNotification(form: any) {
        if (this.network.type === this.network.Connection.NONE || this.network.type === this.network.Connection.UNKNOWN) {
            // this.toast.showShortBottom(`Please connect to internet.`).subscribe(() => { });
            return;
        }
        const url = this.appConstant.getURL(UrlKey.Send_Notification);
        const data = form;
        return this.http.post(url, data, this.header)
            .then((res) => {
            })
            .catch((err) => {
            })
            .finally(() => {
            });
    }
}
