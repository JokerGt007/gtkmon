import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonRegisterComponent } from './pokemon-register.component';

describe('PokemonRegisterComponent', () => {
  let component: PokemonRegisterComponent;
  let fixture: ComponentFixture<PokemonRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
