# **UTF-8 en Doom Emacs + WSL2: Guía de supervivencia para hispanohablantes**

*Cuando las tildes se convierten en `c\363digo` y el copy-paste se vuelve una odisea*
## by RS Montalvo
---

## El problema

Estás en WSL2 (Ubuntu/Debian), usas Doom Emacs en terminal (`emacs -nw`), y el español es tu idioma de trabajo. Copias "niño" y pegas "ni\361o". Guardas un archivo y las tildes desaparecen. Tu flujo de trabajo se convierte en un debugging perpetuo de codificación.

Este post es el resultado de semanas de iteración hasta encontrar una configuración robusta que funcione para **tres escenarios críticos**:

1. **Kill-ring interno** (copiar/pegar dentro de Emacs)
2. **Emacs → Windows** (compartir código con colegas)
3. **Windows → Emacs** (pegar de Stack Overflow, documentación, etc.)

---

## Diagnóstico: ¿Qué está pasando?

### La arquitectura del problema
![img](img/bp07_emacsNW-setting.svg)


### Los tres fallos clásicos

| Síntoma | Causa real | Falso culpable |
|---------|-----------|----------------|
| `C-y` muestra `^[` y secuencias raras | `interprogram-paste-function` activo en TTY corrompe el kill-ring | "Mi terminal está rota" |
| Copiar a Windows pierde tildes | `clip.exe` requiere UTF-16LE, no UTF-8 | "Emacs no sabe copiar" |
| Guardar archivo borra caracteres | `buffer-file-coding-system` mixto o `auto-coding-functions` conflictivo | "Doom Emacs tiene bugs" |

---

## La solución paso a paso

### Paso 1: Desactivar la "magia" de integración clipboard

Doom Emacs (y Emacs en general) intenta ser "inteligente" con `xclip`/`xsel`. En WSL2 + TTY, esto corrompe el kill-ring interno.

```elisp
;; Al INICIO de config.el, antes de cualquier otra cosa
(setq xclip-mode nil)
(setq xclip-program nil)
(setq interprogram-paste-function nil)  ; ¡Crítico! Deja C-y puro
```

### Paso 2: UTF-8 base sólido (solo lo esencial)

```elisp
(set-language-environment "UTF-8")
(set-default-coding-systems 'utf-8-unix)
(set-terminal-coding-system 'utf-8-unix)
(set-keyboard-coding-system 'utf-8-unix)
(setq-default buffer-file-coding-system 'utf-8-unix)

;; Desactivar detección automática que causa falsos positivos
(setq auto-coding-functions nil)
```

**Nota**: No uses `set-selection-coding-system` ni `set-clipboard-coding-system` en modo terminal. Son para GUI/X11.

### Paso 3: Copiar A Windows (Emacs → clip.exe)

El truco: `clip.exe` de Windows **solo** acepta UTF-16LE para caracteres no-ASCII.

```elisp
(defun wsl-copy (text)
  "Copia a Windows clipboard usando UTF-16LE (requerido para tildes)"
  (let ((process-connection-type nil))
    (let ((proc (start-process "clip.exe" nil "clip.exe")))
      ;; ¡CRÍTICO! UTF-16LE, no UTF-8
      (process-send-string proc (encode-coding-string text 'utf-16le))
      (process-send-eof proc))))

(setq interprogram-cut-function #'wsl-copy)
```

**Verificación rápida**:
```bash
# En terminal WSL, esto DEBE funcionar:
echo -n "niño café" | iconv -f UTF-8 -t UTF-16LE | clip.exe
# Pega en Windows con Ctrl+V → debe mostrar tildes correctas
```

### Paso 4: Pegar DESDE Windows (estrategia híbrida)

**No uses `interprogram-paste-function`** en terminal. En su lugar:

| Método | Cuándo usar | Por qué funciona |
|--------|-------------|------------------|
| `C-v` | Pegar rápido de Windows | La terminal WSL maneja la conversión UTF-16LE → UTF-8 nativamente |
| Click derecho | Cuando `C-v` no responde | Mismo mecanismo, más confiable en algunas terminales |
| `C-y` | Solo para kill-ring interno | Rápido, nunca falla, pero solo ve lo que cortaste en Emacs |

Si insistes en tener `C-y` para clipboard externo, instala `wl-clipboard`:

```bash
sudo apt install wl-clipboard
```

Y añade (opcional, puede inestabilizar el kill-ring):

```elisp
(setq interprogram-paste-function
      (lambda () (shell-command-to-string "wl-paste -n 2>/dev/null")))
```

**Recomendación**: No lo hagas. Mantén `C-y` para interno y `C-v` para externo. Es más robusto.

---

## Configuración final completa

```elisp
;;; $DOOMDIR/config.el -*- lexical-binding: t; -*-
;;; UTF-8 robusto para WSL2 + Emacs terminal

;; ============================================
;; 0. DESACTIVAR INTEGRACIÓN CLIPBOARD "MÁGICA"
;; ============================================
(setq xclip-mode nil)
(setq xclip-program nil)
(setq interprogram-paste-function nil)  ; C-y = kill-ring puro

;; ============================================
;; 1. UTF-8 BASE (sin variables de GUI)
;; ============================================
(set-language-environment "UTF-8")
(set-default-coding-systems 'utf-8-unix)
(set-terminal-coding-system 'utf-8-unix)
(set-keyboard-coding-system 'utf-8-unix)
(setq-default buffer-file-coding-system 'utf-8-unix)
(setq auto-coding-functions nil)

;; ============================================
;; 2. WSL: COPIAR A WINDOWS (UTF-16LE)
;; ============================================
(when (and (eq system-type 'gnu/linux)
           (or (getenv "WSL_DISTRO_NAME")
               (string-match-p "Microsoft" (shell-command-to-string "uname -a"))))
  
  (defun wsl-copy (text)
    (let ((process-connection-type nil))
      (let ((proc (start-process "clip.exe" nil "clip.exe")))
        (process-send-string proc (encode-coding-string text 'utf-16le))
        (process-send-eof proc))))
  
  (setq interprogram-cut-function #'wsl-copy))

;; ============================================
;; 3. ORG-MODE (ejemplo de configuración adicional)
;; ============================================
(after! org
  (add-hook 'org-mode-hook 
            (lambda ()
              (set-buffer-file-coding-system 'utf-8-unix)
              (set-buffer-multibyte t))))
```

---

## Troubleshooting rápido

### "C-y muestra `^[` y caracteres raros"

**Causa**: `interprogram-paste-function` está activo y recibiendo códigos ANSI de la terminal.

**Fix**: Asegúrate de tener `(setq interprogram-paste-function nil)` al inicio de config.

### "Copio 'niño' y en Windows sale 'niÃ±o'"

**Causa**: Enviando UTF-8 a `clip.exe` que espera UTF-16LE.

**Fix**: Usa `(encode-coding-string text 'utf-16le)` en `wsl-copy`.

### "Guardo el archivo y las tildes desaparecen"

**Causa**: `buffer-file-coding-system` no es `utf-8-unix` o `auto-coding-functions` está cambiándolo.

**Fix**: 
```elisp
(setq auto-coding-functions nil)
(setq-default buffer-file-coding-system 'utf-8-unix)
```

### "C-v no pega nada"

**Causa**: Tu terminal no tiene integración clipboard habilitada.

**Fix**: Usa Windows Terminal (recomendado) o habilita "Copy on select" / "Paste on right-click" en tu emulador de terminal.

---

## Principios generales (aplicables a otros escenarios)

1. **Separar flujos**: Kill-ring interno (Emacs) ≠ Clipboard del sistema (Windows). No intentes unificarlos en terminal.
2. **Conocer tu encoding**: Windows = UTF-16LE, Linux/Unix = UTF-8. Nunca asumas que son compatibles.
3. **Desconfiar de la "magia"**: Auto-detección de codificación, integración "transparente" de clipboard... suelen fallar en los edge cases (como el español).
4. **Verificar en cada capa**: Si algo falla, prueba: Windows → WSL (`echo | clip.exe`), WSL → Terminal (`cat`), Terminal → Emacs (`C-v`).

---

## Referencias y recursos

- [Emacs Manual: Coding Systems](https://www.gnu.org/software/emacs/manual/html_node/emacs/Coding-Systems.html)
- [WSL2 Interoperability](https://docs.microsoft.com/en-us/windows/wsl/interop)
- [Doom Emacs OS Module](https://github.com/doomemacs/doomemacs/tree/master/modules/os)

