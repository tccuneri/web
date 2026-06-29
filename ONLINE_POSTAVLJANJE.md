# Cuneri web online postavljanje

## Sto treba kupiti

1. Domena
   - Primjer: `cuneri.hr`, `tuningcrew-cuneri.hr`, `cuneri.eu` ili slicno.
   - Preporuka: kupiti preko Cloudflare Registrar ili domaceg registra ako zelis `.hr`.

2. Hosting za Node.js aplikaciju s trajnim diskom
   - Aplikacija koristi `server.js`, `data/db.json` i upload slika u `/uploads`.
   - Hosting mora imati persistent disk / volume, inace uploadane slike i narudzbe mogu nestati nakon redeploya.
   - Dobre opcije: Render s Persistent Disk, Railway s Volume, ili VPS.

3. Email slanje
   - Trenutno je podeseno za Gmail SMTP.
   - Treba koristiti Gmail App Password, ne obicnu lozinku.

## Environment varijable

Na hostingu dodati:

```env
CLUB_EMAIL=tccuneri@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tccuneri@gmail.com
SMTP_PASS=OVDJE_IDE_NOVI_GMAIL_APP_PASSWORD
SMTP_FROM="Tuning Crew Cuneri <tccuneri@gmail.com>"
```

Za hosting s trajnim diskom dodati i:

```env
DATA_DIR=/var/data/data
UPLOAD_DIR=/var/data/uploads
```

Ako hosting koristi drugu putanju za disk, upisati njegovu mount putanju.

## Start komanda

```bash
npm start
```

ili:

```bash
node server.js
```

## DNS

Kad hosting da javnu adresu aplikacije, domenu treba spojiti u DNS-u:

- `A` record ako hosting daje IP adresu
- `CNAME` record ako hosting daje hostname
- ukljuciti HTTPS/SSL

## Obavezno prije javne objave

- Promijeniti Gmail App Password jer je stari vec bio koristen lokalno.
- Ne slati `.env` javno na GitHub.
- Napraviti backup `data/db.json`, `data/email-inbox.json` i `public/uploads`.
- Provjeriti registraciju, login, reset lozinke, kontakt formu, narudzbu i upload slike na test domeni.

## Kako uredjivati kasnije s kompa, laptopa ili mobitela

### Najbolji workflow

1. Kod aplikacije ide u privatni GitHub repo.
2. Render/Railway se spoji na taj GitHub repo.
3. Kad se kod promijeni i posalje na GitHub, hosting automatski napravi deploy.
4. Podaci i slike ostaju na trajnom disku hostinga kroz `DATA_DIR` i `UPLOAD_DIR`.

### S glavnog kompa ili laptopa s Codexom

- Otvoris isti GitHub repo u Codexu.
- Codex napravi izmjene u kodu.
- Promjene se posalju na GitHub.
- Hosting automatski objavi novu verziju weba.

### S mobitela

Mobitel je najbolji za admin rad, ne za programiranje koda:

- otvoris `https://tvoja-domena.hr/admin`
- prijavis se kao admin
- uredjujes clanove, webshop, artikle, narudzbe, slike i statuse

Ako bas treba mijenjati kod s mobitela, moze preko GitHub web editora ili Codespaces, ali za ozbiljne izmjene je bolje laptop + Codex.

### Vazna razlika

- Admin panel mijenja zive podatke: clanove, slike, narudzbe, artikle.
- Codex/GitHub mijenja kod: izgled, funkcije, nove stranice, logiku.

Zato produkcijski server mora imati backup podataka, jer su podaci odvojeni od koda.
