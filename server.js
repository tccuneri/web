const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads");
const DB_FILE = path.join(DATA_DIR, "db.json");
const INBOX_FILE = path.join(DATA_DIR, "email-inbox.json");
const sessions = new Map();

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

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
        clubEmail: "info@cuneri.hr",
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
  const shopManagers = [
    { id: "u-shop-1", username: "shop1", email: "shop1@cuneri.hr", name: "Webshop moderator 1" },
    { id: "u-shop-2", username: "shop2", email: "shop2@cuneri.hr", name: "Webshop moderator 2" }
  ];
  for (const manager of shopManagers) {
    if (!db.users.some(user => user.id === manager.id)) db.users.push({ ...manager, role: "shop_manager", passwordHash: hashPassword("shop12345"), mustChangePassword: false, createdAt: new Date().toISOString() });
  }
  for (const user of db.users) {
    user.shopAccess ??= ["admin", "shop_manager", "member", "customer"].includes(user.role);
    user.garageAccess ??= ["admin", "member"].includes(user.role);
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

function currentUser(req, db) {
  const sid = getCookie(req, "cuneri_sid");
  const session = sid && sessions.get(sid);
  return session ? db.users.find(user => user.id === session.userId) : null;
}

function requireUser(req, res, db) {
  const user = currentUser(req, db);
  if (!user) sendJson(res, 401, { error: "Not authenticated" });
  return user;
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

function appendMail(to, subject, text) {
  const inbox = JSON.parse(fs.readFileSync(INBOX_FILE, "utf8").replace(/^\uFEFF/, ""));
  inbox.unshift({ id: crypto.randomUUID(), to, subject, text, createdAt: new Date().toISOString() });
  fs.writeFileSync(INBOX_FILE, JSON.stringify(inbox, null, 2));
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

function publicAttendees(event) {
  return (event.attendees || []).map(item => ({
    id: item.id,
    name: item.name || "Gost",
    car: item.car || "Auto"
  }));
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
          return {
            ...publicEvent,
            attendees: publicAttendees(event).map((attendee, index) => ({
              ...attendee,
              mine: Boolean(viewer && event.attendees[index]?.userId === viewer.id)
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
        user.shopProfile = { firstName: body.firstName || "", lastName: body.lastName || "", phone: body.phone || "", deliveryType: body.deliveryType || "address", address: body.address || "", city: body.city || "", postalCode: body.postalCode || "", parcelService: body.parcelService || "", parcelLocker: body.parcelLocker || "" };
        saveDb(db);
        return sendJson(res, 200, { profile: user.shopProfile });
      }
      if (method === "POST" && route === "/api/shop/order") {
        const body = await parseBody(req);
        const profile = user.shopProfile || {};
        if (!profile.firstName || !profile.lastName || !profile.phone || (!profile.address && !profile.parcelLocker)) return sendJson(res, 400, { error: "Najprije spremi potpune podatke za dostavu." });
        if (!Array.isArray(body.items) || !body.items.length) return sendJson(res, 400, { error: "Kosarica je prazna." });
        const items = [];
        for (const requested of body.items) {
          const product = db.products.find(item => item.id === requested.productId && item.active !== false);
          const quantity = Math.max(1, Number(requested.quantity || 1));
          if (!product || Number(product.stock) < quantity) return sendJson(res, 400, { error: "Artikl nije dostupan u trazenoj kolicini." });
          product.stock -= quantity;
          items.push({ productId: product.id, name: product.name, price: Number(product.price), quantity, audience: requested.audience || "", color: requested.color || "", size: requested.size || "" });
        }
        const order = { id: slug("order"), userId: user.id, customerEmail: user.email, profile: { ...profile }, items, total: items.reduce((sum, item) => sum + item.price * item.quantity, 0), status: "Nova", createdAt: new Date().toISOString() };
        db.orders.unshift(order);
        saveDb(db);
        appendMail(user.email, `Cuneri narudzba ${order.id}`, `Narudzba je zaprimljena. Ukupno: ${order.total.toFixed(2)} EUR (PDV ukljucen).`);
        return sendJson(res, 201, { order });
      }
    }

    if (method === "POST" && route === "/api/shop/order") {
      const body = await parseBody(req);
      const user = currentUser(req, db);
      if (user && !user.shopAccess && user.role !== "admin") return sendJson(res, 403, { error: "Ovaj racun nema webshop pristup." });
      const profile = user ? { ...(user.shopProfile || {}), ...(body.profile || {}) } : (body.profile || {});
      const customerEmail = user?.email || body.email;
      if (!customerEmail || !profile.firstName || !profile.lastName || !profile.phone || (!profile.address && !profile.parcelLocker)) return sendJson(res, 400, { error: "Upisi email i potpune podatke za dostavu ili paketomat." });
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
      const order = { id: slug("order"), userId: user?.id || null, customerEmail, profile: { ...profile }, items, subtotal, couponCode: coupon?.code || "", discount, total: subtotal - discount, status: "Nova", createdAt: new Date().toISOString() };
      if (coupon) {
        coupon.usedCount = Number(coupon.usedCount || 0) + 1;
        db.couponRedemptions.push({ couponId: coupon.id, customerKey, orderId: order.id, createdAt: new Date().toISOString() });
      }
      db.orders.unshift(order);
      saveDb(db);
      appendMail(customerEmail, `Cuneri narudzba ${order.id}`, `Narudzba je zaprimljena. Ukupno: ${order.total.toFixed(2)} EUR (PDV ukljucen).`);
      return sendJson(res, 201, { order });
    }

    if (route.startsWith("/api/shop/manage")) {
      const user = requireUser(req, res, db);
      if (!user) return;
      if (!["admin", "shop_manager"].includes(user.role)) return sendJson(res, 403, { error: "Webshop ovlasti su potrebne." });
      if (method === "GET" && route === "/api/shop/manage") return sendJson(res, 200, { products: db.products, orders: db.orders, coupons: db.coupons });
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
        order.status = body.status || order.status;
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
      appendMail(db.settings.clubEmail, body.subject, `${body.name} ${body.lastName}${body.company ? ` (${body.company})` : ""}\n${body.email}\n\n${body.message}`);
      return sendJson(res, 201, { ok: true });
    }

    if (method === "POST" && route === "/api/join") {
      const body = await parseBody(req);
      const item = { id: slug("join"), ...body, createdAt: new Date().toISOString() };
      db.joinRequests.unshift(item);
      saveDb(db);
      appendMail(db.settings.clubEmail, "Nova prijava za klub", `${body.name || "Netko"} želi ući u klub. Email: ${body.email || "-"}`);
      return sendJson(res, 201, { ok: true });
    }

    if (method === "POST" && route === "/api/event/attend") {
      const body = await parseBody(req);
      const event = db.events.find(item => item.id === body.eventId);
      if (!event) return sendJson(res, 404, { error: "Susret nije pronađen." });
      event.attendees ||= [];
      const user = currentUser(req, db);
      if (user) {
        const member = db.members.find(item => item.userId === user.id);
        const name = (member?.name || user.name || user.email || "Član").split(" ")[0];
        const car = member?.cars?.find(item => item.id === body.carId) || member?.cars?.[0];
        const carText = car ? car.name : "Auto člana";
        const existing = event.attendees.find(item => item.userId === user.id);
        if (!existing) event.attendees.push({ id: slug("a"), userId: user.id, name, car: carText, createdAt: new Date().toISOString() });
      } else {
        if (!body.firstName || !body.lastName || !body.car) return sendJson(res, 400, { error: "Gost mora upisati ime, prezime i auto." });
        event.attendees.push({
          id: slug("a"),
          name: body.firstName,
          lastName: body.lastName,
          instagram: body.instagram || "",
          car: body.car,
          createdAt: new Date().toISOString()
        });
      }
      saveDb(db);
      return sendJson(res, 201, { attendees: publicAttendees(event) });
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
      appendMail(db.settings.clubEmail, `Novi javni event: ${event.title}`, `${event.organizerName} (${event.organizerEmail}) dodao je event na lokaciji ${event.location}.`);
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
      if (loginMode === "garage" && !user.garageAccess && user.role !== "admin") return sendJson(res, 403, { error: "Ovaj email nema pristup garazi clanova." });
      if (loginMode === "shop" && !user.shopAccess && user.role !== "admin") return sendJson(res, 403, { error: "Ovaj email nema pristup webshop racunu." });
      const sid = crypto.randomUUID();
      sessions.set(sid, { userId: user.id, createdAt: Date.now() });
      res.setHeader("Set-Cookie", `cuneri_sid=${encodeURIComponent(sid)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`);
      return sendJson(res, 200, { user: publicUser(user) });
    }

    if (method === "POST" && route === "/api/logout") {
      const sid = getCookie(req, "cuneri_sid");
      if (sid) sessions.delete(sid);
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

    if (route.startsWith("/api/admin")) {
      const user = requireUser(req, res, db);
      if (!user) return;
      if (user.mustChangePassword && route !== "/api/change-password") return sendJson(res, 403, { error: "Najprije promijeni privremenu lozinku." });
      if (user.role !== "admin") return sendJson(res, 403, { error: "Admin pristup je potreban." });

      if (method === "GET" && route === "/api/admin/dashboard") {
        return sendJson(res, 200, {
          users: db.users.map(publicUser),
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
        saveDb(db);
        return sendJson(res, 200, { user: publicUser(target) });
      }

      if (method === "POST" && route === "/api/admin/member") {
        const body = await parseBody(req);
        const tempPassword = body.tempPassword || "ulaz123ulaz";
        const userId = slug("u");
        const memberId = slug("m");
        const newUser = {
          id: userId,
          email: body.email,
          name: body.email,
          role: "member",
          passwordHash: hashPassword(tempPassword),
          mustChangePassword: true,
          createdAt: new Date().toISOString()
        };
        const member = {
          id: memberId,
          userId,
          name: body.email,
          email: body.email,
          instagram: "",
          tiktok: "",
          bio: "",
          competitions: "",
          cars: []
        };
        db.users.push(newUser);
        db.members.unshift(member);
        saveDb(db);
        appendMail(body.email, "Tuning Crew Ćuneri pristup", `Email: ${body.email}\nPrivremena lozinka: ${tempPassword}\nNakon prijave moraš odmah promijeniti lozinku.`);
        return sendJson(res, 201, { user: publicUser(newUser), member });
      }

      if (method === "POST" && route === "/api/admin/reset-password") {
        const body = await parseBody(req);
        const target = db.users.find(item => item.id === body.userId || item.email === body.email);
        if (!target) return sendJson(res, 404, { error: "Korisnik nije pronađen." });
        if (!body.password || String(body.password).length < 8) return sendJson(res, 400, { error: "Lozinka mora imati barem 8 znakova." });
        target.passwordHash = hashPassword(body.password);
        target.mustChangePassword = true;
        saveDb(db);
        appendMail(target.email, "Tuning Crew Ćuneri nova privremena lozinka", `Email: ${target.email}\nPrivremena lozinka: ${body.password}\nNakon prijave moraš odmah promijeniti lozinku.`);
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

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) return api(req, res, url);
  return serveStatic(req, res, url);
}).listen(PORT, () => {
  console.log(`Tuning Crew Ćuneri radi na http://localhost:${PORT}`);
});
