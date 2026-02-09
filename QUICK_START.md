# Rask Framføringsguide

## 1. Lag Tabell i Supabase (2 min)

Gå til Table Editor > New table

**Tabellnavn:** `todos`

Klikk "Add column" 3 ganger og legg inn:

| Navn | Type | Default |
|------|------|---------|
| title | text | (ingen) |
| completed | bool | false |

**Eller bruk SQL Editor:**
```sql
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

-- Skru av RLS for demo
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
```

## 2. Hent API Keys (1 min)

Project Settings > API

Kopier:
- Project URL
- anon public key

## 3. Oppdater app.js (1 min)

Åpne `app.js`, linje 6-7:

```javascript
const SUPABASE_URL = 'DIN_URL_HER'
const SUPABASE_KEY = 'DIN_KEY_HER'
```

Lim inn dine verdier.

## 4. Test Lokalt (1 min)

Åpne `index.html` i nettleser.

Test:
- Legg til todo
- Marker som fullført
- Slett

Vis at data dukker opp i Supabase Dashboard!

## 5. Deploy til GitHub Pages (2 min)

1. Push koden til GitHub (hvis ikke gjort allerede)
2. Gå til repository Settings > Pages
3. Under Source: velg "main" branch og "/" (root)
4. Klikk Save

Nettsiden vil være tilgjengelig på:
`https://<brukernavn>.github.io/<repo-navn>/`

**Eller bruk GitHub Actions:** Bare push til main, så deployes nettsiden automatisk!

Ferdig!

---

## SQL Template for Rask Kopiering

```sql
-- Lag tabell
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

-- Skru av RLS
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;

-- Legg inn testdata (valgfritt)
INSERT INTO todos (title, completed) VALUES
  ('Test Supabase', false),
  ('Deploy til GitHub Pages', false),
  ('Vis frem CRUD', false);
```
