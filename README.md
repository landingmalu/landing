# 🏃‍♀️ Malú Pérez - Pilates & Lagree Fitness

Sitio web de preventa para estudio de Pilates Reformer y Lagree Fitness con integración de pagos Transbank (Webpay Plus).

## 🛠️ Stack Tecnológico

- **Framework**: Astro 5.17 (SSR habilitado)
- **Styling**: Tailwind CSS 4.1
- **Pagos**: Transbank SDK 6.1 (Webpay Plus)
- **Deployment**: Node.js standalone adapter

## 🚀 Configuración Local

### 1. Instalación

```bash
npm install
```

### 2. Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Para desarrollo local (con tarjetas de prueba):

```bash
TBK_API_KEY_ID=597055555532
TBK_API_KEY_SECRET=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
TBK_ENVIRONMENT=INTEGRATION
PUBLIC_BASE_URL=http://localhost:4321
PORT=4321
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre: http://localhost:4321

### 4. Build para Producción

```bash
npm run build
npm run preview
```

## 💳 Integración Transbank

### Ambiente de Integración (Pruebas)

Usa estas credenciales (ya configuradas en `.env`):
- API Key ID: `597055555532`
- API Key Secret: `579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C`

**Tarjeta de prueba que APRUEBA:**
- Número: `4051 8856 0044 6623`
- CVV: `123`
- Fecha: Cualquier fecha futura
- RUT: `11.111.111-1`
- Contraseña: `123`

### Ambiente de Producción

Ver documentación completa en:
- 📄 **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)** - Guía paso a paso para deployment
- 📄 **[ENV-PRODUCTION.md](./ENV-PRODUCTION.md)** - Variables de entorno para producción
- 📄 **[TRANSBANK-SETUP.md](./TRANSBANK-SETUP.md)** - Configuración inicial de Transbank

## 📁 Estructura del Proyecto

```
apparent-ascension/
├── src/
│   ├── pages/
│   │   ├── index.astro              # Página principal
│   │   ├── test-payment.astro       # Página de prueba $50 (eliminar post-validación)
│   │   ├── pago-exitoso.astro       # Confirmación de pago exitoso
│   │   ├── pago-error.astro         # Página de error en pago
│   │   └── api/
│   │       └── transbank/
│   │           ├── create.ts        # Endpoint: Iniciar transacción
│   │           └── confirm.ts       # Endpoint: Confirmar pago
│   ├── layouts/
│   │   └── Layout.astro             # Layout principal
│   ├── components/
│   │   ├── LagreeFitness.astro
│   │   └── Welcome.astro
│   └── styles/
│       └── global.css
├── public/
│   └── fonts/                       # Fuentes y recursos estáticos
├── .env                             # Variables de entorno (NO subir a Git)
├── .env.example                     # Ejemplo de variables de entorno
├── astro.config.mjs                 # Configuración de Astro (SSR habilitado)
├── DEPLOYMENT-GUIDE.md              # Guía completa de deployment
├── ENV-PRODUCTION.md                # Variables para producción
└── TRANSBANK-SETUP.md               # Configuración de Transbank
```

## 🔐 Seguridad

- **NUNCA** subir el archivo `.env` a Git (ya está en `.gitignore`)
- Las credenciales de producción deben estar **solo en el servidor**
- Usar variables de entorno del hosting para producción

## 📦 Deployment

### Vercel

```bash
npm install -g vercel
vercel --prod
```

Configurar variables de entorno en: Proyecto → Settings → Environment Variables

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

Configurar variables en: Site settings → Build & deploy → Environment

### VPS (Ubuntu/Debian)

```bash
npm run build
node ./dist/server/entry.mjs
```

O con PM2:

```bash
pm2 start dist/server/entry.mjs --name "maluperez-pilates"
pm2 save
pm2 startup
```

## 🧪 Pruebas de Transbank

### 1. Pruebas Locales (Integración)

```bash
npm run dev
```

Ir a: http://localhost:4321/test-payment

### 2. Validación de Producción (Transacción Real de $50)

**⚠️ SOLO después de deployment en producción con HTTPS**

1. Configurar variables de producción en el servidor
2. Acceder a: `https://tudominio.cl/test-payment`
3. Realizar pago con tarjeta real
4. Capturar screenshot del comprobante
5. Verificar cargo en banco
6. **Eliminar** la página `/test-payment` después de aprobación

## 📄 Scripts Disponibles

```bash
npm run dev       # Desarrollo con hot-reload
npm run build     # Build para producción
npm run preview   # Preview del build
npm start         # Iniciar servidor producción (post-build)
```

## 🆘 Troubleshooting

### Error: "Credenciales de Transbank no configuradas"
- Verificar que las variables `TBK_API_KEY_ID` y `TBK_API_KEY_SECRET` existan
- Verificar que no haya espacios en los valores

### Error: "Invalid return URL"
- Verificar que `PUBLIC_BASE_URL` esté correcta
- En producción debe ser HTTPS: `https://tudominio.cl`
- No debe tener trailing slash

### El botón COMPRAR no funciona
- Abrir DevTools (F12) → Console
- Verificar errores de JavaScript
- Verificar que el endpoint `/api/transbank/create` responda

## 📞 Soporte

- **Transbank**: https://www.transbankdevelopers.cl/
- **Documentación**: Ver archivos `*-GUIDE.md` en este repositorio

## 📝 Notas Importantes

1. **SSL/HTTPS es OBLIGATORIO** para producción con Transbank
2. El **puerto 443** debe estar abierto
3. Transbank requiere **transacción real de $50** para aprobar producción
4. Eliminar `/test-payment` después de validación
5. Las credenciales de integración son públicas (de Transbank), pero las de producción son privadas

---

Desarrollado para Malú Pérez - Pilates & Lagree Fitness 🏃‍♀️
