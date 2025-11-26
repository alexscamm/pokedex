# Despliegue en InfinityFree (pasos)

Este documento describe cómo desplegar tu aplicación (frontend React + backend PHP) en InfinityFree.

Resumen rápido:
- Crear cuenta en InfinityFree y crear un sitio (dominio gratuito tipo `tu-cuenta.epizy.com`) o usar tu propio dominio.
- Crear la base de datos MySQL desde el panel (anota `hostname`, `database`, `username`, `password`).
- Editar `pokedex_backend/db.php` con las credenciales producidas.
- Importar `pokedex_backend/create_db.sql` usando phpMyAdmin en el panel.
- Construir el frontend localmente (`npm run build`) con `REACT_APP_API_BASE` apuntando al path del backend.
- Subir `build/` y la carpeta `pokedex_backend/` al directorio raíz (htdocs) via FTP o File Manager.
- Asegurar que `pokedex_backend/uploads/` existe y es escribible.

Detalle paso a paso

1) Crear cuenta y sitio
- Regístrate en https://infinityfree.net/ y crea una cuenta.
- Crea un nuevo dominio (puede ser un subdominio gratuito `*.epizy.com`) o apunta tu dominio al hosting.

2) Crear base de datos
- En el Control Panel de InfinityFree abre "MySQL Databases".
- Crea una base de datos; el panel te mostrará:
  - MySQL Host (ej. `sql123.epizy.com`)
  - Database name (ej. `epiz_12345678_pokedex`)
  - Username (ej. `epiz_12345678`)
  - Password (la que elijas)

3) Importar esquema
- Abre phpMyAdmin desde el panel (link en el control panel).
- Selecciona la base de datos que creaste y en la pestaña "Import" sube `pokedex_backend/create_db.sql`.
  - Si el archivo es grande y la importación falla por límite, puedes dividir el SQL o ejecutar solo las partes necesarias (CREATE TABLE/INSERT).

4) Editar `db.php`
- En el archivo `pokedex_backend/db.php` sustituye las credenciales locales por las de InfinityFree:

```php
$DB_HOST = 'sqlXXX.epizy.com'; // MySQL Host que te dio InfinityFree
$DB_NAME = 'epiz_12345678_pokedex';
$DB_USER = 'epiz_12345678';
$DB_PASS = 'TU_PASSWORD';
```

Guarda los cambios y súbelos a `pokedex_backend/db.php` en el servidor.

5) Preparar el frontend para producción
- En el root del proyecto local crea o edita `.env.production` con la URL del backend. Ejemplo:

```
REACT_APP_API_BASE=https://your-site.epizy.com/pokedex_backend
```

- Luego en tu PC corre:

```powershell
npm install
npm run build
```

6) Subir archivos al servidor
- Con FileZilla o el File Manager del panel, sube el contenido de `build/` al directorio público (normalmente `htdocs` o `your-site/public_html`).
- Sube también la carpeta `pokedex_backend/` (incluyendo `db.php`, `registrar.php`, `listar.php`, etc.) al mismo nivel (por ejemplo `htdocs/pokedex_backend/`).

7) Asegurar carpeta `uploads`
- Verifica que `pokedex_backend/uploads/` existe en el servidor y que PHP puede escribir en ella.
- Si el File Manager permite cambiar permisos, asegúrate de que es escribible (chmod 755 suele bastar en la mayoría de free hosts).

8) Comprobar la app
- Abre `https://your-site.epizy.com/`.
- Prueba listar: `https://your-site.epizy.com/pokedex_backend/listar.php` debe devolver JSON con los pokemons.
- Prueba crear un Pokemon desde la UI y verifica que el archivo aparece en `pokedex_backend/uploads/`.

Notas importantes y limitaciones de InfinityFree
- No hay SSH en cuentas gratuitas — todo se hace por FTP o File Manager.
- Límites de tamaño de subida y tiempo de ejecución: evita imágenes muy grandes.
- MySQL host NO suele ser `localhost` — usa el `MySQL Host` que te entrega InfinityFree.
- Certificados HTTPS están soportados por InfinityFree en muchos planes; si usas su subdominio `epizy.com`, suele funcionar con HTTPS.

Si quieres, te genero los archivos `.htaccess` y el `.env.production` listos (ya están en este repositorio) y un checklist con comandos para ejecutar localmente y pasos concretos para subir con FileZilla.
