import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { UserMessage } from '../model/message';


@Injectable()
export class MessageService {
    private itemsCollection: AngularFirestoreCollection<UserMessage>;
    constructor(private db: AngularFirestore) {
    }

    public subscribeCollection(collectionName: string) {
        this.itemsCollection = this.db.collection('allMessages')
            .doc(collectionName)
            .collection<UserMessage>('messages', ref => ref.orderBy('datetime', 'asc'));
    }

    public getMessages(): Observable<UserMessage[]> {
        return this.itemsCollection.valueChanges();
    }

    pushNewMsg(message: UserMessage) {
        return this.itemsCollection.add(message);
    }
}
