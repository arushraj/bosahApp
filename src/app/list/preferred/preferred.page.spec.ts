import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreferredPage } from './preferred.page';

describe('PreferredPage', () => {
  let component: PreferredPage;
  let fixture: ComponentFixture<PreferredPage>;
  let preferredPage: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreferredPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreferredPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of 10 elements', () => {
    preferredPage = fixture.nativeElement;
    const items = preferredPage.querySelectorAll('ion-item');
    expect(items.length).toEqual(10);
  });

});
