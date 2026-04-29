import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniHeaderComponent } from './mini-header.component';

describe('MiniHeaderComponent', () => {
  let component: MiniHeaderComponent;
  let fixture: ComponentFixture<MiniHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
