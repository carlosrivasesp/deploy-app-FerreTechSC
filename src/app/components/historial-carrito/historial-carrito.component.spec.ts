import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialCarritoComponent } from './historial-carrito.component';

describe('HistorialCarritoComponent', () => {
  let component: HistorialCarritoComponent;
  let fixture: ComponentFixture<HistorialCarritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistorialCarritoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
