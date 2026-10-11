# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

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

## Deploy
## Despliegue

Genera el bundle de producción con `npm run build` y publica el directorio `dist/` en Netlify. `netlify.toml` reenvía `/api/*` al backend de Railway y sirve `index.html` como fallback para las rutas de la aplicación. Para usar ese proxy, elimina `VITE_API_URL` de las variables de Netlify o configúrala como `/api`. Si configuras la URL de Railway directamente, usa `https://workoutmebackend-production-9597.up.railway.app/api` (el cliente también agrega `https://` y `/api` si recibe solo el dominio). Vite incorpora los valores `VITE_*` al bundle del navegador: nunca pongas credenciales ni secretos ahí. Si cambia el backend, actualiza el destino en `netlify.toml` y `vite.config.js`.

Sirve frontend y backend por HTTPS.

## Seguridad del backend antes de producción

Las propiedades compartidas contienen valores inseguros para producción: credenciales de base de datos `root`/`admin`, un secreto JWT débil con valor predeterminado, `ddl-auto=update`, registro de SQL y orígenes CORS de localhost. Considera expuestos la contraseña de base de datos y el secreto JWT: rótalos y no los reutilices. Guarda nuevos secretos distintos por entorno en el gestor de secretos del proveedor backend.

Externaliza `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`, `app.jwt.secret` y `app.cors.allowed-origins`. En producción, elimina el valor predeterminado de `app.jwt.secret`, usa un secreto aleatorio criptográficamente fuerte, crea una cuenta de base de datos dedicada con privilegios mínimos, desactiva `spring.jpa.show-sql` y configura `spring.jpa.hibernate.ddl-auto=validate` junto con migraciones versionadas. No configures `localhost` como base de datos de un backend desplegado.
