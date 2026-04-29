import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDepartamentoComponent } from './modal-departamento.component';

describe('ModalDepartamentoComponent', () => {
  let component: ModalDepartamentoComponent;
  let fixture: ComponentFixture<ModalDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDepartamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
