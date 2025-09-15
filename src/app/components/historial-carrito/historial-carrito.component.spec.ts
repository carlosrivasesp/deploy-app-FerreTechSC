import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HistorialCarritoComponent } from './historial-carrito.component';

describe('HistorialCarritoComponent', () => {
  let component: HistorialCarritoComponent;
  let fixture: ComponentFixture<HistorialCarritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HistorialCarritoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
