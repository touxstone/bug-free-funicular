# Plan
Evaluar PR y generar un sistema de flashcards con el material en @stuff y utilizando de respuestas correctas la tabla stuff/corrector.pdf
# Autoescuela Flashcards

## PR 1 - Pipeline de datos base

Objetivo: convertir los PDFs de `stuff/` en datos estructurados y verificables.

- Crear `data/answers.json` con el corrector de los 10 tests.
- Crear `scripts/extract-questions.js` para extraer preguntas y opciones desde los PDFs con `pdftotext`.
- Crear `scripts/build-flashcards.js` para unir preguntas + respuestas correctas.
- Crear `scripts/validate-data.js` para comprobar que hay 10 tests, 30 preguntas por test y respuestas `a/b/c`.

## PR 2 - App web de repaso

Objetivo: una app JS estática, usable en desktop y mobile, sin backend obligatorio.

- Crear `app/index.html`.
- Crear `app/src/main.js`.
- Crear `app/src/styles.css`.
- Cargar `data/flashcards.json` desde el navegador.
- Implementar navegación, revelado de respuesta y guardado local del progreso.

## PR 3 - Imágenes asociadas a preguntas

Objetivo: detectar y adjuntar imágenes/señales de cada pregunta.

- Estado: implementado.
- Extrae imágenes de PDFs con `pdftohtml -xml -fmt png`.
- Asocia cada imagen a la pregunta por página y posición vertical.
- Marca como visual toda tarjeta con imagen asociada.
- Muestra imagen en la flashcard.
- Valida 300 tarjetas y 290 imágenes asociadas.

## PR 4 - Prompt pedagógico y enriquecimiento

Objetivo: mejorar la calidad didáctica de cada tarjeta.

- Estado: aplazado.
- Motivo: la version local resultaba redundante y el enriquecimiento LLM no es necesario para validar la app.
- Proxima accion futura: reactivar solo cuando se quiera generar explicaciones pedagogicas especificas con modelo externo.

## PR 4 actual - App desplegable

Objetivo: dejar el proyecto listo para publicar y probar como app estatica.

- Estado: implementado.
- Mantiene el alcance hasta PR3.
- Añade `README.md`.
- Añade workflow de GitHub Pages en `.github/workflows/pages.yml`.
- No requiere backend ni API key.

## PR 5 - Exportaciones

Objetivo: permitir usar el material fuera de la app.

- Exportar CSV para Anki.
- Exportar JSON portable.
- Añadir import/export de progreso.
