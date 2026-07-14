import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTarjetas } from './mis-tarjetas';

describe('MisTarjetas', () => {
  let component: MisTarjetas;
  let fixture: ComponentFixture<MisTarjetas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisTarjetas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisTarjetas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
