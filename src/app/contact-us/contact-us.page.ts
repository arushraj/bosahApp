import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../shared/services/app.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  public contactUsForm: FormGroup;

  constructor(private appService: AppService, private fb: FormBuilder) {
    this.contactUsForm = fb.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      message: ['', Validators.compose([Validators.required])]
    });
   }

  ngOnInit() {
  }

}
