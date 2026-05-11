# De PDF a Markdown con MarkItDown: Guía Definitiva (Evita Nuestras Trampas)

## by Por RS Montalvo
- Después de **2 horas de debugging**, aquí está **TODO** lo que debes saber para convertir PDFs a Markdown con [MarkItDown](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp) usando Docker en WSL/Ubuntu.

## 🚨 PROBLEMA #1: Imagen Docker Hub NO es CLI

**❌ NO FUNCIONA** (todos caímos aquí):
```bash
docker pull mcp/markitdown:latest
docker run --rm -v .:/data mcp/markitdown /data/file.pdf -o file.md
```
**Error**: `unrecognized arguments: /data/file.pdf -o file.md`

**¿POR QUÉ?** `mcp/markitdown` es un **servidor MCP** (para AIs como Claude), **NO CLI**.

## 🚨 PROBLEMA #2: GitHub `markitdown-mcp` ≠ Docker Hub `mcp/markitdown`

```
GitHub: microsoft/markitdown/packages/markitdown-mcp/  ← Paquete Python
Docker Hub: mcp/markitdown                           ← Servidor MCP empaquetado
```
**Mismo proyecto, nombres distintos** → confusión total.

## 🚨 PROBLEMA #3: `packages/markitdown` SIN Dockerfile

```
❌ cd packages/markitdown && docker build .  # FAIL - No Dockerfile
✅ cd ~/markitdown/ && docker build .        # Dockerfile en RAÍZ
```

## ✅ SOLUCIÓN FINAL (5 min, funciona 100%)

```bash
# 1. UNA VEZ (build imagen CLI permanente)
cd ~
git clone https://github.com/microsoft/markitdown.git
cd markitdown
docker build -t markitdown-cli .

# 2. CADA VEZ (tus PDFs)
cd ~/mis-pdfs
docker run --rm -i -v "$(pwd)":/data markitdown-cli /data/mi.pdf > mi.md
```

**¡Listo!** `mi.md` generado perfectamente.

## 📁 Estructura del Repo (LA CLAVE)
```
markitdown/
├── Dockerfile           ← BUILD AQUÍ ⭐
├── packages/
│   ├── markitdown/      ← Core Python (sin Docker)
│   └── markitdown-mcp/  ← MCP server (TIENE Dockerfile propio)
```

## 🎯 Script Batch Completo
```bash
#!/bin/bash
# pdf2md-all.sh
for pdf in *.pdf; do
  echo "Convirtiendo $pdf..."
  docker run --rm -i -v "$(pwd)":/data markitdown-cli "/data/$pdf" > "${pdf%.pdf}.md"
done
echo "✅ Todos convertidos a .md"
```

## 🤔 ¿Por Qué Tantos Vericuetos?

| Intuición | Realidad |
|-----------|----------|
| `docker pull mcp/markitdown` = CLI | Es servidor MCP para AIs |
| `packages/markitdown` tiene Docker | Dockerfile está en raíz |
| `markitdown file.pdf -o file.md` | `stdin → stdout` pipe |
| GitHub package = Docker image | Empaquetado por Docker Inc. |

## 💡 TAKEAWAYS para WSL/Docker

1. **Siempre verifica `ls Dockerfile`** antes `docker build`
2. **MCP servers** = JSON-RPC protocol, no shell interactivo
3. **Raíz del monorepo** suele tener el Dockerfile principal
4. **`--rm -i`** + `> output.md` para CLI Docker pipes
5. **Volúmenes WSL** funcionan perfecto (`$(pwd):/data`)

***
