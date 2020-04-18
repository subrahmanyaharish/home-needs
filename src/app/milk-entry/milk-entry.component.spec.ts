import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilkEntryComponent } from './milk-entry.component';

describe('MilkEntryComponent', () => {
  let component: MilkEntryComponent;
  let fixture: ComponentFixture<MilkEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilkEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilkEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
