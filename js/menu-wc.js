'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">proyecto-intermodular-dam-frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AdminPageComponent.html" data-type="entity-link" >AdminPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AnadirTropaAtaqueModalComponent.html" data-type="entity-link" >AnadirTropaAtaqueModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/App.html" data-type="entity-link" >App</a>
                            </li>
                            <li class="link">
                                <a href="components/AtacarModalComponent.html" data-type="entity-link" >AtacarModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthComponent.html" data-type="entity-link" >AuthComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AvisoModalComponent.html" data-type="entity-link" >AvisoModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CambiarContrasenaModalComponent.html" data-type="entity-link" >CambiarContrasenaModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CharactersPageComponent.html" data-type="entity-link" >CharactersPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmAbandonModalComponent.html" data-type="entity-link" >ConfirmAbandonModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CrearPartidaModalComponent.html" data-type="entity-link" >CrearPartidaModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EntrenarModalComponent.html" data-type="entity-link" >EntrenarModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GameLogModalComponent.html" data-type="entity-link" >GameLogModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GamePageComponent.html" data-type="entity-link" >GamePageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GlobalDebugComponent.html" data-type="entity-link" >GlobalDebugComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LobbyModalComponent.html" data-type="entity-link" >LobbyModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LobbyPageComponent.html" data-type="entity-link" >LobbyPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogoComponent.html" data-type="entity-link" >LogoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link" >NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReglasModalComponent.html" data-type="entity-link" >ReglasModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RulesPageComponent.html" data-type="entity-link" >RulesPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SalaLlenaModalComponent.html" data-type="entity-link" >SalaLlenaModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatisticsComponent.html" data-type="entity-link" >StatisticsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UnirsePartidaModalComponent.html" data-type="entity-link" >UnirsePartidaModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserConfigComponent.html" data-type="entity-link" >UserConfigComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VisualizarTropasModalComponent.html" data-type="entity-link" >VisualizarTropasModalComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DebugService.html" data-type="entity-link" >DebugService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GameService.html" data-type="entity-link" >GameService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/I18nService.html" data-type="entity-link" >I18nService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThemeService.html" data-type="entity-link" >ThemeService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ActiveAttack.html" data-type="entity-link" >ActiveAttack</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ActiveGameMock.html" data-type="entity-link" >ActiveGameMock</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AttackSelection.html" data-type="entity-link" >AttackSelection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BanRecord.html" data-type="entity-link" >BanRecord</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClanDetail.html" data-type="entity-link" >ClanDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClanOption.html" data-type="entity-link" >ClanOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClanOption-1.html" data-type="entity-link" >ClanOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClanPreview.html" data-type="entity-link" >ClanPreview</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnemyTarget.html" data-type="entity-link" >EnemyTarget</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FinishedGameMock.html" data-type="entity-link" >FinishedGameMock</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GameContext.html" data-type="entity-link" >GameContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GameLogEntry.html" data-type="entity-link" >GameLogEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PlayerNode.html" data-type="entity-link" >PlayerNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SessionState.html" data-type="entity-link" >SessionState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StatMetric.html" data-type="entity-link" >StatMetric</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrainableTroopOption.html" data-type="entity-link" >TrainableTroopOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Troop.html" data-type="entity-link" >Troop</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TroopGridCell.html" data-type="entity-link" >TroopGridCell</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/TranslatePipe.html" data-type="entity-link" >TranslatePipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});