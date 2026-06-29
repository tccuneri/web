const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const net = require("net");
const tls = require("tls");

const ROOT = __dirname;
loadEnv(path.join(ROOT, ".env"));
const PORT = process.env.PORT || 3000;
const CLUB_EMAIL = process.env.CLUB_EMAIL || "tccuneri@gmail.com";
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(PUBLIC_DIR, "uploads");
const DB_FILE = path.join(DATA_DIR, "db.json");
const INBOX_FILE = path.join(DATA_DIR, "email-inbox.json");
const SESSION_FILE = path.join(DATA_DIR, "sessions.json");
const sessions = new Map();

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

function ensureData() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const now = new Date().toISOString();
    const db = {
      users: [
        {
          id: "u-admin",
          username: "admin",
          email: "admin@cuneri.hr",
          name: "Ćuneri Admin",
          role: "admin",
          passwordHash: hashPassword("admin123"),
          mustChangePassword: false,
          createdAt: now
        }
      ],
      settings: {
        clubEmail: CLUB_EMAIL,
        memberCount: 52,
        visitedMeetsCount: 18,
        soonTextHr: "SOON Ćuner meet!!!",
        soonTextEn: "SOON Ćuner meet!!!",
        heroImages: [
          "/assets/hero-night.svg",
          "/assets/hero-sunrise.svg",
          "/assets/hero-garage.svg"
        ],
        aboutHr: "Tuning Crew Ćuneri je hrvatski autoklub za ljubitelje tuninga, stylinga, natjecanja i dobre ekipe. Okupljamo aute s karakterom i ljude koji vole raditi stvari svojim rukama.",
        aboutEn: "Tuning Crew Ćuneri is a Croatian car club for tuning, styling, competitions and a strong community around cars with character.",
        historyHr: historyHr(),
        historyEn: historyEn(),
        historyImages: ["/assets/hero-night.svg", "/assets/hero-sunrise.svg", "/assets/hero-garage.svg"]
      },
      members: [
        {
          id: "m-luka",
          userId: null,
          name: "Luka Horvat",
          email: "luka@example.com",
          instagram: "@luka_cuneri",
          tiktok: "@luka.garage",
          bio: "Voli clean buildove, dobar fitment i vikend susrete.",
          competitions: "Style, stance, audio",
          cars: [
            {
              id: "c-golf",
              name: "Golf GTI Mk7",
              cover: "/assets/member-golf.svg",
              images: ["/assets/member-golf.svg", "/assets/hero-garage.svg"],
              mods: "Stage 2 mapa, downpipe, coilover ovjes, forged felge, custom interijer.",
              details: "Auto je složen za daily vožnju i show nastupe, s naglaskom na čist izgled i pouzdanost.",
              competesIn: "Style, street class"
            }
          ]
        },
        {
          id: "m-marta",
          userId: null,
          name: "Marta Kovač",
          email: "marta@example.com",
          instagram: "@marta.racing",
          tiktok: "@marta_tune",
          bio: "Drift, fotografija i noćna okupljanja.",
          competitions: "Drift, track day",
          cars: [
            {
              id: "c-silvia",
              name: "Turbo Coupe",
              cover: "/assets/member-coupe.svg",
              images: ["/assets/member-coupe.svg", "/assets/hero-night.svg"],
              mods: "Turbo kit, roll cage, hydro ručna, bucket sjedala, angle kit.",
              details: "Projekt za vikend treninge i evente, stalno se nadograđuje.",
              competesIn: "Drift"
            }
          ]
        }
      ],
      events: [
        {
          id: "e-zagreb",
          title: "Noćni Meet Zagreb",
          city: "Zagreb",
          date: "2026-07-04",
          time: "21:00",
          description: "Meet otvoren za sve ljubitelje auta. Dolazak urednih i složenih projekata je poželjan.",
          image: "/assets/hero-night.svg",
          x: 54,
          y: 38
        },
        {
          id: "e-split",
          title: "Coast Cruise Split",
          city: "Split",
          date: "2026-07-18",
          time: "18:30",
          description: "Lagani cruise, fotkanje i druženje uz obalu.",
          image: "/assets/hero-sunrise.svg",
          x: 48,
          y: 72
        }
      ],
      posts: [
        {
          id: "p-1",
          titleHr: "Otvorene prijave za nove članove",
          titleEn: "New member applications are open",
          textHr: "Ako imaš projekt, volju i poštovanje prema ekipi, pošalji prijavu i predstavi svoj auto.",
          textEn: "If you have a project, motivation and respect for the crew, send an application and present your car.",
          createdAt: now
        },
        {
          id: "p-2",
          titleHr: "Pripreme za ljetne susrete",
          titleEn: "Summer meet preparation",
          textHr: "Uskoro objavljujemo nove lokacije i termine susreta kroz mapu.",
          textEn: "New event locations and dates will be published through the map soon.",
          createdAt: now
        }
      ],
      sponsors: [
        { id: "s-1", name: "Garage 2024", url: "#", logoText: "GARAGE 2024" },
        { id: "s-2", name: "Detail Lab", url: "#", logoText: "DETAIL LAB" },
        { id: "s-3", name: "Street Parts", url: "#", logoText: "STREET PARTS" },
        { id: "s-4", name: "Turbo Print", url: "#", logoText: "TURBO PRINT" }
      ],
      weather: makeWeather(),
      contacts: [],
      joinRequests: []
    };
    saveDb(db);
  }
  if (!fs.existsSync(INBOX_FILE)) fs.writeFileSync(INBOX_FILE, "[]");
  if (!fs.existsSync(SESSION_FILE)) fs.writeFileSync(SESSION_FILE, "{}");
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hashPassword(password, salt).split(":")[1]));
}

function readDb() {
  const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8").replace(/^\uFEFF/, ""));
  return normalizeDb(db);
}

function saveDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function makeWeather() {
  const cities = ["Zagreb", "Split", "Rijeka", "Osijek", "Dubrovnik"];
  const icons = ["sun", "cloud", "storm", "wind", "clear"];
  const today = new Date();
  return cities.map((city, cityIndex) => ({
    city,
    days: Array.from({ length: 5 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() + index);
      return {
        date: day.toISOString().slice(0, 10),
        temp: 18 + cityIndex + index,
        icon: icons[(cityIndex + index) % icons.length],
        textHr: ["Sunčano", "Oblačno", "Moguća kiša", "Vjetrovito", "Vedro"][(cityIndex + index) % 5],
        textEn: ["Sunny", "Cloudy", "Chance of rain", "Windy", "Clear"][(cityIndex + index) % 5]
      };
    })
  }));
}

function normalizeDb(db) {
  db.users ||= [];
  const admin = db.users.find(user => user.role === "admin");
  if (admin && !admin.username) admin.username = "admin";
  db.settings ||= {};
  if (!db.settings.clubEmail || db.settings.clubEmail === "info@cuneri.hr") db.settings.clubEmail = CLUB_EMAIL;
  db.settings.webshopSeizedMode ??= false;
  db.settings.memberCount ??= 52;
  db.settings.visitedMeetsCount ??= 18;
  db.settings.soonTextHr ||= "SOON Ćuner meet!!!";
  db.settings.soonTextEn ||= "SOON Ćuner meet!!!";
  db.settings.historyHr ||= historyHr();
  db.settings.historyEn ||= historyEn();
  db.settings.historyImages ||= ["/assets/hero-night.svg", "/assets/hero-sunrise.svg", "/assets/hero-garage.svg"];
  db.events ||= [];
  db.events = db.events.map(normalizeEvent);
  db.weather ||= makeWeather();
  for (const user of db.users) {
    user.shopAccess ??= ["admin", "shop_manager", "member", "customer"].includes(user.role);
    user.garageAccess ??= ["admin", "member"].includes(user.role);
    user.meetAccess ??= ["admin", "meet_manager"].includes(user.role);
  }
  db.products ||= defaultProducts();
  db.orders ||= [];
  db.coupons ||= [{ id: "coupon-2cv10", code: "2CV10", percent: 10, maxUses: 100000, usedCount: 0, onePerCustomer: true, firstOrderOnly: true, active: true }];
  db.couponRedemptions ||= [];
  return db;
}

function defaultProducts() {
  return [
    { id: "prod-hoodie", name: "Cuneri hoodie", category: "Hoodies", description: "Heavy cotton hoodie with club print.", price: 49.90, image: "/assets/member-wagon.svg", audiences: ["Musko", "Zensko"], colors: ["Crna", "Bijela", "Crvena"], sizes: ["S", "M", "L", "XL", "XXL"], stock: 40, active: true },
    { id: "prod-shirt", name: "Cuneri T-shirt", category: "Majice", description: "Short sleeve club T-shirt.", price: 24.90, image: "/assets/member-roadster.svg", audiences: ["Musko", "Zensko"], colors: ["Crna", "Bijela", "Crvena"], sizes: ["S", "M", "L", "XL", "XXL"], stock: 65, active: true },
    { id: "prod-cap", name: "Cuneri silterica", category: "Kape", description: "Unisex adjustable cap.", price: 19.90, image: "/assets/meet-lineup.svg", audiences: [], colors: ["Crna", "Bijela", "Crvena"], sizes: [], stock: 32, active: true },
    { id: "prod-sticker", name: "Cuneri naljepnica", category: "Dodaci", description: "Weather-resistant club sticker.", price: 3.50, image: "/assets/cuneri-logo.png", audiences: [], colors: [], sizes: [], stock: 150, active: true }
  ];
}

function normalizeEvent(event) {
  const normalized = { ...event };
  normalized.id ||= slug("e");
  normalized.attendees ||= [];
  normalized.clubMeet = normalized.clubMeet === true || normalized.clubMeet === "true" || normalized.clubMeet === "on";
  const locationText = normalized.location || normalized.address || normalized.description || normalized.city || "";
  const inferredCity = inferCity(locationText);
  const previousCity = normalized.city || "";
  const finalCity = inferredCity || previousCity;
  if (finalCity) normalized.city = finalCity;
  const point = cityPoint(normalized.city);
  if (point && (inferredCity && inferredCity !== previousCity || !Number.isFinite(Number(normalized.x)) || !Number.isFinite(Number(normalized.y)))) {
    normalized.x = point.x;
    normalized.y = point.y;
  }
  normalized.x = Number(normalized.x ?? point?.x ?? 50);
  normalized.y = Number(normalized.y ?? point?.y ?? 50);
  return normalized;
}

function inferCity(text) {
  const haystack = String(text || "").toLowerCase();
  const aliases = [
    ["Zaprešić", ["zapresic", "zaprešić"]],
    ["Zagreb", ["zagreb"]],
    ["Split", ["split"]],
    ["Rijeka", ["rijeka"]],
    ["Osijek", ["osijek"]],
    ["Dubrovnik", ["dubrovnik"]],
    ["Karlovac", ["karlovac"]],
    ["Varaždin", ["varazdin", "varaždin"]],
    ["Zadar", ["zadar"]],
    ["Pula", ["pula"]],
    ["Vukovar", ["vukovar"]],
    ["Velika Gorica", ["velika gorica"]],
    ["Samobor", ["samobor"]],
    ["Kerestinec", ["kerestinec"]]
  ];
  return aliases.find(([, names]) => names.some(name => haystack.includes(name)))?.[0] || "";
}

function cityPoint(city) {
  const points = {
    "Zagreb": { x: 54, y: 38 },
    "Zaprešić": { x: 51, y: 36 },
    "Kerestinec": { x: 52, y: 39 },
    "Samobor": { x: 49, y: 39 },
    "Velika Gorica": { x: 55, y: 42 },
    "Split": { x: 48, y: 72 },
    "Rijeka": { x: 31, y: 45 },
    "Osijek": { x: 76, y: 43 },
    "Dubrovnik": { x: 63, y: 88 },
    "Karlovac": { x: 45, y: 47 },
    "Varaždin": { x: 59, y: 27 },
    "Zadar": { x: 35, y: 65 },
    "Pula": { x: 20, y: 55 }
    ,"Vukovar": { x: 81, y: 45 }
  };
  return points[city];
}

function historyHr() {
  return [
    "Tuning Crew Ćuneri nastao je iz male ekipe koja se počela okupljati oko auta, garaža i večernjih vožnji još prije nego što je ime kluba postalo službeno. U početku nije bilo velikih planova, samo nekoliko ljudi koji su nakon posla ili škole dolazili pomoći oko spuštanja auta, slaganja felgi, čišćenja interijera, popravljanja sitnica i planiranja prvih zajedničkih izlazaka.",
    "Prva godina bila je godina stvaranja identiteta. Klub je dobio ime, logo, prve fotografije, prve dogovorene susrete i prve članove koji nisu došli samo pokazati auto, nego stvarno biti dio priče. Svaki projekt imao je svoj karakter: netko je gradio clean daily, netko stance auto, netko drift projekt, a netko audio ili show car. Upravo ta razlika je postala snaga kluba, jer Ćuneri nisu zamišljeni kao ekipa u kojoj svi auti moraju izgledati isto.",
    "Druga godina donijela je ozbiljniji tempo. Više putovanja, više susreta, više fotografiranja i više ljudi koji su počeli prepoznavati ime kluba. Garažne večeri pretvorile su se u male radionice, razgovori ispred auta u planove za evente, a obični parking susreti u trenutke po kojima se pamti sezona. Klub danas broji 52 člana i svaki od njih nosi dio tog razvoja, od prvih naljepnica do novih planova za veće meetove.",
    "Povijest kluba se i dalje piše. Ćuneri žele ostati mjesto gdje se poštuje trud, gdje nije bitno imaš li najskuplji auto nego koliko si spreman učiti, slagati, pomoći i voziti s ekipom. Zato ova stranica nije samo arhiva, nego dnevnik koji će admin moći puniti slikama, tekstovima, susretima i uspomenama kako klub raste."
  ].join("\n\n");
}

function historyEn() {
  return [
    "Tuning Crew Ćuneri started as a small group built around cars, garages and late drives before the club name became official. At first there were no huge plans, just people helping each other lower cars, fit wheels, clean interiors, fix details and plan the first drives together.",
    "The first year shaped the identity. The club got its name, logo, first photos, first organized meets and first members who wanted to be part of the story, not just show a car. Each project had its own character: clean daily builds, stance cars, drift projects, audio cars and show builds.",
    "The second year brought more momentum. More trips, more meets, more photos and more people recognizing the club name. Garage nights became small workshops, parking talks turned into event plans, and ordinary meets became memories of the season. The club now has 52 members, each carrying a part of that growth.",
    "The story is still being written. Ćuneri wants to stay a place that respects effort, learning, helping and driving together. This page is not just an archive, but a living diary that admins can fill with photos, stories, meets and memories as the club grows."
  ].join("\n\n");
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function sendText(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    ...headers
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 20_000_000) reject(new Error("Payload too large"));
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

function getCookie(req, name) {
  const cookies = (req.headers.cookie || "").split(";").map(v => v.trim());
  const found = cookies.find(v => v.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.split("=").slice(1).join("=")) : null;
}

function loadSessions() {
  try {
    const stored = JSON.parse(fs.readFileSync(SESSION_FILE, "utf8").replace(/^\uFEFF/, ""));
    sessions.clear();
    for (const [sid, session] of Object.entries(stored)) sessions.set(sid, session);
  } catch {
    sessions.clear();
  }
}

function saveSessions() {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(Object.fromEntries(sessions), null, 2));
}

function currentUser(req, db) {
  const sid = getCookie(req, "cuneri_sid");
  const session = sid && sessions.get(sid);
  if (!session) return null;
  if (Date.now() - Number(session.createdAt || 0) > 7 * 24 * 60 * 60 * 1000) {
    sessions.delete(sid);
    saveSessions();
    return null;
  }
  const user = db.users.find(user => user.id === session.userId) || null;
  if (user) {
    session.lastSeenAt = Date.now();
    session.userAgent = req.headers["user-agent"] || "";
    session.ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "";
    sessions.set(sid, session);
    saveSessions();
  }
  return user;
}

function requireUser(req, res, db) {
  const user = currentUser(req, db);
  if (!user) sendJson(res, 401, { error: "Sesija je istekla. Prijavi se ponovno u webshop/admin panel." });
  return user;
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

function smtpConfig() {
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  if (!user || !pass) return null;
  return {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true").toLowerCase() !== "false",
    user,
    pass,
    from: process.env.SMTP_FROM || `Tuning Crew Cuneri <${user}>`
  };
}

function cleanHeader(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function encodeHeader(value) {
  const text = cleanHeader(value);
  return /^[\x20-\x7E]*$/.test(text) ? text : `=?UTF-8?B?${Buffer.from(text, "utf8").toString("base64")}?=`;
}

function addressFromHeader(value) {
  const text = cleanHeader(value);
  const match = text.match(/<([^>]+)>/);
  return match ? match[1] : text;
}

function htmlEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function mailtoAddress(value) {
  return String(value || "").trim().replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, "");
}

function mailtoLink(email, subject, original) {
  const address = mailtoAddress(email);
  const body = [
    "",
    "",
    "--------------------",
    "Original message",
    `Subject: ${subject}`,
    `Ime / Prezime: ${original.name}`,
    `Company: ${original.company || "-"}`,
    `E-mail: ${email}`,
    "",
    "Message:",
    original.message
  ].join("\n");
  return `mailto:${address}?subject=${encodeURIComponent(`Re: ${subject}`)}&body=${encodeURIComponent(body)}`;
}

function contactMailContent(body) {
  const fullName = `${body.name} ${body.lastName}`.trim();
  const company = body.company || "-";
  const text = [
    `Ime / Prezime: ${fullName}`,
    `Company: ${company}`,
    `E-mail: ${body.email}`,
    "",
    "Message:",
    body.message
  ].join("\n");
  const replyHref = mailtoLink(body.email, body.subject, {
    name: fullName,
    company,
    message: body.message
  });
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#172026">
    <div style="max-width:620px;margin:0 auto;padding:28px 18px">
      <div style="background:#ffffff;border:1px solid #dde3ea;border-radius:12px;overflow:hidden">
        <div style="background:#050607;color:#ffffff;padding:22px 24px">
          <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#ffba52">Tuning Crew Cuneri</div>
          <h1 style="margin:8px 0 0;font-size:24px;line-height:1.2">Novi upit s web stranice</h1>
        </div>
        <div style="padding:24px">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:15px">
            <tr><td style="padding:8px 0;color:#66727a;width:130px">Ime / Prezime:</td><td style="padding:8px 0;font-weight:700">${htmlEscape(fullName)}</td></tr>
            <tr><td style="padding:8px 0;color:#66727a">Company:</td><td style="padding:8px 0">${htmlEscape(company)}</td></tr>
            <tr><td style="padding:8px 0;color:#66727a">E-mail:</td><td style="padding:8px 0"><a href="mailto:${htmlEscape(body.email)}" style="color:#0b63ce">${htmlEscape(body.email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#66727a">Subject:</td><td style="padding:8px 0">${htmlEscape(body.subject)}</td></tr>
          </table>
          <div style="margin-top:22px">
            <div style="margin-bottom:8px;color:#66727a;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.8px">Message</div>
            <div style="white-space:pre-wrap;background:#f7f9fb;border:1px solid #e2e8ef;border-radius:8px;padding:16px;line-height:1.55">${htmlEscape(body.message)}</div>
          </div>
          <div style="margin-top:24px">
            <a href="${htmlEscape(replyHref)}" style="display:inline-block;background:#ff284c;color:#ffffff;text-decoration:none;font-weight:700;border-radius:6px;padding:12px 18px">Reply to ${htmlEscape(fullName)}</a>
          </div>
          <p style="margin:18px 0 0;color:#66727a;font-size:13px">Gmailov standardni Reply takoder odgovara direktno na ${htmlEscape(body.email)}.</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
  return { text, html };
}

function smtpRead(socket) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const onData = chunk => {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const last = lines[lines.length - 1] || "";
      if (/^\d{3} /.test(last)) cleanup(resolve, buffer);
    };
    const onError = error => cleanup(reject, error);
    const cleanup = (done, value) => {
      socket.off("data", onData);
      socket.off("error", onError);
      done(value);
    };
    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function smtpCommand(socket, command, expected) {
  if (command) socket.write(`${command}\r\n`);
  const response = await smtpRead(socket);
  const code = Number(String(response).slice(0, 3));
  if (!expected.includes(code)) throw new Error(`SMTP ${code}: ${String(response).trim()}`);
  return response;
}

function smtpSafeBody(value) {
  return String(value || "").replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
}

function smtpMessage({ from, to, subject, text, html, replyTo }) {
  const headers = [
    `From: ${cleanHeader(from)}`,
    `To: ${cleanHeader(to)}`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@cuneri.local>`
  ];
  if (replyTo) headers.splice(2, 0, `Reply-To: ${cleanHeader(replyTo)}`);
  if (!html) {
    headers.splice(5, 0, "Content-Type: text/plain; charset=UTF-8", "Content-Transfer-Encoding: 8bit");
    return `${headers.join("\r\n")}\r\n\r\n${smtpSafeBody(text)}\r\n.`;
  }
  const boundary = `cuneri-${crypto.randomUUID()}`;
  headers.splice(5, 0, `Content-Type: multipart/alternative; boundary="${boundary}"`);
  const body = [
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    smtpSafeBody(text),
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    smtpSafeBody(html),
    `--${boundary}--`
  ].join("\r\n");
  return `${headers.join("\r\n")}\r\n\r\n${body}\r\n.`;
}

function smtpConnect(config) {
  return new Promise((resolve, reject) => {
    const options = { host: config.host, port: config.port, servername: config.host };
    const socket = config.secure ? tls.connect(options, () => resolve(socket)) : net.connect(options, () => resolve(socket));
    socket.setEncoding("utf8");
    socket.setTimeout(20000, () => {
      socket.destroy(new Error("SMTP timeout"));
    });
    socket.once("error", reject);
  });
}

async function sendMail(to, subject, text, options = {}) {
  const config = smtpConfig();
  if (!config) return false;
  const socket = await smtpConnect(config);
  try {
    await smtpCommand(socket, null, [220]);
    await smtpCommand(socket, `EHLO ${process.env.SMTP_HELO || "localhost"}`, [250]);
    await smtpCommand(socket, "AUTH LOGIN", [334]);
    await smtpCommand(socket, Buffer.from(config.user, "utf8").toString("base64"), [334]);
    await smtpCommand(socket, Buffer.from(config.pass, "utf8").toString("base64"), [235]);
    await smtpCommand(socket, `MAIL FROM:<${addressFromHeader(config.from)}>`, [250]);
    await smtpCommand(socket, `RCPT TO:<${addressFromHeader(to)}>`, [250, 251]);
    await smtpCommand(socket, "DATA", [354]);
    socket.write(`${smtpMessage({ from: config.from, to, subject, text, html: options.html, replyTo: options.replyTo })}\r\n`);
    await smtpCommand(socket, null, [250]);
    await smtpCommand(socket, "QUIT", [221]);
    return true;
  } finally {
    socket.end();
  }
}

function updateMailDelivery(id, delivery) {
  try {
    const inbox = JSON.parse(fs.readFileSync(INBOX_FILE, "utf8").replace(/^\uFEFF/, ""));
    const item = inbox.find(mail => mail.id === id);
    if (!item) return;
    item.delivery = { ...(item.delivery || {}), ...delivery, updatedAt: new Date().toISOString() };
    fs.writeFileSync(INBOX_FILE, JSON.stringify(inbox, null, 2));
  } catch {}
}

function appendMail(to, subject, text, options = {}) {
  const inbox = JSON.parse(fs.readFileSync(INBOX_FILE, "utf8").replace(/^\uFEFF/, ""));
  const mail = {
    id: crypto.randomUUID(),
    to,
    subject,
    text,
    createdAt: new Date().toISOString(),
    delivery: smtpConfig() ? { status: "queued" } : { status: "local-only", note: "SMTP nije konfiguriran." }
  };
  inbox.unshift(mail);
  fs.writeFileSync(INBOX_FILE, JSON.stringify(inbox, null, 2));
  sendMail(to, subject, text, options)
    .then(sent => updateMailDelivery(mail.id, sent ? { status: "sent" } : { status: "local-only", note: "SMTP nije konfiguriran." }))
    .catch(error => updateMailDelivery(mail.id, { status: "failed", error: error.message }));
}

function slug(prefix) {
  return `${prefix}-${crypto.randomBytes(5).toString("hex")}`;
}

function saveUpload(fileName, dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/(?:png|jpeg|jpg));base64,(.+)$/);
  if (!match) throw new Error("Podržane su samo image datoteke.");
  const ext = match[1].includes("jpeg") || match[1].includes("jpg") ? ".jpg" : ".png";
  const safeName = String(fileName || "upload").replace(/[^a-z0-9_.-]/gi, "-").slice(0, 70);
  const outName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${safeName}${safeName.endsWith(ext) ? "" : ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, outName), Buffer.from(match[2], "base64"));
  return `/uploads/${outName}`;
}

function publicAttendees(event, db = null, detailed = false) {
  return (event.attendees || []).map(item => {
    const member = detailed && db ? db.members.find(m => m.id === item.memberId || m.userId === item.userId) : null;
    const user = detailed && db ? db.users.find(u => u.id === item.userId || u.id === member?.userId) : null;
    return {
    id: item.id,
    memberId: item.memberId || "",
    userId: item.userId || "",
    name: member?.name || item.name || "Gost",
    car: item.car || memberCarText(member, item.carId) || "Auto",
    ...(detailed ? {
      email: member?.email || user?.email || "",
      instagram: member?.instagram || item.instagram || "",
      tiktok: member?.tiktok || "",
      images: memberImages(member)
    } : {})
  };
  });
}

function canManageMeets(user) {
  return Boolean(user && (user.meetAccess || ["admin", "meet_manager"].includes(user.role)));
}

function canAdminMeets(user) {
  return Boolean(user && user.role === "admin");
}

function ensureMemberProfile(db, user, data = {}) {
  let member = db.members.find(item => item.userId === user.id);
  if (!member) {
    member = { id: slug("m"), userId: user.id, email: user.email || user.username || "", cars: [] };
    db.members.unshift(member);
  }
  member.name = data.name || user.name || user.email || user.username || "Clan";
  member.email = data.email || user.email || user.username || "";
  member.instagram = data.instagram ?? member.instagram ?? "";
  member.tiktok = data.tiktok ?? member.tiktok ?? "";
  member.profileImage = user.profileImage || member.profileImage || "";
  member.coverImage = user.coverImage || member.coverImage || "";
  member.bio = data.bio ?? member.bio ?? "";
  member.bioEn = data.bioEn ?? member.bioEn ?? "";
  member.competitions = data.competitions ?? member.competitions ?? "";
  member.competitionsEn = data.competitionsEn ?? member.competitionsEn ?? "";
  member.cars = Array.isArray(data.cars) ? data.cars : (member.cars || []);
  return member;
}

function memberCarText(member, carId) {
  const cars = member?.cars || [];
  const car = cars.find(item => item.id === carId) || cars[0];
  return car?.name || "Auto clana";
}

function memberImages(member) {
  if (!member) return [];
  const images = [];
  if (member.profileImage) images.push(member.profileImage);
  if (member.coverImage) images.push(member.coverImage);
  for (const car of member.cars || []) {
    if (car.cover) images.push(car.cover);
    if (Array.isArray(car.images)) images.push(...car.images);
  }
  return [...new Set(images.filter(Boolean))];
}

function attendeeFromMember(member, carId) {
  return {
    id: slug("a"),
    memberId: member.id,
    userId: member.userId || null,
    name: member.name || member.email || "Clan",
    car: memberCarText(member, carId),
    createdAt: new Date().toISOString()
  };
}

function activeUsers(db) {
  const activeMs = 5 * 60 * 1000;
  const latestByUser = new Map();
  const now = Date.now();
  for (const session of sessions.values()) {
    if (!session.userId) continue;
    if (now - Number(session.createdAt || 0) > 7 * 24 * 60 * 60 * 1000) continue;
    const lastSeenAt = Number(session.lastSeenAt || session.createdAt || 0);
    const existing = latestByUser.get(session.userId);
    if (!existing || lastSeenAt > existing.lastSeenAt) latestByUser.set(session.userId, { lastSeenAt, userAgent: session.userAgent || "", ip: session.ip || "" });
  }
  return db.users.map(user => {
    const activity = latestByUser.get(user.id) || {};
    const lastSeenAt = Number(activity.lastSeenAt || 0);
    return {
      id: user.id,
      name: user.name || user.email,
      email: user.email,
      username: user.username || "",
      role: user.role,
      online: Boolean(lastSeenAt && now - lastSeenAt <= activeMs),
      lastSeenAt: lastSeenAt ? new Date(lastSeenAt).toISOString() : "",
      userAgent: activity.userAgent || ""
    };
  }).sort((a, b) => Number(b.online) - Number(a.online) || String(b.lastSeenAt).localeCompare(String(a.lastSeenAt)) || String(a.email).localeCompare(String(b.email)));
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function htmlCell(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function absoluteAsset(req, value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const host = req.headers.host || `localhost:${PORT}`;
  return `http://${host}${String(value).startsWith("/") ? value : `/${value}`}`;
}

function meetCsv(event, db, req) {
  const rows = [["Ime i prezime", "Automobil", "Instagram", "TikTok", "Slike"]];
  for (const attendee of publicAttendees(event, db, true)) {
    rows.push([
      attendee.name,
      attendee.car,
      attendee.instagram,
      attendee.tiktok,
      (attendee.images || []).map(image => absoluteAsset(req, image)).join(" | ")
    ]);
  }
  return `\uFEFF${rows.map(row => row.map(csvCell).join(";")).join("\r\n")}`;
}

function meetExcel(event, db, req) {
  const attendees = publicAttendees(event, db, true);
  const title = event.title || "Cuneri meet";
  const dateLine = [event.date, event.time, event.location || event.city].filter(Boolean).join(" - ");
  const rows = attendees.map((attendee, index) => {
    const instagram = attendee.instagram ? String(attendee.instagram).replace(/^@/, "") : "";
    const tiktok = attendee.tiktok ? String(attendee.tiktok).replace(/^@/, "") : "";
    const imageLinks = (attendee.images || []).map((image, imageIndex) => {
      const url = absoluteAsset(req, image);
      return `<a href="${htmlCell(url)}">Slika ${imageIndex + 1}</a>`;
    }).join("<br>");
    const preview = attendee.images?.[0] ? `<img src="${htmlCell(absoluteAsset(req, attendee.images[0]))}" width="120" height="70" />` : "";
    return `<tr>
      <td class="num">${index + 1}</td>
      <td class="strong">${htmlCell(attendee.name)}</td>
      <td>${htmlCell(attendee.car)}</td>
      <td>${instagram ? `<a href="https://www.instagram.com/${htmlCell(instagram)}">@${htmlCell(instagram)}</a>` : ""}</td>
      <td>${tiktok ? `<a href="https://www.tiktok.com/@${htmlCell(tiktok)}">@${htmlCell(tiktok)}</a>` : ""}</td>
      <td>${preview}</td>
      <td>${imageLinks}</td>
    </tr>`;
  }).join("");
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; color: #111827; }
    h1 { margin: 0; font-size: 26px; }
    .meta { margin: 6px 0 18px; color: #4b5563; font-size: 14px; }
    table { border-collapse: collapse; width: 100%; }
    th { background: #07121f; color: #ffffff; font-weight: 700; text-transform: uppercase; }
    th, td { border: 1px solid #9ca3af; padding: 10px; vertical-align: top; }
    tr:nth-child(even) td { background: #f3f7fb; }
    .num { text-align: center; font-weight: 700; width: 44px; }
    .strong { font-weight: 700; }
    a { color: #0b63ce; }
  </style>
</head>
<body>
  <h1>${htmlCell(title)}</h1>
  <div class="meta">${htmlCell(dateLine)} | Clanova na popisu: ${attendees.length}</div>
  <table>
    <thead><tr><th>#</th><th>Ime i prezime</th><th>Automobil</th><th>Instagram</th><th>TikTok</th><th>Slika</th><th>Linkovi slika</th></tr></thead>
    <tbody>${rows || `<tr><td colspan="7">Jos nitko nije na popisu.</td></tr>`}</tbody>
  </table>
</body>
</html>`;
}

function paymentLabel(method) {
  if (method === "paypal") return "PayPal";
  if (method === "revolut") return "Revolut";
  return "Pouzecem";
}

function paymentStatusFor(method) {
  return method === "cod" ? "Pouzecem" : "Ceka uplatu";
}

function paymentInstructions(method, order) {
  if (method === "paypal") return `PayPal uplata: tccuneri@gmail.com\nU opis uplate obavezno upisi broj narudzbe: ${order.id}`;
  if (method === "revolut") return `Revolut uplata: @cuneri\nU opis uplate obavezno upisi broj narudzbe: ${order.id}`;
  return "Placanje pouzecem obavlja se prilikom preuzimanja paketa.";
}

function deliverySummary(profile) {
  if (profile.deliveryType === "parcel") {
    return [
      `Dostava: Paketomat`,
      `Sluzba: ${profile.parcelService || "-"}`,
      `Broj / oznaka paketomata: ${profile.parcelLocker || "-"}`,
      `Adresa paketomata: ${profile.parcelAddress || "-"}`
    ].join("\n");
  }
  return [
    "Dostava: Kucna adresa",
    `Adresa: ${profile.address || "-"}`,
    `Grad: ${profile.city || "-"}`,
    `Postanski broj: ${profile.postalCode || "-"}`,
    `Napomena: ${profile.deliveryNote || "-"}`
  ].join("\n");
}

function billingSummary(profile) {
  return [
    `Grad: ${profile.billingCity || "-"}`,
    `Ulica: ${profile.billingStreet || "-"}`,
    `Kucni broj: ${profile.billingHouseNumber || "-"}`,
    `Postanski broj: ${profile.billingPostalCode || "-"}`,
    `Napomena: ${profile.billingNote || "-"}`
  ].join("\n");
}

function orderItemsText(order) {
  return order.items.map(item => `${item.quantity}x ${item.name}${[item.audience, item.color, item.size].filter(Boolean).length ? ` (${[item.audience, item.color, item.size].filter(Boolean).join(" / ")})` : ""} - ${(item.price * item.quantity).toFixed(2)} EUR`).join("\n");
}

function customerOrderMail(order) {
  return [
    `Pozdrav ${order.profile.firstName || ""},`,
    "",
    `Narudzba ${order.id} je zaprimljena.`,
    `Ukupno: ${order.total.toFixed(2)} EUR`,
    `Nacin placanja: ${paymentLabel(order.paymentMethod)}`,
    "",
    paymentInstructions(order.paymentMethod, order),
    "",
    "Artikli:",
    orderItemsText(order),
    "",
    "Dostava:",
    deliverySummary(order.profile),
    "",
    "Podaci za uplatu / racun:",
    billingSummary(order.profile),
    "",
    "Povratno ces dobivati informacije o uplati, pripremi paketa i slanju."
  ].join("\n");
}

function adminOrderMail(order) {
  return [
    `Nova narudzba: ${order.id}`,
    `Kupac: ${order.customerEmail}`,
    `Ukupno: ${order.total.toFixed(2)} EUR`,
    `Placanje: ${paymentLabel(order.paymentMethod)} (${order.paymentStatus})`,
    "",
    "Artikli:",
    orderItemsText(order),
    "",
    deliverySummary(order.profile),
    "",
    "Podaci za uplatu / racun:",
    billingSummary(order.profile)
  ].join("\n");
}

function validateCheckout(customerEmail, profile) {
  if (!customerEmail || !profile.firstName || !profile.lastName || !profile.phone) return "Upisi email, ime, prezime i telefon.";
  if (profile.deliveryType === "parcel") {
    if (!profile.parcelService || !profile.parcelLocker || !profile.parcelAddress) return "Za paketomat odaberi sluzbu, broj lokatora i adresu paketomata.";
  } else if (!profile.address || !profile.city || !profile.postalCode) {
    return "Za dostavu na adresu upisi adresu, grad i postanski broj.";
  }
  if (!profile.billingCity || !profile.billingStreet || !profile.billingHouseNumber || !profile.billingPostalCode) return "Upisi podatke za uplatu: grad, ulicu, kucni broj i postanski broj.";
  return "";
}

function maybeSendOrderUpdate(order, beforeStatus, beforePaymentStatus) {
  order.statusEmailsSent ||= {};
  if (order.paymentStatus === "Placeno" && beforePaymentStatus !== "Placeno" && !order.statusEmailsSent.paid) {
    appendMail(order.customerEmail, `Cuneri narudzba ${order.id} - uplata potvrdena`, `Uplata za narudzbu ${order.id} je evidentirana.\nUskoro krece priprema paketa.`);
    order.statusEmailsSent.paid = true;
  }
  if (order.status === "U pripremi" && beforeStatus !== "U pripremi" && !order.statusEmailsSent.preparing) {
    appendMail(order.customerEmail, `Cuneri narudzba ${order.id} - paket u pripremi`, `Tvoja narudzba ${order.id} je u pripremi. Javit cemo ti kada paket bude poslan.`);
    order.statusEmailsSent.preparing = true;
  }
  if (order.status === "Poslana" && beforeStatus !== "Poslana" && !order.statusEmailsSent.sent) {
    appendMail(order.customerEmail, `Cuneri narudzba ${order.id} - paket poslan`, `Tvoja narudzba ${order.id} je poslana.\nSluzba: ${order.trackingCarrier || "-"}\nTracking kod: ${order.trackingCode || "-"}\n\nHvala na narudzbi.`);
    order.statusEmailsSent.sent = true;
  }
}

async function api(req, res, url) {
  const db = readDb();
  const method = req.method;
  const route = url.pathname;

  try {
    if (method === "GET" && route === "/api/public") {
      const viewer = currentUser(req, db);
      return sendJson(res, 200, {
        settings: db.settings,
        members: db.members,
        events: db.events.map(event => {
          const { organizerEmail, ...publicEvent } = event;
          const canSeeAttendees = !event.clubMeet || canManageMeets(viewer);
          const visibleAttendees = canSeeAttendees
            ? publicAttendees(event, db, canManageMeets(viewer))
            : publicAttendees(event).filter(attendee => viewer && attendee.userId === viewer.id);
          return {
            ...publicEvent,
            attendeeCount: (event.attendees || []).length,
            canManageMeet: canManageMeets(viewer),
            canAdminMeet: canAdminMeets(viewer),
            attendees: visibleAttendees.map(attendee => ({
              ...attendee,
              mine: Boolean(viewer && attendee.userId === viewer.id)
            }))
          };
        }),
        posts: db.posts,
        sponsors: db.sponsors,
        weather: db.weather,
        products: db.products.filter(product => product.active !== false && Number(product.stock) > 0)
      });
    }

    if (method === "POST" && route === "/api/shop/register") {
      const body = await parseBody(req);
      if (!body.firstName || !body.lastName || !body.email || !body.password || String(body.password).length < 8) return sendJson(res, 400, { error: "Ime, prezime, email i lozinka od najmanje 8 znakova su obavezni." });
      if (body.password !== body.passwordConfirm) return sendJson(res, 400, { error: "Lozinke nisu jednake." });
      if (db.users.some(user => String(user.email).toLowerCase() === String(body.email).toLowerCase())) return sendJson(res, 409, { error: "Korisnik s tim emailom vec postoji." });
      const user = { id: slug("u"), email: body.email, username: body.email, name: `${body.firstName} ${body.lastName}`, role: "customer", shopAccess: true, garageAccess: false, passwordHash: hashPassword(body.password), mustChangePassword: false, shopProfile: { firstName: body.firstName, lastName: body.lastName }, createdAt: new Date().toISOString() };
      db.users.push(user);
      saveDb(db);
      appendMail(body.email, "Cuneri webshop - registracija", `Pozdrav ${body.firstName},\n\nTvoj Cuneri webshop racun je otvoren za email ${body.email}.\n\nMozes se prijaviti i pratiti svoje narudzbe.`);
      appendMail(db.settings.clubEmail || CLUB_EMAIL, "Novi webshop korisnik", `${body.firstName} ${body.lastName} otvorio/la je webshop racun.\nEmail: ${body.email}`, { replyTo: body.email });
      return sendJson(res, 201, { ok: true });
    }

    if (method === "POST" && route === "/api/shop/reset-password") {
      const body = await parseBody(req);
      const user = db.users.find(item => String(item.email).toLowerCase() === String(body.email || "").toLowerCase());
      if (user) {
        const temporary = `shop-${crypto.randomBytes(4).toString("hex")}`;
        user.passwordHash = hashPassword(temporary);
        user.mustChangePassword = true;
        saveDb(db);
        appendMail(user.email, "Cuneri webshop - reset lozinke", `Privremena lozinka: ${temporary}`);
      }
      return sendJson(res, 200, { ok: true });
    }

    if (route.startsWith("/api/shop/account")) {
      const user = requireUser(req, res, db);
      if (!user) return;
      if (method === "GET" && route === "/api/shop/account") return sendJson(res, 200, { profile: user.shopProfile || {}, orders: db.orders.filter(order => order.userId === user.id) });
      if (method === "PUT" && route === "/api/shop/account") {
        const body = await parseBody(req);
        user.shopProfile = { firstName: body.firstName || "", lastName: body.lastName || "", phoneCountryCode: body.phoneCountryCode || "+385", phone: body.phone || "", deliveryType: body.deliveryType || "address", address: body.address || "", city: body.city || "", postalCode: body.postalCode || "", parcelService: body.parcelService || "", parcelLocker: body.parcelLocker || "" };
        saveDb(db);
        return sendJson(res, 200, { profile: user.shopProfile });
      }
      if (method === "POST" && route === "/api/shop/order") {
        if (db.settings.webshopSeizedMode) return sendJson(res, 423, { error: "Webshop je trenutno u izradi. Narudzbe su privremeno zaustavljene." });
        const body = await parseBody(req);
        const profile = { ...(user.shopProfile || {}), ...(body.profile || {}) };
        profile.deliveryType ||= "address";
        const paymentMethod = body.paymentMethod || profile.paymentMethod || "cod";
        const validationError = validateCheckout(user.email, profile);
        if (validationError) return sendJson(res, 400, { error: validationError });
        if (!Array.isArray(body.items) || !body.items.length) return sendJson(res, 400, { error: "Kosarica je prazna." });
        const items = [];
        for (const requested of body.items) {
          const product = db.products.find(item => item.id === requested.productId && item.active !== false);
          const quantity = Math.max(1, Number(requested.quantity || 1));
          if (!product || Number(product.stock) < quantity) return sendJson(res, 400, { error: "Artikl nije dostupan u trazenoj kolicini." });
          product.stock -= quantity;
          items.push({ productId: product.id, name: product.name, price: Number(product.price), quantity, audience: requested.audience || "", color: requested.color || "", size: requested.size || "" });
        }
        const order = { id: slug("order"), userId: user.id, customerEmail: user.email, profile: { ...profile }, items, total: items.reduce((sum, item) => sum + item.price * item.quantity, 0), paymentMethod, paymentStatus: paymentStatusFor(paymentMethod), status: "Nova", trackingCarrier: "", trackingCode: "", createdAt: new Date().toISOString() };
        db.orders.unshift(order);
        saveDb(db);
        appendMail(user.email, `Cuneri narudzba ${order.id}`, customerOrderMail(order));
        appendMail(db.settings.clubEmail || CLUB_EMAIL, `Nova Cuneri narudzba ${order.id}`, adminOrderMail(order), { replyTo: user.email });
        return sendJson(res, 201, { order });
      }
    }

    if (method === "POST" && route === "/api/shop/order") {
      if (db.settings.webshopSeizedMode) return sendJson(res, 423, { error: "Webshop je trenutno u izradi. Narudzbe su privremeno zaustavljene." });
      const body = await parseBody(req);
      const user = currentUser(req, db);
      if (user && !user.shopAccess && user.role !== "admin") return sendJson(res, 403, { error: "Ovaj racun nema webshop pristup." });
      const profile = user ? { ...(user.shopProfile || {}), ...(body.profile || {}) } : (body.profile || {});
      const customerEmail = user?.email || body.email;
      profile.deliveryType ||= "address";
      const paymentMethod = body.paymentMethod || profile.paymentMethod || "cod";
      const validationError = validateCheckout(customerEmail, profile);
      if (validationError) return sendJson(res, 400, { error: validationError });
      if (!Array.isArray(body.items) || !body.items.length) return sendJson(res, 400, { error: "Kosarica je prazna." });
      const items = [];
      for (const requested of body.items) {
        const product = db.products.find(item => item.id === requested.productId && item.active !== false);
        const quantity = Math.max(1, Number(requested.quantity || 1));
        if (!product || Number(product.stock) < quantity) return sendJson(res, 400, { error: "Artikl nije dostupan u trazenoj kolicini." });
        const sale = Math.max(0, Math.min(100, Number(product.salePercent || 0)));
        const price = Number(product.price) * (1 - sale / 100);
        product.stock -= quantity;
        items.push({ productId: product.id, name: product.name, price, quantity, audience: requested.audience || "", color: requested.color || "", size: requested.size || "" });
      }
      const customerKey = user?.id || String(customerEmail).toLowerCase();
      let coupon = null;
      if (body.couponCode) {
        coupon = db.coupons.find(item => item.active !== false && String(item.code).toUpperCase() === String(body.couponCode).trim().toUpperCase());
        if (!coupon || Number(coupon.usedCount || 0) >= Number(coupon.maxUses || 0)) return sendJson(res, 400, { error: "Kupon nije vazeci ili je potrosen." });
        if (coupon.onePerCustomer && db.couponRedemptions.some(item => item.couponId === coupon.id && item.customerKey === customerKey)) return sendJson(res, 400, { error: "Ovaj kupon je vec iskoristen na tom racunu ili emailu." });
        if (coupon.firstOrderOnly && db.orders.some(order => order.userId === user?.id || String(order.customerEmail).toLowerCase() === String(customerEmail).toLowerCase())) return sendJson(res, 400, { error: "Kupon vrijedi samo za prvu kupnju." });
      }
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount = coupon ? subtotal * Math.max(0, Math.min(100, Number(coupon.percent))) / 100 : 0;
      const order = { id: slug("order"), userId: user?.id || null, customerEmail, profile: { ...profile }, items, subtotal, couponCode: coupon?.code || "", discount, total: subtotal - discount, paymentMethod, paymentStatus: paymentStatusFor(paymentMethod), status: "Nova", trackingCarrier: "", trackingCode: "", createdAt: new Date().toISOString() };
      if (coupon) {
        coupon.usedCount = Number(coupon.usedCount || 0) + 1;
        db.couponRedemptions.push({ couponId: coupon.id, customerKey, orderId: order.id, createdAt: new Date().toISOString() });
      }
      db.orders.unshift(order);
      saveDb(db);
      appendMail(customerEmail, `Cuneri narudzba ${order.id}`, customerOrderMail(order));
      appendMail(db.settings.clubEmail || CLUB_EMAIL, `Nova Cuneri narudzba ${order.id}`, adminOrderMail(order), { replyTo: customerEmail });
      return sendJson(res, 201, { order });
    }

    if (route.startsWith("/api/shop/manage")) {
      const user = requireUser(req, res, db);
      if (!user) return;
      if (!["admin", "shop_manager"].includes(user.role)) return sendJson(res, 403, { error: "Webshop ovlasti su potrebne." });
      if (method === "GET" && route === "/api/shop/manage") return sendJson(res, 200, { products: db.products, orders: db.orders, coupons: db.coupons, settings: db.settings });
      if (method === "PUT" && route === "/api/shop/manage/settings") {
        const body = await parseBody(req);
        db.settings.webshopSeizedMode = body.webshopSeizedMode === true || body.webshopSeizedMode === "true" || body.webshopSeizedMode === "on";
        saveDb(db);
        return sendJson(res, 200, { settings: db.settings });
      }
      if (method === "POST" && route === "/api/shop/manage/upload") {
        const body = await parseBody(req);
        return sendJson(res, 201, { url: saveUpload(body.fileName, body.dataUrl) });
      }
      if (method === "PUT" && route === "/api/shop/manage/products") {
        const body = await parseBody(req);
        if (!Array.isArray(body.products)) return sendJson(res, 400, { error: "Neispravan popis artikala." });
        db.products = body.products.map(product => ({ ...product, id: product.id || slug("prod"), price: Number(product.price || 0), stock: Number(product.stock || 0) }));
        saveDb(db);
        return sendJson(res, 200, { ok: true });
      }
      if (method === "POST" && route === "/api/shop/manage/product") {
        const body = await parseBody(req);
        const product = body.id ? db.products.find(item => item.id === body.id) : null;
        const data = { name: body.name, category: body.category, description: body.description, price: Number(body.price || 0), salePercent: Number(body.salePercent || 0), stock: Number(body.stock || 0), image: body.image || "/assets/cuneri-logo.png", audiences: String(body.audiences || "").split(",").map(v => v.trim()).filter(Boolean), colors: String(body.colors || "").split(",").map(v => v.trim()).filter(Boolean), sizes: String(body.sizes || "").split(",").map(v => v.trim()).filter(Boolean), active: body.active === true || body.active === "true" || body.active === "on" };
        if (product) Object.assign(product, data); else db.products.unshift({ id: slug("prod"), ...data });
        saveDb(db);
        return sendJson(res, 200, { ok: true });
      }
      if (method === "DELETE" && route === "/api/shop/manage/product") {
        const body = await parseBody(req);
        db.products = db.products.filter(item => item.id !== body.id);
        saveDb(db);
        return sendJson(res, 200, { ok: true });
      }
      if (method === "POST" && route === "/api/shop/manage/coupon") {
        const body = await parseBody(req);
        const coupon = body.id ? db.coupons.find(item => item.id === body.id) : null;
        const data = { code: String(body.code || "").trim().toUpperCase(), percent: Number(body.percent || 0), maxUses: Number(body.maxUses || 1), onePerCustomer: true, firstOrderOnly: body.firstOrderOnly === true || body.firstOrderOnly === "on", active: body.active === true || body.active === "on" };
        if (!data.code) return sendJson(res, 400, { error: "Kod kupona je obavezan." });
        if (coupon) Object.assign(coupon, data); else db.coupons.unshift({ id: slug("coupon"), usedCount: 0, ...data });
        saveDb(db);
        return sendJson(res, 200, { ok: true });
      }
      if (method === "PUT" && route === "/api/shop/manage/order") {
        const body = await parseBody(req);
        const order = db.orders.find(item => item.id === body.id);
        if (!order) return sendJson(res, 404, { error: "Narudzba nije pronadena." });
        const beforeStatus = order.status;
        const beforePaymentStatus = order.paymentStatus;
        order.status = body.status || order.status;
        order.paymentStatus = body.paymentStatus || order.paymentStatus || paymentStatusFor(order.paymentMethod || "cod");
        order.trackingCarrier = body.trackingCarrier || order.trackingCarrier || "";
        order.trackingCode = body.trackingCode || order.trackingCode || "";
        maybeSendOrderUpdate(order, beforeStatus, beforePaymentStatus);
        saveDb(db);
        return sendJson(res, 200, { order });
      }
    }

    if (method === "POST" && route === "/api/contact") {
      const body = await parseBody(req);
      if (!body.name || !body.lastName || !body.email || !body.subject || !body.message) {
        return sendJson(res, 400, { error: "Ime, prezime, email, naslov i poruka su obavezni." });
      }
      const item = { id: slug("contact"), ...body, createdAt: new Date().toISOString() };
      db.contacts.unshift(item);
      saveDb(db);
      const mail = contactMailContent(body);
      appendMail(db.settings.clubEmail || CLUB_EMAIL, body.subject, mail.text, { replyTo: body.email, html: mail.html });
      return sendJson(res, 201, { ok: true });
    }

    if (method === "POST" && route === "/api/join") {
      const body = await parseBody(req);
      const item = { id: slug("join"), ...body, createdAt: new Date().toISOString() };
      db.joinRequests.unshift(item);
      saveDb(db);
      appendMail(db.settings.clubEmail || CLUB_EMAIL, "Nova prijava za klub", `${body.name || "Netko"} zeli uci u klub. Email: ${body.email || "-"}`, { replyTo: body.email });
      return sendJson(res, 201, { ok: true });
    }

    if (method === "POST" && route === "/api/event/attend") {
      const body = await parseBody(req);
      const event = db.events.find(item => item.id === body.eventId);
      if (!event) return sendJson(res, 404, { error: "Susret nije pronađen." });
      event.attendees ||= [];
      const user = currentUser(req, db);
      if (event.clubMeet && (!user || (!user.garageAccess && user.role !== "admin"))) {
        return sendJson(res, 403, { error: "Samo prijavljeni clanovi mogu potvrditi dolazak na grupni meet." });
      }
      const member = user ? db.members.find(item => item.userId === user.id) : null;
      const useGuestDetails = !event.clubMeet && body.firstName && body.car && (!member || (!user?.garageAccess && user?.role !== "admin"));
      if (user && !useGuestDetails) {
        if (event.clubMeet && !member) return sendJson(res, 403, { error: "Ovaj racun nema povezan profil clana." });
        const name = member?.name || user.name || user.email || "Clan";
        const car = member?.cars?.find(item => item.id === body.carId) || member?.cars?.[0];
        const carText = car ? car.name : "Auto clana";
        const existing = event.attendees.find(item => item.userId === user.id || item.memberId === member?.id);
        if (!existing) event.attendees.push({ id: slug("a"), memberId: member?.id || "", userId: user.id, name, car: carText, createdAt: new Date().toISOString() });
      } else {
        if (!body.firstName || !body.car) return sendJson(res, 400, { error: "Gost mora upisati ime i auto." });
        const guestName = [body.firstName, body.lastName].filter(Boolean).join(" ");
        event.attendees.push({
          id: slug("a"),
          userId: user?.id || "",
          name: guestName,
          lastName: body.lastName,
          instagram: body.instagram || "",
          car: body.car,
          createdAt: new Date().toISOString()
        });
      }
      saveDb(db);
      return sendJson(res, 201, { attendees: publicAttendees(event) });
    }

    if (route.startsWith("/api/meet-manager")) {
      const user = requireUser(req, res, db);
      if (!user) return;
      if (!canManageMeets(user)) return sendJson(res, 403, { error: "Pristup meet panelu je potreban." });

      if (method === "GET" && route === "/api/meet-manager") {
        return sendJson(res, 200, {
          events: db.events.filter(event => event.clubMeet),
          members: db.members.map(member => ({
            id: member.id,
            userId: member.userId || "",
            name: member.name || member.email || "Clan",
            email: member.email || "",
            cars: member.cars || []
          }))
        });
      }

      if (method === "GET" && route === "/api/meet-manager/event/export") {
        const event = db.events.find(item => item.id === url.searchParams.get("eventId") && item.clubMeet);
        if (!event) return sendJson(res, 404, { error: "Grupni meet nije pronaden." });
        const fileName = `${String(event.title || "meet-popis").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "meet-popis"}.xls`;
        return sendText(res, 200, meetExcel(event, db, req), {
          "Content-Type": "application/vnd.ms-excel; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fileName}"`
        });
      }

      if (method === "POST" && route === "/api/meet-manager/event") {
        if (!canAdminMeets(user)) return sendJson(res, 403, { error: "Samo admin moze dodavati klupski meet." });
        const body = await parseBody(req);
        if (!body.title || !body.location || !body.date || !body.time) return sendJson(res, 400, { error: "Naziv, lokacija, datum i vrijeme su obavezni." });
        const event = normalizeEvent({
          id: slug("e"),
          title: String(body.title).slice(0, 100),
          city: String(body.city || "").slice(0, 60),
          location: String(body.location).slice(0, 180),
          date: body.date,
          time: body.time,
          description: String(body.description || "Cuneri grupni odlazak na meet.").slice(0, 1200),
          image: body.image || "/assets/meet-lineup.svg",
          clubMeet: true,
          organizerName: user.name || user.email,
          organizerEmail: user.email,
          createdAt: new Date().toISOString(),
          attendees: []
        });
        db.events.push(event);
        saveDb(db);
        return sendJson(res, 201, { event });
      }

      if (method === "PUT" && route === "/api/meet-manager/event") {
        if (!canAdminMeets(user)) return sendJson(res, 403, { error: "Samo admin moze pretvoriti event u klupski meet." });
        const body = await parseBody(req);
        const event = db.events.find(item => item.id === body.eventId);
        if (!event) return sendJson(res, 404, { error: "Meet nije pronaden." });
        event.clubMeet = body.clubMeet === true || body.clubMeet === "true" || body.clubMeet === "on";
        event.attendees ||= [];
        saveDb(db);
        return sendJson(res, 200, { event });
      }

      if (method === "PUT" && route === "/api/meet-manager/attendee") {
        if (!canAdminMeets(user)) return sendJson(res, 403, { error: "Samo admin moze mijenjati clanove na popisu." });
        const body = await parseBody(req);
        const event = db.events.find(item => item.id === body.eventId && item.clubMeet);
        if (!event) return sendJson(res, 404, { error: "Grupni meet nije pronaden." });
        event.attendees ||= [];
        if (body.action === "remove") {
          event.attendees = event.attendees.filter(item => item.id !== body.attendeeId && item.memberId !== body.memberId);
        } else {
          const member = db.members.find(item => item.id === body.memberId);
          if (!member) return sendJson(res, 404, { error: "Clan nije pronaden." });
          const existing = event.attendees.find(item => item.memberId === member.id || item.userId && item.userId === member.userId);
          if (!existing) event.attendees.push(attendeeFromMember(member, body.carId));
        }
        saveDb(db);
        return sendJson(res, 200, { event });
      }
    }

    if (method === "POST" && route === "/api/event") {
      const body = await parseBody(req);
      if (!body.title || !body.location || !body.date || !body.time || !body.description || !body.organizerName || !body.organizerEmail) {
        return sendJson(res, 400, { error: "Naziv, lokacija, datum, vrijeme, opis i kontakt organizatora su obavezni." });
      }
      const event = normalizeEvent({
        id: slug("e"),
        title: String(body.title).slice(0, 100),
        city: String(body.city || "").slice(0, 60),
        location: String(body.location).slice(0, 180),
        date: body.date,
        time: body.time,
        description: String(body.description).slice(0, 1200),
        image: "/assets/meet-lineup.svg",
        organizerName: String(body.organizerName).slice(0, 100),
        organizerEmail: String(body.organizerEmail).slice(0, 160),
        submittedByUserId: currentUser(req, db)?.id || null,
        submittedPublicly: true,
        createdAt: new Date().toISOString(),
        attendees: []
      });
      db.events.push(event);
      saveDb(db);
      appendMail(db.settings.clubEmail || CLUB_EMAIL, `Novi javni event: ${event.title}`, `${event.organizerName} (${event.organizerEmail}) dodao je event na lokaciji ${event.location}.`, { replyTo: event.organizerEmail });
      return sendJson(res, 201, { event: { ...event, attendees: [] } });
    }

    if (method === "POST" && route === "/api/login") {
      const { email, username, password, loginMode } = await parseBody(req);
      const login = String(username || email || "").toLowerCase();
      const user = db.users.find(u =>
        String(u.email || "").toLowerCase() === login ||
        String(u.username || "").toLowerCase() === login ||
        (login === "admin" && u.role === "admin")
      );
      if (!user || !verifyPassword(password || "", user.passwordHash)) return sendJson(res, 401, { error: "Krivi email ili lozinka." });
      if (loginMode === "admin" && !["admin", "shop_manager", "meet_manager"].includes(user.role) && !user.meetAccess) return sendJson(res, 403, { error: "Ovaj email nema pristup admin, webshop ili meet panelu." });
      if (loginMode === "garage" && !user.garageAccess && user.role !== "admin") return sendJson(res, 403, { error: "Ovaj email nema pristup garazi clanova." });
      if (loginMode === "shop" && !user.shopAccess && user.role !== "admin") return sendJson(res, 403, { error: "Ovaj email nema pristup webshop racunu." });
      const sid = crypto.randomUUID();
      sessions.set(sid, { userId: user.id, loginMode: loginMode || "", createdAt: Date.now(), lastSeenAt: Date.now(), userAgent: req.headers["user-agent"] || "", ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "" });
      saveSessions();
      res.setHeader("Set-Cookie", `cuneri_sid=${encodeURIComponent(sid)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`);
      return sendJson(res, 200, { user: publicUser(user) });
    }

    if (method === "POST" && route === "/api/logout") {
      const sid = getCookie(req, "cuneri_sid");
      if (sid) sessions.delete(sid);
      saveSessions();
      res.setHeader("Set-Cookie", "cuneri_sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
      return sendJson(res, 200, { ok: true });
    }

    if (method === "GET" && route === "/api/me") {
      return sendJson(res, 200, { user: publicUser(currentUser(req, db)) });
    }

    if (method === "POST" && route === "/api/change-password") {
      const user = requireUser(req, res, db);
      if (!user) return;
      const { password } = await parseBody(req);
      if (!password || password.length < 8) return sendJson(res, 400, { error: "Lozinka mora imati barem 8 znakova." });
      user.passwordHash = hashPassword(password);
      user.mustChangePassword = false;
      saveDb(db);
      return sendJson(res, 200, { user: publicUser(user) });
    }

    if (method === "PUT" && route === "/api/profile") {
      const user = requireUser(req, res, db);
      if (!user) return;
      if (user.mustChangePassword) return sendJson(res, 403, { error: "Najprije promijeni privremenu lozinku." });
      const body = await parseBody(req);
      const profile = {
        firstName: String(body.firstName || "").trim(),
        lastName: String(body.lastName || "").trim(),
        phoneCountryCode: String(body.phoneCountryCode || "+385").trim(),
        phone: String(body.phone || "").trim(),
        address: String(body.address || "").trim(),
        city: String(body.city || "").trim(),
        postalCode: String(body.postalCode || "").trim(),
        note: String(body.note || "").trim()
      };
      user.name = String(body.name || `${profile.firstName} ${profile.lastName}`.trim() || user.name || user.email).trim();
      user.profileImage = body.removeProfileImage ? "" : String(body.profileImage || user.profileImage || "").trim();
      user.coverImage = body.removeCoverImage ? "" : String(body.coverImage || user.coverImage || "").trim();
      user.profile = profile;
      user.shopProfile = { ...(user.shopProfile || {}), ...profile };
      const member = db.members.find(item => item.userId === user.id);
      if (member) {
        member.name = user.name;
        member.email = user.email;
        member.profileImage = user.profileImage || "";
        member.coverImage = user.coverImage || "";
      }
      saveDb(db);
      return sendJson(res, 200, { user: publicUser(user) });
    }

    if (method === "POST" && route === "/api/profile/upload") {
      const user = requireUser(req, res, db);
      if (!user) return;
      if (user.mustChangePassword) return sendJson(res, 403, { error: "Najprije promijeni privremenu lozinku." });
      const body = await parseBody(req);
      const url = saveUpload(body.fileName, body.dataUrl);
      return sendJson(res, 201, { url });
    }

    if (route.startsWith("/api/admin")) {
      const user = requireUser(req, res, db);
      if (!user) return;
      if (user.mustChangePassword && route !== "/api/change-password") return sendJson(res, 403, { error: "Najprije promijeni privremenu lozinku." });
      if (user.role !== "admin") return sendJson(res, 403, { error: "Admin pristup je potreban." });

      if (method === "GET" && route === "/api/admin/dashboard") {
        return sendJson(res, 200, {
          users: db.users.map(publicUser),
          activeUsers: activeUsers(db),
          settings: db.settings,
          members: db.members,
          events: db.events,
          posts: db.posts,
          sponsors: db.sponsors,
          contacts: db.contacts,
          joinRequests: db.joinRequests,
          inbox: JSON.parse(fs.readFileSync(INBOX_FILE, "utf8").replace(/^\uFEFF/, ""))
        });
      }

      if (method === "PUT" && route === "/api/admin/access") {
        const body = await parseBody(req);
        const target = db.users.find(item => item.id === body.id);
        if (!target) return sendJson(res, 404, { error: "Korisnik nije pronaden." });
        target.shopAccess = body.shopAccess === true || body.shopAccess === "on";
        target.garageAccess = body.garageAccess === true || body.garageAccess === "on";
        if (target.garageAccess) {
          target.shopAccess = true;
          if (target.role === "customer") target.role = "member";
          ensureMemberProfile(db, target);
        } else if (target.role === "member") {
          target.role = "customer";
          db.members = db.members.filter(item => item.userId !== target.id);
        }
        target.meetAccess = body.meetAccess === true || body.meetAccess === "on" || ["admin", "meet_manager"].includes(target.role);
        saveDb(db);
        return sendJson(res, 200, { user: publicUser(target) });
      }

      if (method === "PUT" && route === "/api/admin/user") {
        const body = await parseBody(req);
        const target = db.users.find(item => item.id === body.id);
        if (!target) return sendJson(res, 404, { error: "Korisnik nije pronaden." });
        const nextRole = ["admin", "shop_manager", "meet_manager", "member", "customer"].includes(body.role) ? body.role : target.role;
        if (target.id === user.id && nextRole !== "admin") return sendJson(res, 400, { error: "Ne mozes sam sebi maknuti admin ovlasti." });
        if (target.role === "admin" && nextRole !== "admin" && db.users.filter(item => item.role === "admin").length <= 1) return sendJson(res, 400, { error: "Mora ostati barem jedan admin." });
        target.name = body.name || target.name || target.email;
        target.email = body.email || target.email;
        target.username = body.username || target.username || target.email;
        target.role = nextRole;
        target.shopAccess = body.shopAccess === true || body.shopAccess === "on";
        target.garageAccess = body.garageAccess === true || body.garageAccess === "on";
        if (target.garageAccess) {
          target.shopAccess = true;
          if (target.role === "customer") target.role = "member";
        } else if (target.role === "member") {
          target.role = "customer";
        }
        target.meetAccess = body.meetAccess === true || body.meetAccess === "on" || nextRole === "admin" || nextRole === "meet_manager";
        target.mustChangePassword = body.mustChangePassword === true || body.mustChangePassword === "on";
        target.profileImage = body.removeProfileImage ? "" : String(body.profileImage || target.profileImage || "").trim();
        target.coverImage = body.removeCoverImage ? "" : String(body.coverImage || target.coverImage || "").trim();
        target.profile = {
          firstName: String(body.firstName ?? target.profile?.firstName ?? "").trim(),
          lastName: String(body.lastName ?? target.profile?.lastName ?? "").trim(),
          phoneCountryCode: String(body.phoneCountryCode ?? target.profile?.phoneCountryCode ?? "+385").trim(),
          phone: String(body.phone ?? target.profile?.phone ?? "").trim(),
          address: String(body.address ?? target.profile?.address ?? "").trim(),
          city: String(body.city ?? target.profile?.city ?? "").trim(),
          postalCode: String(body.postalCode ?? target.profile?.postalCode ?? "").trim(),
          note: String(body.note ?? target.profile?.note ?? "").trim()
        };
        target.shopProfile = { ...(target.shopProfile || {}), ...target.profile };

        if (target.garageAccess && body.member) {
          ensureMemberProfile(db, target, {
            name: body.member.name || target.name || target.email,
            email: body.member.email || target.email,
            instagram: body.member.instagram || "",
            tiktok: body.member.tiktok || "",
            bio: body.member.bio || "",
            bioEn: body.member.bioEn || "",
            competitions: body.member.competitions || "",
            competitionsEn: body.member.competitionsEn || "",
            cars: Array.isArray(body.member.cars) ? body.member.cars.map(car => ({
            id: car.id || slug("c"),
            name: car.name || "Auto",
            cover: car.cover || "/assets/hero-garage.svg",
            images: Array.isArray(car.images) ? car.images : String(car.images || "").split(",").map(item => item.trim()).filter(Boolean),
            mods: car.mods || "",
            modsEn: car.modsEn || "",
            details: car.details || "",
            detailsEn: car.detailsEn || "",
            competesIn: car.competesIn || "",
            competesInEn: car.competesInEn || ""
            })).filter(car => car.name.trim()) : []
          });
        }

        if (!target.garageAccess || body.deleteMemberProfile === true) db.members = db.members.filter(item => item.userId !== target.id);
        saveDb(db);
        return sendJson(res, 200, { user: publicUser(target), member: db.members.find(item => item.userId === target.id) || null });
      }

      if (method === "DELETE" && route === "/api/admin/user") {
        const body = await parseBody(req);
        const target = db.users.find(item => item.id === body.id);
        if (!target) return sendJson(res, 404, { error: "Korisnik nije pronaden." });
        if (target.id === user.id) return sendJson(res, 400, { error: "Ne mozes obrisati samog sebe." });
        if (target.role === "admin" && db.users.filter(item => item.role === "admin").length <= 1) return sendJson(res, 400, { error: "Ne mozes obrisati zadnjeg admina." });
        db.users = db.users.filter(item => item.id !== target.id);
        db.members = (db.members || []).filter(member => member.userId !== target.id);
        for (const [sid, session] of sessions.entries()) {
          if (session.userId === target.id) sessions.delete(sid);
        }
        saveSessions();
        saveDb(db);
        return sendJson(res, 200, { ok: true });
      }

      if (method === "POST" && route === "/api/admin/member") {
        const body = await parseBody(req);
        const tempPassword = body.tempPassword || "ulaz123ulaz";
        const identifier = String(body.identifier || body.email || body.username || "").trim();
        if (!identifier) return sendJson(res, 400, { error: "Upisi email ili username." });
        const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(identifier);
        const email = isEmail ? identifier.toLowerCase() : "";
        const username = String(body.username || (isEmail ? identifier.split("@")[0] : identifier)).trim().toLowerCase();
        if (!username) return sendJson(res, 400, { error: "Username nije ispravan." });
        if (email && db.users.some(item => String(item.email || "").toLowerCase() === email)) return sendJson(res, 409, { error: "Korisnik s tim emailom vec postoji." });
        if (db.users.some(item => String(item.username || "").toLowerCase() === username)) return sendJson(res, 409, { error: "Korisnik s tim usernameom vec postoji." });
        const shopAccess = body.shopAccess === true || body.shopAccess === "on" || body.garageAccess === true || body.garageAccess === "on";
        const garageAccess = body.garageAccess === true || body.garageAccess === "on";
        const adminAccess = body.adminAccess === true || body.adminAccess === "on";
        const meetAccess = body.meetAccess === true || body.meetAccess === "on" || adminAccess;
        const role = adminAccess ? "admin" : meetAccess ? "meet_manager" : garageAccess ? "member" : "customer";
        const userId = slug("u");
        const newUser = {
          id: userId,
          email,
          username,
          name: String(body.displayName || identifier).trim(),
          role,
          shopAccess,
          garageAccess,
          meetAccess,
          passwordHash: hashPassword(tempPassword),
          mustChangePassword: true,
          createdAt: new Date().toISOString()
        };
        db.users.push(newUser);
        let member = null;
        if (garageAccess) {
          member = {
            id: slug("m"),
            userId,
            name: newUser.name,
            email: email || username,
            instagram: "",
            tiktok: "",
            bio: "",
            competitions: "",
            cars: []
          };
          db.members.unshift(member);
        }
        saveDb(db);
        if (email) appendMail(email, "Tuning Crew Cuneri pristup", `Login: ${email}\nUsername: ${username}\nPrivremena lozinka: ${tempPassword}\nNakon prijave moras odmah promijeniti lozinku.`);
        return sendJson(res, 201, { user: publicUser(newUser), member });
      }

      if (method === "POST" && route === "/api/admin/reset-password") {
        const body = await parseBody(req);
        const lookup = String(body.email || body.username || "").toLowerCase();
        const target = db.users.find(item => item.id === body.userId || String(item.email || "").toLowerCase() === lookup || String(item.username || "").toLowerCase() === lookup);
        if (!target) return sendJson(res, 404, { error: "Korisnik nije pronađen." });
        if (!body.password || String(body.password).length < 8) return sendJson(res, 400, { error: "Lozinka mora imati barem 8 znakova." });
        target.passwordHash = hashPassword(body.password);
        target.mustChangePassword = true;
        saveDb(db);
        if (target.email) appendMail(target.email, "Tuning Crew Cuneri nova privremena lozinka", `Login: ${target.email || target.username}\nPrivremena lozinka: ${body.password}\nNakon prijave moras odmah promijeniti lozinku.`);
        return sendJson(res, 200, { ok: true });
      }

      if (method === "POST" && route === "/api/admin/upload") {
        const body = await parseBody(req);
        const url = saveUpload(body.fileName, body.dataUrl);
        return sendJson(res, 201, { url });
      }

      if (method === "PUT" && route === "/api/admin/data") {
        const body = await parseBody(req);
        for (const key of ["members", "events", "posts", "sponsors", "settings"]) {
          if (Object.prototype.hasOwnProperty.call(body, key)) db[key] = body[key];
        }
        db.events = (db.events || []).map(normalizeEvent);
        saveDb(db);
        return sendJson(res, 200, { ok: true });
      }
    }

    if (route.startsWith("/api/member")) {
      const user = requireUser(req, res, db);
      if (!user) return;
      if (user.mustChangePassword) return sendJson(res, 403, { error: "Najprije promijeni privremenu lozinku." });
      const member = db.members.find(m => m.userId === user.id);
      if (method === "GET" && route === "/api/member/profile") return sendJson(res, 200, { member });
      if (method === "PUT" && route === "/api/member/profile") {
        if (!member) return sendJson(res, 404, { error: "Profil člana nije pronađen." });
        const body = await parseBody(req);
        Object.assign(member, body, { id: member.id, userId: member.userId, email: member.email });
        saveDb(db);
        return sendJson(res, 200, { member });
      }
    }

    return sendJson(res, 404, { error: "API route not found" });
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
}

function serveStatic(req, res, url) {
  let filePath = decodeURIComponent(url.pathname);
  if (filePath === "/") filePath = "/index.html";
  if (filePath.startsWith("/uploads/")) {
    const uploadPath = path.normalize(path.join(UPLOAD_DIR, filePath.replace(/^\/uploads\//, "")));
    if (!uploadPath.startsWith(UPLOAD_DIR)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    if (!fs.existsSync(uploadPath) || fs.statSync(uploadPath).isDirectory()) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": types[path.extname(uploadPath).toLowerCase()] || "application/octet-stream" });
    return fs.createReadStream(uploadPath).pipe(res);
  }
  const absolute = path.normalize(path.join(PUBLIC_DIR, filePath));
  if (!absolute.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  if (!fs.existsSync(absolute) || fs.statSync(absolute).isDirectory()) {
    return fs.createReadStream(path.join(PUBLIC_DIR, "index.html")).pipe(res);
  }
  res.writeHead(200, { "Content-Type": types[path.extname(absolute).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(absolute).pipe(res);
}

ensureData();
loadSessions();

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) return api(req, res, url);
  return serveStatic(req, res, url);
}).listen(PORT, () => {
  console.log(`Tuning Crew Ćuneri radi na http://localhost:${PORT}`);
});
