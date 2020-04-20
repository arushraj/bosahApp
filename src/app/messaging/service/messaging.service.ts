import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';

import { UserMessage } from '../model/message';
import { OnlineUser } from '../model/user';
import { AppService } from 'src/app/shared/services/app.service';
import { map } from 'rxjs/operators';


@Injectable()
export class MessageService {
    private itemsCollection: AngularFirestoreDocument<UserMessage>;
    private currentOnlineUser: AngularFirestoreDocument<OnlineUser>;
    private friendOnlineUser: AngularFirestoreDocument<OnlineUser>;
    constructor(private db: AngularFirestore, private appService: AppService) { }

    public subscribeMessageCollection(documentKey: string) {
        // encrypt to MD5
        documentKey = this.md5Encrypt(documentKey);
        this.itemsCollection = this.db.collection('allMessages')
            .doc(documentKey);
        // .collection<UserMessage>('messages', ref => ref.orderBy('datetime', 'asc'));
    }

    public subscribeUserDocument(documentKey: string) {
        return this.db.collection('onlineUsers').doc<OnlineUser>(documentKey);
    }

    public messagesSnapshotChanges(): Observable<any> {
        return this.itemsCollection
            .collection<UserMessage>('messages', ref => ref.orderBy('datetime', 'asc'))
            .snapshotChanges();
    }

    public messagesValueChanges(): Observable<any> {
        return this.itemsCollection
            .collection<UserMessage>('messages', ref => ref.orderBy('datetime', 'asc'))
            .valueChanges();
    }

    public getFriendMessages(doc: any, pageSize: number): Observable<UserMessage[]> {
        let query: QueryFn;
        if (doc !== '') {
            query = ref => ref.orderBy('datetime', 'asc').endBefore(doc).limitToLast(pageSize);
        } else {
            query = ref => ref.orderBy('datetime', 'asc').limitToLast(pageSize);
        }

        return this.itemsCollection.collection<UserMessage>('messages', query)
            .stateChanges(['added', 'modified']).pipe(
                map(actions => actions.map(a => {
                    const document = a.payload.doc;
                    const data = a.payload.doc.data() as UserMessage;
                    const type = a.type;
                    const index = { oldIndex: a.payload.oldIndex, newIndex: a.payload.newIndex };
                    const id = a.payload.doc.id;
                    return { id, type, ...data, index, document };
                }))
            );
    }

    public sendNotification(form: any) {
        this.appService.sendNotification(form);
    }
    public pushNewMsg(message: UserMessage) {
        return this.itemsCollection.collection<UserMessage>('messages').add(message);
    }

    public updateMsg(unReadMsgId: any) {
        this.itemsCollection.collection<UserMessage>('messages').doc(unReadMsgId).update({
            isRead: true,
            readDateTime: new Date().toISOString()
        });
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

    public async setUserOnline(userId: string) {
        const user: OnlineUser = {
            isOnline: true,
            isTyping: false,
            lastOnlineDateTime: new Date().toISOString()
        };
        this.currentOnlineUser = this.subscribeUserDocument(userId.toString());
        this.currentOnlineUser.set(user);
    }

    public async userTypingMessage(isTyping: boolean) {
        if (this.currentOnlineUser) {
            this.currentOnlineUser.update({ isTyping });
        }
    }

    public getFriendUserStatus(userId: string) {
        this.friendOnlineUser = this.subscribeUserDocument(userId.toString());
        return this.friendOnlineUser.valueChanges();
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

    public async updateNotification(form: any) {
        await this.appService.updateNotification(form);
    }
}
