# 🚀 GUÍA SIMPLE - Transbank Producción

## ⚠️ IMPORTANTE: No se puede probar en localhost

Transbank **requiere HTTPS** y **no acepta localhost**. Para probar necesitas:
- **Opción 1**: Subir directamente a tu servidor con HTTPS
- **Opción 2**: Usar ngrok para crear un túnel temporal

---

## OPCIÓN 1: Probar Directo en Servidor (Recomendado)

### PASO 1: Subir a Tu Servidor con SSL

Tu equipo (Antigravity) debe:

1. **Subir el código** al servidor
2. **Activar HTTPS** (obligatorio)
3. **Configurar estas variables** en el panel del servidor:

```bash
TBK_API_KEY_ID=597053047445
TBK_API_KEY_SECRET=93d5d597-ca1f-4170-b2ab-e3c5817a85d4
TBK_ENVIRONMENT=INTEGRATION
PUBLIC_BASE_URL=https://tudominio.cl
```

4. **Deploy:**
```bash
npm install
npm run build
npm start
```

### PASO 2: Probar en el Servidor

Ve a: `https://tudominio.cl/test-payment`

Usa tarjeta de prueba:
- Número: `4051 8856 0044 6623`
- CVV: `123`
- Fecha: Cualquier futura

¿Funcionó? ✅ Continúa al Paso 3

---

## OPCIÓN 2: Probar Localmente con ngrok

Si quieres probar antes de subir al servidor:

### 1. Instalar ngrok
```bash
brew install ngrok
# o descarga desde: https://ngrok.com/download
```

### 2. Iniciar tu servidor local
```bash
npm run dev
```
(Anota el puerto, ej: 4322)

### 3. Crear túnel ngrok
```bash
ngrok http 4322
```

ngrok te dará una URL como: `https://abc123.ngrok.io`

### 4. Actualizar .env
```bash
PUBLIC_BASE_URL=https://abc123.ngrok.io
```

### 5. Reiniciar servidor
```bash
# Ctrl+C para detener
npm run dev
```

### 6. Probar
Ve a: `https://abc123.ngrok.io/test-payment`

**Nota**: La URL de ngrok cambia cada vez que lo reinicias (gratis). Para URL fija necesitas cuenta paga.

---

## PASO 3: Cambiar a Producción (Credenciales Reales)

**En el servidor**, cambia estas variables:

```bash
TBK_API_KEY_ID=tu_codigo_597_real_aqui
TBK_API_KEY_SECRET=tu_codigo_93d_real_aqui
TBK_ENVIRONMENT=PRODUCTION
```

*(Usa las credenciales de tu cuenta Transbank - las que ya pusiste en el .env local)*

**Redeploy**

---

## PASO 4: Transacción Real de $50 (Validación Transbank)

Ve a: `https://tudominio.cl/test-payment`

**USA TU TARJETA REAL** - Se cobrarán $50 de verdad

1. Completa el pago
2. Captura pantalla del éxito
3. Verifica el cargo en tu banco

¿Funcionó? ✅ Continúa al Paso 5

---

## PASO 5: Limpiar y Listo

**Elimina la página de prueba:**

```bash
rm src/pages/test-payment.astro
```

**Redeploy**

✅ **LISTO!** El botón "COMPRAR" de la página principal ya funciona con $369.990

---

## 📝 Resumen Ultra-Rápido

**NO SE PUEDE PROBAR EN LOCALHOST** - Transbank requiere HTTPS

1. Subir a servidor con HTTPS
2. Variables de INTEGRATION en el servidor
3. Probar con tarjeta de prueba en servidor
4. Cambiar a PRODUCTION con tus credenciales reales
5. Pagar $50 reales para validación
6. Eliminar test-payment.astro
7. ✅ Listo

**O usar ngrok para túnel temporal desde localhost**

---

## ⚠️ Solo Recuerda

- **HTTPS es obligatorio** - localhost NO funciona
- Las variables van en el panel del servidor, NO en el código
- La transacción de $50 es real
- Elimina test-payment.astro después de validar
- Tus credenciales: `TBK_API_KEY_ID=597053047445` y `TBK_API_KEY_SECRET=93d5d597...`

---

## 🆘 Si Algo Falla

**Error más común:** Variables mal configuradas

Verifica en el servidor:
- Nombres exactos: `TBK_API_KEY_ID`, `TBK_API_KEY_SECRET`, `TBK_ENVIRONMENT`
- Sin espacios al inicio/final
- `PUBLIC_BASE_URL` con https://
