import { Component, Input } from '@angular/core';
import { AppService } from '../../../shared/services/app.service';

import { UserFriends } from 'src/app/shared/model/user-friend.model';

@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss'],
})

export class UserDetailsComponent {

    @Input() user: UserFriends;

    constructor(private appService: AppService) { }

    public setdefultImage(event) {
        event.target.src = '/assets/no-image.png';
    }
}
