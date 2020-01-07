import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSettingPage } from './profile-setting.page';

describe('ProfileSettingPage', () => {
  let component: ProfileSettingPage;
  let fixture: ComponentFixture<ProfileSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSettingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
