import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserMessage, OnlineUser } from '../model/firebase.model';
import { Observable, BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { AppService } from './app.service';
import { map, tap } from 'rxjs/operators';
import { UserFriends } from '../model/user-friend.model';

@Injectable({
  providedIn: 'root'
})
export class FirebasedbService {

  private itemsCollection: AngularFirestoreCollection<UserMessage>;
  private currentOnlineUser: AngularFirestoreDocument<OnlineUser>;
  private friendOnlineUser: AngularFirestoreDocument<OnlineUser>;
  private friendList = new BehaviorSubject<UserFriends[]>(null);

  public unReadMessagesArray = [];

  constructor(private db: AngularFirestore) { }

  public getFirebaseFriends(): Observable<UserFriends[]> {
    return this.friendList.asObservable();
  }

  public setFirebaseFriends(data: any) {
    return this.friendList.next(data);
  }

  public md5Encrypt(value: string) {
    return CryptoJS.MD5(value).toString();
  }
  public aesEncrypt(value: string, key: string) {
    return CryptoJS.AES.encrypt(value, key).toString();
  }
  public aesDecrypt(value: string, key: string) {
    try {
      const decryptValue = CryptoJS.AES.decrypt(value, key);
      if (decryptValue.sigBytes >= 0) {
        return decryptValue.toString(CryptoJS.enc.Utf8);
      } else {
        return value;
      }
    } catch (error) {
      return '';
    }
  }

  private createDocumentKey(friendId: string, currentUserId: string) {
    return (friendId > currentUserId) ?
      (currentUserId.toString() + '—' + friendId.toString())
      : (friendId.toString() + '—' + currentUserId.toString());
  }

  public subscribeLastMessageItem(friendId: string, currentUserId: string) {
    if (friendId) {
      let documentKey = this.createDocumentKey(friendId, currentUserId);
      // encrypt to MD5
      documentKey = this.md5Encrypt(documentKey);
      // this.itemsCollection =
      return this.db.collection('allMessages')
        .doc(documentKey)
        .collection<UserMessage>('messages', ref => ref.orderBy('datetime', 'desc')).valueChanges();
    }
  }

  public subscribeUserDocument(documentKey: string) {
    return this.db.collection('onlineUsers').doc<OnlineUser>(documentKey);
  }

  public setUserOffline(userId: string) {
    const user: OnlineUser = {
      isOnline: false,
      lastOnlineDateTime: new Date().toISOString()
    };
    if (!this.currentOnlineUser) {
      this.currentOnlineUser = this.subscribeUserDocument(userId.toString());
    }
    this.currentOnlineUser.set(user);
  }

  public setUserOnline(userId: string) {
    const user: OnlineUser = {
      isOnline: true,
      lastOnlineDateTime: new Date().toISOString()
    };
    this.currentOnlineUser = this.subscribeUserDocument(userId.toString());
    this.currentOnlineUser.set(user);
  }

}
