import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPremios } from './mis-premios';

describe('MisPremios', () => {
  let component: MisPremios;
  let fixture: ComponentFixture<MisPremios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisPremios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisPremios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
