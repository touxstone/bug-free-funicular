
# El Tao de Docker, 
## by RS. Montalvo

> un dev que ha muerto y renacido en rebuilds

Efímero es mejor que persistente.  
Declarativo es mejor que imperativo.  
Simple es mejor que complejo.  
Complejo es mejor que frágil y lleno de side-effects.  

Stateless es mejor que stateful.  
Aunque stateful es mejor que estado oculto en el host.  

El contenedor debe ser predecible, reproducible y aburrido.  
Aunque la producción a veces exige caos controlado.  

docker compose up -d es mejor que un script bash de 400 líneas.  
Aunque un script bash de 400 líneas es mejor que un dashboard clickeado a mano.  

Logs en stdout son mejores que archivos mágicos en /var/log.  
Aunque volúmenes son mejores que perder datos cada martes.  

Commit es tentación en emergencias.  
Aunque commit es pecado capital en el camino del build limpio.  

La imagen debe ser pequeña.  
Aunque la imagen multi-stage con cache inteligente es mejor que pequeña y lenta de construir.  

Multi-arch es mejor que sorpresas en ARM.  
Aunque x86 es aún mejor que discutir con QEMU.  

Limpieza es mejor que acumular basura eterna.  
Aunque docker system prune -a --volumes es mejor que lágrimas por disco lleno.  

docker scout es mejor que ignorar vulnerabilidades.  
Aunque ignorar vulnerabilidades es a veces mejor que bloquear el deploy por un CVE de 2009.  

En el principio era el Dockerfile.  
Y el Dockerfile era con Dios.  
Y el Dockerfile era Dios.  

Ahora es mejor que nunca.  
Aunque "nunca" es a menudo mejor que "ahora mismo" con --no-cache en prod.  

Si el contenedor muere misteriosamente, es mala señal.  
Si el contenedor muere misteriosamente y no hay logs, es señal de que debes sufrir.  

Los nombres de contenedores son una gran idea — ¡hagamos más de esos!

