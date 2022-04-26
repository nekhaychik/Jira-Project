import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFormUpdateComponent } from './card-form-update.component';

describe('CardFormUpdateComponent', () => {
  let component: CardFormUpdateComponent;
  let fixture: ComponentFixture<CardFormUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardFormUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFormUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
