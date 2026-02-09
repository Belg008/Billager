# Supabase Demo - Todo Liste

En enkel todo-liste app for å demonstrere Supabase CRUD-operasjoner.

## Før Framføringen

### 1. Push til GitHub
```bash
git init
git add .
git commit -m "Initial commit - Supabase demo"
git branch -M main
git remote add origin <DIN_GITHUB_REPO_URL>
git push -u origin main
```

### 2. Forbered Supabase Dashboard
- Logg inn på [supabase.com](https://supabase.com)
- Ha et prosjekt klart (eller vær klar til å lage et nytt)

## Under Framføringen

### Steg 1: Lag Supabase Tabell

Gå til Supabase Dashboard > Table Editor > Create new table

**Tabellnavn:** `todos`

**Kolonner:**
| Navn | Type | Default | Extra |
|------|------|---------|-------|
| id | int8 | (auto) | Primary key, auto-increment |
| created_at | timestamptz | now() | |
| title | text | | Not null |
| completed | bool | false | |

**SQL kode (alternativ):**
```sql
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);
```

### Steg 2: Aktiver Row Level Security (RLS)

**VIKTIG:** For demo-formål, skru AV RLS eller lag en policy som tillater alt:

**Alternativ 1 - Skru av RLS (enklest for demo):**
```sql
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
```

**Alternativ 2 - Lag en åpen policy:**
```sql
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations"
ON todos
FOR ALL
TO anon
USING (true)
WITH CHECK (true);
```

### Steg 3: Hent API Credentials

1. Gå til Project Settings > API
2. Kopier:
   - **Project URL** (eks: `https://xxxxx.supabase.co`)
   - **anon/public key**

### Steg 4: Koble til Nettsiden

Åpne `app.js` og oppdater:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co'  // Din URL
const SUPABASE_KEY = 'eyJhbGc...'  // Din anon key
```

### Steg 5: Test Lokalt

Åpne `index.html` i en nettleser og test:
- Legg til en todo
- Marker som fullført
- Slett en todo

### Steg 6: Deploy til Coolify

1. Logg inn på Coolify
2. Lag en ny ressurs > GitHub repository
3. Velg din repo
4. Konfigurer:
   - **Type:** Static site / Simple Dockerfile
   - **Build command:** (ikke nødvendig)
   - **Publish directory:** `.` (root)
5. Deploy

**Alternativ med enkel web-server:**

Hvis Coolify krever en server, lag en `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Eller bruk Python:
```dockerfile
FROM python:3.9-alpine
WORKDIR /app
COPY . .
EXPOSE 8000
CMD ["python", "-m", "http.server", "8000"]
```

## Demonstrasjonspunkter

Under framføringen, vis frem:

1. **CREATE** - Legg til nye todos
2. **READ** - Last inn todos fra databasen
3. **UPDATE** - Marker todos som fullført/ikke fullført
4. **DELETE** - Slett todos

Vis også:
- Supabase Dashboard og hvordan data oppdateres i sanntid
- Network tab i browser for å se API-kall
- Hvor enkelt det er å koble frontend til Supabase

## Struktur

```
supabase-framføring/
├── index.html      # Hovedside med UI
├── style.css       # Styling
├── app.js          # Supabase logikk + CRUD
└── README.md       # Dette dokumentet
```

## Tips for Framføringen

- Åpne Supabase Dashboard og nettleseren side-ved-side
- Legg til en todo på nettsiden, vis at den dukker opp i Supabase Dashboard
- Endre data i Supabase Dashboard, refresh nettsiden og vis at endringen synker
- Forklar Row Level Security (RLS) kort, men hold det enkelt
