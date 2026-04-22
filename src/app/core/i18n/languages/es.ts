export const es = {
  NAV: {
    HOME: 'Inicio',
    MENU: 'Menú',
    LOBBY: 'Guerra',
    CHARACTERS: 'Linajes',
    ADMIN: 'Oráculo',
    CONFIG: 'Ajustes',
    STATS: 'Sagas',
    LOGOUT: 'Partir al Valhalla',
    LOGIN: 'Iniciar Sesión',
    RULES: 'Leyes de Midgard'
  },
  SHOW: '▼ MOSTRAR',
  HIDE: '▲ ESCONDER',
  HOME: {
    HERO_TITLE: 'VIKING CLAN WARS',
    HERO_SUBTITLE: 'Conquista las Tierras del Norte. Forja tu leyenda. Arrasa con tus enemigos.',
    START_ADVENTURE: '¡A LAS ARMAS!',
    EXPLORE_ERA: 'Explora el Códice',
    SECTIONS: {
      ERAS: {
        TITLE: 'La Cronología de la Guerra',
        DESC: 'Toda saga se divide en tres eras ancestrales.',
        ERA_1_NAME: 'Preparación',
        ERA_1_DESC: 'Los ataques están prohibidos. Es el momento de realizar rituales, entrenar tus tropas y acumular sabiduría. Los costos son elevados, pero la paz es temporal.',
        ERA_2_NAME: 'Guerra Total',
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
    FINISHED_GAMES: 'Gestas Finalizadas',
    NO_GAMES: 'No hay batallas en curso...',
    CREATE_GAME: 'FORJAR PARTIDA',
    JOIN_GAME: 'UNIRSE A LA GESTA',
    ABANDON: 'ABANDONAR',
    DELETE: 'BORRAR',
    STATS: 'Sagas',
    GAME_RESULT: {
      VICTORY: 'Victoria',
      DEFEAT: 'Derrota'
    },
    MESSAGES: {
      CONFIRM_LEAVE: '¿Estás seguro de que quieres abandonar esta partida? Perderás automáticamente.'
    },
    MODALS: {
      CREATE: {
        TITLE: 'JURAMENTAR CLAN',
        SUBTITLE: 'Elige tu linaje. Tu destino depende de ello.',
        HINT_ACTIVE: 'Clan seleccionado — listo para la batalla',
        HINT_EMPTY: 'Selecciona un clan para continuar',
        FORGING: 'Forjando partida…',
        BTN: 'CREAR PARTIDA'
      },
      JOIN: {
        TITLE: 'UNIRSE A LA GESTA',
        SUBTITLE: 'Introduce el Códice de Guerra para entrar en batalla.',
        CODE_PLACEHOLDER: 'Códice (Ej: A7X9-B)',
        BTN: 'ENTRAR EN BATALLA',
        JOINING: 'Buscando clan…'
      },
      FULL: {
        TITLE: 'SALA LLENA',
        MESSAGE: 'El salón de guerra ya está completo. Otros guerreros han llegado antes que tú.',
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
      REGISTER_ERROR: 'Error en el registro. Inténtalo de nuevo.'
    }
  },
  CONFIG: {
    TITLE: 'AJUSTES DEL GUERRERO',
    PROFILE: 'Perfil de Guerrero',
    LANGUAGE: 'Lengua del Clan',
    THEME: 'Atmósfera',
    DARK_MODE: 'Noche Eterna',
    LIGHT_MODE: 'Día de Odín',
    BTN_SAVE: 'GUARDAR CAMBIOS',
    BTN_CANCEL: 'DESCARTAR',
    CHANGE_PASSWORD: 'Cambiar Contraseña'
  },
  GAME: {
    PHASES: {
      WAITING: 'ESPERANDO',
      PREPARATION: 'PREPARACIÓN',
      WAR: 'GUERRA',
      END: 'FIN'
    },
    STATS: {
      HEALTH: 'Vida',
      GOLD: 'Oro',
      RESEARCH: 'Ptos. Inv'
    },
    troop_types: {
      infanteria: 'Infantería',
      arqueria: 'Arquería',
      caballeria: 'Caballería'
    },
    troop_desc: {
      infanteria: 'Guerreros básicos con hachas y escudos.',
      arqueria: 'Unidades a distancia para hostigar al enemigo.',
      caballeria: 'Unidades rápidas y poderosas montadas.'
    },
    ACTIONS: {
      TRAIN: 'Entrenar Tropas',
      TROOPS: 'Ver Tropas',
      TECH: 'Árbol Tecnológico',
      LOG: 'Log de Batalla'
    },
    LOG_START: 'ha iniciado la partida',
    LOG_ATTACK: 'ha lanzado un ataque contra {{ target }}',
    LOG_TRAIN: 'ha entrenado {{ troop }}',
    MODALS: {
      LEAVE_CONFIRM: {
        TITLE: '¿ABANDONAR BATALLA?',
        BODY: 'Si abandonas ahora, tus tropas se dispersarán y perderás todo el progreso en esta partida. Los demás clanes verán tu retirada como un acto de cobardía.',
        QUOTE: '"Un cobarde cree que vivirá para siempre si evita la guerra."',
        BTN_STAY: 'QUEDARSE Y LUCHAR',
        BTN_LEAVE: 'RETIRADA'
      },
      PREPARATION_AVISO: 'En la fase de preparación no se puede atacar. Aprovecha para entrenar tropas y mejorar tu clan.',
      ATTACK: {
        TITLE: 'MODAL DE ATAQUE',
        SUBTITLE: 'Selecciona las tropas para el asalto a {{ target }}',
        ADVANTAGE: '¡VENTAJA TÁCTICA! Tus tropas infligen un 50% más de daño a los {{ enemyClan }}.',
        DISADVANTAGE: '¡CUIDADO! El clan {{ enemyClan }} tiene ventaja defensiva sobre ti (daño reducido).',
        BTN_ATTACK: 'LANZAR ATAQUE',
        EMPTY_GRID: 'Pulsa el botón "+" para desplegar guerreros',
        SELECTED_HINT: 'seleccionada'
      },
      AVISO_TITLE: '¡AVISO GUERRERO!',
      WAITING: {
        WAIT_TITLE: 'ESPERANDO AL ANFITRIÓN',
        HOST_TITLE: 'ASAMBLEA DE GUERREROS',
        MIN_PLAYERS: 'Se necesitan al menos 2 guerreros para zarpar',
        BTN_START: '¡INICIAR CONQUISTA!',
        PLAYER_COUNT: '{{ current }}/{{ max }} Jugadores'
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
      STATUS: {
        READY: 'LISTO',
        TRAINING: 'ENTRENANDO',
        QUEUED: 'EN COLA',
        EMPTY_TERRITORY: 'No hay tropas en este territorio'
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
          FURY_SONG: 'Fury vence a Song (La furia acalla el canto)',
          SONG_DEATH: 'Song vence a Death (La armonía calma a los muertos)',
          DEATH_DIVINE: 'Death vence a Divine (La entropía consume la luz)',
          DIVINE_RUNE: 'Divine vence a Rune (El poder celestial sobre las runas)',
          RUNE_IRON: 'Rune vence a Iron (La magia corroe el acero)',
          IRON_FURY: 'Iron vence a Fury (El blindaje resiste la rabia)'
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
          DESC: 'Existen **8 niveles de tecnología**. Cada uno desbloquea tipos de tropas más poderosas y eficientes. Invierte tus Puntos de Investigación con cabeza.'
        }
      }
    }
  }
};
