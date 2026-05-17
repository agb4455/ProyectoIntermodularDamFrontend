export const es = {
  NAV: {
    HOME: 'Inicio',
    MENU: 'Menú',
    LOBBY: 'CÁMARA DE GUERRA',
    CHARACTERS: 'Personajes',
    ADMIN: 'Admin',
    CONFIG: 'Ajustes',
    STATS: 'Estadisticas',
    LOGOUT: 'Cerrar sesion',
    LOGIN: 'Iniciar Sesión',
    RULES: 'Reglas del Juego'
  },
  SHOW: '▼ MOSTRAR',
  HIDE: '▲ ESCONDER',
  HOME: {
    HERO_TITLE: 'VIKING CLAN WARS',
    HERO_SUBTITLE: 'Conquista las Tierras del Norte. Forja tu leyenda. Arrasa con tus enemigos.',
    START_ADVENTURE: '¡A LAS ARMAS!',
    GO_TO_LOBBY: 'IR AL LOBBY',
    EXPLORE_ERA: 'Explora el Códice',
    SECTIONS: {
      ERAS: {
        TITLE: 'La Cronología de la Guerra',
        DESC: 'Toda saga se divide en tres eras ancestrales.',
        ERA_1_NAME: 'Preparación',
        ERA_1_DESC: 'Los ataques están prohibidos. Es el momento de entrenar tus tropas y acumular sabiduría. Los costos son elevados, pero la paz es temporal.',
        ERA_2_NAME: 'Ragnarök',
        ERA_2_DESC: 'El Ragnarök comienza. Los costos de leva se reducen y la sangre corre por las tierras. Es la era de la conquista y la destrucción mutua.',
        ERA_3_NAME: 'El Veredicto',
        ERA_3_DESC: 'Solo los clanes más fuertes permanecen. La magia fluye con facilidad mientras el fin se acerca. El arma definitiva está lista para ser forjada.'
      },
      CLANS: {
        TITLE: 'Elige tu Linaje',
        DESC: 'Seis clanes ancestrales luchan por el trono supremo.',
        LORE: 'Maestros del {{ archetype }}, estos guerreros dominan tácticas sagradas para prevalecer en el campo de batalla.'
      },
      MILITARY: {
        TITLE: 'Arte de la Guerra',
        AP_TITLE: 'Puntos de Acción (AP)',
        AP_DESC: 'Recurso vital para el reclutamiento y despliegue. Se regeneran con el flujo de las mareas del norte.',
        RP_TITLE: 'Tecnología Sagrada (RP)',
        RP_DESC: 'Invierte en el Árbol Tecnológico para desbloquear unidades de élite y hechizos que alteran el destino.',
        MAP_TITLE: 'Mapa Táctico',
        MAP_DESC: 'Visualiza el frente de batalla y las capitales enemigas. Planifica tus incursiones con precisión rúnica.'
      },
      CTA: {
        TITLE: '¿Estás preparado para el Valhalla?',
        DESC: 'Únete a la asamblea de clanes y reclama tu trono en el Norte.',
        BTN: 'FORJAR MI LEYENDA'
      }
    }
  },
  LOBBY: {
    TITLE: 'CÁMARA DE GUERRA',
    ACTIVE_GAMES: 'Partidas Activas',
    FINISHED_GAMES: 'Partidas Finalizadas',
    NO_GAMES: 'No hay batallas en curso...',
    CREATE_GAME: 'EMPEZAR PARTIDA',
    JOIN_GAME: 'UNIRSE A PARTIDA',
    ABANDON: 'ABANDONAR',
    ENTER: 'ENTRAR',
    CLAN: 'Clan',
    DELETE: 'BORRAR',
    STATS: 'ESTADISTICAS',
    GAME_RESULT: {
      VICTORY: 'Victoria',
      DEFEAT: 'Derrota'
    },
    MESSAGES: {
      CONFIRM_LEAVE_TITLE: '¿ABANDONAR PARTIDA?',
      CONFIRM_LEAVE: '¿Estás seguro de que quieres abandonar esta partida? Perderás automáticamente.',
      ERROR_TITLE: 'ERROR',
      LEAVE_ERROR: 'No se pudo abandonar la partida. Inténtalo desde dentro del juego.'
    },
    MODALS: {
      CREATE: {
        TITLE: 'ELEGIR CLAN',
        SUBTITLE: 'Elige tu linaje. Tu destino depende de ello.',
        HINT_ACTIVE: 'Clan seleccionado — listo para la batalla',
        HINT_EMPTY: 'Selecciona un clan para continuar',
        FORGING: 'Forjando partida…',
        BTN: 'CREAR PARTIDA',
        SELECT_CLAN: 'Seleccionar clan'
      },
      JOIN: {
        TITLE: 'UNIRSE A LA PARTIDA',
        SUBTITLE: 'Introduce el Codigo de Partida para entrar en batalla.',
        CODE_PLACEHOLDER: 'Codigo (Ej: A7X9-B)',
        BTN: 'ENTRAR EN BATALLA',
        JOINING: 'Buscando clan…',
        CHOOSE_DESTINY: 'Elige tu destino'
      },
      FULL: {
        TITLE: 'SALA LLENA',
        MESSAGE: 'El salón de guerra ya está completo. Otros guerreros han llegado antes que tú. Inicia o unete a otra partida distinta',
        BTN: 'ENTENDIDO'
      }
    }
  },
  AUTH: {
    TITLE: 'Viking Strategy',
    SUBTITLE: 'FORJA TU DESTINO EN EL VALHALLA',
    USERNAME: 'Usuario',
    PASSWORD: 'Contraseña',
    LOGIN: {
      TITLE: 'Iniciar Sesión',
      USER_PLACEHOLDER: 'Tu nombre de usuario',
      PASS_PLACEHOLDER: 'Tu contraseña',
      FORGOT: '¿Has olvidado la contraseña?',
      BTN: 'Entrar en Batalla',
      NO_ACCOUNT: '¿Aún no tienes cuenta?',
      REGISTER_LINK: 'Regístrate aquí'
    },
    REGISTER: {
      TITLE: 'Registrarse',
      USER_PLACEHOLDER: 'Tu nombre de usuario',
      EMAIL_PLACEHOLDER: 'tu@email.com',
      PASS_PLACEHOLDER: 'Mínimo 8 caracteres',
      CONFIRM_LABEL: 'Confirmar Contraseña',
      CONFIRM_PLACEHOLDER: 'Repite tu contraseña',
      MISMATCH: 'Las contraseñas no coinciden',
      BTN: 'Crear Cuenta',
      HAS_ACCOUNT: '¿Ya tienes cuenta?',
      LOGIN_LINK: 'Inicia sesión aquí'
    },
    VALIDATION: {
      REQUIRED_FIELDS: 'Por favor completa todos los campos correctamente',
      LOGIN_ERROR: 'Error en el inicio de sesión. Inténtalo de nuevo.',
      REGISTER_ERROR: 'Error en el registro. Inténtalo de nuevo.',
      BANNED_USER: 'Tu cuenta ha sido baneada del sistema.'
    },
    EMAIL: 'Email'
  },
  CONFIG: {
    TITLE: 'AJUSTES DEL USUARIO',
    PROFILE: 'Perfil de Guerrero',
    LANGUAGE: 'IDIOMA',
    THEME: 'Atmósfera',
    DARK_MODE: 'Noche Eterna',
    LIGHT_MODE: 'Día de Odín',
    BTN_SAVE: 'GUARDAR CAMBIOS',
    BTN_CANCEL: 'DESCARTAR',
    CHANGE_PASSWORD: 'Cambiar Contraseña',
    SECURITY: 'SEGURIDAD',
    SECURITY_DESC: 'Asegura tu acceso',
    LANGUAGE_DESC: 'Idioma de la batalla',
    EDIT_AVATAR: 'Editar avatar',
    CHOOSE_AVATAR: 'Elige tu Avatar',
    UPLOAD_CUSTOM: 'Subir Foto Personalizada',
    ERROR_TITLE: 'ERROR'
  },
  OR: 'o',
  GAME: {
    SPECTATOR: 'ESPECTADOR',
    VICTORY: 'VICTORIA',
    DEFEAT: 'DERROTA',
    PHASES: {
      WAITING: 'ESPERANDO',
      PREPARATION: 'PREPARACIÓN',
      WAR: 'Ragnarök',
      END: 'FIN',
      FINISHED: 'FINALIZADO'
    },
    STATS: {
      HEALTH: 'Vida',
      GOLD: 'Oro',
      RESEARCH: 'Sabiduria'
    },
    STATUS: {
      READY: 'LISTO',
      TRAINING: 'ENTRENANDO',
      QUEUED: 'EN COLA',
      DEPLOYED: 'EN CAMPAÑA',
      EMPTY_TERRITORY: 'No hay tropas en este territorio'
    },
    troop_types: {
      ATK: 'Ofensiva',
      DEF: 'Defensiva',
      HEAL: 'Sanadora',
      SUPP: 'Apoyo',
      FURY: 'Furia',
      DIVINE: 'Divino',
      IRON: 'Hierro',
      SHADOW: 'Sombra',
      FROST: 'Escarcha',
      STORM: 'Tormenta'
    },
    troop_desc: {
      infanteria: 'Guerreros básicos con hachas y escudos.',
      arqueria: 'Unidades a distancia para hostigar al enemigo.',
      caballeria: 'Unidades rápidas y poderosas montadas.'
    },
    CLAN_NAMES: {
      FURY: 'Berserkers',
      DIVINE: 'Valkirias',
      IRON: 'Jarls',
      SHADOW: 'Sombras',
      FROST: 'Frost Guard',
      STORM: 'Storm Bringers'
    },
    ACTIONS: {
      TRAIN: 'Entrenar Tropas',
      TROOPS: 'Ver Tropas',
      TECH: 'Árbol Tecnológico',
      LOG: 'Log de Batalla'
    },
    LOG_START: 'ha iniciado la partida',
    LOG_PHASE_CHANGE: 'La fase ha cambiado a: {{ phase }}',
    LOG_ATTACK: 'ha lanzado un ataque contra {{ target }}',
    LOG_ATTACK_RECEIVED: '¡CUIDADO! {{ attacker }} te está atacando',
    LOG_BATTLE_RESULT: 'La batalla contra {{ attacker }} ha terminado',
    LOG_PLAYER_ELIMINATED: '{{ player }} ha sido eliminado del mapa',
    LOG_GAME_WON: '¡HAS CONQUISTADO EL NORTE! Victoria suprema',
    LOG_GAME_LOST: 'Tu capital ha caído. El Valhalla te espera',
    LOG_TRAIN: 'ha comenzado a entrenar {{ troop }}',
    LOG_TRAIN_CONFIRM: 'Entrenamiento confirmado por el Gran Salón',
    LOG_TRAIN_COMPLETE: '{{ troop }} se ha unido a las filas',
    LOG_RESEARCH: 'ha comenzado a investigar {{ tech }}',
    LOG_RESEARCH_CONFIRM: 'Los sabios han comenzado la investigación',
    LOG_RESEARCH_COMPLETE: '{{ tech }} ha sido dominado por el clan',
    MODALS: {
      LEAVE_CONFIRM: {
        TITLE: '¿ABANDONAR BATALLA?',
        BODY: 'Si abandonas ahora, tus tropas se dispersarán y perderás todo el progreso en esta partida. Los demás clanes verán tu retirada como un acto de cobardía.',
        QUOTE: '"Un cobarde cree que vivirá para siempre si evita la guerra."',
        BTN_STAY: 'QUEDARSE Y LUCHAR',
        BTN_LEAVE: 'RETIRADA'
      },
      PREPARATION_AVISO: 'En la fase de preparación no se puede atacar. Aprovecha para entrenar tropas y mejorar tu clan.',
      ONLY_HOST_CAN_START: 'Solo el anfitrión puede iniciar la travesía.',
      REPORT: {
        TITLE: 'Reporte de Combate',
        CAPITAL_DAMAGE: 'Daño a la capital rival:',
        ENEMY_DESTROYED: 'Tropas enemigas destruidas:',
        OWN_LOSSES: 'Tropas propias perdidas:',
        RESEARCH_EARNED: 'Créditos de investigación ganados:',
        ELIMINATED_BANNER: '¡HAS ELIMINADO A TU RIVAL!',
        ACCEPT: 'Aceptar'
      },
      ATTACK: {
        TITLE: 'MODAL DE ATAQUE',
        SUBTITLE: 'Selecciona las tropas para el asalto a {{ target }}',
        ADVANTAGE: '¡VENTAJA TÁCTICA! Tus tropas infligen un 50% más de daño a los {{ enemyClan }}.',
        DISADVANTAGE: '¡CUIDADO! El clan {{ enemyClan }} tiene ventaja defensiva sobre ti (daño reducido).',
        BTN_ATTACK: 'LANZAR ATAQUE',
        EMPTY_GRID: 'Pulsa el botón "+" para desplegar guerreros',
        SELECTED_HINT: 'seleccionada',
        ESTIMATED_DAMAGE: 'Daño Estimado',
        ADVANTAGE_HINT: 'por ventaja',
        CLICK_TO_REMOVE: 'Clic para eliminar',
        ADD_TROOP: 'Añadir tropa',
        PREV_PAGE: 'Página anterior',
        NEXT_PAGE: 'Página siguiente'
      },
      AVISO_TITLE: '¡AVISO GUERRERO!',
      VICTORY_TITLE: '¡VICTORIA!',
      DEFEAT_TITLE: 'DERROTA',
      WAITING: {
        WAIT_TITLE: 'ESPERANDO AL ANFITRIÓN',
        HOST_TITLE: 'ASAMBLEA DE GUERREROS',
        MIN_PLAYERS: 'Se necesitan al menos 2 guerreros para zarpar',
        BTN_START: '¡INICIAR CONQUISTA!',
        PLAYER_COUNT: '{{ current }}/{{ max }} Jugadores',
        HOST_BADGE: 'HOST'
      },
      TRAIN: {
        TITLE: 'CAMPO DE ENTRENAMIENTO',
        SUBTITLE: 'Recluta nuevos guerreros para tu clan',
        COST: 'Coste',
        BTN_TRAIN: 'ENTRENAR',
        NO_GOLD: 'Oro insuficiente',
        EMPTY: 'No hay tropas disponibles para entrenar en este momento. ¡Mejora tu árbol tecnológico!',
        EMPTY_LOG: 'No hay eventos registrados en este momento.'
      },
      TECH: {
        TITLE: 'ÁRBOL TECNOLÓGICO',
        DESC: 'Desbloquea la sabiduría ancestral de tu clan.',
        BTN_RESEARCH: 'INVESTIGAR',
        UNLOCKED: 'DESBLOQUEADO',
        AVAILABLE: 'DISPONIBLE',
        LOCKED: 'BLOQUEADO',
        COST: 'Coste',
        REQUIREMENTS: 'Requisitos',
        TIER: 'Estamento',
        LEGENDARY: 'LEGENDARIO',
        RESEARCHING: 'INVESTIGANDO'
      },
      RULES: {
        TITLE: 'LEYES DE MIDGARD',
        OBJ: {
          TITLE: 'OBJETIVO DEL JUEGO',
          DESC: 'Tu misión es simple pero brutal: **sé el último clan en pie**. Destruye las capitales enemigas antes de que ellos destruyan la tuya. La gloria eterna te espera en el Valhalla, pero solo los vivos gobiernan el mundo.'
        },
        PHASES: {
          TITLE: 'FASES DE LA LUCHA',
          PREP_TITLE: 'PREPARACIÓN (5 min)',
          PREP_DESC: 'Los dioses bendicen el campo con paz. No se permiten ataques. Aprovecha para entrenar tus primeras tropas y planificar tu estrategia.',
          WAR_TITLE: 'GUERRA',
          WAR_DESC: 'Se abren las puertas del conflicto. Los recursos se entregan cada **30-60 segundos**. Es el momento de lanzar tus ataques.',
          END_TITLE: 'EL FINAL (Showdown)',
          END_DESC: 'Cuando solo quedan 2 clanes, la victoria se decide. Sin piedad, solo gloria.'
        },
        RESOURCES: {
          TITLE: 'RECURSOS Y ECONOMÍA',
          GOLD_TITLE: 'Créditos Económicos',
          GOLD_DESC: 'Se obtienen automáticamente durante la Guerra. Úsalos para **entrenar tropas** en tu capital.',
          RES_TITLE: 'Puntos de Investigación',
          RES_DESC: 'Se ganan en el campo de batalla. **Cuanto más daño inflijas**, más rápido podrás avanzar en tu tecnología.'
        },
        ADVANTAGES: {
          TITLE: 'EL CÍRCULO DEL DESTINO (Ventajas)',
          DESC: 'Ciertos clanes tienen una ventaja natural sobre otros. Atacar a un clan vulnerable infligirá un **1.5x de daño extra**.',
          FURY_IRON: 'Fury vence a Iron (La rabia quiebra el acero)',
          IRON_DIVINE: 'Iron vence a Divine (El metal desafía a los dioses)',
          DIVINE_SHADOW: 'Divine vence a Shadow (La luz disipa las sombras)',
          SHADOW_STORM: 'Shadow vence a Storm (El sigilo esquiva el rayo)',
          STORM_FROST: 'Storm vence a Frost (La tormenta quiebra el hielo)',
          FROST_FURY: 'Frost vence a Fury (El frío congela la furia)'
        },
        COMBAT: {
          TITLE: 'MECÁNICAS DE COMBATE',
          SIM_TITLE: 'Daño Simultáneo',
          SIM_DESC: 'Las batallas son brutales: ambos bandos se infligen daño al mismo tiempo basado en su poder total.',
          SHIELD_TITLE: 'Escudo de Tropas',
          SHIELD_DESC: 'Las tropas en la capital protegen la estructura. La Capital solo recibe daño si todas sus tropas defensoras mueren.',
          DEF_TITLE: 'Bono de Defensa',
          DEF_DESC: 'Cualquier clan que defienda su propia capital recibe un **+10% (1.1x)** de potencia defensiva automática.',
          SURV_TITLE: 'Supervivientes',
          SURV_DESC: 'Si tus tropas sobreviven al intercambio, regresarán automáticamente a tu capital tras el ataque.',
          TIP: 'Los multiplicadores (1.5x ataque / 1.1x defensa) solo aumentan el daño que haces, no tu supervivencia.'
        },
        TECH: {
          TITLE: 'ARBOL TECNOLÓGICO',
          DESC: 'Cada clan dispone de un árbol tecnológico único con **8 investigaciones**. Desbloquean tropas de élite, mejoras de estadísticas y el Arma Definitiva. Invierte tus Puntos de Investigación con cabeza.'
        }
      }
    },
    ATTACK_TOAST: {
      TITLE: 'Ataque Finalizado',
      DESC: 'Haz clic para ver el reporte'
    },
    LOG: {
      FILTERS: {
        ALL: 'Todos',
        ATTACK: 'Ataques',
        TRAIN: 'Entrenamiento',
        RESEARCH: 'Investigación'
      },
      AUTO_SCROLL: 'Auto-scroll al final'
    },
    BANNED_TITLE: 'ACCESO DENEGADO',
    BANNED_MESSAGE: 'Has sido expulsado del sistema por un administrador.'
  },
  ADMIN: {
    TITLE: 'Panel de Administración',
    TOTAL_USERS: 'Usuarios Totales',
    TOTAL_GAMES: 'Partidas Totales',
    BANNED_USERS: 'Usuarios Baneados',
    REALTIME_MONITORING: 'Monitoreo en Tiempo Real',
    ACTIVE_USERS: 'Usuarios Activos',
    ACTIVE_GAMES: 'Partidas Activas',
    FINISHED_GAMES_HOUR: 'Partidas Terminadas (Última hora)',
    SERVER_LOAD: 'Carga del Servidor',
    BAN_MANAGEMENT: 'Gestión de Baneos',
    SEARCH_USER: 'Buscar usuario para banear...',
    UNBAN: 'LEVANTAR BAN',
    BAN: 'BANEAR',
    BANNED_BADGE: 'BANEADO',
    TABLE: {
      USER: 'Usuario',
      EMAIL: 'Email',
      CREATED_AT: 'Registrado el',
      STATUS: 'Estado',
      ACTION: 'Acción'
    }
  },
  STATISTICS: {
    TITLE: 'Tus Hazañas',
    GLORY: 'Gloria Eterna',
    MATCH_DETAILS: 'Detalles de la Batalla',
    TIME: 'Tiempo de Juego',
    MONEY: 'Créditos Ganados',
    TRAINED: 'Tropas Entrenadas',
    DEPLOYED: 'Tropas Desplegadas',
    ATTACKS: 'Ataques Realizados',
    WINS: 'Victorias'
  },
  SHARED: {
    MODAL: {
      BTN_OK: 'ENTENDIDO',
      BTN_CONFIRM: 'CONFIRMAR',
      BTN_CANCEL: 'CANCELAR'
    }
  },
  DEBUG: {
    TITLE: 'Herramientas de Debug',
    TOOLS: 'DEBUG TOOLS',
    ECONOMY: 'Economía (Oro)',
    PHASE: 'Fase de Juego',
    PLAYERS: 'Jugadores',
    ADD: 'Añadir',
    REMOVE: 'Quitar',
    NEXT_PHASE: 'Siguiente Fase',
    THEME: 'Tema',
    SYSTEM_INFO: 'Viking Clan Wars v0.1.0-debug',
    OPEN_PANEL: 'Abrir Panel Debug'
  }
};
