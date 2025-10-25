import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TrackingPedidoComponent } from './tracking-pedido.component';

describe('TrackingPedidoComponent', () => {
  let component: TrackingPedidoComponent;
  let fixture: ComponentFixture<TrackingPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackingPedidoComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find a valid order', () => {
    component.codigoPedido = 'FT123';
    component.buscarPedido();
    expect(component.pedidoEncontrado).toBeTruthy();
    expect(component.progreso).toBe(75);
  });

  it('should handle not found order', () => {
    component.codigoPedido = 'XYZ999';
    component.buscarPedido();
    expect(component.pedidoEncontrado).toBeNull();
    expect(component.pedidoNoEncontrado).toBeTrue();
  });
});
