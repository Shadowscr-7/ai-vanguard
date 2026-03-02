# Webhooks & Notificaciones — TODO

## Arquitectura común

### Fuentes de evento

- **PayPal** (pago completado / suscripción / disputa)
- **Patreon** (nuevo miembro / upgrade / cancelación)
- **Discord** (rol PRO asignado, o cambio de rol)

### Tu backend (NestJS)

- `POST /webhooks/paypal`
- `POST /webhooks/patreon`
- Discord Bot Listener (gateway event)
- **Normalizador** → guarda en DB → deduplica → encola
- **Notificador** → Telegram/Pushover/FCM

### Notificación a tu celular

- **Telegram**: lo más simple (mensaje directo a tu chat).
- **Pushover**: "push" limpio tipo alerta.
- **FCM**: pro (si tenés app propia o querés push nativo custom).

---

## Caso 1 — Compra de curso con PayPal (tu sitio)

### Flujo

PayPal "payment completed" → `POST /webhooks/paypal` (Nest) → validar → identificar curso/usuario → notificar.

### Cómo implementarlo bien

- Usar **PayPal Webhooks (REST)** (no depender del redirect de checkout).
- En tu Nest, endpoint:
  - Recibe payload
  - Valida la firma (PayPal entrega headers para verificación)
  - Deduplica por `event_id`
  - Procesa solo `COMPLETED`

### Tu lógica de negocio

- Mapear `resource` → `payer.email`, `amount`, `custom_id` / `invoice_id` / `item_name`
- Guardar "Order" + "Entitlement"
- Disparar notificación

### Mensaje recomendado

```
🚀 Nueva compra (PayPal)
Curso: {curso}
Email: {email}
Monto: {monto} {moneda}
ID: {txn}
```

> **Tip clave**: en tu checkout, asegurate de enviar un identificador interno en PayPal (`custom_id` / `invoice_id`) para saber qué curso fue.

---

## Caso 2 — PRO por Patreon (sin Make)

Patreon también soporta webhooks.

### Flujo

Patreon `member:pledge:create / update / delete` → `POST /webhooks/patreon` → validar firma → actualizar estado PRO → notificar.

### Qué eventos te importan

- **Alta**: nuevo miembro en tier PRO
- **Upgrade/Downgrade**: cambio de tier
- **Cancelación**: baja

### Recomendación operativa

- En Patreon guardás `patreon_user_id` + email (si lo tenés) + tier
- Si querés unirlo con Discord, lo ideal es pedir en tu onboarding el Discord username/ID o usar OAuth Discord en tu web para linkear cuentas.

### Mensaje

```
💎 Nuevo PRO (Patreon)
Usuario: {name}
Tier: {tier}
Estado: {active/declined/canceled}
```

---

## Caso 3 — Rol 💎 PRO asignado en Discord (sin Make)

La forma pro es un bot propio conectado al Gateway.

### Flujo

Discord `guildMemberUpdate` detecta cambio de roles → si agregó `ROLE_PRO_ID` → llama a tu Nest `POST /events/discord` (o escribe directo en DB) → notificar.

### Cómo lo detectás

- Guardás snapshot de roles anterior y nuevo
- Si antes NO tenía rol PRO y ahora SÍ → evento `PRO_GRANTED`
- Si antes tenía y ahora NO → `PRO_REVOKED`

### Mensaje

```
💎 PRO asignado en Discord
Usuario: {username}
Hora: {timestamp}
Origen: {manual/patreon/administrador} (si podés inferirlo)
```

> **Nota**: Discord por sí solo no te dice "quién lo asignó" en el evento; eso lo sacás del Audit Log si querés (más complejo) o lo dejás sin ese detalle.

---

## Notificación al celular: opciones

### Opción A: Telegram (recomendado)

- Creás bot con BotFather
- Obtenés `BOT_TOKEN`
- Obtenés tu `CHAT_ID`
- Tu Nest hace `sendMessage` ante cada evento
- ✅ Ventajas: rápido, simple, confiable.
- ⚠️ Desventaja: queda en un chat (igual sirve mucho).

### Opción B: Pushover

- App en el teléfono
- `user key` + `app token`
- Tu Nest hace `POST` a Pushover
- ✅ Ventajas: notificación push tipo "sistema de alertas".
- ⚠️ Desventaja: es un servicio aparte (pero muy estable).

### Opción C: FCM

- Si después querés notificaciones en tu propia app o panel admin.
