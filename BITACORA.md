# Bitácora de Cambios — TR4INER Funnels

Registro de decisiones, cambios y resultados del proyecto de funnels de adquisición.  
Cada entrada incluye: qué cambió, por qué, y resultado esperado o medido.

---

## 2026-05-18 — Setup inicial del proyecto

### Decisión estratégica
Inicio de la migración de ClickFunnels a páginas web custom alojadas en Vercel.  
Objetivo: control total sobre diseño, analítica, tecnología y escalabilidad de adquisición.

**Rol:** CMO + Analista General del Negocio (auditor y constructor del éxito de adquisición).

### Infraestructura creada
- **Repo GitHub:** https://github.com/gcessar/tr4iner-funnels
- **Proyecto Vercel:** `tr4iner-funnels` (metodotr4iners-projects)
- **Directorio local:** `/Users/gulhioolortetegui/FUNNEL CASO DE ESTUDIO/`

---

## 2026-05-18 — Funnel #1: Casos de Estudio (BRIDGE V3)

### Qué es
Lead magnet de captura. El usuario llega, lee casos de éxito de clientes TR4INER,
completa un formulario (nombre + email + sexo) y es redirigido a un testimonio personalizado.

### URL en producción
https://tr4iner-funnels.vercel.app

### Lógica de conversión
1. Usuario llega a la página (con o sin UTMs)
2. Lee el contenido (headline animada, bullet points, video thumbnail)
3. Abre el modal → completa formulario
4. Datos enviados via webhook a Railway → n8n
5. Redirección personalizada:
   - **Mujer** → `https://metodo.tr4iner.com/testimonio-flor`
   - **Hombre** → `https://metodo.tr4iner.com/testimonio-dashiel`
6. Countdown de 3 segundos antes del redirect automático

### Detalles técnicos
- **Webhook:** `https://primary-production-0efa.up.railway.app/webhook/casos-estudio`
- **UTMs capturados:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- **Anti-spam:** honeypot field + bloqueo de dominios falsos (mailinator, guerrillamail, yopmail, etc.)
- **Diseño:** Warm paper — `#F2EEE2` bg, `#F5C518` acento amarillo
- **Tipografías:** Fraunces (titulares serif), Instrument Sans (cuerpo), JetBrains Mono (labels)
- **SEO:** `noindex, nofollow` — no indexado en buscadores

### Por qué estas decisiones
- Testimonio por sexo: personalización aumenta conversión
- Sin framework ni build step: deploy instantáneo, sin dependencias que romper
- Countdown 3s: reduce fricción del redirect, sensación de "acción tomando lugar"

### Resultado esperado
Reemplazar el funnel equivalente en ClickFunnels con mayor control analítico
y la misma o mejor tasa de conversión.

### KPIs a medir
- [ ] Tasa de apertura del modal (scroll depth)
- [ ] Tasa de envío del formulario
- [ ] Tasa de completion por sexo
- [ ] Drop-off en cada paso del formulario

---

<!-- TEMPLATE para próximas entradas:

## AAAA-MM-DD — [Nombre del cambio]

### Qué cambió
...

### Por qué
...

### Resultado esperado
...

### Resultado medido (completar después)
...

-->
