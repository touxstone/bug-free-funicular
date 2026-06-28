# Autoescuela Flashcards

App estatica para estudiar tests teoricos de autoescuela como flashcards.

## Estado actual

- 10 tests PDF procesados.
- 300 flashcards generadas.
- 290 flashcards con imagen asociada.
- Corrector integrado desde `data/answers.json`.
- App usable en desktop y mobile sin backend.

## Uso local

Generar datos:

```bash
npm run prepare:data
```

Servir la app:

```bash
npm run serve
```

Abrir:

```text
http://127.0.0.1:4173/app/
```

## Estructura

```text
app/                  App estatica
app/assets/questions/ Imagenes extraidas por pregunta
data/                 JSON generado
scripts/              Pipeline de extraccion y validacion
stuff/                PDFs fuente
```

## Despliegue en GitHub Pages

La app no necesita build. GitHub Pages puede publicar el repositorio completo desde la raiz.

Pasos:

1. Subir este directorio a un repositorio de GitHub.
2. Activar GitHub Pages desde `Settings > Pages`.
3. Seleccionar `GitHub Actions` como source.
4. Usar el workflow incluido en `.github/workflows/pages.yml`.

La URL final sera parecida a:

```text
https://usuario.github.io/repositorio/app/
```

## Pipeline

```bash
npm run extract
npm run extract:images
npm run build
npm run validate
```

O todo junto:

```bash
npm run prepare:data
```
