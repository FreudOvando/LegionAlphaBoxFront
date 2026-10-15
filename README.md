# Fitness Platform

## Personalizar una instancia

Actualiza la configuración antes de compilar:

- `src/branding.ts`: cambia `name`, `logoUrl`, `faviconUrl` y los valores hexadecimales de `colors`. Esta es la única fuente de configuración de marca y colores. Deja `logoUrl` vacío para mostrar el nombre como texto; para usar una imagen, copia el archivo del cliente a `public/` y configura su ruta, por ejemplo `/brand/logo.svg`.
- `public/favicon.svg`: reemplaza el favicon genérico o configura otra ruta en `faviconUrl`.
- Backend: define `APP_ADMIN_EMAIL` para el correo administrador. `APP_NAME` permite establecer el nombre identificador del proceso; no controla el nombre de marca visible en la interfaz.

Después ejecuta `npm run build` y publica `dist/`. No hace falta editar los componentes para cambiar colores: sus clases Tailwind existentes usan los tokens definidos en `src/index.css`, que se alimentan desde `src/branding.ts`.

Frontend de la plataforma, construido con React, TypeScript y Vite.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Desarrollo local

Ejecuta `npm run dev`. Vite reenvía las peticiones `/api` al backend desplegado en Railway; las rutas de autenticación son `/api/auth/register` y `/api/auth/login`. Para usar otro backend en local, cambia el destino del proxy en `vite.config.js`.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Despliegue

Genera el bundle de producción con `npm run build` y publica el directorio `dist/` en Netlify. `netlify.toml` reenvía `/api/*` al backend y sirve `index.html` como fallback para las rutas de la aplicación. Para usar ese proxy, elimina `VITE_API_URL` de las variables de Netlify o configúrala como `/api`. Si el cliente usa otro backend, actualiza el destino en `netlify.toml` o configura `VITE_API_URL` para el frontend. Vite incorpora los valores `VITE_*` al bundle del navegador: nunca pongas credenciales ni secretos ahí.

Sirve frontend y backend por HTTPS.

## Seguridad del backend antes de producción

Las propiedades compartidas contienen valores inseguros para producción: credenciales de base de datos `root`/`admin`, un secreto JWT débil con valor predeterminado, `ddl-auto=update`, registro de SQL y orígenes CORS de localhost. Considera expuestos la contraseña de base de datos y el secreto JWT: rótalos y no los reutilices. Guarda nuevos secretos distintos por entorno en el gestor de secretos del proveedor backend.

Externaliza `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`, `app.jwt.secret` y `app.cors.allowed-origins`. En producción, elimina el valor predeterminado de `app.jwt.secret`, usa un secreto aleatorio criptográficamente fuerte, crea una cuenta de base de datos dedicada con privilegios mínimos, desactiva `spring.jpa.show-sql` y configura `spring.jpa.hibernate.ddl-auto=validate` junto con migraciones versionadas. No configures `localhost` como base de datos de un backend desplegado.
