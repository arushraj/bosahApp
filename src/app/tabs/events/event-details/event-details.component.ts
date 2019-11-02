import { Component, Input } from '@angular/core';
import { AppService } from '../../../shared/services/app.service';

import { Event } from '../../../shared/model/event.model';

@Component({
    selector: 'events-details',
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.scss'],
})

export class EventDetailsComponent {

    @Input() event: Event;
    @Input() userId: number;

    constructor(private appService: AppService) { }

    public setdefultImage(event) {
        event.target.src = '/assets/no-image.png';
    }

    public subscribeEvent() {
        this.appService.eventSubscribe(this.userId, this.event);
    }

}
