import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { UserMessage } from '../model/message';
import { OnlineUser } from '../model/user';


@Injectable()
export class MessageService {
    private itemsCollection: AngularFirestoreCollection<UserMessage>;
    private currentOnlineUser: AngularFirestoreDocument<OnlineUser>;
    private friendOnlineUser: AngularFirestoreDocument<OnlineUser>;
    constructor(private db: AngularFirestore) { }

    public subscribeMessageCollection(documentKey: string) {
        this.itemsCollection = this.db.collection('allMessages')
            .doc(documentKey)
            .collection<UserMessage>('messages', ref => ref.orderBy('datetime', 'asc'));
    }

    public subscribeUserDocument(documentKey: string) {
        return this.db.collection('onlineUsers').doc<OnlineUser>(documentKey);
    }

    public getMessages(): Observable<UserMessage[]> {
        return this.itemsCollection.valueChanges();
    }

    public pushNewMsg(message: UserMessage) {
        return this.itemsCollection.add(message);
    }

    public setUserOffline(userId: string) {
        const user: OnlineUser = {
            isOnline: false,
            isTyping: false,
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
            isTyping: false,
            lastOnlineDateTime: new Date().toISOString()
        };
        this.currentOnlineUser = this.subscribeUserDocument(userId.toString());
        this.currentOnlineUser.set(user);
    }

    public userTypingMessage(isTyping: boolean) {
        if (this.currentOnlineUser) {
            this.currentOnlineUser.update({ isTyping });
        }
    }

    public getFriendUserStatus(userId: string) {
        this.friendOnlineUser = this.subscribeUserDocument(userId.toString());
        return this.friendOnlineUser.valueChanges();
    }
}
