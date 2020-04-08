import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Toast } from '@ionic-native/toast/ngx';


@Component({
    selector: 'no-network',
    templateUrl: './no-network.component.html',
    styleUrls: ['./no-network.component.scss'],
})

export class NoNetworkComponent {

    public isOnline: boolean;

    constructor(private modalController: ModalController, private network: Network, private toast: Toast) {
        this.network.onConnect().subscribe(async () => {
            this.isOnline = true;
            this.modalController.dismiss();
        });
    }

    public connect() {
        if (this.isOnline) {
            this.modalController.dismiss();
        } else {
            this.toast.showShortBottom('No Network Connection Found!').subscribe(() => { });
        }
    }
}
