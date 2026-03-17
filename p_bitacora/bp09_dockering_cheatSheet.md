# Chuleta Docker 2026: Comandos imprescindibles para sobrevivir el día a día

## by RS Montalvo

> **Fecha:** Marzo 2026, porque todo puede cambiar (repentinamente) ~~
>> **Para:** Los compis que cual gladiadores luchan lína a línea con contenedores todos los días (¡ya sabéis quiénes somos!)

> **El Tao de Docker**  (versión express) \
Efímero es mejor que eterno.  \
Stateless es mejor que stateful llorón.  \
Declarativo vence a bash de 500 líneas.\
Simple es mejor que complejo.  \
Complejo es mejor que prod en llamas. \
$ docker compose up -d es mejor que clickear.  
$ docker system prune es mejor que pedir más disco. \
$ commit es pecado venial en debug. \
$ commit en prod es pecado mortal (y todos lo hemos hecho). \
La imagen debe ser pequeña y aburrida. \
Aunque multi-stage con cache es mejor que pequeña y eterna de build. \
Logs en stdout son sagrados.  \
Volúmenes son necesarios.  \
Disco lleno es karma acumulado. \
Ahora es mejor que nunca… \ 
…aunque “nunca” suele ser mejor que --no-cache en lunes por la mañana. \
Los contenedores son efímeros — ¡tratémoslos como tales!


Como estamos todos en el mismo barro con Docker (rebuilds eternos, debug en producción, limpiezas urgentes…), he recopilado una **chuleta bastante completa** con los comandos que más usamos. La idea es tenerla siempre a mano (en el terminal, en Notion o pinned en el canal) hasta que nos salgan solos.  

Incluye lo básico + trucos para contenedores **ya corriendo** (porque muchas veces no podemos parar/rebuild todo de golpe).  

Copia y pega esto en tu `~/docker-cheat-sheet.md` o donde prefieras.  

¡A darle caña! 🚀

## 1. Información general y versión
```bash
docker --version                    # Versión rápida
docker version                      # Detallada
docker info                         # Todo el daemon
docker system df                    # Espacio ocupado (imágenes, contenedores, volúmenes, cache)
docker system df -v                 # Detalle por categoría
```

## 2. Contenedores (lo que más tocamos)
```bash
docker ps                           # En ejecución
docker ps -a                        # Todos (parados incluidos)
docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Image}}"

docker start    <nombre|id>
docker stop     <nombre|id>         # SIGTERM (espera graceful)
docker kill     <nombre|id>         # Inmediato
docker restart  <nombre|id>

docker rm       <nombre|id>         # Solo parados
docker rm -f    <nombre|id>         # Stop + rm

docker exec -it <nombre|id> bash    # Entra (o sh si no hay bash)
docker exec -it <nombre|id> sh -c "apk add curl"   # Ejemplo Alpine
docker exec -u 1000:1000 -it ...    # Como usuario específico

docker logs -f <nombre|id>          # Seguir logs
docker logs --tail 100 <nombre|id>
docker logs --since 30m <nombre|id>
```

## 2b. Contenedores EN EJECUCIÓN – debug y ajustes inline

```bash
# Inspeccionar profundo
docker inspect <nombre|id>
docker inspect -f '{{json .NetworkSettings.Networks}}' <nombre>   # Redes
docker inspect -f '{{range .Mounts}}{{.Source}} → {{.Destination}}\n{{end}}' <nombre>   # Mounts

docker stats <nombre|id>            # CPU/MEM en tiempo real
docker stats --no-stream            # Snapshot único

docker top <nombre|id>              # Procesos dentro (ps aux style)

# Copiar archivos sin entrar
docker cp ./local.txt <contenedor>:/app/
docker cp <contenedor>:/app/logs/ ./local/

# Cambios en caliente
docker update --cpus 2.5 <nombre>
docker update --memory 1g <nombre>
docker update --restart unless-stopped <nombre>
docker update --label-add "debug=urgente" <nombre>

docker pause <nombre>               # Pausar procesos
docker unpause <nombre>

docker kill --signal=SIGUSR1 <nombre>   # Señales custom (recargar config, etc.)
```

## 2c. Salvar cambios inline → nueva imagen (emergencias)
```bash
# 1. Entras y modificas
docker exec -it <nombre> apt update && apt install -y vim curl

# 2. Commit como nueva imagen
docker commit <nombre> mi-app:debug-2026-03
docker commit --change='ENV DEBUG=true' <nombre> mi-app:debug

# 3. Usas la nueva
docker run -d --name temp mi-app:debug-2026-03

# Mejor práctica: cp → edita local → rebuild → up --build
```

## 3. Imágenes
```bash
docker images
docker pull nginx:alpine
docker rmi <imagen:tag>
docker image prune                  # Dangling
docker image prune -a               # Todo no usado
docker tag mi-app:dev ghcr.io/tu-usuario/mi-app:latest
docker push ghcr.io/tu-usuario/mi-app:latest
```

## 4. Build
```bash
docker build -t mi-app:1.0 .
docker build --no-cache -t mi-app:1.0 .
docker buildx build --platform linux/amd64,linux/arm64 -t mi-app:multi --push .
DOCKER_BUILDKIT=1 docker build -t mi-app .   # Cache inteligente
```

## 5. Docker Compose (v2)
```bash
docker compose up -d
docker compose up -d --build
docker compose down -v              # + volúmenes
docker compose logs -f api
docker compose exec api bash
docker compose watch                # Hot-reload dev
docker compose pull
```

## 6. Limpieza rápida (¡cuidado!)
```bash
docker container prune
docker image prune -a --filter "until=48h"
docker volume prune
docker system prune -a --volumes    # Nuclear (¡casi todo!)
```

## 7. Alias recomendados (ponlos en ~/.bashrc o ~/.zshrc)
```bash
alias d='docker'
alias dc='docker compose'
alias dps='docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"'
alias dimg='docker images --format "{{.Repository}}:{{.Tag}}\t{{.Size}}"'
alias drm='docker rm -f'
alias dprune='docker system prune -f --volumes'
```

Espero que os salve más de un apuro. Si alguien quiere añadir secciones (Kubernetes sidecar debug, docker scout, multi-arch avanzado, etc.) avisar y lo expandimos.

¡Ánimo con los contenedores rebeldes! 😅

