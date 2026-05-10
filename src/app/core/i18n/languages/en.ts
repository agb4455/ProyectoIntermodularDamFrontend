export const en = {
  NAV: {
    HOME: 'Home',
    MENU: 'Menu',
    LOBBY: 'War',
    CHARACTERS: 'Lineages',
    RULES: 'Midgard Laws',
    ADMIN: 'Oracle',
    CONFIG: 'Settings',
    STATS: 'Sagas',
    LOGOUT: 'Depart for Valhalla',
    LOGIN: 'Login'
  },
  SHOW: '▼ SHOW',
  HIDE: '▲ HIDE',
  HOME: {
    HERO_TITLE: 'VIKING CLAN WARS',
    HERO_SUBTITLE: 'Conquer the Northern Lands. Forge your legend. Crush your enemies.',
    START_ADVENTURE: 'TO ARMS!',
    EXPLORE_ERA: 'Explore the Codex',
    SECTIONS: {
      ERAS: {
        TITLE: 'The Chronology of War',
        DESC: 'Every saga is divided into three ancestral eras.',
        ERA_1_NAME: 'Preparation',
        ERA_1_DESC: 'Attacks are forbidden. It is time to perform rituals, train your troops, and accumulate wisdom. Costs are high, but peace is temporary.',
        ERA_2_NAME: 'Total War',
        ERA_2_DESC: 'Ragnarök begins. Levy costs are reduced and blood flows through the lands. It is the era of conquest and mutual destruction.',
        ERA_3_NAME: 'The Verdict',
        ERA_3_DESC: 'Only the strongest clans remain. Magic flows easily as the end approaches. The ultimate weapon is ready to be forged.'
      },
      CLANS: {
        TITLE: 'Choose your Lineage',
        DESC: 'Six ancestral clans fight for the supreme throne.',
        LORE: 'Masters of {{ archetype }}, these warriors dominate sacred tactics to prevail on the battlefield.'
      },
      MILITARY: {
        TITLE: 'Art of War',
        AP_TITLE: 'Action Points (AP)',
        AP_DESC: 'Vital resource for recruitment and deployment. Regenerates with the flow of the northern tides.',
        RP_TITLE: 'Sacred Technology (RP)',
        RP_DESC: 'Invest in the Tech Tree to unlock elite units and spells that alter destiny.',
        MAP_TITLE: 'Tactical Map',
        MAP_DESC: 'Visualize the battlefront and enemy capitals. Plan your raids with runic precision.'
      },
      CTA: {
        TITLE: 'Are you prepared for Valhalla?',
        DESC: 'Join the assembly of clans and claim your throne in the North.',
        BTN: 'FORGE MY LEGEND'
      }
    }
  },
  LOBBY: {
    TITLE: 'WAR CHAMBER',
    ACTIVE_GAMES: 'Active Games',
    FINISHED_GAMES: 'Finished Sagas',
    NO_GAMES: 'No battles in progress...',
    CREATE_GAME: 'FORGE GAME',
    JOIN_GAME: 'JOIN THE QUEST',
    ABANDON: 'ABANDON',
    ENTER: 'ENTER',
    CLAN: 'Clan',
    DELETE: 'DELETE',
    STATS: 'Sagas',
    GAME_RESULT: {
      VICTORY: 'Victory',
      DEFEAT: 'Defeat'
    },
    MESSAGES: {
      CONFIRM_LEAVE: 'Are you sure you want to abandon this game? You will lose automatically.',
      LEAVE_ERROR: 'Could not abandon the game. Try from within the game.'
    },
    MODALS: {
      CREATE: {
        TITLE: 'SWEAR CLAN OATH',
        SUBTITLE: 'Choose your lineage. Your destiny depends on it.',
        HINT_ACTIVE: 'Clan selected — ready for battle',
        HINT_EMPTY: 'Select a clan to continue',
        FORGING: 'Forging game…',
        BTN: 'CREATE GAME'
      },
      JOIN: {
        TITLE: 'JOIN THE QUEST',
        SUBTITLE: 'Enter the War Codex to enter battle.',
        CODE_PLACEHOLDER: 'Codex (Ex: A7X9-B)',
        BTN: 'ENTER BATTLE',
        JOINING: 'Searching for clan…'
      },
      FULL: {
        TITLE: 'ROOM FULL',
        MESSAGE: 'The war hall is already full. Other warriors have arrived before you.',
        BTN: 'UNDERSTOOD'
      }
    }
  },
  AUTH: {
    TITLE: 'Viking Strategy',
    SUBTITLE: 'FORGE YOUR DESTINY IN VALHALLA',
    USERNAME: 'Username',
    PASSWORD: 'Password',
    LOGIN: {
      TITLE: 'Sign In',
      USER_PLACEHOLDER: 'Your username',
      PASS_PLACEHOLDER: 'Your password',
      FORGOT: 'Forgot your password?',
      BTN: 'Enter Battle',
      NO_ACCOUNT: 'Don\'t have an account yet?',
      REGISTER_LINK: 'Register here'
    },
    REGISTER: {
      TITLE: 'Register',
      USER_PLACEHOLDER: 'Your username',
      EMAIL_PLACEHOLDER: 'your@email.com',
      PASS_PLACEHOLDER: 'Minimum 8 characters',
      CONFIRM_LABEL: 'Confirm Password',
      CONFIRM_PLACEHOLDER: 'Repeat your password',
      MISMATCH: 'Passwords do not match',
      BTN: 'Create Account',
      HAS_ACCOUNT: 'Already have an account?',
      LOGIN_LINK: 'Sign in here'
    },
    VALIDATION: {
      REQUIRED_FIELDS: 'Please complete all fields correctly',
      LOGIN_ERROR: 'Error during sign in. Try again.',
      REGISTER_ERROR: 'Error during registration. Try again.'
    },
    EMAIL: 'Email'
  },
  CONFIG: {
    TITLE: 'WARRIOR SETTINGS',
    PROFILE: 'Warrior Profile',
    LANGUAGE: 'Clan Language',
    THEME: 'Atmosphere',
    DARK_MODE: 'Eternal Night',
    LIGHT_MODE: 'Odin\'s Day',
    BTN_SAVE: 'SAVE CHANGES',
    BTN_CANCEL: 'DISCARD',
    CHANGE_PASSWORD: 'Change Password',
    SECURITY: 'SECURITY',
    SECURITY_DESC: 'Secure your access',
    LANGUAGE_DESC: 'Battle language'
  },
  GAME: {
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT',
    PHASES: {
      WAITING: 'WAITING',
      PREPARATION: 'PREPARATION',
      WAR: 'WAR',
      END: 'FINISH',
      FINISHED: 'CONCLUDED'
    },
    STATS: {
      HEALTH: 'Health',
      GOLD: 'Gold',
      RESEARCH: 'Research'
    },
    troop_types: {
      ATK: 'Offense',
      DEF: 'Defense',
      HEAL: 'Healer',
      SUPP: 'Support'
    },
    troop_desc: {
      infanteria: 'Basic warriors with axes and shields.',
      arqueria: 'Ranged units to harass the enemy.',
      caballeria: 'Fast and powerful mounted units.'
    },
    ACTIONS: {
      TRAIN: 'Train Troops',
      TROOPS: 'View Troops',
      TECH: 'Tech Tree',
      LOG: 'Battle Log'
    },
    LOG_START: 'has started the game',
    LOG_PHASE_CHANGE: 'Phase has changed to: {{ phase }}',
    LOG_ATTACK: 'has launched an attack against {{ target }}',
    LOG_ATTACK_RECEIVED: 'WATCH OUT! {{ attacker }} is attacking you',
    LOG_BATTLE_RESULT: 'The battle against {{ attacker }} has ended',
    LOG_PLAYER_ELIMINATED: '{{ player }} has been eliminated from the map',
    LOG_GAME_WON: 'YOU HAVE CONQUERED THE NORTH! Supreme victory',
    LOG_GAME_LOST: 'Your capital has fallen. Valhalla awaits you',
    LOG_TRAIN: 'has started training {{ troop }}',
    LOG_TRAIN_CONFIRM: 'Recruitment confirmed by the Great Hall',
    LOG_TRAIN_COMPLETE: '{{ troop }} has joined the ranks',
    LOG_RESEARCH: 'has started researching {{ tech }}',
    LOG_RESEARCH_CONFIRM: 'The sages have begun the research',
    LOG_RESEARCH_COMPLETE: '{{ tech }} has been mastered by the clan',
    MODALS: {
      LEAVE_CONFIRM: {
        TITLE: 'ABANDON BATTLE?',
        BODY: 'If you abandon now, your troops will scatter and you will lose all progress in this game. Other clans will see your retreat as an act of cowardice.',
        QUOTE: '"A coward believes he will live forever if he avoids war."',
        BTN_STAY: 'STAY AND FIGHT',
        BTN_LEAVE: 'RETREAT'
      },
      PREPARATION_AVISO: 'In the preparation phase you cannot attack. Take the opportunity to train troops and improve your clan.',
      ONLY_HOST_CAN_START: 'Only the host can start the quest.',
      REPORT: {
        TITLE: 'Combat Report',
        CAPITAL_DAMAGE: 'Damage to rival capital:',
        ENEMY_DESTROYED: 'Enemy troops destroyed:',
        OWN_LOSSES: 'Own troops lost:',
        RESEARCH_EARNED: 'Research credits earned:',
        ELIMINATED_BANNER: 'YOU HAVE ELIMINATED YOUR RIVAL!',
        ACCEPT: 'Accept'
      },
      ATTACK: {
        TITLE: 'ATTACK MODAL',
        SUBTITLE: 'Select troops for the assault on {{ target }}',
        ADVANTAGE: 'TACTICAL ADVANTAGE! Your troops deal 50% more damage to {{ enemyClan }}.',
        DISADVANTAGE: 'WATCH OUT! The {{ enemyClan }} clan has a defensive advantage over you (reduced damage).',
        BTN_ATTACK: 'LAUNCH ATTACK',
        EMPTY_GRID: 'Press the "+" button to deploy warriors',
        SELECTED_HINT: 'selected'
      },
      AVISO_TITLE: 'WARRIOR NOTICE!',
      WAITING: {
        WAIT_TITLE: 'WAITING FOR THE HOST',
        HOST_TITLE: 'WARRIOR ASSEMBLY',
        MIN_PLAYERS: 'At least 2 warriors are needed to set sail',
        BTN_START: 'START CONQUEST!',
        PLAYER_COUNT: '{{ current }}/{{ max }} Players'
      },
      TRAIN: {
        TITLE: 'TRAINING CAMP',
        SUBTITLE: 'Recruit new warriors for your clan',
        COST: 'Cost',
        BTN_TRAIN: 'TRAIN',
        NO_GOLD: 'Not enough gold',
        EMPTY: 'No troops available for training at this time. Upgrade your tech tree!',
        EMPTY_LOG: 'No events registered at this time.'
      },
      TECH: {
        TITLE: 'TECHNOLOGY TREE',
        DESC: 'Unlock the ancient wisdom of your clan.',
        BTN_RESEARCH: 'RESEARCH',
        UNLOCKED: 'UNLOCKED',
        AVAILABLE: 'AVAILABLE',
        LOCKED: 'LOCKED',
        COST: 'Cost',
        REQUIREMENTS: 'Requirements'
      },
      STATUS: {
        READY: 'READY',
        TRAINING: 'TRAINING',
        QUEUED: 'QUEUED',
        DEPLOYED: 'IN CAMPAIGN',
        EMPTY_TERRITORY: 'No troops in this territory'
      },
      RULES: {
        TITLE: 'MIDGARD LAWS',
        OBJ: {
          TITLE: 'GAME OBJECTIVE',
          DESC: 'Your mission is simple but brutal: **be the last clan standing**. Destroy enemy capitals before they destroy yours. Eternal glory awaits you in Valhalla, but only the living rule the world.'
        },
        PHASES: {
          TITLE: 'FIGHT PHASES',
          PREP_TITLE: 'PREPARATION (5 min)',
          PREP_DESC: 'The gods bless the field with peace. No attacks are allowed. Use this time to train your first troops and plan your strategy.',
          WAR_TITLE: 'WAR',
          WAR_DESC: 'The gates of conflict open. Resources are delivered every **30-60 seconds**. It is time to launch your attacks.',
          END_TITLE: 'THE END (Showdown)',
          END_DESC: 'When only 2 clans remain, victory is decided. No mercy, only glory.'
        },
        RESOURCES: {
          TITLE: 'RESOURCES AND ECONOMY',
          GOLD_TITLE: 'Economic Credits',
          GOLD_DESC: 'Obtained automatically during War. Use them to **train troops** in your capital.',
          RES_TITLE: 'Research Points',
          RES_DESC: 'Earned on the battlefield. **The more damage you deal**, the faster you can advance in your technology.'
        },
        ADVANTAGES: {
          TITLE: 'THE CIRCLE OF DESTINY (Advantages)',
          DESC: 'Certain clans have a natural advantage over others. Attacking a vulnerable clan will inflict **1.5x extra damage**.',
          FURY_IRON: 'Fury defeats Iron (Rage shatters the steel)',
          IRON_DIVINE: 'Iron defeats Divine (Metal defies the gods)',
          DIVINE_SHADOW: 'Divine defeats Shadow (Light dispels the darkness)',
          SHADOW_STORM: 'Shadow defeats Storm (Stealth evades the lightning)',
          STORM_FROST: 'Storm defeats Frost (Thunder breaks the ice)',
          FROST_FURY: 'Frost defeats Fury (Cold freezes the rage)'
        },
        COMBAT: {
          TITLE: 'COMBAT MECHANICS',
          SIM_TITLE: 'Simultaneous Damage',
          SIM_DESC: 'Battles are brutal: both sides deal damage at the same time based on their total power.',
          SHIELD_TITLE: 'Troop Shield',
          SHIELD_DESC: 'Troops in the capital protect the structure. The Capital only receives damage if all its defending troops die.',
          DEF_TITLE: 'Defense Bonus',
          DEF_DESC: 'Any clan defending its own capital receives an automatic **+10% (1.1x)** defensive power.',
          SURV_TITLE: 'Survivors',
          SURV_DESC: 'If your troops survive the exchange, they will automatically return to your capital after the attack.',
          TIP: 'Multipliers (1.5x attack / 1.1x defense) only increase the damage you deal, not your survival.'
        },
        TECH: {
          TITLE: 'TECH TREE',
          DESC: 'Each clan has a unique tech tree with **8 researches**. They unlock elite troops, stat improvements, and the Ultimate Weapon. Invest your Research Points wisely.'
        }
      }
    },
    ATTACK_TOAST: {
      TITLE: 'Attack Finished',
      DESC: 'Click to view report'
    }
  },
  ADMIN: {
    TITLE: 'Oracle Panel',
    TOTAL_USERS: 'Total Warriors',
    TOTAL_GAMES: 'Total Sagas',
    BANNED_USERS: 'Exiled Warriors',
    REALTIME_MONITORING: 'Real-time Visions',
    ACTIVE_USERS: 'Active Warriors',
    ACTIVE_GAMES: 'Active Sagas',
    FINISHED_GAMES_HOUR: 'Finished Sagas (Last hour)',
    SERVER_LOAD: 'Oracle Burden',
    BAN_MANAGEMENT: 'Exile Management',
    SEARCH_USER: 'Search warrior to exile...',
    UNBAN: 'LIFT EXILE',
    BAN: 'EXILE',
    BANNED_BADGE: 'EXILED',
    TABLE: {
      USER: 'Warrior',
      EMAIL: 'Email',
      CREATED_AT: 'Oath Sworn',
      STATUS: 'State',
      ACTION: 'Action'
    }
  },
  STATISTICS: {
    TITLE: 'Your Feats',
    GLORY: 'Eternal Glory',
    MATCH_DETAILS: 'Match Details',
    TIME: 'Play Time',
    MONEY: 'Credits Earned',
    TRAINED: 'Troops Trained',
    DEPLOYED: 'Troops Deployed',
    ATTACKS: 'Attacks Launched',
    WINS: 'Victories'
  }
};
