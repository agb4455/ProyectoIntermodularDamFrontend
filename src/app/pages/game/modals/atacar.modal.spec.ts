import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtacarModalComponent } from './atacar.modal';
import { I18nService } from '../../../core/i18n/i18n.service';
import { EnemyTarget, Troop, ClanId, TroopType } from './attack.types';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

describe('AtacarModalComponent', () => {
  let component: AtacarModalComponent;
  let fixture: ComponentFixture<AtacarModalComponent>;
  let i18nServiceSpy: jasmine.SpyObj<I18nService>;

  const mockTarget: EnemyTarget = {
    clan: 'song',
    username: 'EnemyPlayer',
    health: { current: 100, max: 100 }
  };

  const mockTroops: Troop[] = [
    {
      id: 't1',
      name: 'Guerrero',
      type: TroopType.INFANTERIA,
      clan: 'fury',
      currentHealth: 80,
      maxHealth: 100,
      icon: 'icon1',
      cost: 10,
      isTraining: false,
      deployed: false
    },
    {
      id: 't2',
      name: 'Arquero',
      type: TroopType.ARQUERIA,
      clan: 'fury',
      currentHealth: 50,
      maxHealth: 100,
      icon: 'icon2',
      cost: 15,
      isTraining: false,
      deployed: false
    }
  ];

  beforeEach(async () => {
    i18nServiceSpy = jasmine.createSpyObj('I18nService', ['translate']);
    i18nServiceSpy.translate.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [AtacarModalComponent, TranslatePipe],
      providers: [
        { provide: I18nService, useValue: i18nServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AtacarModalComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    fixture.componentRef.setInput('target', mockTarget);
    fixture.componentRef.setInput('availableTroops', mockTroops);
    fixture.componentRef.setInput('localClan', 'fury');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('troopGrid computation', () => {
    it('troopGrid_givenSelectedIds_shouldMapToTroopObjects', () => {
      component.selectedTroopIds.set(['t1', 't2']);
      fixture.detectChanges();

      const grid = component.troopGrid();
      expect(grid.length).toBe(2);
      expect(grid[0].troopId).toBe('t1');
      expect(grid[0].troop.name).toBe('Guerrero');
      expect(grid[1].troopId).toBe('t2');
      expect(grid[1].troop.name).toBe('Arquero');
    });

    it('troopGrid_givenInvalidId_shouldFilterOutNulls', () => {
      component.selectedTroopIds.set(['t1', 'non-existent']);
      fixture.detectChanges();

      const grid = component.troopGrid();
      expect(grid.length).toBe(1);
      expect(grid[0].troopId).toBe('t1');
    });
  });

  describe('advantageState computation', () => {
    it('advantageState_givenFuryVsSong_shouldReturnAdvantage', () => {
      // Fury has advantage over Song (FURY -> SONG)
      fixture.componentRef.setInput('localClan', 'fury');
      fixture.componentRef.setInput('target', { ...mockTarget, clan: 'song' });
      fixture.detectChanges();

      const state = component.advantageState();
      expect(state).toBeTruthy();
      expect(state?.type).toBe('advantage');
      expect(i18nServiceSpy.translate).toHaveBeenCalledWith('GAME.MODALS.ATTACK.ADVANTAGE', jasmine.any(Object));
    });

    it('advantageState_givenSongVsFury_shouldReturnDisadvantage', () => {
      // Song has disadvantage against Fury (FURY -> SONG)
      fixture.componentRef.setInput('localClan', 'song');
      fixture.componentRef.setInput('target', { ...mockTarget, clan: 'fury' });
      fixture.detectChanges();

      const state = component.advantageState();
      expect(state).toBeTruthy();
      expect(state?.type).toBe('disadvantage');
      expect(i18nServiceSpy.translate).toHaveBeenCalledWith('GAME.MODALS.ATTACK.DISADVANTAGE', jasmine.any(Object));
    });

    it('advantageState_givenNeutralClans_shouldReturnNull', () => {
      fixture.componentRef.setInput('localClan', 'fury');
      fixture.componentRef.setInput('target', { ...mockTarget, clan: 'divine' }); // Fury -> Song, not Divine
      fixture.detectChanges();

      expect(component.advantageState()).toBeNull();
    });
  });

  describe('Actions', () => {
    it('onAddTroopClick_shouldShowModal', () => {
      component['onAddTroopClick'](); // Access protected
      expect(component.showAnadirModal()).toBeTrue();
    });

    it('onRemoveTroop_shouldUpdateSelectedIds', () => {
      component.selectedTroopIds.set(['t1', 't2']);
      component['onRemoveTroop']('t1');
      expect(component.selectedTroopIds()).toEqual(['t2']);
    });

    it('onAttackClick_givenTroops_shouldEmitAndReset', () => {
      spyOn(component.launchAttack, 'emit');
      component.selectedTroopIds.set(['t1', 't2']);
      component.showAnadirModal.set(true);

      component['onAttackClick']();

      expect(component.launchAttack.emit).toHaveBeenCalledWith(['t1', 't2']);
      expect(component.selectedTroopIds()).toEqual([]);
      expect(component.showAnadirModal()).toBeFalse();
    });

    it('onAttackClick_givenNoTroops_shouldNotEmit', () => {
      spyOn(component.launchAttack, 'emit');
      component.selectedTroopIds.set([]);

      component['onAttackClick']();

      expect(component.launchAttack.emit).not.toHaveBeenCalled();
    });

    it('onTroopSelected_shouldAddUniqueIdsAndCloseModal', () => {
      component.selectedTroopIds.set(['t1']);
      component.showAnadirModal.set(true);

      component['onTroopSelected'](['t1', 't2', 't3']);

      expect(component.selectedTroopIds()).toEqual(['t1', 't2', 't3']);
      expect(component.showAnadirModal()).toBeFalse();
    });

    it('getHealthPercentage_shouldReturnCorrectValue', () => {
      const troop = mockTroops[0]; // 80/100
      expect(component['getHealthPercentage'](troop)).toBe(80);
    });

    it('closeAtacarModal_shouldEmitClose', () => {
      spyOn(component.closeModal, 'emit');
      component['closeAtacarModal']();
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });
});
