import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioGeocercaComponent } from './formulario-geocerca.component';

describe('FormularioGeocercaComponent', () => {
  let component: FormularioGeocercaComponent;
  let fixture: ComponentFixture<FormularioGeocercaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioGeocercaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioGeocercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
