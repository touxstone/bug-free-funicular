# De la Pesadilla de Permisos al Flujo de Trabajo Perfecto: Guía Definitiva para Git SSH en Windows 11 con WSL2 y VS Code
## by RS Montalvo

**Introducción**

Si estás leyendo esto, es probable que estés en medio de una batalla que muchos de nosotros hemos librado: intentar que el desarrollo web en Windows 11 sea tan fluido como en Linux, usando WSL2. Montas tu entorno, clonas tus repositorios y, de repente, te estrellas contra el muro de los permisos de archivos de Windows (NTFS) al intentar usar tus llaves SSH de Git.

Frustrante, ¿verdad? Pasas horas montando unidades de red (NAS), copiando llaves, cambiando permisos con `chmod`, solo para que el Agente SSH te grite que tus llaves están "too open" (demasiado abiertas).

Tras una larga y valiosa interacción en un chat de soporte, hemos dado con la configuración "Smart". Esta guía no es teoría; es el resultado de resolver problemas reales de permisos, montajes de red y alias de SSH. Aquí tienes el mapa para conseguir un entorno de desarrollo profesional, seguro y rápido.

---

## El Problema Central: La Guerra de los Permisos (NTFS vs Ext4)

El error más común es intentar gestionar llaves SSH o archivos de proyecto sensibles desde el sistema de archivos de Windows (C:\Users...). Windows usa NTFS y Linux (WSL2) usa Ext4. Cuando WSL2 intenta leer una llave privada en una carpeta de Windows, no puede aplicar correctamente el permiso `600` (solo lectura para el dueño) que SSH exige por seguridad. Resultado: La llave es ignorada.

**La Regla de Oro:** Todo lo sensible a permisos (llaves SSH, configuración de Git, archivos de código fuente) **DEBE** vivir dentro del sistema de archivos nativo de Linux en WSL2 (en tu `~/home/usuario`).

---

## El Esquema Visual: Entendiendo la Arquitectura Híbrida

Antes de pasar a los pasos, mira este esquema. Ilustra la "complexión" o estructura que hemos conseguido y por qué funciona tan bien. Muestra cómo Windows 11 y WSL2 colaboran, separando las responsabilidades para obtener lo mejor de ambos mundos.

**Sketch: Arquitectura de Desarrollo Híbrida Windows 11 + WSL2**

<center><img align="center" src="/img/win_wsl_e.svg"/></center>


### Ventajas de esta Complexión (Ilustradas en el Sketch):

* **1. Puente Remote-WSL (Línea Azul):** VS Code en Windows no toca tus archivos de Linux directamente. Instala un pequeño servidor *dentro* de WSL2. Esto elimina la latencia y los problemas de permisos de archivos. Es un "streaming" de código.
* **2. Acceso Nativo (Línea Negra):** El motor del editor y Git acceden a tus proyectos (`~/home`) con la velocidad nativa de Linux.
* **3. Autenticación Segura (Línea Roja):** Tus llaves privadas SSH viven exclusivamente en el entorno seguro de Linux (`~/.ssh/`). Git y el Agente SSH las usan allí, respetando los permisos `600`. Windows nunca las ve.
* **4. Aislamiento Total:** Tu NAS o copias de seguridad en NTFS (donde podrías tener las llaves guardadas) quedan fuera del flujo de trabajo diario, evitando errores de permisos.

---

## La Guía Paso a Paso para la Configuración "Smart"

### Paso 1: Importar tus Llaves SSH "a la Linux"

Si tienes tus llaves backed up en una unidad NTFS o NAS, no intentes usarlas desde allí. El "copia y pega" directo es tu amigo.

1. Abre tu terminal de Ubuntu en WSL2.
2. Crea la carpeta `.ssh` en tu Home si no existe:
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh

```


3. Copia el *contenido* de tu llave privada desde Windows (puedes usar el Bloc de Notas) y pégalo en un archivo nuevo en WSL:
```bash
nano ~/.ssh/id_ed25519
# Pega el contenido de tu llave privada, Ctrl+O, Enter, Ctrl+X

```


4. **Crucial:** Establece los permisos correctos:
```bash
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub  # Si también copiaste la pública

```



### Paso 2: Configurar el Agente SSH y `.ssh/config`

Para automatizar y evitar tener que cargar la llave cada vez que reinicias, vamos a usar el archivo `~/.ssh/config`.

1. Crea o edita el archivo config en WSL2:
```bash
nano ~/.ssh/config

```


2. Añade un bloque para GitHub. Puedes usar un alias descriptivo (ej. `github-personal`) si manejas varias cuentas, o el estándar `github.com`. Aquí está la configuración **robusta**:
```text
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes       # ¡Magia! Carga la llave al primer uso
    IdentitiesOnly yes      # Evita probar otras llaves

```



### Paso 3: El "Ritual" de Git (Clonación Estándar)

Aunque los alias de SSH (`git@github-personal:...`) parecen prometedores, el método más robusto y que mejor se integra con herramientas como VS Code es usar la URL SSH estándar que te da GitHub.

1. Copia la URL SSH de tu repo en GitHub (`git@github.com:usuario/repo.git`).
2. En tu terminal de WSL2, en tu carpeta de proyectos (`~/dev/`), clona:
```bash
git clone git@github.com:tu-usuario/tu-repo.git

```


3. **No olvides configurar tu identidad Git *dentro* del repo:**
```bash
cd tu-repo
git config user.name "Tu Nombre"
git config user.email "tu-email@ejemplo.com"

```



---

## La Guía de "Aterrizaje" en VS Code

Ahora que la infraestructura base funciona, vamos a conectar el editor.

### 1. Instalación y Extensión

1. Instala **VS Code en Windows 11**.
2. Instala la extensión oficial **"WSL"** de Microsoft.

### 2. El comando mágico `code .`

Vuelve a tu terminal de WSL2, entra en la carpeta de tu repositorio clonado y escribe:

```bash
code .

```

La primera vez, VS Code instalará el "servidor" dentro de tu Ubuntu. Cuando se abra, verás la etiqueta azul **"WSL: Ubuntu"** en la esquina inferior izquierda.

**¿Por qué esto es la victoria?**
Si abres la terminal integrada (`Ctrl + ñ`), verás que es tu Ubuntu. Si haces un `git push` desde ahí, VS Code usará tu Agente SSH de Linux automáticamente. No tienes que configurar nada en Windows. Tus archivos se guardan instantáneamente con los permisos correctos en Ext4.

### 3. Automatización del Agente SSH (Opcional pero Recomendado)

Para que no tengas que escribir `ssh-add` nunca más, añade esto al final de tu `~/.bashrc` en Ubuntu:

```bash
# Autostart ssh-agent if not running
if [ -z "$SSH_AUTH_SOCK" ]; then
   eval "$(ssh-agent -s)" > /dev/null
fi
# Add your key(s)
ssh-add ~/.ssh/id_ed25519 2>/dev/null

```

---

## Conclusión

Configurar un entorno de desarrollo híbrido Windows/Linux puede parecer una odisea llena de trampas de permisos. Pero la clave está en **respetar los dominios**:

* **Linux (WSL2)** gestiona la seguridad (llaves SSH), la configuración de Git y el almacenamiento de código.
* **Windows 11** proporciona la interfaz gráfica (VS Code, Windows Terminal) y la comodidad.

Siguiendo esta guía y visualizando la arquitectura con el sketch, tendrás un entorno estable, seguro y listo para la productividad. ¡Feliz codificación!