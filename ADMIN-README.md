# Panel de Administración - Pilates Malú Pérez

## 🔐 Acceso al Panel

**URL:** `/admin/login`

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `maluperez2024`

⚠️ **IMPORTANTE:** Cambia estas credenciales en el archivo `.env` antes de subir a producción:
```env
ADMIN_USERNAME=tu_usuario
ADMIN_PASSWORD=tu_password_segura
```

## 📊 Funcionalidades

### Dashboard Principal (`/admin/dashboard`)

El panel de administración te permite:

1. **Ver estadísticas generales:**
   - Total de clientes registrados
   - Total de pagos exitosos
   - Total recaudado

2. **Filtrar clientes:**
   - Por estado: Todos, Pagado, Pendiente, Cancelado
   - Por búsqueda: Nombre, email o teléfono

3. **Ver lista de clientes con:**
   - Fecha de registro
   - Nombre completo
   - Email
   - Teléfono
   - Tipo de clase seleccionada
   - Monto pagado
   - Estado del pago

4. **Ver detalles completos** de cada cliente:
   - Datos personales completos
   - Dirección
   - Notas adicionales
   - Información de la transacción (orden de compra, código de autorización)

5. **Exportar datos a Excel (CSV):**
   - Descarga todos los clientes en formato CSV
   - Compatible con Excel, Google Sheets, etc.

## 🔒 Seguridad

- El acceso requiere login con usuario y contraseña
- Los tokens de sesión expiran después de 24 horas
- Solo usuarios autenticados pueden acceder a los datos de clientes
- La sesión se guarda en `sessionStorage` (se borra al cerrar el navegador)

## 🚀 Cómo Usar

1. **Inicia sesión:**
   ```
   http://localhost:4321/admin/login
   ```

2. **Accede al dashboard:**
   Una vez autenticado, serás redirigido automáticamente a `/admin/dashboard`

3. **Filtra y busca clientes:**
   - Usa el filtro de estado para ver solo pagos exitosos, pendientes o cancelados
   - Usa la barra de búsqueda para encontrar clientes específicos

4. **Ve detalles:**
   - Haz clic en "Ver detalles" para ver toda la información de un cliente

5. **Exporta datos:**
   - Haz clic en "Exportar Excel" para descargar todos los datos

6. **Cierra sesión:**
   - Haz clic en "Cerrar Sesión" en la esquina superior derecha

## 📝 Notas

- El panel muestra por defecto solo los clientes con pago exitoso
- Los datos se actualizan en tiempo real desde Supabase
- El diseño mantiene la identidad visual del sitio
- Responsive: funciona en escritorio, tablet y móvil

## 🔧 Configuración Adicional

Para cambiar las credenciales de admin, edita el archivo `.env`:

```env
ADMIN_USERNAME=nuevo_usuario
ADMIN_PASSWORD=nueva_password_segura
```

Luego reinicia el servidor.
