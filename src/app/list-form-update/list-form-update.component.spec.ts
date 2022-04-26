import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFormUpdateComponent } from './list-form-update.component';

describe('ListFormUpdateComponent', () => {
  let component: ListFormUpdateComponent;
  let fixture: ComponentFixture<ListFormUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFormUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFormUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
