import { ClanId } from "../../pages/game/modals/attack.types";

export const CLANS_DATA: any[] = [
  {
    "id": "berserkers",
    "name": "Los Berserkers",
    "archetype": "FURY",
    "description": "Guerreros pose\u00eddos por la furia de Od\u00edn, incapaces de sentir dolor en el calor de la batalla. Su sed de sangre los convierte en armas vivientes sin igual.",
    "color": "#C0392B",
    "baseCapitalHealth": 1000,
    "advantages": [
      "IRON",
      "FROST"
    ],
    "initialTroops": [
      {
        "id": "berserker_guerrero",
        "name": "Guerrero Berserker",
        "type": "ATK",
        "power": 22,
        "trainingTimeSeconds": 45,
        "cost": 80
      },
      {
        "id": "corredor_de_furia",
        "name": "Corredor de Furia",
        "type": "ATK",
        "power": 15,
        "trainingTimeSeconds": 30,
        "cost": 55
      }
    ],
    "technologies": [
      {
        "id": "bersk_furia_primordial",
        "name": "Furia Primordial",
        "description": "Los berserkers canalizan la rabia ancestral de sus antepasados, aumentando su potencia de ataque base.",
        "researchCost": 100,
        "durationSeconds": 60,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "attack",
              "multiplier": 1.15
            }
          ]
        }
      },
      {
        "id": "bersk_sed_de_sangre",
        "name": "Sed de Sangre",
        "description": "El olor de la batalla aguza los sentidos de las tropas, incrementando su velocidad de movimiento en combate.",
        "researchCost": 150,
        "durationSeconds": 90,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "speed",
              "multiplier": 1.2
            }
          ]
        }
      },
      {
        "id": "bersk_grito_de_guerra",
        "name": "Grito de Guerra",
        "description": "Un aullido aterrador eleva el fervor de combate de las unidades aliadas, amplificando el da\u00f1o infligido.",
        "researchCost": 350,
        "durationSeconds": 200,
        "requirements": [
          "bersk_furia_primordial"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "attack",
              "multiplier": 1.2
            }
          ]
        }
      },
      {
        "id": "bersk_filo_runado",
        "name": "Filo R\u00fanico",
        "description": "Los herreros graban s\u00edmbolos de poder en las armas de guerra, desatando una nueva clase de devastador en el campo de batalla.",
        "researchCost": 500,
        "durationSeconds": 240,
        "requirements": [
          "bersk_furia_primordial",
          "bersk_sed_de_sangre"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "devastador_runico",
              "name": "Devastador R\u00fanico",
              "type": "ATK",
              "power": 35,
              "trainingTimeSeconds": 70,
              "cost": 130
            }
          ]
        }
      },
      {
        "id": "bersk_piel_de_oso",
        "name": "Piel de Oso",
        "description": "Los guerreros invocan el esp\u00edritu del oso sagrado, ganando una resistencia sobrenatural a los golpes del enemigo.",
        "researchCost": 400,
        "durationSeconds": 180,
        "requirements": [
          "bersk_sed_de_sangre"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "defense",
              "multiplier": 1.12
            }
          ]
        }
      },
      {
        "id": "bersk_trance_berserker",
        "name": "Trance Berserker",
        "description": "Los guerreros entran en un estado de trance divino donde sienten el doble de poder pero ignoran por completo el peligro.",
        "researchCost": 900,
        "durationSeconds": 450,
        "requirements": [
          "bersk_grito_de_guerra",
          "bersk_piel_de_oso"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "attack",
              "multiplier": 1.3
            }
          ]
        }
      },
      {
        "id": "bersk_furia_imparable",
        "name": "Furia Imparable",
        "description": "La capital de los Berserkers irradia una energ\u00eda salvaje que infunde terror en cualquier atacante que ose acercarse.",
        "researchCost": 1000,
        "durationSeconds": 600,
        "requirements": [
          "bersk_filo_runado"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "capital",
              "attribute": "attack",
              "multiplier": 1.25
            }
          ]
        }
      },
      {
        "id": "bersk_campeon_del_caos",
        "name": "Campe\u00f3n del Caos",
        "description": "La encarnaci\u00f3n viviente de la destrucci\u00f3n vikinga; una unidad legendaria cuya presencia sola decide el destino de las batallas.",
        "researchCost": 1500,
        "durationSeconds": 900,
        "requirements": [
          "bersk_trance_berserker",
          "bersk_furia_imparable"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "campeon_del_caos",
              "name": "Campe\u00f3n del Caos",
              "type": "ATK",
              "power": 75,
              "trainingTimeSeconds": 180,
              "cost": 350
            }
          ]
        }
      }
    ]
  },
  {
    "id": "valkirias",
    "name": "Las Valkirias",
    "archetype": "DIVINE",
    "description": "Mensajeras de los dioses y conductoras de almas, las Valkirias canalizan el poder de Asgard para sanar y fortalecer a sus aliados. Su gracia en batalla es superada \u00fanicamente por su ferocidad.",
    "color": "#8E44AD",
    "baseCapitalHealth": 1500,
    "advantages": [
      "FURY",
      "SHADOW"
    ],
    "initialTroops": [
      {
        "id": "escudera_sagrada",
        "name": "Escudera Sagrada",
        "type": "DEF",
        "power": 18,
        "trainingTimeSeconds": 40,
        "cost": 70
      },
      {
        "id": "sanadora_de_luz",
        "name": "Sanadora de Luz",
        "type": "HEAL",
        "power": 20,
        "trainingTimeSeconds": 50,
        "cost": 85
      }
    ],
    "technologies": [
      {
        "id": "valk_bendicion_divina",
        "name": "Bendici\u00f3n Divina",
        "description": "Las sacerdotisas invocan la gracia de Frigg, aumentando la vitalidad de todas las tropas aliadas en el campo.",
        "researchCost": 120,
        "durationSeconds": 70,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "health",
              "multiplier": 1.15
            }
          ]
        }
      },
      {
        "id": "valk_luz_de_asgard",
        "name": "Luz de Asgard",
        "description": "Un fulgor celestial protege la capital, elevando su salud m\u00e1xima por la voluntad de los dioses del pante\u00f3n n\u00f3rdico.",
        "researchCost": 180,
        "durationSeconds": 100,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "capital",
              "attribute": "health",
              "multiplier": 1.2
            }
          ]
        }
      },
      {
        "id": "valk_canto_de_sanacion",
        "name": "Canto de Sanaci\u00f3n",
        "description": "Las valkirias entonan himnos sagrados que aceleran la recuperaci\u00f3n de las tropas heridas durante el combate.",
        "researchCost": 300,
        "durationSeconds": 180,
        "requirements": [
          "valk_bendicion_divina"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "health",
              "multiplier": 1.25
            }
          ]
        }
      },
      {
        "id": "valk_lanza_de_mimir",
        "name": "Lanza de Mimir",
        "description": "Armas forjadas con la sabidur\u00eda del dios Mimir desatan a las Valkirias de asalto, una unidad \u00fanica de apoyo ofensivo.",
        "researchCost": 550,
        "durationSeconds": 260,
        "requirements": [
          "valk_bendicion_divina",
          "valk_luz_de_asgard"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "valkirie_de_asalto",
              "name": "Valkiria de Asalto",
              "type": "SUPP",
              "power": 28,
              "trainingTimeSeconds": 65,
              "cost": 110
            }
          ]
        }
      },
      {
        "id": "valk_escudo_de_tyr",
        "name": "Escudo de Tyr",
        "description": "La protecci\u00f3n del dios de la guerra refuerza las defensas de la capital ante cualquier ofensiva enemiga de gran escala.",
        "researchCost": 400,
        "durationSeconds": 200,
        "requirements": [
          "valk_luz_de_asgard"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "capital",
              "attribute": "defense",
              "multiplier": 1.18
            }
          ]
        }
      },
      {
        "id": "valk_resurreccion_de_valhalla",
        "name": "Resurrecci\u00f3n de Valhalla",
        "description": "Las ca\u00eddas en batalla son reclamadas por Valhalla y devueltas al campo, aumentando dr\u00e1sticamente la regeneraci\u00f3n de las tropas.",
        "researchCost": 850,
        "durationSeconds": 480,
        "requirements": [
          "valk_canto_de_sanacion",
          "valk_escudo_de_tyr"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "health",
              "multiplier": 1.35
            }
          ]
        }
      },
      {
        "id": "valk_juicio_divino",
        "name": "Juicio Divino",
        "description": "El favor de Od\u00edn recae sobre las guerreras, dot\u00e1ndolas de un poder ofensivo reservado \u00fanicamente a los elegidos de los dioses.",
        "researchCost": 1100,
        "durationSeconds": 650,
        "requirements": [
          "valk_lanza_de_mimir"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "attack",
              "multiplier": 1.2
            }
          ]
        }
      },
      {
        "id": "valk_serafin_de_batalla",
        "name": "Seraf\u00edn de Batalla",
        "description": "La encarnaci\u00f3n del poder divino en forma de guerrera, capaz de sanar aliados y devastar enemigos de manera simult\u00e1nea.",
        "researchCost": 1400,
        "durationSeconds": 850,
        "requirements": [
          "valk_resurreccion_de_valhalla",
          "valk_juicio_divino"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "serafin_de_batalla",
              "name": "Seraf\u00edn de Batalla",
              "type": "HEAL",
              "power": 65,
              "trainingTimeSeconds": 160,
              "cost": 300
            }
          ]
        }
      }
    ]
  },
  {
    "id": "jarls",
    "name": "Los Jarls de Hierro",
    "archetype": "IRON",
    "description": "Se\u00f1ores feudales forjados en las fraguas del norte, los Jarls construyen fortalezas impenetrables y tropas envueltas en acero. Su econom\u00eda de guerra es absolutamente inigualable.",
    "color": "#7F8C8D",
    "baseCapitalHealth": 2000,
    "advantages": [
      "STORM",
      "DIVINE"
    ],
    "initialTroops": [
      {
        "id": "escudero_de_hierro",
        "name": "Escudero de Hierro",
        "type": "DEF",
        "power": 20,
        "trainingTimeSeconds": 50,
        "cost": 90
      },
      {
        "id": "lancero_del_muro",
        "name": "Lancero del Muro",
        "type": "DEF",
        "power": 17,
        "trainingTimeSeconds": 45,
        "cost": 75
      }
    ],
    "technologies": [
      {
        "id": "jarl_forja_de_acero",
        "name": "Forja de Acero",
        "description": "Las fraguas de los Jarls producen armaduras de mayor grosor, incrementando la defensa de todas las unidades del clan.",
        "researchCost": 150,
        "durationSeconds": 80,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "defense",
              "multiplier": 1.2
            }
          ]
        }
      },
      {
        "id": "jarl_murallas_de_roca",
        "name": "Murallas de Roca",
        "description": "Los ingenieros militares construyen muros reforzados que elevan enormemente la salud total de la capital.",
        "researchCost": 200,
        "durationSeconds": 120,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "capital",
              "attribute": "health",
              "multiplier": 1.25
            }
          ]
        }
      },
      {
        "id": "jarl_muro_de_escudos",
        "name": "Formaci\u00f3n Muro de Escudos",
        "description": "La t\u00e1ctica del muro de escudos reduce dr\u00e1sticamente el da\u00f1o recibido por las tropas en primera l\u00ednea de combate.",
        "researchCost": 400,
        "durationSeconds": 200,
        "requirements": [
          "jarl_forja_de_acero"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "defense",
              "multiplier": 1.25
            }
          ]
        }
      },
      {
        "id": "jarl_economia_de_guerra",
        "name": "Econom\u00eda de Guerra",
        "description": "Las redes comerciales de los Jarls generan m\u00e1s tributos, potenciando los recursos econ\u00f3micos del clan en el largo plazo.",
        "researchCost": 350,
        "durationSeconds": 180,
        "requirements": [
          "jarl_forja_de_acero",
          "jarl_murallas_de_roca"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "economy",
              "attribute": "income",
              "multiplier": 1.3
            }
          ]
        }
      },
      {
        "id": "jarl_guardia_del_senor",
        "name": "Guardia del Se\u00f1or",
        "description": "Una \u00e9lite de guerreros pesados es entrenada para proteger al Jarl y las l\u00edneas defensivas del clan ante cualquier asalto.",
        "researchCost": 600,
        "durationSeconds": 280,
        "requirements": [
          "jarl_murallas_de_roca"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "guardia_del_senor",
              "name": "Guardia del Se\u00f1or",
              "type": "DEF",
              "power": 38,
              "trainingTimeSeconds": 80,
              "cost": 160
            }
          ]
        }
      },
      {
        "id": "jarl_baluarte_eterno",
        "name": "Baluarte Eterno",
        "description": "La capital se transforma en una fortaleza inexpugnable con estructuras capaces de resistir el asedio m\u00e1s brutal jam\u00e1s visto.",
        "researchCost": 900,
        "durationSeconds": 500,
        "requirements": [
          "jarl_muro_de_escudos",
          "jarl_economia_de_guerra"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "capital",
              "attribute": "health",
              "multiplier": 1.4
            }
          ]
        }
      },
      {
        "id": "jarl_acero_runico",
        "name": "Acero R\u00fanico",
        "description": "Runas antiguas son grabadas en cada pieza de armadura, concediendo resistencias sobrenaturales en el campo de batalla.",
        "researchCost": 1100,
        "durationSeconds": 620,
        "requirements": [
          "jarl_guardia_del_senor"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "defense",
              "multiplier": 1.35
            }
          ]
        }
      },
      {
        "id": "jarl_titan_de_hierro",
        "name": "Tit\u00e1n de Hierro",
        "description": "El coloso viviente de los Jarls; una unidad blindada capaz de absorber cantidades masivas de da\u00f1o y mantener el frente intacto.",
        "researchCost": 1500,
        "durationSeconds": 900,
        "requirements": [
          "jarl_baluarte_eterno",
          "jarl_acero_runico"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "titan_de_hierro",
              "name": "Tit\u00e1n de Hierro",
              "type": "DEF",
              "power": 80,
              "trainingTimeSeconds": 200,
              "cost": 400
            }
          ]
        }
      }
    ]
  },
  {
    "id": "sombras",
    "name": "Las Sombras de Loki",
    "archetype": "SHADOW",
    "description": "Hijos del enga\u00f1o y la astucia, las Sombras de Loki atacan desde la oscuridad antes de que el enemigo pueda reaccionar. Su velocidad y sigilo los hacen virtualmente indetectables en cualquier terreno.",
    "color": "#2C3E50",
    "baseCapitalHealth": 1200,
    "advantages": [
      "DIVINE",
      "IRON"
    ],
    "initialTroops": [
      {
        "id": "asesino_veloz",
        "name": "Asesino Veloz",
        "type": "ATK",
        "power": 18,
        "trainingTimeSeconds": 35,
        "cost": 65
      },
      {
        "id": "explorador_nocturno",
        "name": "Explorador Nocturno",
        "type": "SUPP",
        "power": 12,
        "trainingTimeSeconds": 28,
        "cost": 50
      }
    ],
    "technologies": [
      {
        "id": "somb_arte_del_sigilo",
        "name": "Arte del Sigilo",
        "description": "Los guerreros aprenden las t\u00e9cnicas ancestrales del movimiento silencioso, aumentando su velocidad de infiltraci\u00f3n.",
        "researchCost": 110,
        "durationSeconds": 65,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "speed",
              "multiplier": 1.25
            }
          ]
        }
      },
      {
        "id": "somb_veneno_de_serpiente",
        "name": "Veneno de Serpiente",
        "description": "Las armas son ba\u00f1adas en extractos letales de la Serpiente de Midgard, potenciando el da\u00f1o de cada ataque certero.",
        "researchCost": 160,
        "durationSeconds": 95,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "attack",
              "multiplier": 1.15
            }
          ]
        }
      },
      {
        "id": "somb_paso_de_sombra",
        "name": "Paso de Sombra",
        "description": "Una t\u00e9cnica avanzada que permite a las unidades moverse sin dejar rastro, reduciendo el tiempo de despliegue en el campo.",
        "researchCost": 320,
        "durationSeconds": 190,
        "requirements": [
          "somb_arte_del_sigilo"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "speed",
              "multiplier": 1.3
            }
          ]
        }
      },
      {
        "id": "somb_infiltrador_del_vacio",
        "name": "Infiltrador del Vac\u00edo",
        "description": "Una nueva clase de guerrero surge de la oscuridad absoluta, capaz de penetrar l\u00edneas enemigas sin ser jam\u00e1s detectado.",
        "researchCost": 480,
        "durationSeconds": 250,
        "requirements": [
          "somb_arte_del_sigilo",
          "somb_veneno_de_serpiente"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "infiltrador_del_vacio",
              "name": "Infiltrador del Vac\u00edo",
              "type": "ATK",
              "power": 30,
              "trainingTimeSeconds": 60,
              "cost": 115
            }
          ]
        }
      },
      {
        "id": "somb_danza_de_cuchillas",
        "name": "Danza de Cuchillas",
        "description": "Los asesinos perfeccionan la t\u00e9cnica de ataque m\u00faltiple, incrementando el da\u00f1o causado en cada emboscada bien ejecutada.",
        "researchCost": 450,
        "durationSeconds": 220,
        "requirements": [
          "somb_veneno_de_serpiente"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "attack",
              "multiplier": 1.22
            }
          ]
        }
      },
      {
        "id": "somb_manto_de_loki",
        "name": "Manto de Loki",
        "description": "El favor del dios del enga\u00f1o envuelve a las tropas en un velo de ilusi\u00f3n perfecta que desorienta fatalmente a los atacantes.",
        "researchCost": 880,
        "durationSeconds": 460,
        "requirements": [
          "somb_paso_de_sombra",
          "somb_danza_de_cuchillas"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "speed",
              "multiplier": 1.35
            }
          ]
        }
      },
      {
        "id": "somb_red_de_espias",
        "name": "Red de Esp\u00edas",
        "description": "Una vasta red de informantes incrementa los ingresos del clan al interceptar rutas comerciales y recursos del enemigo.",
        "researchCost": 1050,
        "durationSeconds": 580,
        "requirements": [
          "somb_infiltrador_del_vacio"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "economy",
              "attribute": "income",
              "multiplier": 1.25
            }
          ]
        }
      },
      {
        "id": "somb_fantasma_de_midgard",
        "name": "Fantasma de Midgard",
        "description": "El asesino supremo, un ser que parece surgir de la nada y desvanecerse antes de que el enemigo pueda reaccionar o contraatacar.",
        "researchCost": 1400,
        "durationSeconds": 820,
        "requirements": [
          "somb_manto_de_loki",
          "somb_red_de_espias"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "fantasma_de_midgard",
              "name": "Fantasma de Midgard",
              "type": "ATK",
              "power": 70,
              "trainingTimeSeconds": 150,
              "cost": 310
            }
          ]
        }
      }
    ]
  },
  {
    "id": "frost_guard",
    "name": "Guardianes del Eterno Hielo",
    "archetype": "FROST",
    "description": "Nacidos en las tundras del extremo norte, los Guardianes del Hielo dominan el arte del control del campo de batalla. Sus enemigos se mueven como insectos atrapados en \u00e1mbar glacial.",
    "color": "#5DADE2",
    "baseCapitalHealth": 1700,
    "advantages": [
      "FURY",
      "STORM"
    ],
    "initialTroops": [
      {
        "id": "lancero_de_hielo",
        "name": "Lancero de Hielo",
        "type": "ATK",
        "power": 16,
        "trainingTimeSeconds": 42,
        "cost": 72
      },
      {
        "id": "escudo_glaciar",
        "name": "Escudo Glaciar",
        "type": "DEF",
        "power": 22,
        "trainingTimeSeconds": 55,
        "cost": 95
      }
    ],
    "technologies": [
      {
        "id": "frost_aliento_de_niflheim",
        "name": "Aliento de Niflheim",
        "description": "El viento helado del reino de los muertos ralentiza a los enemigos, reduciendo su capacidad de maniobra y ataque.",
        "researchCost": 130,
        "durationSeconds": 75,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "defense",
              "multiplier": 1.15
            }
          ]
        }
      },
      {
        "id": "frost_armadura_de_permafrost",
        "name": "Armadura de Permafrost",
        "description": "Capas de hielo eterno son fundidas en las armaduras de los guerreros, aumentando su resistencia sobrenatural al impacto.",
        "researchCost": 180,
        "durationSeconds": 110,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "capital",
              "attribute": "health",
              "multiplier": 1.2
            }
          ]
        }
      },
      {
        "id": "frost_tormenta_de_granizo",
        "name": "Tormenta de Granizo",
        "description": "Los chamanes invocan una lluvia de granizo sobrenatural que ralentiza y desorganiza las formaciones enemigas en combate.",
        "researchCost": 380,
        "durationSeconds": 210,
        "requirements": [
          "frost_aliento_de_niflheim"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "defense",
              "multiplier": 1.2
            }
          ]
        }
      },
      {
        "id": "frost_guardian_de_hielo",
        "name": "Guardi\u00e1n de Hielo",
        "description": "Los rituales de invierno eterno dan vida a un guardi\u00e1n congelado, una unidad de defensa de resistencia extraordinaria.",
        "researchCost": 520,
        "durationSeconds": 270,
        "requirements": [
          "frost_aliento_de_niflheim",
          "frost_armadura_de_permafrost"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "guardian_de_hielo",
              "name": "Guardi\u00e1n de Hielo",
              "type": "DEF",
              "power": 36,
              "trainingTimeSeconds": 75,
              "cost": 145
            }
          ]
        }
      },
      {
        "id": "frost_cadenas_del_invierno",
        "name": "Cadenas del Invierno",
        "description": "Esposas de hielo m\u00e1gico encadenan a las tropas enemigas, dej\u00e1ndolas inm\u00f3viles en instantes cruciales del combate.",
        "researchCost": 450,
        "durationSeconds": 230,
        "requirements": [
          "frost_armadura_de_permafrost"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "speed",
              "multiplier": 1.15
            }
          ]
        }
      },
      {
        "id": "frost_corazon_del_invierno",
        "name": "Coraz\u00f3n del Invierno",
        "description": "El esp\u00edritu del invierno eterno habita la capital, aumentando su salud m\u00e1xima y reduciendo el da\u00f1o recibido en cada asalto.",
        "researchCost": 950,
        "durationSeconds": 520,
        "requirements": [
          "frost_tormenta_de_granizo",
          "frost_cadenas_del_invierno"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "capital",
              "attribute": "health",
              "multiplier": 1.4
            }
          ]
        }
      },
      {
        "id": "frost_avalancha_imparable",
        "name": "Avalancha Imparable",
        "description": "Una fuerza glacial arrolladora potencia los ataques de las tropas, enviando una ola de destrucci\u00f3n helada al frente enemigo.",
        "researchCost": 1100,
        "durationSeconds": 640,
        "requirements": [
          "frost_guardian_de_hielo"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "attack",
              "multiplier": 1.25
            }
          ]
        }
      },
      {
        "id": "frost_coloso_de_hielo",
        "name": "Coloso de Hielo",
        "description": "Un tit\u00e1n congelado formado por las energ\u00edas primigenias de Niflheim, cuya sola presencia paraliza de terror a los enemigos.",
        "researchCost": 1450,
        "durationSeconds": 880,
        "requirements": [
          "frost_corazon_del_invierno",
          "frost_avalancha_imparable"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "coloso_de_hielo",
              "name": "Coloso de Hielo",
              "type": "DEF",
              "power": 78,
              "trainingTimeSeconds": 190,
              "cost": 380
            }
          ]
        }
      }
    ]
  },
  {
    "id": "storm_bringers",
    "name": "Los Portadores de la Tormenta",
    "archetype": "STORM",
    "description": "Adoradores de Thor y el poder de los cielos, los Portadores de la Tormenta desatan el caos el\u00e9ctrico sobre sus enemigos. Sus ataques de \u00e1rea barren ej\u00e9rcitos enteros antes de que puedan organizarse.",
    "color": "#F39C12",
    "baseCapitalHealth": 1300,
    "advantages": [
      "SHADOW",
      "FROST"
    ],
    "initialTroops": [
      {
        "id": "jinete_del_rayo",
        "name": "Jinete del Rayo",
        "type": "ATK",
        "power": 20,
        "trainingTimeSeconds": 38,
        "cost": 75
      },
      {
        "id": "arquero_de_tormenta",
        "name": "Arquero de Tormenta",
        "type": "ATK",
        "power": 17,
        "trainingTimeSeconds": 32,
        "cost": 60
      }
    ],
    "technologies": [
      {
        "id": "storm_llamada_del_trueno",
        "name": "Llamada del Trueno",
        "description": "El rugido de Thor resuena en el campo de batalla, aumentando el ataque de todas las tropas del clan de manera inmediata.",
        "researchCost": 140,
        "durationSeconds": 80,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "attack",
              "multiplier": 1.15
            }
          ]
        }
      },
      {
        "id": "storm_vientos_del_norte",
        "name": "Vientos del Norte",
        "description": "Corrientes de aire tempestuosas elevan la velocidad de movimiento de las tropas en cualquier terreno del mapa.",
        "researchCost": 170,
        "durationSeconds": 100,
        "requirements": [],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "speed",
              "multiplier": 1.2
            }
          ]
        }
      },
      {
        "id": "storm_rayo_de_mjolnir",
        "name": "Rayo de Mjolnir",
        "description": "El poder del martillo sagrado es canalizado en los ataques del clan, a\u00f1adiendo un da\u00f1o de \u00e1rea el\u00e9ctrica absolutamente devastador.",
        "researchCost": 420,
        "durationSeconds": 210,
        "requirements": [
          "storm_llamada_del_trueno"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "attack",
              "multiplier": 1.25
            }
          ]
        }
      },
      {
        "id": "storm_heraldo_de_la_tormenta",
        "name": "Heraldo de la Tormenta",
        "description": "Guerreros \u00e9lite canalizadores de energ\u00eda rel\u00e1mpago surgen entre las filas del clan para liderar el asalto el\u00e9ctrico.",
        "researchCost": 560,
        "durationSeconds": 265,
        "requirements": [
          "storm_llamada_del_trueno",
          "storm_vientos_del_norte"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "heraldo_de_la_tormenta",
              "name": "Heraldo de la Tormenta",
              "type": "ATK",
              "power": 33,
              "trainingTimeSeconds": 68,
              "cost": 125
            }
          ]
        }
      },
      {
        "id": "storm_ojos_del_aguila",
        "name": "Ojos del \u00c1guila",
        "description": "Los arqueros del clan reciben entrenamiento avanzado bajo la gu\u00eda de Huginn, mejorando punter\u00eda y cadencia de disparo.",
        "researchCost": 390,
        "durationSeconds": 195,
        "requirements": [
          "storm_vientos_del_norte"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "attack",
              "multiplier": 1.18
            }
          ]
        }
      },
      {
        "id": "storm_furia_celestial",
        "name": "Furia Celestial",
        "description": "Una tormenta eterna envuelve la capital, castigando con rayos a cualquier enemigo que se atreva a acercarse a sus muros.",
        "researchCost": 920,
        "durationSeconds": 490,
        "requirements": [
          "storm_rayo_de_mjolnir",
          "storm_ojos_del_aguila"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "capital",
              "attribute": "attack",
              "multiplier": 1.3
            }
          ]
        }
      },
      {
        "id": "storm_ojo_del_huracan",
        "name": "Ojo del Hurac\u00e1n",
        "description": "Las tropas que se mueven dentro del caos de la tormenta alcanzan velocidades sobrehumanas imposibles de igualar.",
        "researchCost": 1080,
        "durationSeconds": 610,
        "requirements": [
          "storm_heraldo_de_la_tormenta"
        ],
        "unlocks": {
          "buffs": [
            {
              "target": "troops",
              "attribute": "speed",
              "multiplier": 1.35
            }
          ]
        }
      },
      {
        "id": "storm_avatar_de_thor",
        "name": "Avatar de Thor",
        "description": "La encarnaci\u00f3n del dios del trueno en forma humana; una unidad capaz de devastar ej\u00e9rcitos enteros con ataques el\u00e9ctricos masivos.",
        "researchCost": 1500,
        "durationSeconds": 900,
        "requirements": [
          "storm_furia_celestial",
          "storm_ojo_del_huracan"
        ],
        "unlocks": {
          "troops": [
            {
              "id": "avatar_de_thor",
              "name": "Avatar de Thor",
              "type": "ATK",
              "power": 85,
              "trainingTimeSeconds": 200,
              "cost": 420
            }
          ]
        }
      }
    ]
  }
];
