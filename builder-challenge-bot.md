# Builder Challenge Bot — Especificación Completa

> Bot interno de AI Vanguard para generar, publicar y gestionar challenges semanales para 🔥 Builders.

---

## 1) Objetivo del bot

Builder Challenge Bot hace **4 cosas**:

1. **Genera un challenge semanal (IA)** con plantilla consistente
2. **Publica el challenge** en `#builders-lounge` cada viernes (o lunes)
3. **Detecta cuando alguien obtiene rol 🔥 Builder** y le manda DM con:
   - Bienvenida
   - Challenge actual
   - Instrucciones de entrega
   - **Solo si NO tiene rol 💎 PRO**
4. **Persistencia:** evita spam guardando estado:
   - "Este usuario ya recibió el challenge esta semana"
   - "Challenge vigente (semana X)"

---

## 2) Roles y canales (inputs del bot)

### Roles

| Variable           | Rol                    |
| ------------------ | ---------------------- |
| `ROLE_BUILDER_ID`  | 🔥 Builder             |
| `ROLE_PRO_ID`      | 💎 AI VANGUARD PRO     |
| `ROLE_MENTOR_ID`   | *(opcional)*           |
| `ROLE_FOUNDER_ID`  | *(opcional)*           |

### Canales

| Variable                     | Canal                                  |
| ---------------------------- | -------------------------------------- |
| `CHANNEL_BUILDERS_LOUNGE_ID` | Donde postea el challenge              |
| `CHANNEL_LOGS_ID`            | *(privado)* — Logs de ejecución/errores |
| `CHANNEL_SUBMISSIONS_ID`     | *(opcional)* — Si se separan entregas  |

---

## 3) Scheduling: ¿Viernes o lunes?

### Recomendación práctica

✅ **Viernes** (ideal para comunidad):

- Genera actividad el fin de semana (más tiempo libre)
- Más participación y entregas
- Más upgrades (porque ven fricción en ejecución real)

**Horario:** viernes 10:00 (timezone `-0300`)

---

## 4) Diseño del challenge (IA) — "Generación con guardrails"

La IA **no debe inventar** un desafío incoherente cada semana.  
Se le da un **marco rígido**:

### Estructura fija (output)

| Sección                     | Descripción                  |
| --------------------------- | ---------------------------- |
| Título                      |                              |
| Contexto                    |                              |
| Misión                      | 1 frase                     |
| Entregable exacto           | Formato esperado             |
| Restricciones               |                              |
| Criterios de evaluación     |                              |
| Bonus *(opcional)*          |                              |
| Ejemplos                    | 1 mini ejemplo               |
| Tiempo estimado             | 60–90 min                   |
| Dificultad                  |                              |

### Nivel Builder (no Pro)

- **Herramientas permitidas:** ChatGPT + Google Sheets/Docs + n8n básico *(opcional)*
- No exige deploy, ni infra, ni código complejo
- Se centra en **diseño + prueba + documentación**

### Tipos de challenge (rotación)

Rotación semanal para evitar repetición:

| Semana | Tipo                              |
| ------ | --------------------------------- |
| A      | Sistema de prompts                |
| B      | Workflow / automatización simple  |
| C      | Clasificación / extracción        |
| D      | Agente simple (sin tools complejas) |
| E      | Auditoría / mejora de proceso     |
| F      | Plantilla SOP + IA               |

El bot elige el tipo según **calendario** (más estable) o **aleatorio controlado**.

---

## 5) Lógica de "Builder pero no Pro"

### Reglas de DM

Cuando detecta rol 🔥 Builder:

- **Si también tiene 💎 PRO** → no envía (o envía un mensaje distinto)
- **Si NO tiene 💎 PRO** → envía DM *"Bienvenido Builder + challenge vigente"*
- **Si DM falla** (privacidad) → logea en `#logs` para contacto manual

### Anti-spam

- Solo **1 DM por semana** por usuario
- Si el usuario recibe rol Builder y se lo quitan y lo vuelven a dar, **no reenvía** esa misma semana

---

## 6) Detección del rol Builder

Dos formas robustas (sin depender de Arcane internals):

### A) Evento Discord `guildMemberUpdate` ✅ Recomendado

El bot escucha cambios de roles:

- **Antes:** roles no incluyen Builder
- **Después:** roles incluyen Builder
- ⇒ Disparo de onboarding

Esto es lo más limpio.

### B) Mensaje en canal "auto-level"

Si Arcane postea ahí, el bot parsea y actúa.  
Funciona, pero depende del formato del mensaje.

**Recomendación:** opción A (`guildMemberUpdate`).

---

## 7) Persistencia / Estado

Usar una tabla simple (**SQLite** / Postgres / Redis). Con SQLite alcanza.

### Tablas mínimas

#### `weekly_challenges`

| Campo                | Tipo / Ejemplo       |
| -------------------- | -------------------- |
| `week_key`           | `2026-W09`           |
| `created_at`         | timestamp            |
| `title`              | texto                |
| `content_markdown`   | texto largo          |
| `type`               | A / B / C …          |
| `posted_message_id`  | para editar/referenciar |

#### `user_weekly_delivery`

| Campo              | Tipo / Ejemplo       |
| ------------------ | -------------------- |
| `user_id`          | Discord user ID      |
| `week_key`         | `2026-W09`           |
| `dm_sent_at`       | timestamp            |
| `dm_status`        | `sent` / `failed`    |
| `is_pro_at_send`   | bool                 |

#### `config`

| Campo            | Ejemplo              |
| ---------------- | -------------------- |
| `timezone`       | `-0300`              |
| `schedule_day`   | `FRI` / `MON`        |
| `schedule_time`  | `10:00`              |
| `llm_model`      | modelo a usar        |
| `channel_ids`    | IDs de canales       |
| `role_ids`       | IDs de roles         |

---

## 8) Flujo semanal completo

### Viernes 09:55

Bot ejecuta `prepareWeeklyChallenge()`:

1. Calcula `week_key`
2. Si ya existe challenge para esa semana → **no regenera**
3. Si no existe:
   - Llama LLM con prompt + rotación de tipo
   - Valida el output (chequeos: longitud, secciones, restricciones)
   - Guarda en DB

### Viernes 10:00

Job `postWeeklyChallenge()`:

1. Toma el challenge de la semana
2. Postea en `#builders-lounge`
3. Guarda `posted_message_id`
4. Logea en `#logs`

### Viernes 10:05

Job `notifyBuilders()` *(opcional)*:

- Hace ping suave a rol 🔥 Builder dentro de `#builders-lounge`
- O solo lo deja publicado sin ping (más premium)

---

## 9) DM de bienvenida Builder

> Template "conversión sin vender"

DM al ganar 🔥 Builder (si no 💎 Pro):

```
Bienvenido a 🔥 Builder.
Esto significa una cosa: consistencia.

Tu desafío vigente (semana {week_key}):
{challenge_title}

Entrega en #builders-lounge con este formato:
• objetivo
• flujo
• prompt / inputs
• resultado
• iteración

Si querés convertir esto en un sistema "de verdad", el entorno Pro existe para eso.
(Sin presión: primero construí.)
```

> **Nota:** el "pitch" es suave — no precio, no link inmediato.

---

## 10) Prompt del LLM (esqueleto)

**System:**

> "Sos diseñador de desafíos para builders. No pro. No uses tono infantil."

**User (resumen):**

- **Comunidad:** AI Vanguard, laboratorio de sistemas con IA
- **Target:** rol 🔥 Builder, nivel intermedio inicial
- **Constraints:** sin deploy, sin infra, no requiere código avanzado
- **Output:** markdown con secciones fijas
- **Timebox:** 60–90 min
- Incluir ejemplo mínimo
- Incluir "bonus opcional"
- No mencionar "paga / premium" en el challenge
- **Español neutro**

Además: se le pasa un "tema" de la semana (ej: *"automatizar intake de leads"*, *"analizador de logs"*, *"resumen ejecutivo"*, etc.) o lo deja elegir dentro de categorías.

---

## 11) Seguridad / Permisos

Permisos mínimos del bot:

- ✅ Leer mensajes *(si se leen submissions — opcional)*
- ✅ Enviar mensajes
- ✅ Enviar DMs
- ✅ Ver canales target
- *(opcional)* Gestionar mensajes si se quiere editar el post semanal

> **No necesita administrador.**

---

## 12) Hosting recomendado

Un VPS (Oracle / Hostinger) o un contenedor Docker en la infra actual.

- Variables `.env`
- Reinicio automático (`PM2` o `systemd`)
- Logs a archivo + canal Discord privado

---

## 13) "Builder-only" garantizado

Aunque Pro pueda ver `#builders-lounge`, el bot **segmenta DM solo a Builder no-Pro**.

Si se quiere exclusividad total Builder:

- `#builders-lounge` solo para 🔥 Builder (y staff)
- Pro no lo ve
- Pro tiene su **LABORATORIO**

> Esto es decisión de producto.

---

## Decisión final recomendada (para maximizar upgrades)

| Aspecto                | Decisión                                                                 |
| ---------------------- | ------------------------------------------------------------------------ |
| `#builders-lounge`     | Visible a Builder **y** Pro (así Pro da ejemplo y eleva nivel)           |
| DM                     | Solo a **Builder no-Pro**                                                |
| Bonus del challenge    | Sugiere *"si querés feedback profundo, pedilo en Pro"* (sin vender explícito) |
