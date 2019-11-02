import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatSearchFormPage } from './flat-search-form.page';

describe('FlatSearchFormPage', () => {
  let component: FlatSearchFormPage;
  let fixture: ComponentFixture<FlatSearchFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatSearchFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatSearchFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
