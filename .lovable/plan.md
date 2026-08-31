# Rediseño estético de Vimarti Business Manager

Recreamos el sistema de gestión en este proyecto con un rediseño puramente visual: mismas secciones, misma información, misma jerarquía funcional que el sistema actual (revisado en staging), pero con un lenguaje visual propio y mucho más cuidado. Sin cambios de lógica de negocio: los datos se cargan como datos de ejemplo (mock) idénticos a los que muestra hoy staging.

## Dirección visual

- **Paleta**: blanco / negro / grises + rojo Vimarti como acento principal, y un secundario **ámbar cálido** para estados intermedios (pago parcial, pendiente). Verde y rojo se reservan para semántica (pagado / vencido), no para decoración.
- **Tipografía**: Space Grotesk para títulos y números grandes, DM Sans para texto e interfaz. Números tabulares en todas las tablas y métricas para que los montos se alineen.
- **Superficies**: fondo casi blanco cálido, tarjetas blancas con borde de 1px y sombra mínima; radio de esquina 10px consistente. El sidebar pasa a fondo negro carbón con texto claro, lo que da contraste real contra el área de trabajo y reemplaza el actual bloque rosa lavado.
- **Densidad**: filas de tabla más compactas y legibles, cabeceras en mayúsculas pequeñas con tracking, celdas numéricas alineadas a la derecha.
- **Iconografía**: se reemplazan los glifos actuales (⌂ ◇ ♙ ↗ ▥) por un set de íconos coherente (Lucide).
- **Motion**: contenida — transiciones de 150ms en hover/estado, sin animaciones de entrada por elemento.

## Estructura

Sidebar clásico fijo, refinado:

```text
┌────────────┬────────────────────────────────────────────┐
│ Vimarti    │ breadcrumb                    [buscar] [T] │
│ Business   ├────────────────────────────────────────────┤
│            │ Título de sección       + acción primaria  │
│ Resumen    │ ────────────────────────────────────────── │
│ Productos  │ métricas / filtros                         │
│ Clientes   │ tabla o paneles                            │
│ Ventas     │                                            │
│ Reportes   │                                            │
│            │                                            │
│ Config.    │                                            │
│ tomas ▾    │                                            │
└────────────┴────────────────────────────────────────────┘
```

Mejoras de shell: breadcrumb legible (no "VI / Resumen"), topbar con buscador y menú de usuario, sidebar colapsable, y adaptación móvil (sidebar en drawer, tablas con scroll horizontal y celdas prioritarias).

## Pantallas a construir

1. **Login** (`/login`) — pantalla partida: marca a la izquierda sobre fondo negro, formulario a la derecha. Campos con labels flotantes, estados de error y foco claros.
2. **Resumen** (`/`) — KPIs de monto vendido y ventas confirmadas con indicador "en vivo" sutil, panel de cobros por medio de pago con barra de proporción, y tabla de ventas recientes con chips de estado rediseñados.
3. **Productos** (`/productos`) — tabla con miniatura real, nombre + código en dos líneas, precio y comisión alineados, chip de estado, y acciones agrupadas en un menú en lugar de tres enlaces sueltos. Filtros como segmented control + select de orden. Estado vacío diseñado.
4. **Clientes** (`/clientes`) — tabla con avatar de iniciales, email y teléfono formateados, acciones en menú. Se corrige el contador que hoy dice "2 productos" en la sección de clientes.
5. **Ventas** (`/ventas`) — tabla ancha con columnas fijas de venta/cliente, barra de progreso de cobro (cobrado vs saldo) y doble chip pago/entrega con color semántico. Filtros como grupo de dropdowns compactos.
6. **Detalle de venta** (`/ventas/$id`) — cabecera con importe y estados, línea de tiempo de cuotas y entrega, datos de cliente y producto en panel lateral.
7. **Reportes** (`/reportes`) — fila de KPIs, panel de flujo de entregas como barra segmentada, ranking de productos con barras horizontales, ranking de vendedores en podio con progreso hacia el próximo objetivo, y tarjeta de "vendedor del mes" con estado vacío elegante.
8. **Configuración** (`/configuracion`) — tabs reales por sección (Usuarios, Roles, Integraciones, Proveedores, Apariencia), tabla de usuarios con chips de rol/estado, y panel de Apariencia con selector claro/oscuro.

## Componentes compartidos

`AppShell` (sidebar + topbar), `PageHeader`, `StatCard`, `DataTable` (cabecera, orden, paginación, estado vacío), `StatusChip` (variantes pagada / parcial / pendiente / enviada / entregada / activo / inactivo), `SegmentedFilter`, `ProgressBar`, `EmptyState`, `Avatar`.

## Detalles técnicos

- TanStack Start con rutas en `src/routes/` (`login`, `index`, `productos`, `clientes`, `ventas`, `ventas.$id`, `reportes`, `configuracion`), cada una con su `head()` propio.
- Tokens de diseño en `src/styles.css` (`@theme inline` + `:root`/`.dark` en oklch): se agregan tokens de marca, ámbar de advertencia, verde de éxito, superficies del sidebar y sombras. Sin colores hardcodeados en componentes.
- Space Grotesk + DM Sans cargadas con `<link>` en `src/routes/__root.tsx` y declaradas como `--font-display` / `--font-sans`.
- Datos de ejemplo en `src/lib/mock-data.ts` replicando los registros de staging (2 productos, 2 clientes, 3 ventas, métricas y ranking), con helpers de formato de moneda y fecha en es-AR.
- Sin backend, sin auth real: el login navega al panel. Si más adelante querés datos reales, se conecta Lovable Cloud o la API existente sin tocar la capa visual.
