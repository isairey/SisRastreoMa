import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGestionComponent } from './modal-gestion.component';

describe('ModalGestionComponent', () => {
  let component: ModalGestionComponent;
  let fixture: ComponentFixture<ModalGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalGestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
