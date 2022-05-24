import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardUpdateComponent } from './board-update.component';

describe('BoardUpdateComponent', () => {
  let component: BoardUpdateComponent;
  let fixture: ComponentFixture<BoardUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
