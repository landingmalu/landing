# 🎯 Guía de Implementación: Sistema de Compra con Transbank y Supabase

## ✅ Lo que hemos configurado

### Archivos Creados:
1. **`src/lib/supabase.ts`** - Cliente de Supabase
2. **`src/pages/comprar.astro`** - Página de checkout con formulario completo
3. **`src/pages/api/cliente/crear.ts`** - Endpoint para guardar cliente en BD
4. **`src/pages/api/transbank/confirm.ts`** - Modificado para actualizar estado en BD

### Flujo Completo:
```
Usuario llena formulario → Datos guardados en BD (pendiente) 
→ Se crea transacción en Transbank 
→ Usuario paga en Webpay 
→ Confirmación actualiza BD a "pagado"
```

---

## 🔧 Pasos de Configuración

### 1️⃣ Instalar Supabase
```bash
npm install @supabase/supabase-js
```

### 2️⃣ Crear Base de Datos en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. En el SQL Editor, copia el contenido de **`setup-database.sql`** y ejecuta

Esto crea:
- Tabla `clientes` con todos los campos necesarios
- Índices para búsquedas rápidas
- Políticas de seguridad (RLS)

### 3️⃣ Obtener Credenciales

En el panel de Supabase, ve a **Settings → API**:
- Copia `Project URL` → `PUBLIC_SUPABASE_URL`
- Copia `Service Role Key` → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Nunca compartas el Service Role Key en repositorios públicos**

### 4️⃣ Actualizar `.env`

```env
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

### 5️⃣ Actualizar Botón Principal

En `src/pages/index.astro`, cambia:

```html
<!-- Antes -->
<a href="#comprar" class="...">COMPRAR</a>

<!-- Después -->
<a href="/comprar" class="...">COMPRAR</a>
```

---

## 🧪 Pruebas Locales

```bash
npm run dev
```

1. Ve a `http://localhost:4321/comprar`
2. Llena el formulario
3. Haz clic en "PROCEDER AL PAGO"
4. **Tarjetas de prueba Transbank:**
   - **Éxito:** `4051885600446623` (CVV: 123, cualquier fecha)
   - **Rechazo:** `4051885600446631` (CVV: 123)

---

## 📊 Estructura de Datos en BD

La tabla `clientes` guarda:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | ID único del cliente |
| `nombre` | String | Nombre |
| `email` | String | Email |
| `telefono` | String | Teléfono |
| `clase_seleccionada` | String | 'reformer', 'lagree', o 'combinado' |
| `monto` | Integer | Monto pagado ($369,990) |
| `estado` | String | 'pendiente', 'pagado', 'cancelado' |
| `buy_order` | String | Referencia de transacción Transbank |
| `auth_code` | String | Código de autorización |
| `created_at` | Timestamp | Fecha de creación |
| `updated_at` | Timestamp | Última actualización |

---

## 🚀 Flujo de Pago Detallado

### 1. **Usuario accede a `/comprar`**
   - Ve el formulario con los campos de facturación
   - Elige su clase preferida (Reformer, Lagree, Combinado)

### 2. **Hace clic en "PROCEDER AL PAGO"**
   - JavaScript valida el formulario
   - Envía datos a `/api/cliente/crear`
   - BD guarda cliente con estado **"pendiente"**

### 3. **Se inicia la transacción Transbank**
   - Endpoint `/api/transbank/create` genera token
   - JavaScript redirige a Webpay

### 4. **Usuario paga en Webpay**
   - Transbank devuelve token al `confirm.ts`
   - Se confirma la transacción

### 5. **Confirmación actualiza BD**
   - Si éxito: estado → "pagado" + auth_code
   - Si rechazo: estado → "cancelado"
   - Usuario ve página de éxito o error

---

## 📱 Páginas del Sistema

### Página de Checkout (`/comprar`)
- ✅ Formulario con validación
- ✅ Resumen de pedido
- ✅ Cálculo automático de monto
- ✅ Integración con Transbank

### Página de Éxito (`/pago-exitoso`)
- ✅ Muestra detalles del pago
- ✅ Recibe parámetros: `amount`, `buyOrder`, `authCode`

### Página de Error (`/pago-error`)
- ✅ Muestra código de error
- ✅ Permite reintentar

---

## 🔐 Variables de Entorno

**Locales (`.env`):**
```env
PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
TBK_API_KEY_ID=...
TBK_API_KEY_SECRET=...
PUBLIC_BASE_URL=http://localhost:4321
```

**Producción (Vercel):**
- Copia las mismas variables en Settings → Environment Variables
- Actualiza `PUBLIC_BASE_URL` a tu dominio
- Cambia `TBK_ENVIRONMENT` a `PRODUCTION`

---

## 🐛 Debugging

### Revisar logs en Supabase
1. Ve a **Logs** en el dashboard
2. Busca errores de inserción

### Revisar transacciones Transbank
1. En el panel de Transbank, ve a transacciones
2. Busca por `buyOrder` (UUID del cliente)

### Logs locales
- Abre console del navegador (F12)
- Revisa la pestaña Network para requests

---

## 💡 Mejoras Futuras

- [ ] Email de confirmación automático
- [ ] Dashboard de admin para ver compras
- [ ] Integración con calendario de clases
- [ ] Sistema de cupones descuento
- [ ] Facturación automática (PDF)
- [ ] Notificaciones por SMS

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que Supabase esté configurado correctamente
2. Revisa que `PUBLIC_SUPABASE_URL` no termine en "/"
3. Asegúrate de que la tabla `clientes` existe
4. Verifica las RLS policies en Supabase

¡Listo para producción! 🎉
