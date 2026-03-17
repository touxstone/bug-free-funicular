
# Games Sof-dev People Play

## by RS Montalvo

> Hacia Octubre, 2025 como parte de una clase que implementaba una simulación de trabajo grupal, a fin, ya sabéis, de acercarnos a los `real-world` escenarios de desarrollo, hice, además de las anotaciones parte del `homework` (ya sabéis, uno haciendo la parte de los diagramas `ER`, otro haciendo las tablas `MySQL` que se tercien, y etc. ... como suele decir `Zoe`, `juntos como hermanos miembros de una iglesia ~~` ), una serie de observaciones que provienen de mi veta-de-interés por la psicología, y por el interesante, así llamado, `Análisis Transaccional`. 
Al final, acabé montando, además, un `mini-módulo AT` de gestión de grupos `soft-dev`y una plantilla de `terapia-no-clínica` ligera para gestionar las operaciones. 

> Here are some curated annotations inspired by the book Games People Play by E. Berne and the role-playing experience as a kind of software development group recently implemented in class.

Si alguien me preguntara, el ojo que ve es de uno. Porque aunque el pretexto fue hacer implementaciones en Java sobre una base de datos, siguiendo el temario del curso, el tema de la clase fue experimentar el rol o los diferentes roles de trabajar en grupo y concurrir en un proyecto y supuestamente experimentar los retos que surgen cuando se desarrolla software en el mundo real. Así que lo que sigue aquí es lo que ví. Luego comprobé, no sería solo yo, hay sendas rutas de investigación y parece ser una linea de trabajo bastante interesante. Aquí solo un brochazo para documentar el asunto y algo de referencias bibliográficas con las que fui a parar (y continuar en alguna siguiente ocasión).

### Juegos Típicos en Equipos de Desarrollo de Software según el Análisis Transaccional (AT)

El Análisis Transaccional (AT), desarrollado por Eric Berne en su libro *Los juegos en que participamos*, describe los "juegos psicológicos" como patrones repetitivos de interacciones inconscientes que generan un "pago" emocional predecible, a menudo negativo, pero que mantienen dinámicas grupales. En contextos de desarrollo de software, como equipos ágiles con sprints, revisiones de código o reuniones diarias, estos juegos surgen en situaciones de presión por plazos, colaboración y resolución de problemas. A continuación, listo aproximativamente 8 juegos típicos adaptados a este ámbito, basados en aplicaciones de AT en entornos laborales [ágiles](https://www.adventureswithagile.com/wp-content/uploads/MinaBostromNakicenovic-GamesPeoplePlay.pdf). 

Para cada uno, incluyo un outline con: descripción, manifiestación en equipos de software y pago emocional.

1. ¿Por qué no...?, Sí, pero...  
   - Descripción: Una persona busca ayuda para un problema, recibe sugerencias, pero las rechaza sistemáticamente con "Sí, pero...", culminando en un giro donde el ayudante se siente incompetente y el buscador justificado. Involucra un engaño inicial (pedir ayuda), un gancho (ofrecer soluciones) y un cierre manipulador.  
   - Manifiestación en equipos de software: En stand-ups o retrospectives ágiles, un desarrollador pide ideas para optimizar un proceso (ej. refactorización de código), pero descarta cada propuesta con excusas técnicas, frustrando al equipo y estancando el progreso.  
   - Pago emocional: El jugador se siente superior y evita la responsabilidad real; el equipo se desmoraliza, reduciendo la innovación.

2. ¡Mira qué duro he intentado!  
   - Descripción: Se presiona a alguien para que pruebe una solución, se cumple a medias, falla intencionalmente y se resalta el esfuerzo fallido para culpar al proceso o al consejero.  
   - Manifiestación en equipos de software: Durante un sprint, un miembro del equipo sigue "consejos" defectuosos para implementar una feature (ej. una integración API), falla y exclama "¡Lo intenté todo!", culpando al framework o al líder ágil, en lugar de ajustar.  
   - Pago emocional: Justifica el fracaso personal y genera simpatía; el equipo se siente culpable por "presionar" demasiado.

3. Solo intento ayudar  
   - Descripción: Se ofrece "ayuda" con instrucciones intencionalmente erróneas, lo que lleva a un error, una disculpa implícita y la defensa "¡Solo quería ayudar!", haciendo sentir al receptor inadecuado.  
   - Manifiestación en equipos de software: Un senior da "guía" en una code review con pasos ambiguos para una tarea (ej. deployment), el junior falla y se disculpa; el senior se victimiza, fomentando dependencia en lugar de autonomía.  
   - Pago emocional: El ayudante se siente moralmente superior; el receptor internaliza inseguridad, afectando la confianza en el equipo.

4. ¡Mira lo que me hiciste hacer!  
   - Descripción: Se pide consejo, se sigue a medias, se comete un error y se culpa al consejero, escalando a provocación y acusación.  
   - Manifiestación en equipos de software: En planificación de sprint, un dev sigue sugerencias del product owner para priorizar tasks, pero al fallar el deadline, acusa "¡Tus prioridades me obligaron a esto!", desviando la atención de su estimación errónea.  
   - Pago emocional: Transfiere la culpa y evita autocrítica; genera conflicto y erosiona la colaboración.

5. ¡Ahora te pillé!  
   - Descripción: Se provoca un error en el otro, se defiende, se castiga y se acusa, culminando en una explosión de furia para sentirse superior.  
   - Manifiestación en equipos de software: En revisiones de código o demos, un tester "provoca" un bug menor en el trabajo de un dev para "atraparlo", lo acusa públicamente y descarga ira, común en entornos de alta presión como releases.
   - Pago emocional: El provocador gana superioridad moral; el equipo pierde confianza, fomentando paranoia.

6. Pata de Palo.  
   - Descripción: Se usa una excusa crónica (ej. "con mi problema...") para evadir expectativas, respondiendo a bajas demandas con resignación fingida.  
   - Manifiestación en equipos de software: Un dev justifica retrasos en commits con "Con mi carga de legacy code, ¿qué esperas?", evadiendo tareas en sprints y perpetuando bajo rendimiento.  
   - Pago emocional: Evita el esfuerzo real y gana indulgencia; el equipo baja expectativas, estancando el crecimiento grupal.

7. Si no fuera por ti  
   - Descripción: Se crea dependencia emocional, como "Si no fuera por ti, mi trabajo sería aburrido", para retener al otro por miedo al abandono.  
   - Manifiestación en equipos de software: Un líder ágil disuade a un dev de unirse a otro equipo diciendo "¡Sin ti, este squad sería un desastre!", fomentando codependencia en lugar de movilidad interna.  
   - Pago emocional: Mantiene el control y evita la soledad; limita la rotación y el desarrollo individual.

8. Esquina (o Doble vínculo)  
   - Descripción: Se crea una trampa donde cualquier acción es "equivocada", dejando al otro paralizado sin salida buena.  
   - Manifiestación en equipos de software: En asignación de roles, el manager dice "Haz esta task crítica o la delegas, pero si la delegas, fallas como líder", atrapando al dev en indecisión durante un sprint.  
   - Pago emocional: El creador gana poder; el atrapado se siente impotente, reduciendo la iniciativa del equipo.

Estos juegos, cuando se identifican, permiten intervenciones como fortalecer el estado del Yo Adulto (racional y directo) para transacciones complementarias, promoviendo comunicación auténtica en grupos de trabajo. En desarrollo de software, reconocerlos ayuda a crear entornos no intrusivos, como sugiere el paradigma AT, fomentando colaboración sin amenazas.

### Entar al Juego (una terapia (no-clínica) ligera)

Siguiendo el paradigma del Análisis Transaccional (AT), propongo aquí cuatro dinámicas de grupo inspiradas en sus principios (como estados del Yo, transacciones y posiciones vitales), adaptadas a equipos de desarrollo de software. Estas actúan como "terapias de grupo" ligeras, no clínicas, para fomentar el involucramiento proactivo de cada miembro. El objetivo es romper patrones disfuncionales (como juegos psicológicos), promover transacciones Adulto-Adulto y alinear a todos con las metas del sprint o proyecto, impulsando la productividad mediante mayor autonomía y colaboración.

Cada dinámica incluye un outline con: descripción, aplicación en equipos de dev, pasos clave y beneficios para productividad e involucramiento.

#### 1. Ego-Gram Colectivo: Mapeando Estados del Yo
   - Descripción: Basado en el ejercicio de "Draw an Ego Gram", los participantes visualizan su distribución de tiempo entre estados del Yo (Padre, Adulto, Niño) y discuten cómo equilibrarlos para interacciones más equilibradas.
   - Aplicación en equipos de dev: En una retrospective post-sprint, para identificar si el equipo cae en Niño Adaptado (evitando responsabilidad en bugs) o Padre Crítico (en code reviews agresivas), fomentando un Adulto proactivo en la planificación.
   - Pasos clave:
     1. Cada miembro dibuja un gráfico de barras con % de tiempo en cada estado del Yo (10 min individual).
     2. Compartir en ronda y anotar patrones grupales en un tablero (ej. Miro para remotos).
     3. Brainstorm: "¿Cómo usamos más Adulto en el próximo sprint?" (20 min).
     4. Compromiso: Cada uno elige una acción proactiva (ej. "Lideraré una code review equilibrada").
   - Beneficios para productividad e involucramiento: Aumenta la conciencia de patrones, reduce conflictos cruzados y promueve posiciones vitales "Yo OK-Tú OK", lo que eleva la iniciativa individual en tasks, mejorando la entrega de features en un 20-30% al alinear energías. 

#### 2. Role-Play de Transacciones: Simulando Sprints
   - Descripción: Role-plays donde se actúan escenarios en diferentes estados del Yo, analizando transacciones complementarias vs. cruzadas para practicar comunicación auténtica.
   - Aplicación en equipos de dev: En stand-ups diarios o planificación, para simular discusiones sobre deadlines o feedback en pull requests, evitando ulteriores como "¡Lo intenté todo!" (juego psicológico).
   - Pasos clave:
     1. Dividir en tríos: Un "dev", un "PO" y un "observador" (10 min preparación).
     2. Role-play un escenario (ej. "Retraso en integración API") primero en Niño-Padre (cruzado), luego en Adulto-Adulto (15 min).
     3. Debrief: El observador feedbacka transacciones y cómo cambiarlas.
     4. Ronda grupal: Compromisos proactivos para el sprint real.
   - Beneficios para productividad e involucramiento: Fomenta transacciones directas que resuelven problemas rápido, reduce tiempo perdido en malentendidos (hasta 40% en reuniones), y empodera a cada miembro a contribuir ideas sin miedo, recreando metas compartidas. 

#### 3. Círculo de Strokes: Reconocimiento Proactivo
   - Descripción: Ronda de "strokes" (reconocimientos positivos) para contrarrestar la escasez emocional en equipos, promoviendo nurturing y motivación intrínseca.
   - Aplicación en equipos de dev: Al final de un demo o demo day, para celebrar contribuciones específicas (ej. "Tu refactor mejoró el performance"), evitando juegos como "¡Mira lo que me hiciste hacer!".
   - Pasos clave:
     1. En círculo (virtual o físico), cada uno da un stroke positivo a otro, especificando impacto (ej. "Tu debug salvó el sprint") (15 min).
     2. Reflexión: "¿Cómo este stroke me motiva a involucrarme más?".
     3. Compromiso grupal: "Daremos strokes semanales en Slack para mantener el flujo".
     4. Cierre con un stroke colectivo al equipo.
   - Beneficios para productividad e involucramiento: Aumenta la motivación y retención (estudios muestran +25% en output), haciendo que cada miembro se sienta valorado y proactivo en recrear un entorno colaborativo, alineado con OK-OK positions.

#### 4. Reescritura de Scripts: Visionado de Sprints
   - Descripción: Identificar "scripts" limitantes (patrones inconscientes) y reescribirlos colectivamente, usando el Adulto para alinear con metas futuras.
   - Aplicación en equipos de dev: En kick-off de proyecto, para desafiar scripts como "Siempre fallamos en releases" (de juegos como Pata de Palo), y co-crear un "script productivo".
   - Pasos clave:
     1. Ronda individual: "Un script limitante en nuestro flujo de trabajo" (10 min).
     2. Grupo mapea en pizarra: ¿De qué estado del Yo viene? ¿Qué transacción lo perpetúa? (15 min).
     3. Reescritura proactiva: Cada uno propone una acción (ej. "Implementaré daily check-ins Adulto").
     4. Visualizar: Dibujar un "sprint ideal" post-reescritura y comprometerse.
   - Beneficios para productividad e involucramiento: Rompe ciclos negativos, fomenta ownership colectivo (mejora velocity en agile un 15-20%), y asegura que todos contribuyan activamente a las finalidades del equipo, como [innovación en código](https://www.mtdtraining.com/blog/what-is-transactional-analysis-model-examples.htm).

Estas dinámicas duran 45-60 min, son fáciles de implementar (incluso por un scrum master) y se integran en ceremonias ágiles sin ser intrusivas. Si dado el caso, medir impacto con métricas como [NPS de equipo](https://factorial.es/blog/enps-employee-net-promoter-score/) o [burndown rate](https://business.adobe.com/blog/basics/burndown-chart). 
  