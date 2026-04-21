import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LogoComponent]
    });
    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('scale_givenValue_shouldApplyTransform', () => {
    // Definir input
    fixture.componentRef.setInput('scale', 1.5);
    fixture.detectChanges();

    const wrapper = fixture.debugElement.nativeElement.querySelector('.logo-wrapper');
    expect(wrapper.style.transform).toBe('scale(1.5)');
  });

  it('showText_givenFalse_shouldHideTextContainer', () => {
    // Definir input
    fixture.componentRef.setInput('showText', false);
    fixture.detectChanges();

    const text = fixture.debugElement.nativeElement.querySelector('.logo-text');
    expect(text).toBeNull();
  });

  it('showText_givenTrue_shouldShowTextContainer', () => {
    // Por defecto es true
    const text = fixture.debugElement.nativeElement.querySelector('.logo-text');
    expect(text).not.toBeNull();
  });

  it('direction_givenHorizontal_shouldApplyHorizontalClass', () => {
    // Definir input
    fixture.componentRef.setInput('direction', 'horizontal');
    fixture.detectChanges();

    const wrapper = fixture.debugElement.nativeElement.querySelector('.logo-wrapper');
    expect(wrapper.classList.contains('horizontal')).toBeTrue();
    expect(wrapper.classList.contains('vertical')).toBeFalse();
  });

  it('direction_givenVertical_shouldApplyVerticalClass', () => {
    // Definir input
    fixture.componentRef.setInput('direction', 'vertical');
    fixture.detectChanges();

    const wrapper = fixture.debugElement.nativeElement.querySelector('.logo-wrapper');
    expect(wrapper.classList.contains('vertical')).toBeTrue();
    expect(wrapper.classList.contains('horizontal')).toBeFalse();
  });
});
