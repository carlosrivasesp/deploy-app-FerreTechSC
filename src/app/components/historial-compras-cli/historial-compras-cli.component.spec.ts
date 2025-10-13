import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HistorialComprasCliComponent } from './historial-compras-cli.component';

describe('HistorialComprasCliComponent', () => {
  let component: HistorialComprasCliComponent;
  let fixture: ComponentFixture<HistorialComprasCliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [HistorialComprasCliComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialComprasCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
