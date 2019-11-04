import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyPreferencesPage } from './modify-preferences.page';

describe('ModifyPreferencesPage', () => {
  let component: ModifyPreferencesPage;
  let fixture: ComponentFixture<ModifyPreferencesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyPreferencesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyPreferencesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
