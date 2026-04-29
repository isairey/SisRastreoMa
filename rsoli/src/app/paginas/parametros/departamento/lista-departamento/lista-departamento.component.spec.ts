import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaDepartamentoComponent } from './lista-departamento.component';

describe('ListaDepartamentoComponent', () => {
  let component: ListaDepartamentoComponent;
  let fixture: ComponentFixture<ListaDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaDepartamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
