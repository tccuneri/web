const state = {
  lang: localStorage.getItem("cuneri_lang") || "hr",
  data: null,
  user: null,
  heroIndex: 0,
  cart: JSON.parse(localStorage.getItem("cuneri_cart") || "[]"),
  forecast: {
    status: "idle",
    items: [],
    source: "",
    updatedAt: "",
    error: ""
  }
};

const t = {
  hr: {
    "nav.home": "Naslovnica",
    "nav.members": "Članovi",
    "nav.maps": "Mapa susreta",
    "nav.history": "Povijest",
    "nav.contact": "Kontakt",
    heroKicker: "Hrvatski autoklub • Est. 2024",
    heroTitle: "Tuning Crew Ćuneri",
    heroText: "Mjesto za aute s karakterom, ljude koji znaju što voze i susrete koji ostaju u glavi dugo nakon gašenja motora.",
    join: "Pošalji prijavu",
    seeMembers: "Vidi članove",
    aboutTitle: "O klubu",
    aboutSide: "Članovi mogu uređivati svoje profile i automobile nakon promjene privremene lozinke.",
    clubMembers: "membera kluba",
    visitedMeets: "Susreta koji smo posjetili",
    soonMeet: "SOON Ćuner meet!!!",
    historyTitle: "Povijest autokluba",
    historyText: "Klub je star 2 godine, ali priča je već dovoljno duga da zaslužuje svoju stranicu.",
    historyAdmin: "Admin može mijenjati tekst i slike povijesti kroz podatke weba.",
    interested: "Želiš u klub?",
    name: "Ime",
    lastName: "Prezime",
    company: "Firma (nije obavezno)",
    subject: "Naslov emaila",
    email: "Email",
    message: "Poruka",
    car: "Auto / projekt",
    send: "Pošalji",
    membersTitle: "Članovi i auti",
    membersText: "Grid je responzivan za mobitel, tablet i desktop. Jedan član može imati više automobila.",
    more: "Više",
    close: "Zatvori",
    mods: "Modifikacije",
    competes: "Natječe se",
    contactTitle: "Kontakt",
    contactText: "Pošalji poruku klubu. Odgovor stiže preko službenog klupskog emaila.",
    mapsTitle: "Mapa susreta",
    mapsText: "Admin dodaje evente, lokacije, datum, vrijeme i opis. Logirani korisnici mogu dobiti email podsjetnik kroz lokalni inbox.",
    newsTitle: "Novosti i prognoza",
    sponsors: "Sponzori",
    login: "Prijava",
    password: "Lozinka",
    newPassword: "Nova lozinka",
    changePassword: "Promijeni lozinku",
    adminTitle: "Admin sučelje",
    addMember: "Dodaj člana",
    tempPassword: "Privremena lozinka",
    dashboard: "Pregled",
    logout: "Odjava",
    saved: "Spremljeno.",
    sent: "Poslano.",
    mustChange: "Moraš promijeniti privremenu lozinku prije korištenja profila.",
    inbox: "Email inbox",
    contacts: "Kontakt poruke",
    joinRequests: "Prijave",
    noUser: "Nisi prijavljen."
  },
  en: {
    "nav.home": "Home",
    "nav.members": "Members",
    "nav.maps": "Meet map",
    "nav.history": "History",
    "nav.contact": "Contact",
    heroKicker: "Croatian car club • Est. 2024",
    heroTitle: "Tuning Crew Ćuneri",
    heroText: "A place for cars with character, people who know what they drive and meets that stay with you long after the engine shuts down.",
    join: "Send application",
    seeMembers: "View members",
    aboutTitle: "About the club",
    aboutSide: "Members can edit their profiles and cars after changing the temporary password.",
    clubMembers: "club members",
    visitedMeets: "Meets we visited",
    soonMeet: "SOON Ćuner meet!!!",
    historyTitle: "Club history",
    historyText: "The club is 2 years old, but the story is already long enough to deserve its own page.",
    historyAdmin: "Admin can change the history text and images through the website data.",
    interested: "Want to join?",
    name: "Name",
    lastName: "Last name",
    company: "Company (optional)",
    subject: "Email subject",
    email: "Email",
    message: "Message",
    car: "Car / project",
    send: "Send",
    membersTitle: "Members and cars",
    membersText: "The grid is responsive for phones, tablets and desktop. One member can have multiple cars.",
    more: "More",
    close: "Close",
    mods: "Modifications",
    competes: "Competes in",
    contactTitle: "Contact",
    contactText: "Send a message to the club. Replies come through the official club email.",
    mapsTitle: "Meet map",
    mapsText: "Admin adds events, locations, date, time and description. Logged in users can get email reminders through the local inbox.",
    newsTitle: "News and forecast",
    sponsors: "Sponsors",
    login: "Login",
    password: "Password",
    newPassword: "New password",
    changePassword: "Change password",
    adminTitle: "Admin panel",
    addMember: "Add member",
    tempPassword: "Temporary password",
    dashboard: "Dashboard",
    logout: "Logout",
    saved: "Saved.",
    sent: "Sent.",
    mustChange: "You must change the temporary password before using the profile.",
    inbox: "Email inbox",
    contacts: "Contact messages",
    joinRequests: "Applications",
    noUser: "You are not logged in."
  }
};

const $ = selector => document.querySelector(selector);
const app = $("#app");
const extraVisuals = ["/assets/member-roadster.svg", "/assets/member-wagon.svg", "/assets/meet-lineup.svg"];
const fallbackWeatherLocations = [
  { city: "Zagreb", latitude: 45.815, longitude: 15.982 },
  { city: "Split", latitude: 43.508, longitude: 16.440 },
  { city: "Rijeka", latitude: 45.327, longitude: 14.442 },
  { city: "Osijek", latitude: 45.551, longitude: 18.693 },
  { city: "Dubrovnik", latitude: 42.651, longitude: 18.094 }
];
const clubSocialLinks = [
  { key: "instagram", label: "Instagram", url: "https://www.instagram.com/tuning_crew_cuneri/" },
  { key: "facebook", label: "Facebook", url: "https://www.facebook.com/profile.php?id=61573466375913" },
  { key: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@tuning.crew.cuneri?lang=en-GB" },
  { key: "youtube", label: "YouTube", url: "https://www.youtube.com/@%C4%86uneriTV" }
];
const phoneCountryCodes = [
  ["+385", "Hrvatska"],
  ["+381", "Srbija"],
  ["+387", "BiH"],
  ["+386", "Slovenija"],
  ["+382", "Crna Gora"],
  ["+389", "Makedonija"],
  ["+43", "Austrija"],
  ["+49", "Njemacka"],
  ["+41", "Svicaraska"],
  ["+39", "Italija"]
];
const weatherCodeLabels = {
  0: ["Vedro", "Clear"],
  1: ["Pretezno vedro", "Mainly clear"],
  2: ["Djelomicno oblacno", "Partly cloudy"],
  3: ["Oblacno", "Cloudy"],
  45: ["Magla", "Fog"],
  48: ["Magla", "Fog"],
  51: ["Slaba rosulja", "Light drizzle"],
  53: ["Rosulja", "Drizzle"],
  55: ["Jaka rosulja", "Dense drizzle"],
  56: ["Ledena rosulja", "Freezing drizzle"],
  57: ["Jaka ledena rosulja", "Dense freezing drizzle"],
  61: ["Slaba kisa", "Light rain"],
  63: ["Kisa", "Rain"],
  65: ["Jaka kisa", "Heavy rain"],
  66: ["Ledena kisa", "Freezing rain"],
  67: ["Jaka ledena kisa", "Heavy freezing rain"],
  71: ["Slab snijeg", "Light snow"],
  73: ["Snijeg", "Snow"],
  75: ["Jak snijeg", "Heavy snow"],
  77: ["Zrnati snijeg", "Snow grains"],
  80: ["Slabi pljuskovi", "Light showers"],
  81: ["Pljuskovi", "Showers"],
  82: ["Jaki pljuskovi", "Heavy showers"],
  85: ["Snjezni pljuskovi", "Snow showers"],
  86: ["Jaki snjezni pljuskovi", "Heavy snow showers"],
  95: ["Grmljavina", "Thunderstorm"],
  96: ["Grmljavina i tuca", "Thunderstorm with hail"],
  99: ["Jaka grmljavina i tuca", "Heavy thunderstorm with hail"]
};

function tr(key) {
  return t[state.lang][key] || key;
}

function ui(hr, en) {
  return state.lang === "hr" ? hr : en;
}

function localizedField(item, key) {
  if (!item) return "";
  if (state.lang === "en") return item[`${key}En`] || item[key] || "";
  return item[key] || "";
}

function localizedValue(value) {
  if (state.lang === "hr") return value;
  const map = {
    "Musko": "Men",
    "Zensko": "Women",
    "Crna": "Black",
    "Bijela": "White",
    "Crvena": "Red",
    "Majice": "T-shirts",
    "Kape": "Caps",
    "Dodaci": "Accessories",
    "Cuneri silterica": "Cuneri cap",
    "Cuneri naljepnica": "Cuneri sticker"
  };
  return map[value] || value;
}

function phoneCodeOptions(value = "+385") {
  const selectedValue = value || "+385";
  return phoneCountryCodes.map(([code, label]) => `<option value="${code}"${selected(code, selectedValue)}>${code} ${label}</option>`).join("");
}

function phoneInputGroup(profile = {}, required = false) {
  return `<label class="phone-group wide">${ui("Telefon", "Phone")}<span><select name="phoneCountryCode" ${required ? "required" : ""}>${phoneCodeOptions(profile.phoneCountryCode)}</select><input ${required ? "required" : ""} name="phone" value="${escapeHtml(profile.phone || "")}" placeholder="91 123 4567" inputmode="tel" /></span></label>`;
}

function fullPhone(profile = {}) {
  return `${profile.phoneCountryCode || "+385"} ${profile.phone || ""}`.trim();
}

function socialSvg(key) {
  const icons = {
    instagram: `<rect x="5" y="5" width="14" height="14" rx="4"></rect><circle cx="12" cy="12" r="3.2"></circle><circle cx="16.6" cy="7.4" r="1"></circle>`,
    facebook: `<path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.6.4-1 1-1z"></path>`,
    tiktok: `<path d="M14 4v9.2a4.2 4.2 0 1 1-4.2-4.2"></path><path d="M14 7.4c1.4 1.8 2.9 2.6 5 2.7"></path>`,
    youtube: `<path d="M4.5 8.5c.2-1.2 1-2 2.2-2.2 3.4-.4 7.2-.4 10.6 0 1.2.2 2 1 2.2 2.2.3 2.1.3 4.9 0 7-.2 1.2-1 2-2.2 2.2-3.4.4-7.2.4-10.6 0-1.2-.2-2-1-2.2-2.2-.3-2.1-.3-4.9 0-7z"></path><path d="M10.5 9.5l4.5 2.5-4.5 2.5z"></path>`
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[key] || ""}</svg>`;
}

function clubSocials(withText = false) {
  return `<div class="club-socials ${withText ? "with-text" : "icon-only"}">${clubSocialLinks.map(item => `<a href="${item.url}" target="_blank" rel="noreferrer" aria-label="${item.label}" title="${item.label}">${socialSvg(item.key)}${withText ? `<span>${item.label}</span>` : ""}</a>`).join("")}</div>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function jsonForEdit(value) {
  return escapeHtml(JSON.stringify(value, null, 2));
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function socialIcon(type, value) {
  if (!value) return "";
  const label = type === "instagram" ? "Instagram" : "TikTok";
  const icon = type === "instagram"
    ? `<rect x="5" y="5" width="14" height="14" rx="4"></rect><circle cx="12" cy="12" r="3.2"></circle><circle cx="16.7" cy="7.3" r="1"></circle>`
    : `<path d="M14 4v9.2a4.2 4.2 0 1 1-4.2-4.2"></path><path d="M14 7.4c1.4 1.8 2.9 2.6 5 2.7"></path>`;
  return `<a class="social-link ${type}" href="#" aria-label="${label} ${escapeHtml(value)}" title="${label} ${escapeHtml(value)}"><svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span>${escapeHtml(value)}</span></a>`;
}

function api(path, options = {}) {
  return fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  }).then(async response => {
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Greška");
    return payload;
  });
}

function weatherText(code) {
  const label = weatherCodeLabels[Number(code)] || ["Promjenjivo", "Variable"];
  return state.lang === "hr" ? label[0] : label[1];
}

function localTimeZoneLabel(value) {
  try {
    return value || Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
  } catch {
    return value || "Local time";
  }
}

function localIsoHour(utcOffsetSeconds = 0) {
  const localOffsetSeconds = -new Date().getTimezoneOffset() * 60;
  const date = new Date(Date.now() + (Number(utcOffsetSeconds) - localOffsetSeconds) * 1000);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:00`;
}

function weatherFromApi(location, payload) {
  const daily = payload.daily || {};
  const hourly = payload.hourly || {};
  const firstCurrentHour = Math.max(0, (hourly.time || []).findIndex(time => time >= localIsoHour(payload.utc_offset_seconds)));
  const hourStart = firstCurrentHour === -1 ? 0 : firstCurrentHour;
  return {
    city: location.city,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: payload.timezone || localTimeZoneLabel(),
    days: (daily.time || []).slice(0, 5).map((date, index) => ({
      date,
      temp: Math.round(Number(daily.temperature_2m_max?.[index] ?? daily.temperature_2m_min?.[index] ?? 0)),
      min: Math.round(Number(daily.temperature_2m_min?.[index] ?? 0)),
      max: Math.round(Number(daily.temperature_2m_max?.[index] ?? 0)),
      textHr: (weatherCodeLabels[Number(daily.weather_code?.[index])] || ["Promjenjivo", "Variable"])[0],
      textEn: (weatherCodeLabels[Number(daily.weather_code?.[index])] || ["Promjenjivo", "Variable"])[1]
    })),
    hours: (hourly.time || []).slice(hourStart, hourStart + 5).map((time, index) => ({
      hour: time.slice(11, 16),
      temp: Math.round(Number(hourly.temperature_2m?.[hourStart + index] ?? 0)),
      textHr: (weatherCodeLabels[Number(hourly.weather_code?.[hourStart + index])] || ["Promjenjivo", "Variable"])[0],
      textEn: (weatherCodeLabels[Number(hourly.weather_code?.[hourStart + index])] || ["Promjenjivo", "Variable"])[1]
    }))
  };
}

function browserLocation() {
  if (!navigator.geolocation) return Promise.resolve(null);
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      position => resolve({
        city: state.lang === "hr" ? "Tvoja lokacija" : "Your location",
        latitude: Number(position.coords.latitude.toFixed(4)),
        longitude: Number(position.coords.longitude.toFixed(4))
      }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 15 * 60 * 1000 }
    );
  });
}

async function fetchLocationWeather(location) {
  const params = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    hourly: "temperature_2m,weather_code",
    forecast_days: "5",
    forecast_hours: "48",
    timezone: "auto"
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!response.ok) throw new Error("Prognoza nije dostupna.");
  return weatherFromApi(location, await response.json());
}

async function loadForecast(force = false) {
  if (!force && ["loading", "ready"].includes(state.forecast.status)) return;
  state.forecast = { ...state.forecast, status: "loading", error: "" };
  const cached = !force ? sessionStorage.getItem("cuneri_forecast") : "";
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.savedAt < 20 * 60 * 1000) {
        state.forecast = { ...parsed.forecast, status: "ready" };
        return;
      }
    } catch {}
  }

  try {
    const detected = await browserLocation();
    const locations = detected ? [detected, ...fallbackWeatherLocations] : fallbackWeatherLocations;
    const items = await Promise.all(locations.map(fetchLocationWeather));
    state.forecast = {
      status: "ready",
      items,
      source: detected ? "browser" : "fallback",
      updatedAt: new Date().toISOString(),
      error: ""
    };
    sessionStorage.setItem("cuneri_forecast", JSON.stringify({ savedAt: Date.now(), forecast: state.forecast }));
  } catch (error) {
    state.forecast = {
      status: "error",
      items: [],
      source: "",
      updatedAt: "",
      error: error.message || "Prognoza nije dostupna."
    };
  }
}

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("is-open");
  setTimeout(() => node.classList.remove("is-open"), 2600);
}

function syncCheckoutDelivery(root = document) {
  const forms = root.matches?.("form[data-form='shop-checkout']")
    ? [root]
    : Array.from(root.querySelectorAll("form[data-form='shop-checkout']"));
  forms.forEach(form => {
    const delivery = form.elements.deliveryType?.value || "address";
    form.classList.toggle("is-parcel", delivery === "parcel");
    form.classList.toggle("is-address", delivery !== "parcel");
    form.querySelectorAll(".checkout-home-fields input").forEach(input => input.required = delivery !== "parcel" && ["address", "city", "postalCode"].includes(input.name));
    form.querySelectorAll(".checkout-parcel-fields input, .checkout-parcel-fields select").forEach(input => input.required = delivery === "parcel");
    const payment = form.querySelector("input[name='paymentMethod']:checked")?.value || "cod";
    const help = form.querySelector("[data-payment-help]");
    if (help) help.textContent = paymentInstruction(payment);
  });
}

function syncLang() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = tr(node.dataset.i18n);
  });
  document.querySelectorAll(".lang").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === state.lang));
  const account = document.querySelector("#headerAccount");
  const avatar = state.user?.profileImage
    ? `<span class="person-icon has-image"><img src="${escapeHtml(state.user.profileImage)}" alt="" /></span>`
    : `<span class="person-icon">&#9679;</span>`;
  if (account) account.innerHTML = state.user
    ? `<a href="/profil" data-link title="${ui("Moj profil", "My profile")}">${avatar}<b>${escapeHtml(state.user.name || state.user.email)}</b></a><button class="header-logout" type="button" data-action="logout" title="${tr("logout")}"><b>${tr("logout")}</b></button>`
    : `<a href="/webshop-login" data-link aria-label="Prijava"><span class="person-icon">&#9679;</span><b>LOGIN</b></a>`;
}

function closeMenu() {
  $("#navPanel").classList.remove("is-open");
  $("#navPanel").setAttribute("aria-hidden", "true");
  $("#menuToggle").classList.remove("is-open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
}

function openMenu() {
  $("#navPanel").classList.add("is-open");
  $("#navPanel").setAttribute("aria-hidden", "false");
  $("#menuToggle").classList.add("is-open");
  $("#menuToggle").setAttribute("aria-expanded", "true");
}

function navigate(path) {
  history.pushState({}, "", path);
  closeMenu();
  render();
}

function imageForHero() {
  const images = state.data.settings.heroImages;
  if (!sessionStorage.getItem("heroSeed")) {
    sessionStorage.setItem("heroSeed", String(Math.floor(Math.random() * images.length)));
  }
  state.heroIndex = Number(sessionStorage.getItem("heroSeed")) % images.length;
  return images[state.heroIndex];
}

function euro(value) {
  return new Intl.NumberFormat(state.lang === "hr" ? "hr-HR" : "en-IE", { style: "currency", currency: "EUR" }).format(Number(value || 0));
}

function saveCart() {
  localStorage.setItem("cuneri_cart", JSON.stringify(state.cart));
}

async function shopPage() {
  let account = null;
  if (state.user) account = await api("/api/shop/account").catch(() => null);
  const products = state.data.products || [];
  app.innerHTML = `
    <section class="shop-hero"><div><span>OFFICIAL CLUB STORE</span><h1>CUNERI<br>WEBSHOP</h1><p>Od klupske odjece do naljepnica i dodataka za svaki build.</p></div></section>
    <section class="section shop-shell">
      <div class="shop-toolbar"><div><h2>Artikli</h2><small>Sve cijene su u eurima i ukljucuju PDV od 25%.</small></div><button class="btn secondary" data-cart-open>Kosarica (${state.cart.reduce((sum, item) => sum + item.quantity, 0)})</button></div>
      <div class="product-grid">${products.map(productCardV2).join("")}</div>
    </section>
    <aside class="product-detail-drawer" id="productDetail" hidden></aside>
    <aside class="cart-drawer" id="cartDrawer" hidden>${cartContentV2(account)}</aside>
    ${clubFooter()}`;
  requestAnimationFrame(() => syncCheckoutDelivery());
  requestAnimationFrame(prepareScrollAnimations);
}

function productCard(product) {
  const options = [
    product.audiences?.length ? `<label>Model<select name="audience">${product.audiences.map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label>` : "",
    product.colors?.length ? `<label>Boja<select name="color">${product.colors.map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label>` : "",
    product.sizes?.length ? `<label>Velicina<select name="size">${product.sizes.map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label>` : ""
  ].join("");
  return `<article class="product-card"><img src="${product.image || "/assets/cuneri-logo.png"}" alt="${escapeHtml(product.name)}" /><div class="product-body"><small>${escapeHtml(product.category || "Cuneri")}</small><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description || "")}</p><strong class="product-price">${euro(product.price)}</strong><span class="vat-note">U cijenu je ukljucen PDV 25%</span><form data-form="add-cart" data-product-id="${product.id}" class="product-options">${options}<label>Kolicina<input name="quantity" type="number" min="1" max="${Number(product.stock)}" value="1" /></label><button class="btn" type="submit">Dodaj u kosaricu</button></form><span class="stock-note">Na zalihi: ${Number(product.stock)}</span></div></article>`;
}

function cartContent() {
  const total = state.cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  return `<div class="cart-head"><h2>Kosarica</h2><button class="map-close" data-cart-close>&times;</button></div><div class="cart-lines">${state.cart.map((item, index) => `<div class="cart-line"><div><strong>${escapeHtml(item.name)}</strong><small>${[item.audience, item.color, item.size].filter(Boolean).join(" / ")} · ${item.quantity} kom</small></div><span>${euro(item.price * item.quantity)}</span><button data-cart-remove="${index}" aria-label="Makni artikl">&times;</button></div>`).join("") || "<p>Kosarica je prazna.</p>"}</div><div class="cart-total"><span>Ukupno s PDV-om</span><strong>${euro(total)}</strong></div>${state.cart.length ? state.user ? `<button class="btn" data-shop-order>Zavrsi narudzbu</button>` : `<a class="btn" href="/login" data-link>Prijavi se za narudzbu</a>` : ""}<p class="vat-note">PDV 25% ukljucen je u sve prikazane cijene.</p>`;
}

function salePrice(product) {
  return Number(product.price) * (1 - Math.max(0, Math.min(100, Number(product.salePercent || 0))) / 100);
}

function productCardV2(product) {
  const sale = Math.max(0, Math.min(100, Number(product.salePercent || 0)));
  return `<article class="product-card">${sale ? `<span class="sale-ribbon">SALE</span>` : ""}<img src="${product.image || "/assets/cuneri-logo.png"}" alt="${escapeHtml(product.name)}" /><div class="product-body"><small>${escapeHtml(product.category || "Cuneri")}</small><h3>${escapeHtml(product.name)}</h3><div class="price-line">${sale ? `<del>${euro(product.price)}</del>` : ""}<strong class="product-price">${euro(salePrice(product))}</strong></div>${sale ? `<span class="sale-copy">Popust ${sale}%</span>` : ""}<span class="vat-note">U cijenu je ukljucen PDV 25%</span><span class="stock-note">Na zalihi: ${Number(product.stock)}</span><button class="btn secondary product-more" data-product-more="${product.id}">Vise</button></div></article>`;
}

function openProductDetail(productId) {
  const product = state.data.products.find(item => item.id === productId);
  const drawer = document.querySelector("#productDetail");
  if (!product || !drawer) return;
  const sale = Math.max(0, Math.min(100, Number(product.salePercent || 0)));
  const options = [product.audiences?.length ? `<label>Musko / zensko<select name="audience">${product.audiences.map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label>` : "", product.colors?.length ? `<label>Boja<select name="color">${product.colors.map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label>` : "", product.sizes?.length ? `<label>Velicina<select name="size">${product.sizes.map(value => `<option>${escapeHtml(value)}</option>`).join("")}</select></label>` : ""].join("");
  drawer.innerHTML = `<button class="map-close drawer-close" data-product-close>&times;</button><img src="${product.image}" alt="${escapeHtml(product.name)}" /><small>${escapeHtml(product.category || "")}</small><h2>${escapeHtml(product.name)}</h2><p>${escapeHtml(product.description || "")}</p><strong class="product-price">${euro(salePrice(product))}</strong>${sale ? `<span class="sale-copy">SALE ${sale}%</span>` : ""}<span class="stock-note">Na zalihi: ${product.stock}</span><form data-form="add-cart" data-product-id="${product.id}" class="product-options">${options}<label>Kolicina<input name="quantity" type="number" min="1" max="${Number(product.stock)}" value="1" /></label><button class="btn" type="submit">Dodaj u kosaricu</button></form>`;
  drawer.hidden = false;
}

function cartContentV2(account) {
  const total = state.cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const profile = account?.profile || {};
  return `<div class="cart-head"><h2>Kosarica</h2><button class="map-close" data-cart-close>&times;</button></div><div class="cart-lines">${state.cart.map((item, index) => `<div class="cart-line"><div><strong>${escapeHtml(item.name)}</strong><small>${[item.audience, item.color, item.size].filter(Boolean).join(" / ")} · ${item.quantity} kom</small></div><span>${euro(item.price * item.quantity)}</span><button data-cart-remove="${index}" aria-label="Makni artikl">&times;</button></div>`).join("") || "<p>Kosarica je prazna.</p>"}</div><div class="cart-total"><span>Ukupno prije kupona</span><strong>${euro(total)}</strong></div>${state.cart.length ? `<form class="checkout-form" data-form="shop-checkout">${state.user ? "" : `<label>Email<input required type="email" name="email" /></label>`}<div class="checkout-grid"><label>Ime<input required name="firstName" value="${escapeHtml(profile.firstName || "")}" /></label><label>Prezime<input required name="lastName" value="${escapeHtml(profile.lastName || "")}" /></label><label>Telefon<input required name="phone" value="${escapeHtml(profile.phone || "")}" /></label><label>Nacin dostave<select name="deliveryType"><option value="address">Kucna adresa</option><option value="parcel">Paketomat</option></select></label><label>Adresa<input name="address" value="${escapeHtml(profile.address || "")}" /></label><label>Grad<input name="city" value="${escapeHtml(profile.city || "")}" /></label><label>Postanski broj<input name="postalCode" value="${escapeHtml(profile.postalCode || "")}" /></label><label>Sluzba paketomata<select name="parcelService"><option value="">Odaberi</option><option>GLS</option><option>Hrvatska posta</option><option>BOX NOW</option></select></label><label class="wide">Broj / oznaka paketomata<input name="parcelLocker" value="${escapeHtml(profile.parcelLocker || "")}" /></label><label class="wide">Kod za popust<input name="couponCode" value="${escapeHtml(localStorage.getItem("cuneri_coupon") || "")}" placeholder="Unesi kod" /></label></div><button class="btn" type="submit">Potvrdi narudzbu</button></form>` : ""}<p class="vat-note">PDV 25% ukljucen je u sve prikazane cijene.</p>`;
}

function selected(value, expected) {
  return value === expected ? " selected" : "";
}

function checked(value, expected) {
  return value === expected ? " checked" : "";
}

function paymentInstruction(method) {
  if (method === "paypal") return "PayPal uplata ide na tccuneri@gmail.com. U opis uplate upisi broj narudzbe koji dobijes nakon potvrde.";
  if (method === "revolut") return "Revolut uplata ide na @cuneri. U opis uplate upisi broj narudzbe koji dobijes nakon potvrde.";
  return "Placanje pouzecem obavlja se prilikom preuzimanja paketa.";
}

function checkoutSections(profile = {}) {
  const deliveryType = profile.deliveryType || "address";
  const paymentMethod = profile.paymentMethod || "cod";
  return `<div class="checkout-block">
    <h3>Kontakt</h3>
    <div class="checkout-grid">
      <label>Ime<input required name="firstName" value="${escapeHtml(profile.firstName || "")}" /></label>
      <label>Prezime<input required name="lastName" value="${escapeHtml(profile.lastName || "")}" /></label>
      ${phoneInputGroup(profile, true)}
      <label>Nacin dostave<select name="deliveryType" data-checkout-delivery><option value="address"${selected(deliveryType, "address")}>Kucna adresa</option><option value="parcel"${selected(deliveryType, "parcel")}>Paketomat</option></select></label>
    </div>
  </div>
  <div class="checkout-block checkout-home-fields">
    <h3>Dostava na adresu</h3>
    <div class="checkout-grid">
      <label class="wide">Adresa dostave<input name="address" value="${escapeHtml(profile.address || "")}" /></label>
      <label>Grad dostave<input name="city" value="${escapeHtml(profile.city || "")}" /></label>
      <label>Postanski broj dostave<input name="postalCode" value="${escapeHtml(profile.postalCode || "")}" /></label>
      <label class="wide">Napomena za dostavu<input name="deliveryNote" value="${escapeHtml(profile.deliveryNote || "")}" placeholder="Kat, zvono, termin..." /></label>
    </div>
  </div>
  <div class="checkout-block checkout-parcel-fields">
    <h3>Paketomat</h3>
    <div class="checkout-grid">
      <label class="wide">Sluzba paketomata<select name="parcelService" data-parcel-service><option value="">Odaberi</option><option value="BOX NOW"${selected(profile.parcelService, "BOX NOW")}>BOX NOW</option><option value="GLS"${selected(profile.parcelService, "GLS")}>GLS</option><option value="Paket24"${selected(profile.parcelService, "Paket24")}>Paket24</option></select></label>
      <label>Broj / oznaka paketomata<input name="parcelLocker" value="${escapeHtml(profile.parcelLocker || "")}" placeholder="npr. ZG123" /></label>
      <label>Adresa paketomata<input name="parcelAddress" value="${escapeHtml(profile.parcelAddress || "")}" placeholder="Ulica i grad paketomata" /></label>
    </div>
    <button class="btn secondary parcel-edit-btn" type="button" data-parcel-open>Upisi detalje paketomata</button>
  </div>
  <div class="checkout-block">
    <h3>Podaci za uplatu</h3>
    <div class="checkout-grid">
      <label>Grad<input required name="billingCity" value="${escapeHtml(profile.billingCity || profile.city || "")}" /></label>
      <label>Postanski broj<input required name="billingPostalCode" value="${escapeHtml(profile.billingPostalCode || profile.postalCode || "")}" /></label>
      <label>Ulica<input required name="billingStreet" value="${escapeHtml(profile.billingStreet || profile.address || "")}" /></label>
      <label>Kucni broj<input required name="billingHouseNumber" value="${escapeHtml(profile.billingHouseNumber || "")}" /></label>
      <label class="wide">Napomena<input name="billingNote" value="${escapeHtml(profile.billingNote || "")}" placeholder="Napomena za narudzbu ili uplatu" /></label>
    </div>
  </div>
  <div class="checkout-block">
    <h3>Placanje</h3>
    <div class="payment-options">
      <label><input type="radio" name="paymentMethod" value="cod"${checked(paymentMethod, "cod")} /> Pouzecem</label>
      <label><input type="radio" name="paymentMethod" value="revolut"${checked(paymentMethod, "revolut")} /> Revolut @cuneri</label>
      <label><input type="radio" name="paymentMethod" value="paypal"${checked(paymentMethod, "paypal")} /> PayPal tccuneri@gmail.com</label>
    </div>
    <p class="payment-help" data-payment-help>${paymentInstruction(paymentMethod)}</p>
  </div>
  <label class="wide">Kod za popust<input name="couponCode" value="${escapeHtml(localStorage.getItem("cuneri_coupon") || "")}" placeholder="Unesi kod" /></label>
  <div class="parcel-modal" data-parcel-modal hidden>
    <div class="parcel-modal-box">
      <button class="map-close" type="button" data-parcel-close>&times;</button>
      <h3>Detalji paketomata</h3>
      <p>Upisi broj lokatora i adresu odabranog paketomata.</p>
      <label>Broj / oznaka paketomata<input data-parcel-locker-copy value="${escapeHtml(profile.parcelLocker || "")}" /></label>
      <label>Adresa paketomata<input data-parcel-address-copy value="${escapeHtml(profile.parcelAddress || "")}" /></label>
      <button class="btn" type="button" data-parcel-save>Spremi paketomat</button>
    </div>
  </div>`;
}

function cartContentV2(account) {
  const total = state.cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const profile = account?.profile || {};
  const deliveryClass = (profile.deliveryType || "address") === "parcel" ? "is-parcel" : "is-address";
  return `<div class="cart-head"><h2>Kosarica</h2><button class="map-close" data-cart-close>&times;</button></div><div class="cart-lines">${state.cart.map((item, index) => `<div class="cart-line"><div><strong>${escapeHtml(item.name)}</strong><small>${[item.audience, item.color, item.size].filter(Boolean).join(" / ")} · ${item.quantity} kom</small></div><span>${euro(item.price * item.quantity)}</span><button data-cart-remove="${index}" aria-label="Makni artikl">&times;</button></div>`).join("") || "<p>Kosarica je prazna.</p>"}</div><div class="cart-total"><span>Ukupno prije kupona</span><strong>${euro(total)}</strong></div>${state.cart.length ? `<form class="checkout-form ${deliveryClass}" data-form="shop-checkout">${state.user ? "" : `<label>Email<input required type="email" name="email" /></label>`}${checkoutSections(profile)}<button class="btn" type="submit">Potvrdi narudzbu</button></form>` : ""}<p class="vat-note">PDV 25% ukljucen je u sve prikazane cijene.</p>`;
}

function shopAccountV2(account) {
  if (!state.user) return `<div class="section-head"><h2>Webshop racun</h2><p>Odvojena prijava za kupce, reset lozinke i registracija nalaze se na jednom sigurnom mjestu.</p></div><div class="panel shop-login-callout"><h3>Vec imas racun?</h3><a class="btn" href="/webshop-login" data-link>Webshop login / registracija</a><p>Kupnju mozes dovrsiti i kao gost iz kosarice.</p></div>`;
  return shopAccount(account);
}

function shopAccount(account) {
  if (!state.user) return `<div class="section-head"><h2>Webshop racun</h2><p>Otvori racun za pracenje narudzbi i spremanje dostave.</p></div><div class="shop-auth-grid"><form class="form-box" data-form="shop-register"><h3>Registracija</h3><label>Email<input required type="email" name="email" /></label><label>Lozinka<input required type="password" minlength="8" name="password" /></label><button class="btn">Otvori racun</button></form><form class="form-box" data-form="shop-reset"><h3>Reset lozinke</h3><label>Email<input required type="email" name="email" /></label><button class="btn secondary">Posalji privremenu lozinku</button></form></div>`;
  const profile = account?.profile || {};
  return `<div class="section-head"><h2>Moj webshop racun</h2><p>${escapeHtml(state.user.email)}</p></div>${["admin", "shop_manager"].includes(state.user.role) ? `<a class="btn" href="/webshop-upravljanje" data-link>Upravljanje webshopom</a>` : ""}<div class="shop-account-grid"><form class="form-box" data-form="shop-profile"><h3>Podaci za dostavu</h3><label>Ime<input required name="firstName" value="${escapeHtml(profile.firstName || "")}" /></label><label>Prezime<input required name="lastName" value="${escapeHtml(profile.lastName || "")}" /></label>${phoneInputGroup(profile, true)}<label>Nacin dostave<select name="deliveryType"><option value="address">Kucna adresa</option><option value="parcel">Paketomat</option></select></label><label>Adresa<input name="address" value="${escapeHtml(profile.address || "")}" /></label><label>Grad<input name="city" value="${escapeHtml(profile.city || "")}" /></label><label>Postanski broj<input name="postalCode" value="${escapeHtml(profile.postalCode || "")}" /></label><label>Sluzba paketomata<select name="parcelService"><option value="">Odaberi</option><option>GLS</option><option>Hrvatska posta</option><option>BOX NOW</option></select></label><label>Broj / oznaka paketomata<input name="parcelLocker" value="${escapeHtml(profile.parcelLocker || "")}" placeholder="Provjeri online pa upisi oznaku" /></label><button class="btn">Spremi podatke</button></form><div class="panel"><h3>Moje narudzbe</h3>${(account?.orders || []).map(order => `<div class="order-row"><strong>${order.id}</strong><span>${order.status} · ${euro(order.total)}</span><small>${new Date(order.createdAt).toLocaleDateString("hr-HR")}</small></div>`).join("") || "<p>Jos nemas narudzbi.</p>"}</div></div>`;
}

async function shopManagePage() {
  if (!state.user || !["admin", "shop_manager"].includes(state.user.role)) return navigate("/login");
  const shop = await api("/api/shop/manage");
  app.innerHTML = `<section class="section alt"><p>Koristi novo upravljanje webshopom.</p></section>`;
}

async function shopManagePageV2() {
  if (!state.user || !["admin", "shop_manager"].includes(state.user.role)) return navigate("/webshop-login");
  const shop = await api("/api/shop/manage");
  const productForm = product => `<form class="product-admin-card" data-form="shop-product"><input type="hidden" name="id" value="${product.id || ""}" /><img src="${product.image || "/assets/cuneri-logo.png"}" alt="" /><div class="product-admin-fields"><label>Naziv<input required name="name" value="${escapeHtml(product.name || "")}" /></label><label>Kategorija<input required name="category" value="${escapeHtml(product.category || "")}" /></label><label class="wide">Opis<textarea name="description">${escapeHtml(product.description || "")}</textarea></label><label>Cijena EUR<input required type="number" step="0.01" min="0" name="price" value="${Number(product.price || 0)}" /></label><label>SALE popust %<input type="number" min="0" max="100" name="salePercent" value="${Number(product.salePercent || 0)}" /></label><label>Zaliha<input required type="number" min="0" name="stock" value="${Number(product.stock || 0)}" /></label><label>URL slike<input name="image" value="${escapeHtml(product.image || "")}" /></label><label>Musko / zensko, odvojeno zarezom<input name="audiences" value="${escapeHtml((product.audiences || []).join(", "))}" /></label><label>Boje, odvojeno zarezom<input name="colors" value="${escapeHtml((product.colors || []).join(", "))}" /></label><label>Velicine, odvojeno zarezom<input name="sizes" value="${escapeHtml((product.sizes || []).join(", "))}" /></label><label class="check-label"><input type="checkbox" name="active" ${product.active !== false ? "checked" : ""} /> Artikl je vidljiv</label><div class="product-admin-actions"><button class="btn" type="submit">Spremi</button>${product.id ? `<button class="btn danger" type="button" data-delete-product="${product.id}">Obrisi</button>` : ""}</div></div></form>`;
  app.innerHTML = `<section class="section alt shop-admin-page"><div class="section-head"><h2>Webshop upravljanje</h2><p>Jednostavno uređivanje bez koda.</p></div><div class="admin-grid">${adminPanelSwitch()}<div class="panel admin-wide"><h3>1. Upload slike</h3><form class="admin-form" data-form="shop-upload"><label>JPG ili PNG<input required type="file" name="image" accept="image/png,image/jpeg" /></label><button class="btn">Upload slike</button><label>Dobiveni URL slike<input id="shopUploadResult" readonly placeholder="/uploads/..." /></label></form></div><div class="panel admin-wide"><h3>2. Dodaj novi artikl</h3>${productForm({ active: true })}</div><div class="admin-wide product-admin-list"><h3>Postojeci artikli</h3>${shop.products.map(productForm).join("")}</div><div class="panel admin-wide"><h3>Kuponi</h3><div class="coupon-grid">${shop.coupons.map(coupon => `<form class="coupon-card" data-form="shop-coupon"><input type="hidden" name="id" value="${coupon.id}" /><label>Kod<input required name="code" value="${escapeHtml(coupon.code)}" /></label><label>Popust %<input required type="number" min="1" max="100" name="percent" value="${coupon.percent}" /></label><label>Maksimalno koristenja<input required type="number" min="1" name="maxUses" value="${coupon.maxUses}" /></label><span>Iskoristeno: ${coupon.usedCount || 0}</span><label class="check-label"><input type="checkbox" name="firstOrderOnly" ${coupon.firstOrderOnly ? "checked" : ""} /> Samo prva kupnja</label><label class="check-label"><input type="checkbox" name="active" ${coupon.active !== false ? "checked" : ""} /> Aktivan</label><button class="btn">Spremi kupon</button></form>`).join("")}<form class="coupon-card new" data-form="shop-coupon"><h4>Novi kupon</h4><label>Kod<input required name="code" /></label><label>Popust %<input required type="number" min="1" max="100" name="percent" /></label><label>Broj koristenja<input required type="number" min="1" name="maxUses" value="1" /></label><label class="check-label"><input type="checkbox" name="firstOrderOnly" /> Samo prva kupnja</label><label class="check-label"><input type="checkbox" name="active" checked /> Aktivan</label><button class="btn">Dodaj kupon</button></form></div></div><div class="panel admin-wide"><h3>Narudzbe i dostava</h3><div class="admin-list">${shop.orders.map(order => `<form class="order-manage" data-form="shop-order"><input type="hidden" name="id" value="${order.id}" /><div><strong>${order.id} · ${escapeHtml(order.profile.firstName || "")} ${escapeHtml(order.profile.lastName || "")}</strong><small>${escapeHtml(order.customerEmail)} · ${escapeHtml(order.profile.address || order.profile.parcelLocker || "")} · ${escapeHtml(order.profile.parcelService || "")}</small><small>${order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")} · ${euro(order.total)}</small></div><select name="status">${["Nova", "Potvrdena", "U pripremi", "Poslana", "Preuzeta", "Otkazana"].map(status => `<option${status === order.status ? " selected" : ""}>${status}</option>`).join("")}</select><button class="btn secondary">Spremi</button></form>`).join("") || "Nema narudzbi."}</div></div></div></section>`;
}

function orderPaymentLabel(method) {
  if (method === "paypal") return "PayPal";
  if (method === "revolut") return "Revolut";
  return "Pouzecem";
}

function accessUserRow(user) {
  const canDelete = state.user?.id !== user.id;
  const identifier = user.email || user.username || user.name || "";
  return `<form data-form="user-access" class="access-row">
    <input type="hidden" name="id" value="${user.id}" />
    <div><strong>${escapeHtml(user.name || identifier)}</strong><small>${escapeHtml(identifier)} · ${escapeHtml(user.role)}</small></div>
    <label class="check-label"><input type="checkbox" name="shopAccess" ${user.shopAccess ? "checked" : ""} /> Webshop</label>
    <label class="check-label"><input type="checkbox" name="garageAccess" ${user.garageAccess ? "checked" : ""} /> Clan autokluba</label>
    <label class="check-label"><input type="checkbox" name="meetAccess" ${user.meetAccess || user.role === "meet_manager" ? "checked" : ""} /> Meet</label>
    <button class="btn secondary" type="button" data-edit-user="${user.id}">Uredi sve</button>
    <button class="btn secondary">Spremi</button>
    ${canDelete ? `<button class="btn danger" type="button" data-delete-user="${user.id}" data-delete-user-email="${escapeHtml(identifier)}">Obrisi</button>` : `<span class="admin-help">Trenutni admin</span>`}
  </form>`;
}

function activeUsersPanel(users = []) {
  return `<div class="panel admin-wide"><h3>Active users</h3><p class="admin-help">Zelena tockica znaci aktivnost u zadnjih 5 minuta. Online korisnici su uvijek na vrhu.</p><div class="active-user-list">
    ${users.map(user => `<div class="active-user-row ${user.online ? "is-online" : ""}"><span class="active-dot"></span><div><strong>${escapeHtml(user.name || user.email || user.username)}</strong><small>${escapeHtml(user.email || user.username || "")} · ${escapeHtml(user.role || "")}${user.lastSeenAt ? ` · zadnje: ${new Date(user.lastSeenAt).toLocaleString("hr-HR")}` : " · nikad online"}</small></div></div>`).join("") || `<p class="admin-help">Nema korisnika.</p>`}
  </div></div>`;
}

function adminAddUserForm() {
  return `<div class="panel"><h3>Dodaj korisnika</h3><form class="admin-form" data-form="add-member">
    <label>Email ili username<input required name="identifier" placeholder="npr. voditelj01 ili ime@email.com" /></label>
    <label>Prikazno ime<input name="displayName" placeholder="npr. Voditelj Meet 01" /></label>
    <label>${tr("tempPassword")}<input name="tempPassword" value="ulaz123ulaz" minlength="8" /></label>
    <label class="check-label"><input type="checkbox" name="shopAccess" checked /> Webshop korisnik</label>
    <label class="check-label"><input type="checkbox" name="garageAccess" /> Clan autokluba</label>
    <label class="check-label"><input type="checkbox" name="meetAccess" /> Meet organizer</label>
    <label class="check-label"><input type="checkbox" name="adminAccess" /> Admin za sve</label>
    <button class="btn" type="submit">Dodaj korisnika</button>
    <p class="admin-help">Registracija kupca sama otvara samo webshop racun. Clan autokluba postaje tek kad admin ukljuci ovu kvacicu ili doda korisnika kao clana.</p>
  </form></div>`;
}

function memberForUser(user) {
  return (state.adminDash?.members || []).find(member => member.userId === user.id) || {
    id: "",
    userId: user.id,
    name: user.name || user.email,
    email: user.email,
    instagram: "",
    tiktok: "",
    bio: "",
    competitions: "",
    cars: []
  };
}

function carEditor(car = {}, index = 0) {
  return `<fieldset class="car-edit-card" data-car-index="${index}">
    <legend>${car.id ? `Auto ${index + 1}` : "Novi auto"}</legend>
    <input type="hidden" name="carId" value="${escapeHtml(car.id || "")}" />
    <label>Naziv auta<input name="carName" value="${escapeHtml(car.name || "")}" /></label>
    <label>Cover slika<input name="carCover" value="${escapeHtml(car.cover || "")}" placeholder="/assets/..." /></label>
    <label class="wide">Galerija slika, odvojeno zarezom<input name="carImages" value="${escapeHtml((car.images || []).join(", "))}" /></label>
    <label class="wide">Modifikacije<textarea name="carMods">${escapeHtml(car.mods || "")}</textarea></label>
    <label class="wide">Modifikacije EN<textarea name="carModsEn">${escapeHtml(car.modsEn || "")}</textarea></label>
    <label class="wide">Detalji / tekst auta<textarea name="carDetails">${escapeHtml(car.details || "")}</textarea></label>
    <label class="wide">Detalji / tekst auta EN<textarea name="carDetailsEn">${escapeHtml(car.detailsEn || "")}</textarea></label>
    <label>Natjece se u<input name="carCompetesIn" value="${escapeHtml(car.competesIn || "")}" /></label>
    <label>Natjece se u EN<input name="carCompetesInEn" value="${escapeHtml(car.competesInEn || "")}" /></label>
    ${car.id ? `<label class="check-label danger-check"><input type="checkbox" name="deleteCar" /> Obrisi ovaj auto</label>` : ""}
  </fieldset>`;
}

function openAdminUserEditor(userId) {
  const user = (state.adminDash?.users || []).find(item => item.id === userId);
  if (!user) return;
  const member = memberForUser(user);
  const profile = user.profile || {};
  const cars = [...(member.cars || []), {}];
  document.querySelector("#adminUserEditor")?.remove();
  const node = document.createElement("aside");
  node.id = "adminUserEditor";
  node.className = "admin-user-editor";
  node.innerHTML = `<div class="event-detail-backdrop" data-close-user-editor></div>
    <form class="admin-user-box" data-form="admin-user-edit">
      <button class="map-close" type="button" data-close-user-editor>&times;</button>
      <input type="hidden" name="id" value="${user.id}" />
      <h2>Uredi korisnika</h2>
      <p>${escapeHtml(user.email)} · ${escapeHtml(user.role)}</p>
      <div class="admin-user-grid">
        <label>Ime / prikaz<input name="name" value="${escapeHtml(user.name || "")}" /></label>
        <label>Email<input required type="email" name="email" value="${escapeHtml(user.email || "")}" /></label>
        <label>Username<input name="username" value="${escapeHtml(user.username || "")}" /></label>
        <label>Rola<select name="role">
          ${["member", "customer", "meet_manager", "shop_manager", "admin"].map(role => `<option value="${role}"${selected(user.role, role)}>${role === "admin" ? "Admin za sve" : role === "shop_manager" ? "Admin za webshop" : role === "meet_manager" ? "Voditelj meetova" : role}</option>`).join("")}
        </select></label>
        <label class="check-label"><input type="checkbox" name="shopAccess" ${user.shopAccess ? "checked" : ""} /> Webshop pristup</label>
        <label class="check-label"><input type="checkbox" name="garageAccess" ${user.garageAccess ? "checked" : ""} /> Clan autokluba</label>
        <label class="check-label"><input type="checkbox" name="meetAccess" ${user.meetAccess || user.role === "meet_manager" ? "checked" : ""} /> Meet panel pristup</label>
        <label class="check-label"><input type="checkbox" name="mustChangePassword" ${user.mustChangePassword ? "checked" : ""} /> Mora promijeniti lozinku</label>
        <label>Ime<input name="firstName" value="${escapeHtml(profile.firstName || "")}" /></label>
        <label>Prezime<input name="lastName" value="${escapeHtml(profile.lastName || "")}" /></label>
        ${phoneInputGroup(profile)}
        <label>Postanski broj<input name="postalCode" value="${escapeHtml(profile.postalCode || "")}" /></label>
        <label class="wide">Adresa<input name="address" value="${escapeHtml(profile.address || "")}" /></label>
        <label>Grad<input name="city" value="${escapeHtml(profile.city || "")}" /></label>
        <label class="wide">Napomena profila<textarea name="note">${escapeHtml(profile.note || "")}</textarea></label>
        <label class="wide">Profilna slika URL<input name="profileImage" value="${escapeHtml(user.profileImage || "")}" placeholder="/uploads/..." /></label>
        <label class="wide">Naslovna slika URL<input name="coverImage" value="${escapeHtml(user.coverImage || "")}" placeholder="/uploads/..." /></label>
        <label class="check-label"><input type="checkbox" name="removeProfileImage" /> Makni profilnu sliku</label>
        <label class="check-label"><input type="checkbox" name="removeCoverImage" /> Makni naslovnu sliku</label>
      </div>
      <h3>Profil clana / garaza</h3>
      <div class="admin-user-grid">
        <label>Ime clana<input name="memberName" value="${escapeHtml(member.name || "")}" /></label>
        <label>Email profila<input name="memberEmail" value="${escapeHtml(member.email || user.email || "")}" /></label>
        <label>Instagram<input name="instagram" value="${escapeHtml(member.instagram || "")}" /></label>
        <label>TikTok<input name="tiktok" value="${escapeHtml(member.tiktok || "")}" /></label>
        <label class="wide">Bio / tekst clana<textarea name="bio">${escapeHtml(member.bio || "")}</textarea></label>
        <label class="wide">Bio / tekst clana EN<textarea name="bioEn">${escapeHtml(member.bioEn || "")}</textarea></label>
        <label class="wide">Natjecanja / opis<textarea name="competitions">${escapeHtml(member.competitions || "")}</textarea></label>
        <label class="wide">Natjecanja / opis EN<textarea name="competitionsEn">${escapeHtml(member.competitionsEn || "")}</textarea></label>
        <label class="check-label wide danger-check"><input type="checkbox" name="deleteMemberProfile" /> Obrisi cijeli profil clana/garazu</label>
      </div>
      <h3>Auti</h3>
      <div class="cars-edit-list">${cars.map(carEditor).join("")}</div>
      <div class="product-admin-actions">
        <button class="btn" type="submit">Spremi sve</button>
        ${state.user?.id !== user.id ? `<button class="btn danger" type="button" data-delete-user="${user.id}" data-delete-user-email="${escapeHtml(user.email)}">Obrisi cijelog korisnika</button>` : ""}
      </div>
    </form>`;
  document.body.appendChild(node);
}

function collectAdminUserEdit(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const cars = Array.from(form.querySelectorAll(".car-edit-card")).map(card => {
    const get = name => card.querySelector(`[name="${name}"]`)?.value || "";
    if (card.querySelector('[name="deleteCar"]')?.checked) return null;
    const name = get("carName").trim();
    if (!name) return null;
    return {
      id: get("carId"),
      name,
      cover: get("carCover"),
      images: get("carImages").split(",").map(item => item.trim()).filter(Boolean),
      mods: get("carMods"),
      modsEn: get("carModsEn"),
      details: get("carDetails"),
      detailsEn: get("carDetailsEn"),
      competesIn: get("carCompetesIn"),
      competesInEn: get("carCompetesInEn")
    };
  }).filter(Boolean);
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    username: data.username,
    role: data.role,
    shopAccess: Boolean(data.shopAccess),
    garageAccess: Boolean(data.garageAccess),
    meetAccess: Boolean(data.meetAccess),
    mustChangePassword: Boolean(data.mustChangePassword),
    firstName: data.firstName,
    lastName: data.lastName,
    phoneCountryCode: data.phoneCountryCode,
    phone: data.phone,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    note: data.note,
    profileImage: data.profileImage,
    coverImage: data.coverImage,
    removeProfileImage: Boolean(data.removeProfileImage),
    removeCoverImage: Boolean(data.removeCoverImage),
    deleteMemberProfile: Boolean(data.deleteMemberProfile),
    member: {
      name: data.memberName,
      email: data.memberEmail,
      instagram: data.instagram,
      tiktok: data.tiktok,
      bio: data.bio,
      bioEn: data.bioEn,
      competitions: data.competitions,
      competitionsEn: data.competitionsEn,
      cars
    }
  };
}

function orderDeliveryLine(order) {
  const profile = order.profile || {};
  if (profile.deliveryType === "parcel") return `${profile.parcelService || "Paketomat"} · ${profile.parcelLocker || "-"} · ${profile.parcelAddress || "-"}`;
  return `${profile.address || "-"} · ${profile.city || "-"} · ${profile.postalCode || "-"}`;
}

function userProfilePage() {
  if (!state.user) return accessLoginPage("shop");
  const canAdmin = state.user.role === "admin";
  const canShop = state.user.shopAccess || ["admin", "shop_manager"].includes(state.user.role);
  const canGarage = state.user.garageAccess || ["admin", "member"].includes(state.user.role);
  const canMeet = state.user.meetAccess || ["admin", "meet_manager"].includes(state.user.role);
  const profile = state.user.profile || state.user.shopProfile || {};
  const cover = state.user.coverImage || "/assets/hero-garage.svg";
  app.innerHTML = `
    <section class="section alt" style="padding-top:128px">
      <div class="section-head"><h2>${ui("Moj profil", "My profile")}</h2><p>${escapeHtml(state.user.email)}</p></div>
      <div class="admin-grid">
        <div class="panel admin-wide profile-summary">
          <img src="${escapeHtml(cover)}" alt="" />
          <div>
            <h3>${escapeHtml(state.user.name || state.user.email)}</h3>
            <p class="admin-help">${ui("Ovdje su tvoji dostupni ulazi i osnovni podaci profila.", "Your available areas and basic profile details are here.")}</p>
          </div>
          <div class="row-actions">
            ${canAdmin ? `<a class="btn" href="/admin" data-link>${ui("Admin panel", "Admin panel")}</a>` : ""}
            ${canShop ? `<a class="btn secondary" href="/webshop-upravljanje" data-link>${ui("Webshop panel", "Webshop panel")}</a>` : `<a class="btn secondary" href="/webshop" data-link>Webshop</a>`}
            ${canMeet ? `<a class="btn secondary" href="/meet-panel" data-link>Meet panel</a>` : ""}
            ${canGarage ? `<a class="btn secondary" href="/clanovi" data-link>${ui("Clanovi / garaza", "Members / garage")}</a>` : ""}
            <button class="btn secondary" data-action="logout">${tr("logout")}</button>
          </div>
        </div>
        <div class="panel admin-wide">
          <h3>${ui("Uredi profil", "Edit profile")}</h3>
          <form class="admin-form profile-form" data-form="user-profile">
            <label>${ui("Prikazano ime", "Display name")}<input name="name" value="${escapeHtml(state.user.name || "")}" /></label>
            <label>${tr("name")}<input name="firstName" value="${escapeHtml(profile.firstName || "")}" /></label>
            <label>${tr("lastName")}<input name="lastName" value="${escapeHtml(profile.lastName || "")}" /></label>
            ${phoneInputGroup(profile)}
            <label class="wide">${ui("Adresa", "Address")}<input name="address" value="${escapeHtml(profile.address || "")}" /></label>
            <label>${ui("Grad", "City")}<input name="city" value="${escapeHtml(profile.city || "")}" /></label>
            <label>${ui("Postanski broj", "Postal code")}<input name="postalCode" value="${escapeHtml(profile.postalCode || "")}" /></label>
            <label class="wide">${ui("Napomena", "Note")}<textarea name="note">${escapeHtml(profile.note || "")}</textarea></label>
            <label class="wide">${ui("Profilna slika URL", "Profile image URL")}<input name="profileImage" value="${escapeHtml(state.user.profileImage || "")}" placeholder="/uploads/..." /></label>
            <label class="wide">${ui("Odaberi profilnu sliku", "Choose profile image")}<input type="file" name="profileImageFile" accept="image/png,image/jpeg" /></label>
            <label class="wide">${ui("Naslovna slika URL", "Cover image URL")}<input name="coverImage" value="${escapeHtml(state.user.coverImage || "")}" placeholder="/uploads/..." /></label>
            <label class="wide">${ui("Odaberi naslovnu sliku", "Choose cover image")}<input type="file" name="coverImageFile" accept="image/png,image/jpeg" /></label>
            <label class="check-label"><input type="checkbox" name="removeProfileImage" /> ${ui("Makni profilnu sliku", "Remove profile image")}</label>
            <label class="check-label"><input type="checkbox" name="removeCoverImage" /> ${ui("Makni naslovnu sliku", "Remove cover image")}</label>
            <button class="btn wide" type="submit">${ui("Spremi profil", "Save profile")}</button>
          </form>
        </div>
      </div>
    </section>
  `;
}

async function adminPage() {
  if (!state.user) return accessLoginPage("admin");
  if (state.user.mustChangePassword) {
    app.innerHTML = `<section class="login-shell"><div class="login-box"><span class="kicker">${tr("mustChange")}</span><h1>${tr("changePassword")}</h1><form class="admin-form" data-form="change-password"><label>${tr("newPassword")}<input required type="password" minlength="8" name="password" /></label><button class="btn">${tr("changePassword")}</button></form></div></section>`;
    return;
  }
  if (state.user.role === "meet_manager") {
    await meetPanelPage();
    return;
  }
  if (state.user.role !== "admin" && (state.user.role === "meet_manager" || state.user.meetAccess)) {
    await meetPanelPage();
    return;
  }
  if (state.user.role === "shop_manager") {
    await shopManagePageV2();
    return;
  }
  if (state.user.role !== "admin") {
    memberProfilePage();
    return;
  }
  const dash = await api("/api/admin/dashboard");
  const settings = dash.settings || state.data.settings;
  app.innerHTML = `
    <section class="section alt" style="padding-top:128px">
      <div class="section-head">
        <h2>${tr("adminTitle")}</h2>
        <p>${tr("dashboard")}: ${dash.members.length} clanova, ${dash.events.length} eventa, ${dash.inbox.length} emailova.</p>
      </div>
      <div class="admin-grid">
        ${adminPanelSwitch()}
        <div class="panel admin-wide"><h3>Pristupi korisnika</h3><p class="admin-help">Odredi moze li pojedini email koristiti webshop, garazu ili oboje. Korisnika mozes i obrisati.</p><div class="access-admin-list">${dash.users.map(accessUserRow).join("")}</div></div>
        <div class="panel admin-wide">
          <h3>Upload slika s racunala</h3>
          <form class="admin-form" data-form="upload-image">
            <label>Odaberi JPG ili PNG<input required type="file" name="image" accept="image/png,image/jpeg" /></label>
            <button class="btn" type="submit">Upload slike</button>
            <label>URL zadnje uploadane slike<input id="uploadResult" readonly placeholder="/uploads/..." /></label>
            <p class="admin-help">Nakon uploada kopiraj URL u polje slike gdje ga zelis koristiti: heroImages, historyImages, member car cover/images, event image, sponsor logo itd.</p>
          </form>
        </div>
        <div class="panel">
          <h3>Postavke naslovnice</h3>
          <form class="admin-form" data-form="settings">
            <label>Broj clanova kluba<input required type="number" name="memberCount" value="${settings.memberCount || 52}" /></label>
            <label>Susreta koji smo posjetili<input required type="number" name="visitedMeetsCount" value="${settings.visitedMeetsCount || 0}" /></label>
            <label>SOON tekst HR<input name="soonTextHr" value="${escapeHtml(settings.soonTextHr || tr("soonMeet"))}" /></label>
            <label>SOON tekst EN<input name="soonTextEn" value="${escapeHtml(settings.soonTextEn || tr("soonMeet"))}" /></label>
            <label>Hero slike, odvojene zarezom<input name="heroImages" value="${escapeHtml((settings.heroImages || []).join(", "))}" /></label>
            <label>O klubu HR<textarea name="aboutHr">${escapeHtml(settings.aboutHr || "")}</textarea></label>
            <label>O klubu EN<textarea name="aboutEn">${escapeHtml(settings.aboutEn || "")}</textarea></label>
            <label>Povijest HR<textarea name="historyHr">${escapeHtml(settings.historyHr || "")}</textarea></label>
            <label>Povijest EN<textarea name="historyEn">${escapeHtml(settings.historyEn || "")}</textarea></label>
            <label>Slike povijesti, odvojene zarezom<input name="historyImages" value="${escapeHtml((settings.historyImages || []).join(", "))}" /></label>
            <button class="btn" type="submit">Spremi postavke</button>
          </form>
        </div>
        <div class="panel">
          <h3>${tr("addMember")}</h3>
          <form class="admin-form" data-form="add-member">
            <label>${tr("email")}<input required type="email" name="email" /></label>
            <label>${tr("tempPassword")}<input name="tempPassword" value="ulaz123ulaz" /></label>
            <button class="btn" type="submit">${tr("addMember")}</button>
          </form>
        </div>
        <div class="panel">
          <h3>Reset lozinke clana</h3>
          <form class="admin-form" data-form="reset-password">
            <label>Email clana<input required type="email" name="email" /></label>
            <label>Nova privremena lozinka<input required name="password" value="ulaz123ulaz" minlength="8" /></label>
            <button class="btn" type="submit">Postavi privremenu lozinku</button>
          </form>
          <p class="admin-help">Admin moze postaviti novu privremenu lozinku, ali ne moze vidjeti staru lozinku.</p>
        </div>
        <div class="panel admin-wide"><h3>Uredi sve clanove, aute, slike i social tagove</h3><form class="admin-form" data-form="json-data" data-key="members"><textarea name="json" class="json-editor">${jsonForEdit(dash.members)}</textarea><button class="btn" type="submit">Spremi clanove</button></form></div>
        <div class="panel admin-wide"><h3>Uredi novosti / tekstove</h3><form class="admin-form" data-form="json-data" data-key="posts"><textarea name="json" class="json-editor">${jsonForEdit(dash.posts)}</textarea><button class="btn" type="submit">Spremi novosti</button></form></div>
        <div class="panel admin-wide"><h3>Uredi susrete / mapu / slike eventa</h3><p class="admin-help">Za automatski grad/tocku dodaj polje "location" ili "address", npr. "Autopraonica Zapresic".</p><form class="admin-form" data-form="json-data" data-key="events"><textarea name="json" class="json-editor">${jsonForEdit(dash.events)}</textarea><button class="btn" type="submit">Spremi susrete</button></form></div>
        <div class="panel admin-wide"><h3>Uredi sponzore</h3><form class="admin-form" data-form="json-data" data-key="sponsors"><textarea name="json" class="json-editor">${jsonForEdit(dash.sponsors)}</textarea><button class="btn" type="submit">Spremi sponzore</button></form></div>
        <div class="panel admin-wide"><h3>${tr("inbox")}</h3><div class="admin-list">${dash.inbox.map(mail => `<div class="list-row"><strong>${mail.subject}</strong><small>${mail.to} · ${mail.createdAt}</small><p>${mail.text}</p></div>`).join("") || "-"}</div></div>
        <div class="panel admin-wide"><h3>Clanovi</h3><div class="admin-list">${dash.members.map(m => `<div class="list-row"><strong>${m.name}</strong><small>${m.email}</small><p>${(m.cars || []).length} auta · ${m.competitions || ""}</p></div>`).join("")}</div></div>
        <div class="panel admin-wide"><h3>${tr("contacts")} / ${tr("joinRequests")}</h3><div class="admin-list">${[...dash.contacts, ...dash.joinRequests].map(item => `<div class="list-row"><strong>${item.name || item.email}</strong><small>${item.email || ""} · ${item.createdAt}</small><p>${item.message || item.car || ""}</p></div>`).join("") || "-"}</div></div>
      </div>
    </section>`;
}

function orderManageCard(order) {
  const profile = order.profile || {};
  const billing = `${profile.billingStreet || "-"} ${profile.billingHouseNumber || ""}, ${profile.billingPostalCode || ""} ${profile.billingCity || ""}`;
  return `<form class="order-manage order-manage-rich" data-form="shop-order">
    <input type="hidden" name="id" value="${order.id}" />
    <div>
      <strong>${escapeHtml(order.id)} · ${escapeHtml(profile.firstName || "")} ${escapeHtml(profile.lastName || "")}</strong>
      <small>${escapeHtml(order.customerEmail)} · ${escapeHtml(fullPhone(profile))}</small>
      <small>${order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")} · ${euro(order.total)}</small>
    </div>
    <div class="order-detail-grid">
      <span><strong>Dostava:</strong> ${escapeHtml(orderDeliveryLine(order))}</span>
      <span><strong>Placanje:</strong> ${escapeHtml(orderPaymentLabel(order.paymentMethod))}</span>
      <span class="wide"><strong>Podaci za uplatu:</strong> ${escapeHtml(billing)}${profile.billingNote ? ` · ${escapeHtml(profile.billingNote)}` : ""}</span>
      <span class="payment-badge">${escapeHtml(order.paymentStatus || "Ceka uplatu")}</span>
    </div>
    <div class="order-manage-fields">
      <label>Status uplate<select name="paymentStatus">${["Ceka uplatu", "Placeno", "Pouzecem", "Refundirano"].map(status => `<option${status === (order.paymentStatus || "Ceka uplatu") ? " selected" : ""}>${status}</option>`).join("")}</select></label>
      <label>Status paketa<select name="status">${["Nova", "Potvrdena", "U pripremi", "Poslana", "Preuzeta", "Otkazana"].map(status => `<option${status === order.status ? " selected" : ""}>${status}</option>`).join("")}</select></label>
      <label>Sluzba slanja<input name="trackingCarrier" value="${escapeHtml(order.trackingCarrier || "")}" placeholder="GLS, Paket24..." /></label>
      <label>Tracking kod<input name="trackingCode" value="${escapeHtml(order.trackingCode || "")}" /></label>
    </div>
    <button class="btn secondary">Spremi i posalji obavijest</button>
  </form>`;
}

async function shopManagePageV2() {
  if (!state.user || !["admin", "shop_manager"].includes(state.user.role)) return navigate("/webshop-login");
  const shop = await api("/api/shop/manage");
  const productForm = product => `<form class="product-admin-card" data-form="shop-product"><input type="hidden" name="id" value="${product.id || ""}" /><img src="${product.image || "/assets/cuneri-logo.png"}" alt="" /><div class="product-admin-fields"><label>Naziv<input required name="name" value="${escapeHtml(product.name || "")}" /></label><label>Kategorija<input required name="category" value="${escapeHtml(product.category || "")}" /></label><label class="wide">Opis<textarea name="description">${escapeHtml(product.description || "")}</textarea></label><label>Cijena EUR<input required type="number" step="0.01" min="0" name="price" value="${Number(product.price || 0)}" /></label><label>SALE popust %<input type="number" min="0" max="100" name="salePercent" value="${Number(product.salePercent || 0)}" /></label><label>Zaliha<input required type="number" min="0" name="stock" value="${Number(product.stock || 0)}" /></label><label>URL slike<input name="image" value="${escapeHtml(product.image || "")}" /></label><label>Musko / zensko, odvojeno zarezom<input name="audiences" value="${escapeHtml((product.audiences || []).join(", "))}" /></label><label>Boje, odvojeno zarezom<input name="colors" value="${escapeHtml((product.colors || []).join(", "))}" /></label><label>Velicine, odvojeno zarezom<input name="sizes" value="${escapeHtml((product.sizes || []).join(", "))}" /></label><label class="check-label"><input type="checkbox" name="active" ${product.active !== false ? "checked" : ""} /> Artikl je vidljiv</label><div class="product-admin-actions"><button class="btn" type="submit">Spremi</button>${product.id ? `<button class="btn danger" type="button" data-delete-product="${product.id}">Obrisi</button>` : ""}</div></div></form>`;
  app.innerHTML = `<section class="section alt shop-admin-page"><div class="section-head"><h2>Webshop upravljanje</h2><p>Narudzbe, placanja, dostava i artikli.</p></div><div class="admin-grid">${adminPanelSwitch()}${shopSeizedControl(shop.settings || {})}<div class="panel admin-wide"><h3>1. Upload slike</h3><form class="admin-form" data-form="shop-upload"><label>JPG ili PNG<input required type="file" name="image" accept="image/png,image/jpeg" /></label><button class="btn">Upload slike</button><label>Dobiveni URL slike<input id="shopUploadResult" readonly placeholder="/uploads/..." /></label></form></div><div class="panel admin-wide"><h3>2. Dodaj novi artikl</h3>${productForm({ active: true })}</div><div class="admin-wide product-admin-list"><h3>Postojeci artikli</h3>${shop.products.map(productForm).join("")}</div><div class="panel admin-wide"><h3>Kuponi</h3><div class="coupon-grid">${shop.coupons.map(coupon => `<form class="coupon-card" data-form="shop-coupon"><input type="hidden" name="id" value="${coupon.id}" /><label>Kod<input required name="code" value="${escapeHtml(coupon.code)}" /></label><label>Popust %<input required type="number" min="1" max="100" name="percent" value="${coupon.percent}" /></label><label>Maksimalno koristenja<input required type="number" min="1" name="maxUses" value="${coupon.maxUses}" /></label><span>Iskoristeno: ${coupon.usedCount || 0}</span><label class="check-label"><input type="checkbox" name="firstOrderOnly" ${coupon.firstOrderOnly ? "checked" : ""} /> Samo prva kupnja</label><label class="check-label"><input type="checkbox" name="active" ${coupon.active !== false ? "checked" : ""} /> Aktivan</label><button class="btn">Spremi kupon</button></form>`).join("")}<form class="coupon-card new" data-form="shop-coupon"><h4>Novi kupon</h4><label>Kod<input required name="code" /></label><label>Popust %<input required type="number" min="1" max="100" name="percent" /></label><label>Broj koristenja<input required type="number" min="1" name="maxUses" value="1" /></label><label class="check-label"><input type="checkbox" name="firstOrderOnly" /> Samo prva kupnja</label><label class="check-label"><input type="checkbox" name="active" checked /> Aktivan</label><button class="btn">Dodaj kupon</button></form></div></div><div class="panel admin-wide"><h3>Narudzbe i dostava</h3><div class="admin-list">${shop.orders.map(orderManageCard).join("") || "Nema narudzbi."}</div></div></div></section>`;
}

function home() {
  const about = state.lang === "hr" ? state.data.settings.aboutHr : state.data.settings.aboutEn;
  const soonText = state.lang === "hr" ? state.data.settings.soonTextHr : state.data.settings.soonTextEn;
  app.innerHTML = `
    <section class="hero">
      <div class="hero-img" id="heroImg" style="background-image:url('${imageForHero()}')"></div>
      <div class="hero-content">
        <div class="kicker">${tr("heroKicker")}</div>
        <h1>${tr("heroTitle")}</h1>
        <p>${tr("heroText")}</p>
        <div class="hero-actions">
          <a class="btn" href="/kontakt" data-link>${tr("join")}</a>
          <a class="btn secondary" href="/clanovi" data-link>${tr("seeMembers")}</a>
          <a class="btn shop-cta" href="/webshop" data-link>Webshop</a>
        </div>
      </div>
      <button class="drive-by drive-by-one discount-car" data-discount-car aria-label="Uhvati 2CV za popust"><img src="/assets/2cv-outline.svg" alt="" /></button>
    </section>
    <section class="section motion-section feather-section history-road">
      <div class="drive-by drive-by-history" aria-hidden="true"><img src="/assets/2cv-outline.svg" alt="" /></div>
      <div class="section-head">
        <h2>${tr("aboutTitle")}</h2>
        <p>${about}</p>
      </div>
      <div class="about-grid">
        <div class="panel big">
          <div class="stat"><strong>${state.data.settings.memberCount || 52}</strong><span>${tr("clubMembers")}</span></div>
          <div class="stat"><strong>${state.data.settings.visitedMeetsCount || 0}</strong><span>${tr("visitedMeets")}</span></div>
          <p class="soon-text">${soonText || tr("soonMeet")}</p>
          <p>${tr("aboutSide")}</p>
        </div>
        <div class="panel small">
          <h3>${tr("interested")}</h3>
          <form class="join-form" data-form="join">
            <label>${tr("name")}<input required name="name" /></label>
            <label>${tr("email")}<input required type="email" name="email" /></label>
            <label>${tr("car")}<input name="car" /></label>
            <label>${tr("message")}<textarea name="message"></textarea></label>
            <button class="btn" type="submit">${tr("send")}</button>
          </form>
        </div>
      </div>
    </section>
    ${visualShowcase()}
    ${newsWeather()}
    ${sponsors()}
    ${clubFooter()}
  `;
  startHeroLoop();
}

function visualShowcase() {
  return `
    <section class="visual-strip motion-section">
      <img src="/assets/meet-lineup.svg" alt="Cuneri lineup" />
      <img src="/assets/member-roadster.svg" alt="Cuneri roadster" />
      <img src="/assets/member-wagon.svg" alt="Cuneri wagon" />
    </section>
  `;
}

function startHeroLoop() {
  const hero = $("#heroImg");
  if (!hero) return;
  clearInterval(window.cuneriHeroTimer);
  window.cuneriHeroTimer = setInterval(() => {
    const images = state.data.settings.heroImages;
    state.heroIndex = (state.heroIndex + 1) % images.length;
    hero.style.opacity = ".2";
    setTimeout(() => {
      hero.style.backgroundImage = `url('${images[state.heroIndex]}')`;
      hero.style.opacity = "1";
    }, 280);
  }, 5200);
}

function membersPage() {
  app.innerHTML = `
    <section class="section alt" style="padding-top:128px">
      <div class="section-head">
        <h2>${tr("membersTitle")}</h2>
        <p>${tr("membersText")}</p>
      </div>
      <div class="members-grid">
        ${state.data.members.map(memberCard).join("")}
      </div>
    </section>
    <aside class="detail" id="detail"></aside>
    ${sponsors()}
    ${clubFooter()}
  `;
}

function memberCard(member) {
  const car = member.cars[0] || {};
  const socials = [socialIcon("instagram", member.instagram), socialIcon("tiktok", member.tiktok)].join("");
  return `
    <article class="member-card">
      <img src="${car.cover || "/assets/hero-garage.svg"}" alt="${member.name}" />
      <div class="content">
        <h3>${member.name}</h3>
        ${socials ? `<div class="socials">${socials}</div>` : ""}
        <p>${member.bio || ""}</p>
        <div class="tag-list">
          ${(member.cars || []).map(c => `<span class="tag">${c.name}</span>`).join("")}
          <span class="tag">${member.competitions || tr("competes")}</span>
        </div>
        <button class="btn secondary" data-member="${member.id}">${tr("more")}</button>
      </div>
    </article>
  `;
}

function openMember(id) {
  const member = state.data.members.find(item => item.id === id);
  const detail = $("#detail");
  detail.innerHTML = `
    <div class="detail-inner">
      <div class="section-head" style="margin-bottom:18px">
        <h2>${member.name}</h2>
        <button class="btn secondary" data-close-detail>${tr("close")}</button>
      </div>
      <p>${member.bio || ""}</p>
      ${(member.cars || []).map(car => `
        <div class="panel" style="margin-top:18px">
          <h3>${car.name}</h3>
          <p><strong>${tr("mods")}:</strong> ${car.mods || ""}</p>
          <p><strong>${tr("competes")}:</strong> ${car.competesIn || ""}</p>
          <p>${car.details || ""}</p>
          <div class="gallery">${(car.images || [car.cover]).map(img => `<img src="${img}" alt="${car.name}" />`).join("")}</div>
        </div>
      `).join("")}
    </div>
  `;
  detail.classList.add("is-open");
}

function contactPage() {
  app.innerHTML = `
    <section class="section" style="padding-top:128px">
      <div class="section-head">
        <h2>${tr("contactTitle")}</h2>
        <p>${tr("contactText")}</p>
      </div>
      <div class="form-grid">
        <form class="form-box contact-form" data-form="contact">
          <label>${tr("name")}<input required name="name" /></label>
          <label>${tr("lastName")}<input required name="lastName" /></label>
          <label>${tr("email")}<input required type="email" name="email" /></label>
          <label>${tr("company")}<input name="company" /></label>
          <label>${tr("subject")}<input required name="subject" /></label>
          <label>${tr("message")}<textarea required name="message"></textarea></label>
          <button class="btn" type="submit">${tr("send")}</button>
        </form>
        <div class="panel">
          <h3>ĆUNERI HQ</h3>
          <p>tccuneri@gmail.com</p>
          <p>Instagram / TikTok: @cuneri</p>
          <p>${tr("interested")} ${tr("join").toLowerCase()}.</p>
        </div>
      </div>
    </section>
    ${clubFooter()}
  `;
}

function mapsPage() {
  app.innerHTML = `
    <section class="section alt" style="padding-top:128px">
      <div class="section-head">
        <h2>${tr("mapsTitle")}</h2>
        <p>${tr("mapsText")}</p>
      </div>
      <div class="map-wrap">
        <div class="cro-map">
          <div class="cro-shape"></div>
          ${state.data.events.map(e => `<button class="pin" style="--x:${e.x};--y:${e.y}" data-city="${e.city}" data-event="${e.id}" aria-label="${e.title}"></button>`).join("")}
        </div>
        <div class="event-list">
          ${state.data.events.map(eventCard).join("")}
        </div>
      </div>
    </section>
  `;
}

function eventCard(event) {
  const count = (event.attendees || []).length;
  return `
    <article class="event-card" id="${event.id}">
      <img src="${event.image}" alt="${event.title}" />
      <h3>${event.title}</h3>
      <div class="event-date">${event.date} • ${event.time} • ${event.city}</div>
      ${event.location || event.address ? `<p class="event-location">${event.location || event.address}</p>` : ""}
      <p>${event.description}</p>
      <div class="event-actions">
        <button class="btn" data-attend="${event.id}">DOLAZIM</button>
        <button class="btn secondary" data-toggle-attendees="${event.id}">Više (${count})</button>
      </div>
      <form class="guest-form" data-form="guest-attend" data-event-id="${event.id}" hidden>
        <label>Ime<input required name="firstName" /></label>
        <label>Prezime<input required name="lastName" /></label>
        <label>Instagram<input name="instagram" /></label>
        <label>Auto (marka / model / boja)<input required name="car" placeholder="VW Golf, crni" /></label>
        <button class="btn" type="submit">Potvrdi dolazak</button>
      </form>
      <div class="attendee-list" data-attendees="${event.id}" hidden>
        ${attendeeList(event)}
      </div>
    </article>
  `;
}

function attendeeList(event) {
  const attendees = event.attendees || [];
  const canManageMeet = state.user?.meetAccess || event.canManageMeet || ["admin", "meet_manager"].includes(state.user?.role);
  if (event.clubMeet && !canManageMeet) return `<p class="admin-help">${ui("Popis dolazaka vide samo admin i voditelj meetova.", "Only admins and meet managers can see the attendee list.")}</p>`;
  if (!attendees.length) return `<p class="admin-help">Jos nema prijavljenih dolazaka.</p>`;
  return attendees.map(item => {
    const socials = [
      item.instagram ? `<a href="${socialProfileUrl("instagram", item.instagram)}" target="_blank" rel="noopener">IG: ${escapeHtml(socialHandle(item.instagram))}</a>` : "",
      item.tiktok ? `<a href="${socialProfileUrl("tiktok", item.tiktok)}" target="_blank" rel="noopener">TT: ${escapeHtml(socialHandle(item.tiktok))}</a>` : ""
    ].filter(Boolean).join(" ");
    const images = (item.images || []).length ? `<small>${(item.images || []).length} slika u CSV exportu</small>` : "";
    return `<div class="attendee-row attendee-row-detailed"><div><strong>${escapeHtml(item.name || "Gost")}</strong>${socials ? `<small>${socials}</small>` : ""}${images}</div><span>${escapeHtml(item.car || "Auto")}</span></div>`;
  }).join("");
}

function mapsPageV2() {
  const cities = Object.values(state.data.events.reduce((groups, event) => {
    const key = event.city || "Ostalo";
    groups[key] ||= { city: key, x: event.x, y: event.y, events: [] };
    groups[key].events.push(event);
    return groups;
  }, {}));
  app.innerHTML = `
    <section class="section alt" style="padding-top:128px">
      <div class="section-head"><h2>${tr("mapsTitle")}</h2><p>${tr("mapsText")}</p></div>
      <div class="map-public-actions"><button class="btn add-event-btn" type="button" data-open-event-form><span>+</span> Dodaj event</button><p>Event mogu dodati clanovi i gosti.</p></div>
      <div class="map-wrap map-wrap-wide">
        <div class="cro-map cro-map-wide">
          <div class="cro-shape"></div>
          ${cities.map(group => `<button class="pin" style="--x:${group.x};--y:${group.y}" data-city="${escapeHtml(group.city)}" data-map-city="${escapeHtml(group.city)}" aria-label="${escapeHtml(group.city)}: ${group.events.length}"><span>${group.events.length}</span></button>`).join("")}
          <aside class="map-city-panel" id="mapCityPanel" hidden></aside>
        </div>
        <p class="map-hint">Klikni crvenu tocku za susrete i druzenja u tom gradu.</p>
      </div>
    </section>
    <aside class="public-event-modal" id="publicEventModal" hidden><div class="event-detail-backdrop" data-close-event-form></div><div class="public-event-box"><button class="map-close" type="button" data-close-event-form>&times;</button><span class="kicker">JAVNI DOGADAJ</span><h2>Dodaj susret</h2><p>Upisi tocnu lokaciju kako bi se grad i tocka automatski prikazali na karti.</p><form class="public-event-form" data-form="public-event"><label>Naziv eventa<input required name="title" maxlength="100" /></label><label>Grad<input required name="city" placeholder="npr. Zapresic" /></label><label class="wide">Tocna lokacija / adresa<input required name="location" placeholder="npr. Autopraonica, Ulica 1, Zapresic" /></label><label>Datum<input required type="date" name="date" /></label><label>Vrijeme<input required type="time" name="time" /></label><label>Ime organizatora<input required name="organizerName" /></label><label>Kontakt email<input required type="email" name="organizerEmail" /></label><label class="wide">Opis<textarea required name="description" maxlength="1200"></textarea></label><button class="btn wide" type="submit">Objavi event na karti</button></form></div></aside>
    <aside class="event-detail-modal" id="eventDetail" hidden></aside>
    ${clubFooter()}`;
}

function cityEventsPanel(city) {
  const events = state.data.events.filter(event => event.city === city);
  return `<div class="map-panel-head"><div><small>${escapeHtml(city)}</small><h3>${events.length} ${events.length === 1 ? "dogadaj" : "dogadaja"}</h3></div><button class="map-close" data-close-city aria-label="Zatvori">&times;</button></div>
    <div class="city-event-list">${events.map(event => `<article class="city-event-row">
      <img src="${event.image || "/assets/hero-night.svg"}" alt="${escapeHtml(event.title)}" />
      <div><strong>${escapeHtml(event.title)}</strong><span>${escapeHtml(event.date)} &middot; ${escapeHtml(event.time || "")}</span></div>
      <button class="btn secondary" data-event-more="${event.id}">${tr("more")}</button>
    </article>`).join("")}</div>`;
}

function eventDetail(event) {
  const count = Number(event.attendeeCount ?? (event.attendees || []).length);
  const member = state.user ? state.data.members.find(item => item.userId === state.user.id) : null;
  const cars = member?.cars || [];
  const isAttending = (event.attendees || []).some(item => item.mine || item.userId === state.user?.id);
  const canManageMeet = state.user?.meetAccess || event.canManageMeet || ["admin", "meet_manager"].includes(state.user?.role);
  const canAdminMeet = event.canAdminMeet || state.user?.role === "admin";
  const clubMeet = Boolean(event.clubMeet);
  const actions = clubMeet
    ? `${state.user && (state.user.garageAccess || state.user.role === "admin") ? loggedInAttend(event, cars, isAttending) : state.user ? "" : `<a class="btn" href="/webshop-login" data-link>${ui("Prijavi se", "Sign in")}</a>`}${canManageMeet ? `<button class="btn secondary" data-toggle-attendees="${event.id}">${ui("Popis dolazaka", "Attendee list")} (${count})</button><a class="btn secondary" href="/api/meet-manager/event/export?eventId=${encodeURIComponent(event.id)}">${ui("Download Excel", "Download Excel")}</a>` : ""}`
    : `${state.user && (state.user.garageAccess || state.user.role === "admin") ? loggedInAttend(event, cars, isAttending) : `<button class="btn" data-attend="${event.id}">${ui("DOLAZIM", "ATTEND")}</button>`}<button class="btn secondary" data-toggle-attendees="${event.id}">${ui("Popis dolazaka", "Attendee list")} (${count})</button>${canAdminMeet ? `<button class="btn secondary" type="button" data-enable-club-meet="${event.id}">${ui("Pretvori u klupski meet", "Make club meet")}</button>` : ""}`;
  return `<div class="event-detail-backdrop" data-close-event></div><article class="event-card event-card-detail" id="${event.id}">
    <button class="map-close event-close" data-close-event aria-label="Zatvori">&times;</button>
    <img src="${event.image || "/assets/hero-night.svg"}" alt="${escapeHtml(event.title)}" />
    <h3>${escapeHtml(event.title)}</h3>
    <div class="event-date">${escapeHtml(event.date)} &middot; ${escapeHtml(event.time || "")} &middot; ${escapeHtml(event.city || "")}</div>
    ${event.location || event.address ? `<p class="event-location">${escapeHtml(event.location || event.address)}</p>` : ""}
    <p>${escapeHtml(event.description || "")}</p><div class="event-count"><strong>${count}</strong><span> ljudi dolazi</span></div>
    <div class="event-actions">${state.user ? loggedInAttend(event, cars, isAttending) : `<button class="btn" data-attend="${event.id}">DOLAZIM</button>`}<button class="btn secondary" data-toggle-attendees="${event.id}">Popis dolazaka (${count})</button></div>
    <form class="guest-form" data-form="guest-attend" data-event-id="${event.id}" hidden>
      <label>Ime / nick<input required name="firstName" /></label><label>Prezime<input name="lastName" /></label>
      <label>Instagram nick<input name="instagram" placeholder="@username" /></label><label>Auto (marka / model / boja)<input required name="car" placeholder="VW Golf, crni" /></label>
      <button class="btn" type="submit">Potvrdi dolazak</button>
    </form><div class="attendee-list" data-attendees="${event.id}" hidden>${attendeeList(event)}</div>
  </article>`;
}

function loggedInAttend(event, cars, isAttending) {
  if (isAttending) return `<span class="attending-badge">Prijavljen/a si</span>`;
  if (cars.length > 1) return `<form class="member-attend" data-form="member-attend" data-event-id="${event.id}"><label>Dolazim s automobilom<select required name="carId">${cars.map(car => `<option value="${car.id}">${escapeHtml(car.name)}</option>`).join("")}</select></label><button class="btn" type="submit">DOLAZIM</button></form>`;
  return `<button class="btn" data-attend="${event.id}">DOLAZIM${cars[0] ? ` &middot; ${escapeHtml(cars[0].name)}` : ""}</button>`;
}

function openEventDetail(eventId) {
  const selected = state.data.events.find(item => item.id === eventId);
  const modal = document.querySelector("#eventDetail");
  if (!selected || !modal) return;
  modal.innerHTML = eventDetail(selected);
  modal.hidden = false;
}

function localHourly(cityIndex) {
  const now = new Date();
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(now.getTime() + (index + 1) * 60 * 60 * 1000);
    const hour = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    return {
      hour,
      temp: 18 + cityIndex + index,
      textHr: ["Vedro", "Sunčano", "Lagani oblaci", "Vjetar", "Moguća kiša"][(cityIndex + index) % 5],
      textEn: ["Clear", "Sunny", "Light clouds", "Wind", "Chance of rain"][(cityIndex + index) % 5]
    };
  });
}

function localTimeZoneLabel() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
  } catch {
    return "Local time";
  }
}

function newsWeather() {
  return `
    <section class="section alt motion-section">
      <div class="section-head"><h2>${tr("newsTitle")}</h2><p>Prognoza je složena po gradovima: 5 dana jedan ispod drugoga i satni pregled za današnji dan prema vremenskoj zoni browsera.</p></div>
      <div class="news-grid news-spaced">
        ${state.data.posts.map(post => `
          <article class="news-card">
            <h3>${state.lang === "hr" ? post.titleHr : post.titleEn}</h3>
            <p>${state.lang === "hr" ? post.textHr : post.textEn}</p>
          </article>
        `).join("")}
      </div>
      <div class="weather-stack">
        ${state.data.weather.map((city, cityIndex) => `
          <div class="weather-area">
            <div class="weather-city">${city.city}<span>${localTimeZoneLabel()}</span></div>
            <div class="weather-pair">
              <article class="weather-card">
                <div class="weather-title">
                  <h3>5 dana</h3>
                  <span>${city.city}</span>
                </div>
                <div class="forecast forecast-days">
                ${city.days.map(day => `<div class="day"><span>${day.date.slice(5)}</span><strong>${day.temp}°</strong><span>${state.lang === "hr" ? day.textHr : day.textEn}</span></div>`).join("")}
                </div>
              </article>
              <article class="weather-card">
                <div class="weather-title">
                  <h3>5 sati</h3>
                  <span>${state.lang === "hr" ? "danas" : "today"}</span>
                </div>
                <div class="forecast forecast-hours">
                ${localHourly(cityIndex).map(hour => `<div class="day hour"><span>${hour.hour}</span><strong>${hour.temp}°</strong><span>${state.lang === "hr" ? hour.textHr : hour.textEn}</span></div>`).join("")}
                </div>
              </article>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function weatherSourceText() {
  if (state.forecast.status === "loading") return state.lang === "hr" ? "Ucitavanje stvarne prognoze..." : "Loading live forecast...";
  if (state.forecast.status === "error") return state.forecast.error;
  if (!state.forecast.updatedAt) return state.lang === "hr" ? "Spremno za prognozu" : "Ready for forecast";
  const time = new Intl.DateTimeFormat(state.lang === "hr" ? "hr-HR" : "en-US", { hour: "2-digit", minute: "2-digit" }).format(new Date(state.forecast.updatedAt));
  const source = state.forecast.source === "browser"
    ? (state.lang === "hr" ? "lokacija uredaja" : "device location")
    : (state.lang === "hr" ? "zadani gradovi" : "default cities");
  return `${source} · ${time}`;
}

function localTimeZoneLabel(value) {
  try {
    return value || Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
  } catch {
    return value || "Local time";
  }
}

function newsWeather() {
  const weatherItems = state.forecast.items.length ? state.forecast.items : [];
  const emptyWeather = state.forecast.status === "error"
    ? `<div class="weather-empty"><strong>${state.lang === "hr" ? "Prognoza trenutno nije dostupna." : "Forecast is not available right now."}</strong><span>${escapeHtml(state.forecast.error)}</span><button class="btn secondary" data-weather-refresh>${state.lang === "hr" ? "Pokusaj ponovno" : "Try again"}</button></div>`
    : `<div class="weather-empty"><strong>${state.lang === "hr" ? "Ucitavanje prognoze..." : "Loading forecast..."}</strong><span>${state.lang === "hr" ? "Ako lokacija nije dopustena, prikazat ce se hrvatski gradovi." : "If location is not allowed, Croatian cities will be shown."}</span></div>`;
  return `
    <section class="section alt motion-section">
      <div class="section-head weather-head"><div><h2>${tr("newsTitle")}</h2><p>${state.lang === "hr" ? "Prognoza se automatski uskladuje s lokacijom i lokalnim vremenom uredaja." : "Forecast automatically follows the device location and local time."}</p></div><button class="btn secondary" data-weather-refresh>${state.lang === "hr" ? "Osvjezi prognozu" : "Refresh forecast"}</button><small>${escapeHtml(weatherSourceText())}</small></div>
      <div class="news-grid news-spaced">
        ${state.data.posts.map(post => `
          <article class="news-card">
            <h3>${state.lang === "hr" ? post.titleHr : post.titleEn}</h3>
            <p>${state.lang === "hr" ? post.textHr : post.textEn}</p>
          </article>
        `).join("")}
      </div>
      <div class="weather-stack">
        ${weatherItems.length ? weatherItems.map(city => `
          <div class="weather-area">
            <div class="weather-city">${escapeHtml(city.city)}<span>${escapeHtml(localTimeZoneLabel(city.timezone))}</span></div>
            <div class="weather-pair">
              <article class="weather-card">
                <div class="weather-title">
                  <h3>5 dana</h3>
                  <span>${escapeHtml(city.city)}</span>
                </div>
                <div class="forecast forecast-days">
                ${city.days.map(day => `<div class="day"><span>${day.date.slice(5)}</span><strong>${day.max}°</strong><span>${escapeHtml(state.lang === "hr" ? day.textHr : day.textEn)}</span><small>${day.min}° / ${day.max}°</small></div>`).join("")}
                </div>
              </article>
              <article class="weather-card">
                <div class="weather-title">
                  <h3>5 sati</h3>
                  <span>${state.lang === "hr" ? "lokalno" : "local"}</span>
                </div>
                <div class="forecast forecast-hours">
                ${city.hours.map(hour => `<div class="day hour"><span>${hour.hour}</span><strong>${hour.temp}°</strong><span>${escapeHtml(state.lang === "hr" ? hour.textHr : hour.textEn)}</span></div>`).join("")}
                </div>
              </article>
            </div>
          </div>
        `).join("") : emptyWeather}
      </div>
    </section>
  `;
}

function historyPage() {
  const text = state.lang === "hr" ? state.data.settings.historyHr : state.data.settings.historyEn;
  const images = [...(state.data.settings.historyImages || state.data.settings.heroImages), ...extraVisuals];
  const paragraphs = String(text || "").split("\n\n").filter(Boolean);
  return app.innerHTML = `
    <section class="history-hero">
      <div class="history-bg" style="background-image:url('${images[0] || "/assets/hero-night.svg"}')"></div>
      <div class="hero-content">
        <div class="kicker">${tr("historyAdmin")}</div>
        <h1>${tr("historyTitle")}</h1>
        <p>${tr("historyText")}</p>
      </div>
    </section>
    <section class="section motion-section feather-section history-road">
      <div class="drive-by drive-by-history" aria-hidden="true"><img src="/assets/member-wagon.svg" alt="" /></div>
      <div class="history-mosaic">
        ${paragraphs.map((paragraph, index) => {
          const image = images[index % images.length];
          const secondImage = images[(index + 1) % images.length];
          if (index % 3 === 1) {
            return `<div class="history-double reveal"><img src="${image}" alt="Ćuneri history ${index + 1}" /><img src="${secondImage}" alt="Ćuneri history ${index + 2}" /></div><article class="history-text solo"><span>0${index + 1}</span><p>${paragraph}</p></article>`;
          }
          return `<article class="history-split ${index % 2 ? "flip" : ""}"><img src="${image}" alt="Ćuneri history ${index + 1}" /><div class="history-text"><span>0${index + 1}</span><p>${paragraph}</p></div></article>`;
        }).join("")}
      </div>
    </section>
    ${sponsors()}
    ${clubFooter()}
  `;
}

function sponsors() {
  const list = [...state.data.sponsors, ...state.data.sponsors, ...state.data.sponsors];
  return `
    <section class="sponsors" id="sponzori" aria-label="${tr("sponsors")}">
      <div class="sponsor-track">
        ${list.map(sponsor => `<a class="sponsor" href="${sponsor.url}">${sponsor.logoText || sponsor.name}</a>`).join("")}
      </div>
    </section>
  `;
}

function termsPage() {
  const sections = [
    ["1. Podaci o trgovcu", `Webshop vodi Tuning Crew Cuneri, 1. odvojak Purgarije 24b, 10310 Kerestinec, Hrvatska, email tccuneri@gmail.com. OIB: XXXXXXXXXXXXX. <strong>Webshop se ne smije pustiti u stvarnu prodaju dok nisu uneseni tocan pravni naziv subjekta, OIB, registracijski podaci, odgovorna osoba i potpuni kontaktni podaci trgovca.</strong>`],
    ["2. Primjena uvjeta", `Ovi Uvjeti primjenjuju se na koristenje webshopa, registraciju korisnika, narucivanje, placanje, dostavu, povrate, reklamacije i sva druga prava i obveze nastale kupnjom. Kupac prije slanja narudzbe mora imati mogucnost procitati Uvjete i izricito potvrditi da ih prihvaca. Potrosac je fizicka osoba koja sklapa pravni posao izvan svoje trgovacke, poslovne, obrtnicke ili profesionalne djelatnosti.`],
    ["3. Artikli i informacije", `Fotografije, nacrti, boje i prikazi proizvoda informativni su te mogu odstupati zbog zaslona, rasvjete ili proizvodne serije. Trgovac mora prije kupnje jasno prikazati bitna obiljezja proizvoda, dostupne modele, spol/kroj, boju, velicinu, materijal, cijenu i zalihu. Kupac je odgovoran za provjeru odabrane varijante i kolicine prije potvrde narudzbe. Ogranicavanje zakonske odgovornosti trgovca za netocan opis ili nesukladan proizvod nije dopusteno.`],
    ["4. Cijene i PDV", `Sve cijene iskazane su u eurima (EUR) i ukljucuju PDV po stopi od 25%, osim ako je uz proizvod izricito i zakonito navedeno drukcije. Prije narudzbe prikazuju se ukupna cijena proizvoda, porezi, trosak dostave i svi drugi moguci troskovi. Ocita tehnicka pogreska u cijeni ne obvezuje trgovca ako kupac razumno moze prepoznati pogresku; kupcu se tada nudi kupnja po ispravnoj cijeni ili otkaz bez troska. Snizenja i prethodna najniza cijena prikazuju se sukladno vazecim pravilima o isticanju cijena.`],
    ["5. Sklapanje ugovora", `Stavljanje artikla u kosaricu nije rezervacija. Kupac narudzbu salje pritiskom gumba koji jasno oznacava obvezu placanja. Automatska potvrda zaprimanja ne mora znaciti prihvat narudzbe. Ugovor je sklopljen kada trgovac potvrdi narudzbu ili otpremu, ovisno o tekstu potvrde. Trgovac moze odbiti narudzbu zbog nedostupnosti, ocite pogreske, sumnje na zlouporabu ili nemogucnosti dostave, uz povrat svih primljenih uplata bez nepotrebnog odgadanja.`],
    ["6. Korisnicki racun", `Kupac daje tocne i potpune podatke te cuva lozinku. Racun se ne smije koristiti za prijevaru, ometanje sustava ili kupnju u ime druge osobe bez ovlasti. Trgovac moze privremeno ograniciti racun radi sigurnosti, ali time ne prestaju prava iz vec sklopljenih ugovora. Reset lozinke provodi se sigurnom jednokratnom ili privremenom vjerodajnicom. Lozinke se ne pohranjuju u citljivom obliku.`],
    ["7. Placanje", `Dostupni nacini placanja moraju biti prikazani prije potvrde narudzbe. Trenutna lokalna verzija nema integriran karticni procesor i ne smije prikazivati da je karticno placanje izvrseno. Ako se naknadno uvede karticno placanje, podatke o kartici mora obradivati ovlasteni pruzatelj platnih usluga uz odgovarajuce sigurnosne mjere. Racun ili druga zakonom propisana isprava dostavlja se kupcu u propisanom obliku.`],
    ["8. Dostava na adresu", `Dostava se obavlja na adresu koju je kupac unio putem ponudene dostavne sluzbe. Ako nije ugovoren drugi rok, roba se mora isporuciti bez nepotrebnog odgadanja, a najkasnije u zakonskom roku. Procijenjeni rok nije jamstvo kada kasnjenje nastane zbog okolnosti izvan razumne kontrole, ali trgovac ostaje duzan obavijestiti kupca i postupiti prema njegovim zakonskim pravima. Rizik slucajnog gubitka u pravilu prelazi na potrosaca kada on ili treca osoba koju je odredio, a nije prijevoznik, fizicki primi robu.`],
    ["9. Paketomati", `Kupac moze odabrati GLS, Hrvatsku postu ili BOX NOW te mora upisati tocnu oznaku ili broj paketomata koji je prethodno provjerio na sluzbenoj karti odabrane sluzbe. Kupac odgovara za pogresno unesenu oznaku, telefon ili email kada trgovac nije mogao razumno uociti pogresku. Dodatni trosak ponovne dostave moze se naplatiti samo ako je unaprijed jasno objavljen i stvarno nastao. Pravila roka preuzimanja pojedinog prijevoznika priopcavaju se kupcu u dostavnoj obavijesti.`],
    ["10. Pravo na jednostrani raskid", `Potrosac kod ugovora sklopljenog na daljinu u pravilu ima 14 dana za jednostrani raskid bez navodenja razloga. Rok za robu u pravilu pocinje kada potrosac ili osoba koju je odredio primi robu. Izjava mora biti nedvosmislena i moze se poslati emailom ili obrascem. Dovoljno je poslati izjavu prije isteka roka. Trgovac mora vratiti primljena placanja, ukljucujuci standardni trosak dostave, u zakonskom roku i istim sredstvom placanja, osim ako je zakonito dogovoreno drukcije; povrat se moze zadrzati do primitka robe ili dokaza da je poslana.`],
    ["11. Povrat robe", `Nakon raskida kupac robu vraca bez nepotrebnog odgadanja, u pravilu najkasnije 14 dana od izjave o raskidu. Izravni trosak povrata snosi kupac samo ako je o tome bio pravilno obavijesten prije kupnje. Kupac smije pregledati robu kao u trgovini, ali odgovara za umanjenje vrijednosti nastalo rukovanjem iznad potrebnog za utvrdivanje prirode, obiljezja i funkcionalnosti. Originalna ambalaza moze olaksati povrat, ali sama po sebi ne smije biti nezakonit uvjet za ostvarenje prava.`],
    ["12. Iznimke od raskida", `Pravo na jednostrani raskid moze biti iskljuceno samo u zakonom propisanim slucajevima, primjerice za robu izradenu prema specifikaciji kupca ili ocito prilagodenu njemu te za zapecacenu robu koja zbog zdravstvenih ili higijenskih razloga nije pogodna za vracanje nakon otvaranja. Obican odabir standardne velicine, boje ili muskog/zenskog kroja sam po sebi u pravilu ne znaci personaliziranu robu. Svaka primjenjiva iznimka mora biti jasno priopcena prije narudzbe.`],
    ["13. Obrazac za raskid", `<strong>Primatelj:</strong> Tuning Crew Cuneri, 1. odvojak Purgarije 24b, 10310 Kerestinec, tccuneri@gmail.com.<br>Ja, [ime i prezime], ovime izjavljujem da jednostrano raskidam ugovor za [naziv robe], narucen dana [datum], primljen dana [datum], broj narudzbe [broj]. Adresa potrosaca: [adresa]. Datum i potpis potreban je samo ako se obrazac dostavlja na papiru.`],
    ["14. Materijalni nedostaci i sukladnost", `Trgovac odgovara za nedostatke i nesukladnost robe prema prisilnim propisima Zakona o obveznim odnosima i pravilima zastite potrosaca. Potrosac moze, ovisno o zakonskim uvjetima, zahtijevati popravak ili zamjenu, razmjerno snizenje cijene ili raskid ugovora. Komercijalno jamstvo, ako postoji, ne smanjuje zakonska prava. Kupac treba opisati problem, navesti broj narudzbe i priloziti fotografije kada je to razumno, ali nedostatak fotografije sam po sebi ne ukida zakonsko pravo.`],
    ["15. Pisani prigovor", `Kupac moze poslati pisani prigovor na tccuneri@gmail.com ili postom na adresu trgovca. Prigovor treba sadrzavati ime, kontakt, broj narudzbe i opis zahtjeva. Trgovac mora bez odgadanja potvrditi primitak pisanog prigovora te odgovoriti u zakonskom roku od 15 dana, jasno navodeci prihvaca li osnovanost prigovora. Evidencija prigovora cuva se u roku propisanom zakonom.`],
    ["16. Alternativno rjesavanje sporova", `Trgovac i potrosac nastojat ce spor rijesiti dogovorom. Potrosac se moze obratiti nadleznom tijelu za alternativno rjesavanje potrosackih sporova kada su ispunjeni uvjeti. Informacije o nadleznim hrvatskim tijelima dostupne su putem Ministarstva gospodarstva i sluzbenih potrosackih portala. Stara EU ODR poveznica ne smije se prikazivati kao aktivna ako je platforma ukinuta. Pravo potrosaca da pokrene postupak pred nadleznim sudom ostaje nepromijenjeno.`],
    ["17. Osobni podaci", `Podaci se obraduju radi otvaranja racuna, izvrsenja ugovora, dostave, racunovodstva, sprjecavanja zlouporabe i ispunjenja pravnih obveza. Pravna osnova, svrhe, primatelji, rokovi cuvanja, prijenosi, prava ispitanika i kontakt voditelja obrade moraju biti opisani u zasebnoj Politici privatnosti. Dostavnim sluzbama daju se samo podaci potrebni za dostavu. Marketing email zahtijeva odgovarajucu pravnu osnovu i jednostavnu odjavu. Kupac ima prava prema GDPR-u, ukljucujuci pristup, ispravak, brisanje kada je primjenjivo, ogranicenje, prigovor i prituzbu AZOP-u.`],
    ["18. Cookies i sigurnost", `Nuzni cookies mogu se koristiti za sesiju, jezik, kosaricu i sigurnost. Analiticki ili marketinski cookies ne smiju se postavljati prije valjane privole kada je ona potrebna. Trgovac primjenjuje razumne tehnicke i organizacijske mjere, ogranicava ovlasti administratora i moderatora, evidentira bitne promjene te redovito sigurnosno kopira podatke. Nijedan internetski sustav nije potpuno bez rizika, ali ta cinjenica ne oslobada trgovca zakonskih obveza zastite podataka.`],
    ["19. Logo, ime i intelektualno vlasnistvo", `Naziv Tuning Crew Cuneri, klupski logo, grafike, fotografije, tekstovi, dizajn proizvoda i ostali originalni sadrzaji pripadaju njihovu nositelju ili se koriste uz dozvolu. Kupnja proizvoda ne prenosi pravo umnozavanja, prerade, preprodaje krivotvorina, registracije znaka, izrade naljepnica ili komercijalne uporabe loga i imena. Dopušteno je fotografirati zakonito kupljeni proizvod za osobnu, nekomercijalnu uporabu. Trgovac zadrzava pravo zahtijevati prestanak neovlastene uporabe i naknadu stete prema primjenjivom pravu. Ova odredba ne stvara registrirani zig ako znak stvarno nije registriran.`],
    ["20. Zabranjena uporaba", `Zabranjeni su neovlasteni pristup, automatizirano opterecivanje sustava, zaobilazenje ogranicenja zalihe, lazne narudzbe, krada identiteta, unos zlonamjernog koda, preprodaja krivotvorene robe i uporaba sadrzaja protivno zakonu. Trgovac moze poduzeti razmjerne zastitne mjere i prijaviti osnovanu sumnju nadleznim tijelima.`],
    ["21. Odgovornost", `Nista u ovim Uvjetima ne iskljucuje odgovornost koja se prema prisilnim propisima ne moze iskljuciti, niti ogranicava zakonska prava potrosaca. Trgovac ne odgovara za neizravnu poslovnu stetu kupca koji nije potrosac u mjeri dopustenoj zakonom. Vanjske poveznice, primjerice karte paketomata, odrzavaju njihovi vlasnici, ali trgovac mora pazljivo odabrati partnere i dati tocne informacije kojima raspolaze.`],
    ["22. Vise sile i prekidi", `U slucaju dogadaja izvan razumne kontrole, poput prirodne nepogode, prekida prometa, rata, kibernetickog incidenta ili duljeg prekida dobavnog lanca, rokovi se mogu razumno produljiti uz pravodobnu obavijest. Ako ispunjenje postane nemoguce ili kasnjenje daje potrosacu zakonsko pravo na raskid, trgovac ce omoguciti raskid i vratiti pripadajuca placanja.`],
    ["23. Izmjene uvjeta", `Na narudzbu se primjenjuje verzija Uvjeta prihvacena u trenutku narudzbe. Nove verzije vrijede za buduce narudzbe od objavljenog datuma i ne mogu retroaktivno umanjiti stecena prava. Bitne promjene za registrirane korisnike priopcavaju se razumnim putem. Ako je pojedina odredba nevazeca, ostale ostaju na snazi u mjeri u kojoj mogu opstati.`],
    ["24. Mjerodavno pravo", `Primjenjuje se pravo Republike Hrvatske, uz sva obvezna prava koja potrosacu pripadaju prema pravu njegova uobicajenog boravista kada su primjenjiva. Ugovaranje nadleznosti ne smije potrosaca lisiti zakonski nadleznog suda. Jezicna verzija koja je kupcu prikazana i prihvacena pri kupnji mora ostati dostupna uz potvrdu narudzbe.`],
    ["25. Propisi i pravna provjera", `Nacrt se oslanja na Zakon o zastiti potrosaca (NN 19/22, 59/23), Zakon o obveznim odnosima, Zakon o elektronickoj trgovini, Zakon o alternativnom rjesavanju potrosackih sporova, Opću uredbu o zastiti podataka (EU) 2016/679 i hrvatski provedbeni zakon. <strong>Ovo je radni predlozak, nije pravno misljenje. Prije javne prodaje hrvatski odvjetnik ili kvalificirani pravnik mora provjeriti tekst, poslovni model, fiskalizaciju, racune, dostavu, privatnost, registraciju djelatnosti i podatke trgovca.</strong>`]
  ];
  app.innerHTML = `<section class="terms-hero"><div><span>VERZIJA 17. LIPNJA 2026.</span><h1>Uvjeti<br>prodaje</h1><p>Uvjeti koristenja, kupnje, dostave, povrata i zastite klupskog identiteta.</p></div></section><section class="section terms-shell"><div class="terms-alert"><strong>VAZNO PRIJE OBJAVE</strong><p>OIB i pravni podaci trgovca jos su oznaceni privremenim vrijednostima. Bez njih webshop nije spreman za stvarnu prodaju.</p></div>${sections.map(([title, body]) => `<article class="terms-section"><h2>${title}</h2><p>${body}</p></article>`).join("")}<div class="terms-sources"><h2>Sluzbeni izvori za provjeru</h2><a href="https://narodne-novine.nn.hr/clanci/sluzbeni/2022_02_19_203.html" target="_blank" rel="noreferrer">Zakon o zastiti potrosaca, NN 19/2022</a><a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj" target="_blank" rel="noreferrer">Opca uredba o zastiti podataka (GDPR)</a><a href="https://eur-lex.europa.eu/eli/dir/2011/83/oj" target="_blank" rel="noreferrer">Direktiva 2011/83/EU o pravima potrosaca</a></div></section>${clubFooter()}`;
}

function clubFooter() {
  return `
    <footer class="club-footer">
      <div class="footer-brand">
        <strong>Tuning Crew Ćuneri</strong>
      </div>
      <address>
        1. odvojak purgarije 24b, 10310 Kerestinec, Croatia<br />
        XXXXXXXXXXXXX - OIB<br />
        email: <a href="mailto:tccuneri@gmail.com">tccuneri@gmail.com</a>
        <br /><a class="terms-link" href="/terms" data-link>Terms and Conditions</a>
      </address>
    </footer>
  `;
}

function termsPageCurrent() {
  termsPage();
  const version = document.querySelector(".terms-hero span");
  if (version) version.textContent = "VERZIJA 18. LIPNJA 2026.";
}

function cookieBanner() {
  if (localStorage.getItem("cuneri_cookies") === "ok" || document.querySelector(".cookie-banner")) return;
  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.innerHTML = `
    <div>
      <strong>Cookies</strong>
      <p>Koristimo lokalne cookies/postavke za login sesiju, jezik i bolji rad stranice.</p>
    </div>
    <button class="btn" type="button" data-cookie-ok>OK</button>
  `;
  document.body.appendChild(banner);
}

function loginPage() {
  app.innerHTML = `
    <section class="login-shell">
      <div class="login-box">
        <h1>${tr("login")}</h1>
        <form class="admin-form" data-form="login">
          <label>Username / email<input required name="username" value="admin" /></label>
          <label>${tr("password")}<input required type="password" name="password" value="admin123" /></label>
          <button class="btn" type="submit">${tr("login")}</button>
        </form>
        <p style="color:var(--muted)">Admin: admin / admin123<br>Webshop moderatori: shop1 / shop12345 i shop2 / shop12345</p>
      </div>
    </section>
  `;
}

function accessLoginPage(mode) {
  const isAdmin = mode === "admin";
  app.innerHTML = `<section class="login-shell access-login"><div class="access-login-grid"><div class="login-box"><span class="kicker">${isAdmin ? "CUNERI ADMIN" : "CLANOVI I WEBSHOP"}</span><h1>${isAdmin ? "Admin login" : "Login"}</h1><p>${isAdmin ? "Admin tim se prijavljuje ovdje." : "Isti email i lozinka koriste se za webshop i clanove autokluba. Sustav sam prepoznaje imas li samo webshop ili i garazu/clanski pristup koji odobrava admin."}</p><form class="admin-form" data-form="login"><input type="hidden" name="loginMode" value="${isAdmin ? "admin" : "shop"}" /><label>Email / username<input required name="username" /></label><label>Lozinka<input required type="password" name="password" /></label><button class="btn">Prijava</button></form><a class="text-link" href="${isAdmin ? "/webshop-login" : "/admin"}" data-link>${isAdmin ? "Idi na login za clanove i webshop" : "ADMIN"}</a></div>${isAdmin ? "" : `<div class="login-side"><form class="form-box" data-form="shop-reset"><h3>Zaboravljena lozinka</h3><label>Email<input required type="email" name="email" /></label><button class="btn secondary">Posalji reset email</button></form><form class="form-box" data-form="shop-register"><h3>Registracija za webshop</h3><p class="admin-help">Ovo otvara samo webshop racun. Clan autokluba postajes kad admin odobri garazu/clanski pristup.</p><label>Ime<input required name="firstName" /></label><label>Prezime<input required name="lastName" /></label><label>Email<input required type="email" name="email" /></label><label>Lozinka<input required minlength="8" type="password" name="password" /></label><label>Ponovi lozinku<input required minlength="8" type="password" name="passwordConfirm" /></label><button class="btn">Registracija</button></form></div>`}</div></section>`;
}

async function adminPage() {
  if (!state.user) {
    app.innerHTML = `<section class="login-shell"><div class="login-box"><h1>${tr("adminTitle")}</h1><p>${tr("noUser")}</p><a class="btn" href="/login" data-link>${tr("login")}</a></div></section>`;
    return;
  }
  if (state.user.mustChangePassword) {
    app.innerHTML = `
      <section class="login-shell">
        <div class="login-box">
          <h1>${tr("changePassword")}</h1>
          <p>${tr("mustChange")}</p>
          <form data-form="change-password" class="admin-form">
            <label>${tr("newPassword")}<input required type="password" name="password" minlength="8" /></label>
            <button class="btn" type="submit">${tr("changePassword")}</button>
          </form>
        </div>
      </section>
    `;
    return;
  }
  if (state.user.role === "shop_manager") {
    await shopManagePageV2();
    return;
  }
  if (state.user.role !== "admin") {
    memberProfilePage();
    return;
  }
  const dash = await api("/api/admin/dashboard");
  const settings = dash.settings || state.data.settings;
  app.innerHTML = `
    <section class="section alt" style="padding-top:128px">
      <div class="section-head">
        <h2>${tr("adminTitle")}</h2>
        <p>${tr("dashboard")}: ${dash.members.length} članova, ${dash.events.length} eventa, ${dash.inbox.length} emailova.</p>
      </div>
      <div class="admin-grid">
        <div class="panel admin-wide"><h3>Webshop</h3><p>Upravljanje artiklima, cijenama, zalihama i narudzbama.</p><a class="btn" href="/webshop-upravljanje" data-link>Otvori webshop upravljanje</a></div>
        <div class="panel admin-wide"><h3>Pristupi korisnika</h3><p class="admin-help">Odredi moze li pojedini email koristiti webshop, garazu ili oboje.</p><div class="access-admin-list">${dash.users.map(user => `<form data-form="user-access" class="access-row"><input type="hidden" name="id" value="${user.id}" /><div><strong>${escapeHtml(user.name || user.email)}</strong><small>${escapeHtml(user.email)} · ${escapeHtml(user.role)}</small></div><label class="check-label"><input type="checkbox" name="shopAccess" ${user.shopAccess ? "checked" : ""} /> Webshop</label><label class="check-label"><input type="checkbox" name="garageAccess" ${user.garageAccess ? "checked" : ""} /> Garaza</label><button class="btn secondary">Spremi</button></form>`).join("")}</div></div>
        <div class="panel admin-wide">
          <h3>Upload slika s računala</h3>
          <form class="admin-form" data-form="upload-image">
            <label>Odaberi JPG ili PNG<input required type="file" name="image" accept="image/png,image/jpeg" /></label>
            <button class="btn" type="submit">Upload slike</button>
            <label>URL zadnje uploadane slike<input id="uploadResult" readonly placeholder="/uploads/..." /></label>
            <p class="admin-help">Nakon uploada kopiraj URL u polje slike gdje ga želiš koristiti: heroImages, historyImages, member car cover/images, event image, sponsor logo itd.</p>
          </form>
        </div>
        <div class="panel">
          <h3>Postavke naslovnice</h3>
          <form class="admin-form" data-form="settings">
            <label>Broj članova kluba<input required type="number" name="memberCount" value="${settings.memberCount || 52}" /></label>
            <label>Susreta koji smo posjetili<input required type="number" name="visitedMeetsCount" value="${settings.visitedMeetsCount || 0}" /></label>
            <label>SOON tekst HR<input name="soonTextHr" value="${escapeHtml(settings.soonTextHr || tr("soonMeet"))}" /></label>
            <label>SOON tekst EN<input name="soonTextEn" value="${escapeHtml(settings.soonTextEn || tr("soonMeet"))}" /></label>
            <label>Hero slike, odvojene zarezom<input name="heroImages" value="${escapeHtml((settings.heroImages || []).join(", "))}" /></label>
            <label>O klubu HR<textarea name="aboutHr">${escapeHtml(settings.aboutHr || "")}</textarea></label>
            <label>O klubu EN<textarea name="aboutEn">${escapeHtml(settings.aboutEn || "")}</textarea></label>
            <label>Povijest HR<textarea name="historyHr">${escapeHtml(settings.historyHr || "")}</textarea></label>
            <label>Povijest EN<textarea name="historyEn">${escapeHtml(settings.historyEn || "")}</textarea></label>
            <label>Slike povijesti, odvojene zarezom<input name="historyImages" value="${escapeHtml((settings.historyImages || []).join(", "))}" /></label>
            <button class="btn" type="submit">Spremi postavke</button>
          </form>
        </div>
        <div class="panel">
          <h3>${tr("addMember")}</h3>
          <form class="admin-form" data-form="add-member">
            <label>${tr("email")}<input required type="email" name="email" /></label>
            <label>${tr("tempPassword")}<input name="tempPassword" value="ulaz123ulaz" /></label>
            <button class="btn" type="submit">${tr("addMember")}</button>
          </form>
        </div>
        <div class="panel">
          <h3>Reset lozinke člana</h3>
          <form class="admin-form" data-form="reset-password">
            <label>Email člana<input required type="email" name="email" /></label>
            <label>Nova privremena lozinka<input required name="password" value="ulaz123ulaz" minlength="8" /></label>
            <button class="btn" type="submit">Postavi privremenu lozinku</button>
          </form>
          <p class="admin-help">Admin može postaviti novu privremenu lozinku, ali ne može vidjeti staru lozinku.</p>
        </div>
        <div class="panel admin-wide">
          <h3>Uredi sve članove, aute, slike i social tagove</h3>
          <form class="admin-form" data-form="json-data" data-key="members">
            <textarea name="json" class="json-editor">${jsonForEdit(dash.members)}</textarea>
            <button class="btn" type="submit">Spremi članove</button>
          </form>
        </div>
        <div class="panel admin-wide">
          <h3>Uredi novosti / tekstove</h3>
          <form class="admin-form" data-form="json-data" data-key="posts">
            <textarea name="json" class="json-editor">${jsonForEdit(dash.posts)}</textarea>
            <button class="btn" type="submit">Spremi novosti</button>
          </form>
        </div>
        <div class="panel admin-wide">
          <h3>Uredi susrete / mapu / slike eventa</h3>
          <p class="admin-help">Za automatski grad/točku dodaj polje "location" ili "address", npr. "Autopraonica Zaprešić". Sustav će izvući grad Zaprešić i staviti crvenu točku na mapu.</p>
          <form class="admin-form" data-form="json-data" data-key="events">
            <textarea name="json" class="json-editor">${jsonForEdit(dash.events)}</textarea>
            <button class="btn" type="submit">Spremi susrete</button>
          </form>
        </div>
        <div class="panel admin-wide">
          <h3>Uredi sponzore</h3>
          <form class="admin-form" data-form="json-data" data-key="sponsors">
            <textarea name="json" class="json-editor">${jsonForEdit(dash.sponsors)}</textarea>
            <button class="btn" type="submit">Spremi sponzore</button>
          </form>
        </div>
        <div class="panel">
          <h3>${tr("inbox")}</h3>
          <div class="admin-list">${dash.inbox.map(mail => `<div class="list-row"><strong>${mail.subject}</strong><small>${mail.to} • ${mail.createdAt}</small><p>${mail.text}</p></div>`).join("") || "-"}</div>
        </div>
        <div class="panel">
          <h3>${tr("membersTitle")}</h3>
          <div class="admin-list">${dash.members.map(m => `<div class="list-row"><strong>${m.name}</strong><small>${m.email}</small><p>${(m.cars || []).length} auta • ${m.competitions || ""}</p></div>`).join("")}</div>
        </div>
        <div class="panel">
          <h3>${tr("contacts")} / ${tr("joinRequests")}</h3>
          <div class="admin-list">
            ${[...dash.contacts, ...dash.joinRequests].map(item => `<div class="list-row"><strong>${item.name || item.email}</strong><small>${item.email || ""} • ${item.createdAt}</small><p>${item.message || item.car || ""}</p></div>`).join("") || "-"}
          </div>
        </div>
      </div>
      <div class="row-actions" style="max-width:1220px;margin:24px auto 0">
        <button class="btn secondary" data-action="logout">${tr("logout")}</button>
      </div>
    </section>
  `;
}

function memberProfilePage() {
  app.innerHTML = `
    <section class="section alt" style="padding-top:128px">
      <div class="section-head"><h2>${state.user.name}</h2><p>Member panel je spreman za uređivanje profila i auta. Admin može sve uređivati za svakoga.</p></div>
      <div class="panel" style="max-width:760px;margin:0 auto">
        <p>Email: ${state.user.email}</p>
        <button class="btn secondary" data-action="logout">${tr("logout")}</button>
      </div>
    </section>
  `;
}

async function adminPage() {
  if (!state.user) return accessLoginPage("admin");
  if (state.user.mustChangePassword) {
    app.innerHTML = `<section class="login-shell"><div class="login-box"><span class="kicker">${tr("mustChange")}</span><h1>${tr("changePassword")}</h1><form class="admin-form" data-form="change-password"><label>${tr("newPassword")}<input required type="password" minlength="8" name="password" /></label><button class="btn">${tr("changePassword")}</button></form></div></section>`;
    return;
  }
  if (state.user.role === "shop_manager") {
    await shopManagePageV2();
    return;
  }
  if (state.user.role !== "admin") {
    memberProfilePage();
    return;
  }
  const dash = await api("/api/admin/dashboard");
  state.adminDash = dash;
  const settings = dash.settings || state.data.settings;
  app.innerHTML = `
    <section class="section alt" style="padding-top:128px">
      <div class="section-head"><h2>${tr("adminTitle")}</h2><p>${tr("dashboard")}: ${dash.members.length} clanova, ${dash.events.length} eventa, ${dash.inbox.length} emailova.</p></div>
      <div class="admin-grid">
        ${adminPanelSwitch()}
        ${activeUsersPanel(dash.activeUsers || [])}
        <div class="panel admin-wide"><h3>Pristupi korisnika</h3><p class="admin-help">Ovdje mozes urediti rolu, pristupe, cijelu garazu, aute, tekstove ili obrisati cijeli profil.</p><div class="access-admin-list">${dash.users.map(accessUserRow).join("")}</div></div>
        <div class="panel admin-wide"><h3>Upload slika s racunala</h3><form class="admin-form" data-form="upload-image"><label>Odaberi JPG ili PNG<input required type="file" name="image" accept="image/png,image/jpeg" /></label><button class="btn" type="submit">Upload slike</button><label>URL zadnje uploadane slike<input id="uploadResult" readonly placeholder="/uploads/..." /></label><p class="admin-help">Nakon uploada kopiraj URL u polje slike gdje ga zelis koristiti.</p></form></div>
        <div class="panel"><h3>Postavke naslovnice</h3><form class="admin-form" data-form="settings"><label>Broj clanova kluba<input required type="number" name="memberCount" value="${settings.memberCount || 52}" /></label><label>Susreta koji smo posjetili<input required type="number" name="visitedMeetsCount" value="${settings.visitedMeetsCount || 0}" /></label><label>SOON tekst HR<input name="soonTextHr" value="${escapeHtml(settings.soonTextHr || tr("soonMeet"))}" /></label><label>SOON tekst EN<input name="soonTextEn" value="${escapeHtml(settings.soonTextEn || tr("soonMeet"))}" /></label><label>Hero slike, odvojene zarezom<input name="heroImages" value="${escapeHtml((settings.heroImages || []).join(", "))}" /></label><label>O klubu HR<textarea name="aboutHr">${escapeHtml(settings.aboutHr || "")}</textarea></label><label>O klubu EN<textarea name="aboutEn">${escapeHtml(settings.aboutEn || "")}</textarea></label><label>Povijest HR<textarea name="historyHr">${escapeHtml(settings.historyHr || "")}</textarea></label><label>Povijest EN<textarea name="historyEn">${escapeHtml(settings.historyEn || "")}</textarea></label><label>Slike povijesti, odvojene zarezom<input name="historyImages" value="${escapeHtml((settings.historyImages || []).join(", "))}" /></label><button class="btn" type="submit">Spremi postavke</button></form></div>
        <div class="admin-stack">
          ${adminAddUserForm()}
          <div class="panel"><h3>Reset lozinke korisnika</h3><form class="admin-form" data-form="reset-password"><label>Email ili username<input required name="email" /></label><label>Nova privremena lozinka<input required name="password" value="ulaz123ulaz" minlength="8" /></label><button class="btn" type="submit">Postavi privremenu lozinku</button></form><p class="admin-help">Admin moze postaviti novu privremenu lozinku, ali ne moze vidjeti staru lozinku.</p></div>
        </div>
        <div class="panel admin-wide"><h3>Uredi sve clanove JSON</h3><form class="admin-form" data-form="json-data" data-key="members"><textarea name="json" class="json-editor">${jsonForEdit(dash.members)}</textarea><button class="btn" type="submit">Spremi clanove</button></form></div>
        <div class="panel admin-wide"><h3>Uredi novosti / tekstove</h3><form class="admin-form" data-form="json-data" data-key="posts"><textarea name="json" class="json-editor">${jsonForEdit(dash.posts)}</textarea><button class="btn" type="submit">Spremi novosti</button></form></div>
        <div class="panel admin-wide"><h3>Uredi susrete / mapu / slike eventa</h3><form class="admin-form" data-form="json-data" data-key="events"><textarea name="json" class="json-editor">${jsonForEdit(dash.events)}</textarea><button class="btn" type="submit">Spremi susrete</button></form></div>
        <div class="panel admin-wide"><h3>Uredi sponzore</h3><form class="admin-form" data-form="json-data" data-key="sponsors"><textarea name="json" class="json-editor">${jsonForEdit(dash.sponsors)}</textarea><button class="btn" type="submit">Spremi sponzore</button></form></div>
        <div class="panel admin-wide"><h3>${tr("inbox")}</h3><div class="admin-list">${dash.inbox.map(mail => `<div class="list-row"><strong>${mail.subject}</strong><small>${mail.to} · ${mail.createdAt}</small><p>${mail.text}</p></div>`).join("") || "-"}</div></div>
        <div class="panel admin-wide"><h3>Clanovi</h3><div class="admin-list">${dash.members.map(m => `<div class="list-row"><strong>${m.name}</strong><small>${m.email}</small><p>${(m.cars || []).length} auta · ${m.competitions || ""}</p></div>`).join("")}</div></div>
        <div class="panel admin-wide"><h3>${tr("contacts")} / ${tr("joinRequests")}</h3><div class="admin-list">${[...dash.contacts, ...dash.joinRequests].map(item => `<div class="list-row"><strong>${item.name || item.email}</strong><small>${item.email || ""} · ${item.createdAt}</small><p>${item.message || item.car || ""}</p></div>`).join("") || "-"}</div></div>
      </div>
    </section>`;
}

async function submitForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const type = form.dataset.form;
  if (isWebshopSeized() && ["add-cart", "shop-checkout"].includes(type)) {
    throw new Error(ui("Webshop je trenutno u izradi. Narudzbe su privremeno zaustavljene.", "The webshop is currently under construction. Orders are temporarily paused."));
  }
  if (type === "upload-image") {
    const file = form.elements.image.files[0];
    const result = await api("/api/admin/upload", {
      method: "POST",
      body: { fileName: file.name, dataUrl: await fileToDataUrl(file) }
    });
    const out = document.querySelector("#uploadResult");
    if (out) out.value = result.url;
    await navigator.clipboard?.writeText(result.url).catch(() => {});
    toast(`Uploadano: ${result.url}`);
    return;
  }
  if (type === "join") {
    await api("/api/join", { method: "POST", body: data });
    form.reset();
    toast(tr("sent"));
  }
  if (type === "contact") {
    await api("/api/contact", { method: "POST", body: data });
    form.reset();
    toast(tr("sent"));
  }
  if (type === "add-cart") {
    const product = state.data.products.find(item => item.id === form.dataset.productId);
    state.cart.push({ productId: product.id, name: product.name, price: salePrice(product), quantity: Math.max(1, Number(data.quantity || 1)), audience: data.audience || "", color: data.color || "", size: data.size || "" });
    saveCart();
    toast("Artikl je dodan u kosaricu.");
    await shopPage();
    document.querySelector("#cartDrawer").hidden = false;
    return;
  }
  if (type === "shop-register") {
    await api("/api/shop/register", { method: "POST", body: data });
    form.reset();
    toast("Racun je otvoren. Sada se prijavi.");
    navigate("/login");
    return;
  }
  if (type === "shop-checkout") {
    const profile = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      phoneCountryCode: data.phoneCountryCode,
      deliveryType: data.deliveryType,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      deliveryNote: data.deliveryNote,
      parcelService: data.parcelService,
      parcelLocker: data.parcelLocker,
      parcelAddress: data.parcelAddress,
      billingCity: data.billingCity,
      billingStreet: data.billingStreet,
      billingHouseNumber: data.billingHouseNumber,
      billingNote: data.billingNote,
      billingPostalCode: data.billingPostalCode,
      paymentMethod: data.paymentMethod || "cod"
    };
    const result = await api("/api/shop/order", { method: "POST", body: { items: state.cart, email: data.email, profile, paymentMethod: data.paymentMethod || "cod", couponCode: data.couponCode } });
    state.cart = [];
    saveCart();
    toast(`Narudzba ${result.order.id} je zaprimljena. Potvrda je poslana emailom.`);
    await refresh();
    await shopPage();
    return;
  }
  if (type === "shop-reset") {
    await api("/api/shop/reset-password", { method: "POST", body: data });
    toast("Ako racun postoji, privremena lozinka je poslana na email.");
    return;
  }
  if (type === "shop-profile") {
    await api("/api/shop/account", { method: "PUT", body: data });
    toast("Podaci za dostavu su spremljeni.");
    return;
  }
  if (type === "user-profile") {
    const profileFile = form.elements.profileImageFile?.files?.[0];
    const coverFile = form.elements.coverImageFile?.files?.[0];
    if (profileFile) {
      const uploaded = await api("/api/profile/upload", { method: "POST", body: { fileName: profileFile.name, dataUrl: await fileToDataUrl(profileFile) } });
      data.profileImage = uploaded.url;
    }
    if (coverFile) {
      const uploaded = await api("/api/profile/upload", { method: "POST", body: { fileName: coverFile.name, dataUrl: await fileToDataUrl(coverFile) } });
      data.coverImage = uploaded.url;
    }
    const result = await api("/api/profile", {
      method: "PUT",
      body: {
        ...data,
        removeProfileImage: Boolean(data.removeProfileImage),
        removeCoverImage: Boolean(data.removeCoverImage)
      }
    });
    state.user = result.user;
    toast(ui("Profil je spremljen.", "Profile saved."));
    userProfilePage();
    syncLang();
    return;
  }
  if (type === "shop-products") {
    await api("/api/shop/manage/products", { method: "PUT", body: { products: JSON.parse(data.json) } });
    await refresh();
    toast("Artikli su spremljeni.");
    await shopManagePageV2();
    return;
  }
  if (type === "shop-upload") {
    const file = form.elements.image.files[0];
    const result = await api("/api/shop/manage/upload", { method: "POST", body: { fileName: file.name, dataUrl: await fileToDataUrl(file) } });
    document.querySelector("#shopUploadResult").value = result.url;
    toast(`Uploadano: ${result.url}`);
    return;
  }
  if (type === "shop-settings") {
    await api("/api/shop/manage/settings", { method: "PUT", body: { webshopSeizedMode: Boolean(data.webshopSeizedMode) } });
    await refresh();
    toast(data.webshopSeizedMode ? "Webshop je zaplijenjen preko svega." : "Webshop je ponovno otvoren.");
    await shopManagePageV2();
    return;
  }
  if (type === "shop-order") {
    await api("/api/shop/manage/order", { method: "PUT", body: data });
    toast("Status narudzbe je spremljen.");
    return;
  }
  if (type === "shop-product") {
    await api("/api/shop/manage/product", { method: "POST", body: data });
    await refresh();
    toast("Artikl je spremljen.");
    await shopManagePageV2();
    return;
  }
  if (type === "shop-coupon") {
    await api("/api/shop/manage/coupon", { method: "POST", body: data });
    toast("Kupon je spremljen.");
    await shopManagePageV2();
    return;
  }
  if (type === "guest-attend") {
    await api("/api/event/attend", { method: "POST", body: { ...data, eventId: form.dataset.eventId } });
    await refresh();
    toast("Dolazak je dodan.");
    openEventDetail(form.dataset.eventId);
    return;
  }
  if (type === "public-event") {
    await api("/api/event", { method: "POST", body: data });
    form.reset();
    await refresh();
    mapsPageV2();
    toast("Event je dodan na kartu.");
    return;
  }
  if (type === "meet-event") {
    await api("/api/meet-manager/event", { method: "POST", body: data });
    form.reset();
    await refresh();
    toast("Grupni meet je dodan.");
    await meetPanelPage();
    return;
  }
  if (type === "meet-attendee-add") {
    await api("/api/meet-manager/attendee", { method: "PUT", body: { eventId: data.eventId, memberId: data.memberId, action: "add" } });
    await refresh();
    toast("Clan je dodan na popis.");
    await meetPanelPage();
    return;
  }
  if (type === "member-attend") {
    await api("/api/event/attend", { method: "POST", body: { eventId: form.dataset.eventId, carId: data.carId } });
    await refresh();
    toast("Dolazak je dodan.");
    openEventDetail(form.dataset.eventId);
    return;
  }
  if (type === "login") {
    const result = await api("/api/login", { method: "POST", body: data });
    state.user = result.user;
    toast(tr("saved"));
    if (data.loginMode === "admin") {
      navigate(state.user.role === "admin" ? "/admin" : state.user.role === "meet_manager" || state.user.meetAccess ? "/meet-panel" : "/webshop-upravljanje");
    } else if (data.loginMode === "shop") {
      navigate(["admin", "shop_manager"].includes(state.user.role) ? "/webshop-upravljanje" : state.user.garageAccess || state.user.role === "member" ? "/profil" : "/webshop");
    } else {
      navigate(state.user.role === "admin" ? "/admin" : "/admin");
    }
  }
  if (type === "change-password") {
    const result = await api("/api/change-password", { method: "POST", body: data });
    state.user = result.user;
    toast(tr("saved"));
    render();
  }
  if (type === "add-member") {
    await api("/api/admin/member", { method: "POST", body: data });
    await refresh();
    toast(tr("saved"));
    render();
  }
  if (type === "reset-password") {
    await api("/api/admin/reset-password", { method: "POST", body: data });
    toast(tr("saved"));
  }
  if (type === "user-access") {
    await api("/api/admin/access", { method: "PUT", body: data });
    toast("Pristupi su spremljeni.");
    return;
  }
  if (type === "admin-user-edit") {
    await api("/api/admin/user", { method: "PUT", body: collectAdminUserEdit(form) });
    document.querySelector("#adminUserEditor")?.remove();
    await refresh();
    toast("Korisnik i garaza su spremljeni.");
    await adminPage();
    return;
  }
  if (type === "json-data") {
    const key = form.dataset.key;
    const parsed = JSON.parse(data.json);
    await api("/api/admin/data", { method: "PUT", body: { [key]: parsed } });
    await refresh();
    toast(tr("saved"));
    render();
  }
  if (type === "settings") {
    const settings = {
      ...state.data.settings,
      memberCount: Number(data.memberCount || 0),
      visitedMeetsCount: Number(data.visitedMeetsCount || 0),
      soonTextHr: data.soonTextHr,
      soonTextEn: data.soonTextEn,
      heroImages: String(data.heroImages || "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean),
      aboutHr: data.aboutHr,
      aboutEn: data.aboutEn,
      historyHr: data.historyHr,
      historyEn: data.historyEn,
      historyImages: String(data.historyImages || "")
        .split(",")
        .map(item => item.trim())
        .filter(Boolean)
    };
    await api("/api/admin/data", { method: "PUT", body: { settings } });
    await refresh();
    toast(tr("saved"));
    render();
  }
}

function prepareScrollAnimations() {
  const items = document.querySelectorAll(".panel, .member-card, .product-card, .product-admin-card, .terms-section, .news-card, .weather-card, .event-card, .history-copy p, .history-rail img, .history-split, .history-double, .history-text, .visual-strip img, .club-footer");
  items.forEach((node, index) => {
    node.classList.add("reveal");
    node.style.setProperty("--delay", `${Math.min(index * 55, 420)}ms`);
  });
  if (!("IntersectionObserver" in window)) {
    items.forEach(node => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  items.forEach(node => observer.observe(node));
}

function errorPage(code = 404, message = "Stranica nije pronadena.") {
  app.innerHTML = `<section class="error-page"><div class="error-road"><img src="/assets/2cv-outline.svg" alt="Citroen 2CV" /></div><span>ERROR</span><h1>${code}</h1><h2>${escapeHtml(message)}</h2><p>Izgleda da smo skrenuli s rute. Vrati se prema klubu ili webshopu.</p><div class="hero-actions"><a class="btn" href="/" data-link>Naslovnica</a><a class="btn secondary" href="/webshop" data-link>Webshop</a></div></section>`;
}

function showErrorOverlay(message) {
  document.querySelector(".error-overlay")?.remove();
  const node = document.createElement("div");
  node.className = "error-overlay";
  node.innerHTML = `<div class="error-mini"><button class="map-close" data-error-close>&times;</button><img src="/assets/2cv-outline.svg" alt="" /><span>CHECK ENGINE</span><h2>Nesto nije dobro uneseno</h2><p>${escapeHtml(message)}</p><button class="btn" data-error-close>Ispravi podatke</button></div>`;
  document.body.appendChild(node);
}

function showDiscountReward() {
  document.querySelector(".discount-reward")?.remove();
  const node = document.createElement("div");
  node.className = "discount-reward";
  node.innerHTML = `<div class="discount-reward-card"><button class="map-close reward-close" data-reward-close aria-label="Zatvori">&times;</button><div class="reward-car"><img src="/assets/2cv-outline.svg" alt="Citroen 2CV" /></div><span>UHVATIO SI 2CV</span><h2>10% popusta</h2><p>Iskoristi kod pri svojoj prvoj kupnji u Cuneri webshopu.</p><button class="reward-code" type="button" data-copy-coupon><small>TVOJ KOD</small><strong>2CV10</strong><em>Klikni za kopiranje</em></button><p class="reward-note">Kod vrijedi jednom po korisniku ili email adresi.</p><a class="btn" href="/webshop" data-link>Idi u webshop</a></div>`;
  document.body.appendChild(node);
}

function contactPage() {
  app.innerHTML = `
    <section class="section" style="padding-top:128px">
      <div class="section-head">
        <h2>${tr("contactTitle")}</h2>
        <p>${tr("contactText")}</p>
      </div>
      <div class="form-grid">
        <form class="form-box contact-form" data-form="contact">
          <label>${tr("name")}<input required name="name" /></label>
          <label>${tr("lastName")}<input required name="lastName" /></label>
          <label>${tr("email")}<input required type="email" name="email" /></label>
          <label>${tr("company")}<input name="company" /></label>
          <label>${tr("subject")}<input required name="subject" /></label>
          <label>${tr("message")}<textarea required name="message"></textarea></label>
          <button class="btn" type="submit">${tr("send")}</button>
        </form>
        <div class="panel contact-panel">
          <h3>CUNERI HQ</h3>
          <p><a href="mailto:tccuneri@gmail.com">tccuneri@gmail.com</a></p>
          <p>${ui("Prati klub na drustvenim mrezama:", "Follow the club online:")}</p>
          ${clubSocials(true)}
          <p>${tr("interested")} ${tr("join").toLowerCase()}.</p>
        </div>
      </div>
    </section>
    ${clubFooter()}
  `;
}

function clubFooter() {
  return `
    <footer class="club-footer">
      <div class="footer-brand">
        <strong>Tuning Crew Cuneri</strong>
        ${clubSocials(false)}
      </div>
      <address>
        1. odvojak purgarije 24b, 10310 Kerestinec, Croatia<br />
        XXXXXXXXXXXXX - OIB<br />
        email: <a href="mailto:tccuneri@gmail.com">tccuneri@gmail.com</a>
        <br /><a class="terms-link" href="/terms" data-link>${ui("Uvjeti prodaje", "Terms and Conditions")}</a>
      </address>
    </footer>
  `;
}

function memberCars(member) {
  return member.cars?.length ? member.cars : [{ name: ui("Projekt u pripremi", "Project in progress"), cover: "/assets/member-roadster.svg", images: ["/assets/member-roadster.svg"], mods: "", details: "" }];
}

function carImageList(car) {
  return [car.cover, ...(car.images || [])].filter(Boolean).filter((item, index, list) => list.indexOf(item) === index);
}

function socialProfileUrl(type, value) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  if (/^https?:\/\//i.test(clean)) return clean;
  const handle = clean.replace(/^@/, "");
  if (type === "instagram") return `https://www.instagram.com/${encodeURIComponent(handle)}/`;
  if (type === "tiktok") return `https://www.tiktok.com/@${encodeURIComponent(handle)}`;
  return clean;
}

function socialHandle(value) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  if (/^https?:\/\//i.test(clean)) {
    const parts = clean.replace(/\/$/, "").split("/");
    return parts[parts.length - 1] ? `@${parts[parts.length - 1].replace(/^@/, "")}` : clean;
  }
  return clean.startsWith("@") ? clean : `@${clean}`;
}

function imageFileName(url, fallback = "cuneri-slika") {
  const clean = String(url || "").split("?")[0].split("#")[0];
  const file = clean.split("/").filter(Boolean).pop() || `${fallback}.jpg`;
  return file.includes(".") ? file : `${file}.jpg`;
}

function memberSocialLinks(member) {
  const items = [
    ["instagram", "Instagram", member.instagram],
    ["tiktok", "TikTok", member.tiktok]
  ].filter(([, , value]) => String(value || "").trim());
  if (!items.length) return "";
  return `<div class="garage-socials">${items.map(([type, label, value]) => {
    const handle = socialHandle(value);
    return `<span class="social-tools"><a class="social-link ${type}" href="${socialProfileUrl(type, value)}" target="_blank" rel="noreferrer" title="${label}">${socialSvg(type)}<span>${escapeHtml(handle)}</span></a><button class="social-copy" type="button" data-copy-social="${escapeHtml(handle)}">Copy username</button></span>`;
  }).join("")}</div>`;
}

function membersPage() {
  const totalCars = state.data.members.reduce((sum, member) => sum + memberCars(member).length, 0);
  app.innerHTML = `
    <section class="members-hero">
      <div>
        <span>${ui("CUNERI GARAZA", "CUNERI GARAGE")}</span>
        <h1>${tr("membersTitle")}</h1>
        <p>${tr("membersText")}</p>
        <div class="members-stats">
          <strong>${state.data.members.length}<small>${ui("clanova", "members")}</small></strong>
          <strong>${totalCars}<small>${ui("auta", "cars")}</small></strong>
        </div>
      </div>
    </section>
    <section class="section members-shell">
      <div class="member-grid member-grid-polished">${state.data.members.map(memberCard).join("")}</div>
    </section>
    <aside class="detail-drawer" id="detail"></aside>
    ${clubFooter()}
  `;
}

function memberCard(member) {
  const cars = memberCars(member);
  const car = cars[0] || {};
  const images = carImageList(car);
  const bio = localizedField(member, "bio");
  const competitions = localizedField(member, "competitions");
  return `<article class="member-card garage-card">
    <button class="garage-cover" type="button" data-member="${member.id}" aria-label="${tr("more")} ${escapeHtml(member.name)}">
      <img src="${images[0] || "/assets/member-roadster.svg"}" alt="${escapeHtml(car.name || member.name)}" />
      <span>${cars.length} ${cars.length === 1 ? ui("auto", "car") : ui("auta", "cars")}</span>
    </button>
    <div class="member-body">
      <small>${escapeHtml(competitions || ui("Clan kluba", "Club member"))}</small>
      <h3>${escapeHtml(member.name)}</h3>
      ${memberSocialLinks(member)}
      <p>${escapeHtml(bio || localizedField(car, "details") || ui("Klikni vise za galeriju, opis auta i modifikacije.", "Open for gallery, car description and modifications."))}</p>
      <div class="garage-card-footer">
        <strong>${escapeHtml(car.name || ui("Projekt", "Project"))}</strong>
        <button class="btn secondary" data-member="${member.id}">${tr("more")}</button>
      </div>
    </div>
  </article>`;
}

function openMember(id) {
  const member = state.data.members.find(item => item.id === id);
  const detail = $("#detail");
  if (!member || !detail) return;
  const cars = memberCars(member);
  const heroCar = cars[0] || {};
  const allImages = cars.flatMap(carImageList).filter((item, index, list) => list.indexOf(item) === index);
  detail.innerHTML = `
    <div class="detail-backdrop" data-close-detail></div>
    <div class="detail-inner garage-detail">
      <button class="map-close detail-close" data-close-detail aria-label="${tr("close")}">&times;</button>
      <div class="garage-detail-hero">
        <img src="${carImageList(heroCar)[0] || "/assets/member-roadster.svg"}" alt="${escapeHtml(heroCar.name || member.name)}" />
        <div>
          <span>${ui("CLAN GARAZE", "GARAGE MEMBER")}</span>
          <h2>${escapeHtml(member.name)}</h2>
          <p>${escapeHtml(localizedField(member, "bio") || ui("Profil clana i njegovi auti.", "Member profile and cars."))}</p>
          ${memberSocialLinks(member)}
          ${allImages.length ? `<button class="btn secondary" type="button" data-download-images="${escapeHtml(allImages.join("|"))}">${ui("Download sve slike", "Download all images")}</button>` : ""}
          <div class="garage-tags">
            ${localizedField(member, "competitions") ? `<em>${escapeHtml(localizedField(member, "competitions"))}</em>` : ""}
          </div>
        </div>
      </div>
      <div class="garage-car-list">
        ${cars.map(car => {
          const images = carImageList(car);
          return `<article class="garage-car-panel">
            <div class="garage-car-copy">
              <small>${ui("AUTO", "CAR")}</small>
              <h3>${escapeHtml(car.name || ui("Projekt", "Project"))}</h3>
              ${localizedField(car, "details") ? `<p>${escapeHtml(localizedField(car, "details"))}</p>` : ""}
              <dl>
                ${localizedField(car, "mods") ? `<div><dt>${tr("mods")}</dt><dd>${escapeHtml(localizedField(car, "mods"))}</dd></div>` : ""}
                ${localizedField(car, "competesIn") ? `<div><dt>${tr("competes")}</dt><dd>${escapeHtml(localizedField(car, "competesIn"))}</dd></div>` : ""}
              </dl>
            </div>
            <div class="gallery garage-gallery">
              ${images.map(img => `<figure class="downloadable-image"><img src="${img}" alt="${escapeHtml(car.name || member.name)}" /><a class="image-download" href="${img}" download="${escapeHtml(imageFileName(img, car.name || member.name))}">Download</a></figure>`).join("")}
            </div>
          </article>`;
        }).join("")}
      </div>
    </div>
  `;
  detail.classList.add("is-open");
}

function mapsPageV2() {
  const cities = Object.values(state.data.events.reduce((groups, event) => {
    const key = event.city || ui("Ostalo", "Other");
    groups[key] ||= { city: key, x: event.x, y: event.y, events: [] };
    groups[key].events.push(event);
    return groups;
  }, {}));
  app.innerHTML = `
    <section class="section alt" style="padding-top:128px">
      <div class="section-head"><h2>${tr("mapsTitle")}</h2><p>${tr("mapsText")}</p></div>
      <div class="map-public-actions"><button class="btn add-event-btn" type="button" data-open-event-form><span>+</span> ${ui("Dodaj event", "Add event")}</button><p>${ui("Event mogu dodati clanovi i gosti.", "Members and guests can add an event.")}</p></div>
      <div class="map-wrap map-wrap-wide">
        <div class="cro-map cro-map-wide">
          <div class="cro-shape"></div>
          ${cities.map(group => `<button class="pin" style="--x:${group.x};--y:${group.y}" data-city="${escapeHtml(group.city)}" data-map-city="${escapeHtml(group.city)}" aria-label="${escapeHtml(group.city)}: ${group.events.length}"><span>${group.events.length}</span></button>`).join("")}
          <aside class="map-city-panel" id="mapCityPanel" hidden></aside>
        </div>
        <p class="map-hint">${ui("Klikni crvenu tocku za susrete i druzenja u tom gradu.", "Click a red point to see meets and events in that city.")}</p>
      </div>
    </section>
    <aside class="public-event-modal" id="publicEventModal" hidden><div class="event-detail-backdrop" data-close-event-form></div><div class="public-event-box"><button class="map-close" type="button" data-close-event-form>&times;</button><span class="kicker">${ui("JAVNI DOGADAJ", "PUBLIC EVENT")}</span><h2>${ui("Dodaj susret", "Add meet")}</h2><p>${ui("Upisi tocnu lokaciju kako bi se grad i tocka automatski prikazali na karti.", "Enter the exact location so the city point can appear on the map.")}</p><form class="public-event-form" data-form="public-event"><label>${ui("Naziv eventa", "Event title")}<input required name="title" maxlength="100" /></label><label>${ui("Grad", "City")}<input required name="city" placeholder="${ui("npr. Zapresic", "e.g. Zagreb")}" /></label><label class="wide">${ui("Tocna lokacija / adresa", "Exact location / address")}<input required name="location" placeholder="${ui("npr. Autopraonica, Ulica 1, Zapresic", "e.g. Car wash, Street 1, Zagreb")}" /></label><label>${ui("Datum", "Date")}<input required type="date" name="date" /></label><label>${ui("Vrijeme", "Time")}<input required type="time" name="time" /></label><label>${ui("Ime organizatora", "Organizer name")}<input required name="organizerName" /></label><label>${ui("Kontakt email", "Contact email")}<input required type="email" name="organizerEmail" /></label><label class="wide">${ui("Opis", "Description")}<textarea required name="description" maxlength="1200"></textarea></label><button class="btn wide" type="submit">${ui("Objavi event na karti", "Publish event on map")}</button></form></div></aside>
    <aside class="event-detail-modal" id="eventDetail" hidden></aside>
    ${clubFooter()}`;
}

function cityEventsPanel(city) {
  const events = state.data.events.filter(event => event.city === city);
  return `<div class="map-panel-head"><div><small>${escapeHtml(city)}</small><h3>${events.length} ${events.length === 1 ? ui("dogadaj", "event") : ui("dogadaja", "events")}</h3></div><button class="map-close" data-close-city aria-label="${tr("close")}">&times;</button></div>
    <div class="city-event-list">${events.map(event => `<article class="city-event-row">
      <img src="${event.image || "/assets/hero-night.svg"}" alt="${escapeHtml(localizedField(event, "title"))}" />
      <div><strong>${escapeHtml(localizedField(event, "title"))}</strong><span>${escapeHtml(event.date)} &middot; ${escapeHtml(event.time || "")}</span></div>
      <button class="btn secondary" data-event-more="${event.id}">${tr("more")}</button>
    </article>`).join("")}</div>`;
}

function eventDetail(event) {
  const count = Number(event.attendeeCount ?? (event.attendees || []).length);
  const member = state.user ? state.data.members.find(item => item.userId === state.user.id) : null;
  const cars = member?.cars || [];
  const isAttending = (event.attendees || []).some(item => item.mine || item.userId === state.user?.id);
  const canManageMeet = state.user?.meetAccess || event.canManageMeet || ["admin", "meet_manager"].includes(state.user?.role);
  const canAdminMeet = event.canAdminMeet || state.user?.role === "admin";
  const clubMeet = Boolean(event.clubMeet);
  const actions = clubMeet
    ? `${state.user && (state.user.garageAccess || state.user.role === "admin") ? loggedInAttend(event, cars, isAttending) : state.user ? "" : `<a class="btn" href="/webshop-login" data-link>${ui("Prijavi se", "Sign in")}</a>`}${canManageMeet ? `<button class="btn secondary" data-toggle-attendees="${event.id}">${ui("Popis dolazaka", "Attendee list")} (${count})</button><a class="btn secondary" href="/api/meet-manager/event/export?eventId=${encodeURIComponent(event.id)}">${ui("Download Excel", "Download Excel")}</a>` : ""}`
    : `${state.user && (state.user.garageAccess || state.user.role === "admin") ? loggedInAttend(event, cars, isAttending) : `<button class="btn" data-attend="${event.id}">${ui("DOLAZIM", "ATTEND")}</button>`}<button class="btn secondary" data-toggle-attendees="${event.id}">${ui("Popis dolazaka", "Attendee list")} (${count})</button>${canAdminMeet ? `<button class="btn secondary" type="button" data-enable-club-meet="${event.id}">${ui("Pretvori u klupski meet", "Make club meet")}</button>` : ""}`;
  return `<div class="event-detail-backdrop" data-close-event></div><article class="event-card event-card-detail" id="${event.id}">
    <button class="map-close event-close" data-close-event aria-label="${tr("close")}">&times;</button>
    <img src="${event.image || "/assets/hero-night.svg"}" alt="${escapeHtml(localizedField(event, "title"))}" />
    <h3>${escapeHtml(localizedField(event, "title"))}</h3>
    <div class="event-date">${escapeHtml(event.date)} &middot; ${escapeHtml(event.time || "")} &middot; ${escapeHtml(event.city || "")}</div>
    ${event.location || event.address ? `<p class="event-location">${escapeHtml(localizedField(event, "location") || event.address)}</p>` : ""}
    <p>${escapeHtml(localizedField(event, "description"))}</p>${clubMeet ? `<div class="event-count"><strong>${count}</strong><span> ${ui("clanova ide", "members attending")}</span></div>` : ""}
    <div class="event-actions">${actions}</div>
    ${clubMeet ? "" : `<form class="guest-form" data-form="guest-attend" data-event-id="${event.id}" hidden>
      <label>${ui("Ime / nick", "Name / nickname")}<input required name="firstName" /></label><label>${tr("lastName")}<input name="lastName" /></label>
      <label>Instagram nick<input name="instagram" placeholder="@username" /></label><label>${ui("Auto (marka / model / boja)", "Car (make / model / color)")}<input required name="car" placeholder="${ui("VW Golf, crni", "VW Golf, black")}" /></label>
      <button class="btn" type="submit">${ui("Potvrdi dolazak", "Confirm attendance")}</button>
    </form>`}<div class="attendee-list" data-attendees="${event.id}" hidden>${attendeeList(event)}</div>
  </article>`;
}

function loggedInAttend(event, cars, isAttending) {
  if (isAttending) return `<span class="attending-badge">${ui("Prijavljen/a si", "You are attending")}</span>`;
  if (!state.user?.garageAccess && state.user?.role !== "admin") return `<span class="attending-badge">${ui("Samo clanovi mogu potvrditi dolazak", "Only members can confirm attendance")}</span>`;
  if (cars.length > 1) return `<form class="member-attend" data-form="member-attend" data-event-id="${event.id}"><label>${ui("Dolazim s automobilom", "I am coming with")}<select required name="carId">${cars.map(car => `<option value="${car.id}">${escapeHtml(car.name)}</option>`).join("")}</select></label><button class="btn" type="submit">${ui("DOLAZIM", "ATTEND")}</button></form>`;
  return `<button class="btn" data-attend="${event.id}">${ui("DOLAZIM", "ATTEND")}${cars[0] ? ` &middot; ${escapeHtml(cars[0].name)}` : ""}</button>`;
}

function productText(product, key) {
  const value = localizedField(product, key);
  return localizedValue(value);
}

function productOption(options = []) {
  return options.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(localizedValue(value))}</option>`).join("");
}

async function shopPage() {
  let account = null;
  if (state.user) account = await api("/api/shop/account").catch(() => null);
  const products = state.data.products || [];
  const seized = isWebshopSeized();
  app.innerHTML = `
    <section class="shop-hero"><div><span>OFFICIAL CLUB STORE</span><h1>CUNERI<br>WEBSHOP</h1><p>${ui("Od klupske odjece do naljepnica i dodataka za svaki build.", "From club clothing to stickers and accessories for every build.")}</p></div></section>
    <section class="section shop-shell ${seized ? "shop-is-seized" : ""}">
      <div class="shop-toolbar"><div><h2>${ui("Artikli", "Products")}</h2><small>${ui("Sve cijene su u eurima i ukljucuju PDV od 25%.", "All prices are in euros and include 25% VAT.")}</small></div><button class="btn secondary" data-cart-open>${ui("Kosarica", "Cart")} (${state.cart.reduce((sum, item) => sum + item.quantity, 0)})</button></div>
      <div class="product-grid">${products.map(productCardV2).join("")}</div>
    </section>
    <aside class="product-detail-drawer" id="productDetail" hidden></aside>
    <aside class="cart-drawer" id="cartDrawer" hidden>${cartContentV2(account)}</aside>
    ${clubFooter()}
    ${seized ? webshopSeizedOverlay() : ""}`;
  requestAnimationFrame(() => syncCheckoutDelivery());
  requestAnimationFrame(prepareScrollAnimations);
}

function productCardV2(product) {
  const sale = Math.max(0, Math.min(100, Number(product.salePercent || 0)));
  return `<article class="product-card">${sale ? `<span class="sale-ribbon">SALE</span>` : ""}<img src="${product.image || "/assets/cuneri-logo.png"}" alt="${escapeHtml(productText(product, "name"))}" /><div class="product-body"><small>${escapeHtml(productText(product, "category") || "Cuneri")}</small><h3>${escapeHtml(productText(product, "name"))}</h3><div class="price-line">${sale ? `<del>${euro(product.price)}</del>` : ""}<strong class="product-price">${euro(salePrice(product))}</strong></div>${sale ? `<span class="sale-copy">${ui("Popust", "Discount")} ${sale}%</span>` : ""}<span class="vat-note">${ui("U cijenu je ukljucen PDV 25%", "25% VAT is included in the price")}</span><span class="stock-note">${ui("Na zalihi", "In stock")}: ${Number(product.stock)}</span><button class="btn secondary product-more" data-product-more="${product.id}">${tr("more")}</button></div></article>`;
}

function openProductDetail(productId) {
  const product = state.data.products.find(item => item.id === productId);
  const drawer = document.querySelector("#productDetail");
  if (!product || !drawer) return;
  const sale = Math.max(0, Math.min(100, Number(product.salePercent || 0)));
  const options = [product.audiences?.length ? `<label>${ui("Musko / zensko", "Men / women")}<select name="audience">${productOption(product.audiences)}</select></label>` : "", product.colors?.length ? `<label>${ui("Boja", "Color")}<select name="color">${productOption(product.colors)}</select></label>` : "", product.sizes?.length ? `<label>${ui("Velicina", "Size")}<select name="size">${productOption(product.sizes)}</select></label>` : ""].join("");
  drawer.innerHTML = `<button class="map-close drawer-close" data-product-close>&times;</button><img src="${product.image}" alt="${escapeHtml(productText(product, "name"))}" /><small>${escapeHtml(productText(product, "category") || "")}</small><h2>${escapeHtml(productText(product, "name"))}</h2><p>${escapeHtml(productText(product, "description") || "")}</p><strong class="product-price">${euro(salePrice(product))}</strong>${sale ? `<span class="sale-copy">SALE ${sale}%</span>` : ""}<span class="stock-note">${ui("Na zalihi", "In stock")}: ${product.stock}</span><form data-form="add-cart" data-product-id="${product.id}" class="product-options">${options}<label>${ui("Kolicina", "Quantity")}<input name="quantity" type="number" min="1" max="${Number(product.stock)}" value="1" /></label><button class="btn" type="submit">${ui("Dodaj u kosaricu", "Add to cart")}</button></form>`;
  drawer.hidden = false;
}

function paymentInstruction(method) {
  if (method === "paypal") return ui("PayPal uplata ide na tccuneri@gmail.com. U opis uplate upisi broj narudzbe koji dobijes nakon potvrde.", "PayPal payment goes to tccuneri@gmail.com. Write the order number in the payment note.");
  if (method === "revolut") return ui("Revolut uplata ide na @cuneri. U opis uplate upisi broj narudzbe koji dobijes nakon potvrde.", "Revolut payment goes to @cuneri. Write the order number in the payment note.");
  return ui("Placanje pouzecem obavlja se prilikom preuzimanja paketa.", "Cash on delivery is paid when you receive the package.");
}

function checkoutSections(profile = {}) {
  const deliveryType = profile.deliveryType || "address";
  const paymentMethod = profile.paymentMethod || "cod";
  return `<div class="checkout-block">
    <h3>${ui("Kontakt", "Contact")}</h3>
    <div class="checkout-grid">
      <label>${tr("name")}<input required name="firstName" value="${escapeHtml(profile.firstName || "")}" /></label>
      <label>${tr("lastName")}<input required name="lastName" value="${escapeHtml(profile.lastName || "")}" /></label>
      ${phoneInputGroup(profile, true)}
      <label>${ui("Nacin dostave", "Delivery method")}<select name="deliveryType" data-checkout-delivery><option value="address"${selected(deliveryType, "address")}>${ui("Kucna adresa", "Home address")}</option><option value="parcel"${selected(deliveryType, "parcel")}>${ui("Paketomat", "Parcel locker")}</option></select></label>
    </div>
  </div>
  <div class="checkout-block checkout-home-fields">
    <h3>${ui("Dostava na adresu", "Delivery to address")}</h3>
    <div class="checkout-grid">
      <label class="wide">${ui("Adresa dostave", "Delivery address")}<input name="address" value="${escapeHtml(profile.address || "")}" /></label>
      <label>${ui("Grad dostave", "Delivery city")}<input name="city" value="${escapeHtml(profile.city || "")}" /></label>
      <label>${ui("Postanski broj dostave", "Delivery postal code")}<input name="postalCode" value="${escapeHtml(profile.postalCode || "")}" /></label>
      <label class="wide">${ui("Napomena za dostavu", "Delivery note")}<input name="deliveryNote" value="${escapeHtml(profile.deliveryNote || "")}" placeholder="${ui("Kat, zvono, termin...", "Floor, doorbell, preferred time...")}" /></label>
    </div>
  </div>
  <div class="checkout-block checkout-parcel-fields">
    <h3>${ui("Paketomat", "Parcel locker")}</h3>
    <div class="checkout-grid">
      <label class="wide">${ui("Sluzba paketomata", "Parcel service")}<select name="parcelService" data-parcel-service><option value="">${ui("Odaberi", "Choose")}</option><option value="BOX NOW"${selected(profile.parcelService, "BOX NOW")}>BOX NOW</option><option value="GLS"${selected(profile.parcelService, "GLS")}>GLS</option><option value="Paket24"${selected(profile.parcelService, "Paket24")}>Paket24</option></select></label>
      <label>${ui("Broj / oznaka paketomata", "Locker number / locator")}<input name="parcelLocker" value="${escapeHtml(profile.parcelLocker || "")}" placeholder="ZG123" /></label>
      <label>${ui("Adresa paketomata", "Locker address")}<input name="parcelAddress" value="${escapeHtml(profile.parcelAddress || "")}" placeholder="${ui("Ulica i grad paketomata", "Street and city")}" /></label>
    </div>
    <button class="btn secondary parcel-edit-btn" type="button" data-parcel-open>${ui("Upisi detalje paketomata", "Enter parcel locker details")}</button>
  </div>
  <div class="checkout-block">
    <h3>${ui("Podaci za uplatu", "Billing details")}</h3>
    <div class="checkout-grid">
      <label>${ui("Grad", "City")}<input required name="billingCity" value="${escapeHtml(profile.billingCity || profile.city || "")}" /></label>
      <label>${ui("Postanski broj", "Postal code")}<input required name="billingPostalCode" value="${escapeHtml(profile.billingPostalCode || profile.postalCode || "")}" /></label>
      <label>${ui("Ulica", "Street")}<input required name="billingStreet" value="${escapeHtml(profile.billingStreet || profile.address || "")}" /></label>
      <label>${ui("Kucni broj", "House number")}<input required name="billingHouseNumber" value="${escapeHtml(profile.billingHouseNumber || "")}" /></label>
      <label class="wide">${ui("Napomena", "Note")}<input name="billingNote" value="${escapeHtml(profile.billingNote || "")}" placeholder="${ui("Napomena za narudzbu ili uplatu", "Order or payment note")}" /></label>
    </div>
  </div>
  <div class="checkout-block">
    <h3>${ui("Placanje", "Payment")}</h3>
    <div class="payment-options">
      <label><input type="radio" name="paymentMethod" value="cod"${checked(paymentMethod, "cod")} /> ${ui("Pouzecem", "Cash on delivery")}</label>
      <label><input type="radio" name="paymentMethod" value="revolut"${checked(paymentMethod, "revolut")} /> Revolut @cuneri</label>
      <label><input type="radio" name="paymentMethod" value="paypal"${checked(paymentMethod, "paypal")} /> PayPal tccuneri@gmail.com</label>
    </div>
    <p class="payment-help" data-payment-help>${paymentInstruction(paymentMethod)}</p>
  </div>
  <label class="wide">${ui("Kod za popust", "Discount code")}<input name="couponCode" value="${escapeHtml(localStorage.getItem("cuneri_coupon") || "")}" placeholder="${ui("Unesi kod", "Enter code")}" /></label>
  <div class="parcel-modal" data-parcel-modal hidden>
    <div class="parcel-modal-box">
      <button class="map-close" type="button" data-parcel-close>&times;</button>
      <h3>${ui("Detalji paketomata", "Parcel locker details")}</h3>
      <p>${ui("Upisi broj lokatora i adresu odabranog paketomata.", "Enter the locator number and address of the selected parcel locker.")}</p>
      <label>${ui("Broj / oznaka paketomata", "Locker number / locator")}<input data-parcel-locker-copy value="${escapeHtml(profile.parcelLocker || "")}" /></label>
      <label>${ui("Adresa paketomata", "Locker address")}<input data-parcel-address-copy value="${escapeHtml(profile.parcelAddress || "")}" /></label>
      <button class="btn" type="button" data-parcel-save>${ui("Spremi paketomat", "Save parcel locker")}</button>
    </div>
  </div>`;
}

function cartContentV2(account) {
  const total = state.cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const profile = account?.profile || {};
  const deliveryClass = (profile.deliveryType || "address") === "parcel" ? "is-parcel" : "is-address";
  return `<div class="cart-head"><h2>${ui("Kosarica", "Cart")}</h2><button class="map-close" data-cart-close>&times;</button></div><div class="cart-lines">${state.cart.map((item, index) => `<div class="cart-line"><div><strong>${escapeHtml(localizedValue(item.name))}</strong><small>${[item.audience, item.color, item.size].filter(Boolean).map(localizedValue).join(" / ")} &middot; ${item.quantity} ${ui("kom", "pcs")}</small></div><span>${euro(item.price * item.quantity)}</span><button data-cart-remove="${index}" aria-label="${ui("Makni artikl", "Remove item")}">&times;</button></div>`).join("") || `<p>${ui("Kosarica je prazna.", "Your cart is empty.")}</p>`}</div><div class="cart-total"><span>${ui("Ukupno prije kupona", "Total before coupon")}</span><strong>${euro(total)}</strong></div>${state.cart.length ? `<form class="checkout-form ${deliveryClass}" data-form="shop-checkout">${state.user ? "" : `<label>${tr("email")}<input required type="email" name="email" /></label>`}${checkoutSections(profile)}<button class="btn" type="submit">${ui("Potvrdi narudzbu", "Confirm order")}</button></form>` : ""}<p class="vat-note">${ui("PDV 25% ukljucen je u sve prikazane cijene.", "25% VAT is included in all displayed prices.")}</p>`;
}

function shopAccountV2(account) {
  if (!state.user) return `<div class="section-head"><h2>${ui("Webshop racun", "Webshop account")}</h2><p>${ui("Odvojena prijava za kupce, reset lozinke i registracija nalaze se na jednom sigurnom mjestu.", "Customer login, password reset and registration are in one secure place.")}</p></div><div class="panel shop-login-callout"><h3>${ui("Vec imas racun?", "Already have an account?")}</h3><a class="btn" href="/webshop-login" data-link>${ui("Webshop login / registracija", "Webshop login / registration")}</a><p>${ui("Kupnju mozes dovrsiti i kao gost iz kosarice.", "You can also checkout as a guest from the cart.")}</p></div>`;
  const accountHtml = shopAccount(account);
  return accountHtml
    .replaceAll("Moj webshop racun", ui("Moj webshop racun", "My webshop account"))
    .replaceAll("Upravljanje webshopom", ui("Upravljanje webshopom", "Webshop management"))
    .replaceAll("Podaci za dostavu", ui("Podaci za dostavu", "Delivery details"))
    .replaceAll("Moje narudzbe", ui("Moje narudzbe", "My orders"))
    .replaceAll("Jos nemas narudzbi.", ui("Jos nemas narudzbi.", "You do not have any orders yet."));
}

function accessLoginPage(mode) {
  const isGarage = false;
  const isAdmin = mode === "admin";
  const title = isAdmin ? "Admin login" : "Login";
  const kicker = isAdmin ? "CUNERI ADMIN" : "CLANOVI I WEBSHOP";
  const text = isAdmin
    ? ui("Ovdje se prijavljuje admin tim za upravljanje stranicom, webshopom, clanovima i meetovima.", "Admins sign in here to manage the site, webshop, members and meets.")
    : ui("Isti email i lozinka koriste se za webshop i clanove autokluba. Sustav sam prepoznaje imas li samo webshop ili i garazu/clanski pristup koji odobrava admin.", "The same email and password are used for the webshop and club members. The system detects whether you only have webshop access or also garage/member access approved by an admin.");
  const secondaryLinks = isAdmin
    ? `<a class="text-link" href="/webshop-login" data-link>${ui("Idi na login za clanove i webshop", "Go to member and webshop login")}</a>`
    : `<a class="text-link" href="/admin" data-link>ADMIN</a>`;
  app.innerHTML = `<section class="login-shell access-login"><div class="access-login-grid"><div class="login-box"><span class="kicker">${kicker}</span><h1>${title}</h1><p>${text}</p><form class="admin-form" data-form="login"><input type="hidden" name="loginMode" value="${isAdmin ? "admin" : "shop"}" /><label>Email / username<input required name="username" /></label><label>${tr("password")}<input required type="password" name="password" /></label><button class="btn">${tr("login")}</button></form><div class="login-links">${secondaryLinks}</div></div>${isAdmin ? "" : `<div class="login-side"><form class="form-box" data-form="shop-reset"><h3>${ui("Zaboravljena lozinka", "Forgot password")}</h3><label>${tr("email")}<input required type="email" name="email" /></label><button class="btn secondary">${ui("Posalji reset email", "Send reset email")}</button></form><form class="form-box" data-form="shop-register"><h3>${ui("Registracija za webshop", "Webshop registration")}</h3><p class="admin-help">${ui("Ovo otvara samo webshop racun. Clan autokluba postajes kad admin odobri garazu/clanski pristup.", "This creates a webshop account only. You become a club member when an admin approves garage/member access.")}</p><label>${tr("name")}<input required name="firstName" /></label><label>${tr("lastName")}<input required name="lastName" /></label><label>${tr("email")}<input required type="email" name="email" /></label><label>${tr("password")}<input required minlength="8" type="password" name="password" /></label><label>${ui("Ponovi lozinku", "Repeat password")}<input required minlength="8" type="password" name="passwordConfirm" /></label><button class="btn">${ui("Registracija", "Register")}</button></form></div>`}</div></section>`;
}

async function meetPanelPage() {
  if (!state.user) return accessLoginPage("admin");
  if (!["admin", "meet_manager"].includes(state.user.role) && !state.user.meetAccess) return errorPage(403, "Nemas pristup meet panelu.");
  const canAdminMeet = state.user.role === "admin";
  const data = await api("/api/meet-manager");
  app.innerHTML = `<section class="section alt meet-admin-page" style="padding-top:128px">
    <div class="section-head"><h2>Meet panel</h2><p>Digitalni popis clanova za meetove gdje Cuneri idu kao grupa.</p></div>
    <div class="admin-grid">
      ${adminPanelSwitch()}
      ${canAdminMeet ? `<div class="panel admin-wide">
        <h3>Dodaj grupni meet</h3>
        <form class="admin-form public-event-form" data-form="meet-event">
          <label>Naziv meet-a<input required name="title" /></label>
          <label>Grad<input name="city" /></label>
          <label class="wide">Lokacija<input required name="location" /></label>
          <label>Datum<input required type="date" name="date" /></label>
          <label>Vrijeme<input required type="time" name="time" /></label>
          <label class="wide">Opis<textarea name="description" placeholder="Npr. okupljanje u 17:00, polazak zajedno..."></textarea></label>
          <button class="btn wide" type="submit">Dodaj meet za popis</button>
        </form>
      </div>` : `<div class="panel admin-wide"><h3>Meet organizer pristup</h3><p class="admin-help">Ovaj pristup sluzi samo za pregled popisa i download Excelice. Samo admin moze dodavati klupske meetove ili mijenjati popis clanova.</p></div>`}
      ${data.events.map(event => meetPanelEvent(event, data.members, canAdminMeet)).join("") || `<div class="panel admin-wide"><h3>Nema grupnih meetova</h3><p class="admin-help">${canAdminMeet ? "Dodaj prvi grupni meet gore ili u JSON eventa postavi \"clubMeet\": true." : "Admin jos nije dodao klupski meet."}</p></div>`}
    </div>
  </section>`;
}

function meetPanelEvent(event, members, canAdminMeet = false) {
  const attendees = event.attendees || [];
  const attendingIds = new Set(attendees.map(item => item.memberId || item.userId));
  const memberOptions = members
    .filter(member => !attendingIds.has(member.id) && !attendingIds.has(member.userId))
    .map(member => `<option value="${member.id}">${escapeHtml(member.name)}${member.email ? ` - ${escapeHtml(member.email)}` : ""}</option>`)
    .join("");
  return `<div class="panel admin-wide meet-panel-card">
    <div class="meet-panel-head">
      <div><span class="payment-badge">Grupni meet</span><h3>${escapeHtml(localizedField(event, "title"))}</h3><p>${escapeHtml(event.date || "")} ${escapeHtml(event.time || "")} · ${escapeHtml(event.location || event.city || "")}</p></div>
      <strong>${attendees.length} clanova</strong>
    </div>
    <div class="row-actions"><a class="btn secondary" href="/api/meet-manager/event/export?eventId=${encodeURIComponent(event.id)}">Download Excel popisa</a></div>
    ${canAdminMeet ? `<form class="admin-form meet-add-form" data-form="meet-attendee-add">
      <input type="hidden" name="eventId" value="${event.id}" />
      <label>Dodaj clana<select required name="memberId">${memberOptions || `<option value="">Svi clanovi su vec dodani</option>`}</select></label>
      <button class="btn secondary" ${memberOptions ? "" : "disabled"}>Dodaj na popis</button>
    </form>` : ""}
    <div class="meet-attendee-list">
      ${attendees.map((item, index) => `<div class="attendee-row meet-attendee-row"><strong>${index + 1}. ${escapeHtml(item.name || "Clan")}</strong><span>${escapeHtml(item.car || "Auto clana")}</span>${canAdminMeet ? `<button class="btn danger" type="button" data-meet-remove="${event.id}" data-attendee-id="${item.id}" data-member-id="${item.memberId || ""}">Makni</button>` : ""}</div>`).join("") || `<p class="admin-help">Jos nitko nije na popisu.</p>`}
    </div>
  </div>`;
}

function adminPanelSwitch() {
  if (!state.user) return "";
  const canShop = state.user.shopAccess || ["admin", "shop_manager"].includes(state.user.role);
  const canAdmin = state.user.role === "admin";
  const canMeet = state.user.meetAccess || ["admin", "meet_manager"].includes(state.user.role);
  const path = location.pathname.replace(/\/$/, "") || "/";
  const adminActive = path === "/admin";
  const shopActive = path === "/webshop-upravljanje";
  const meetActive = path === "/meet-panel";
  const links = [
    canAdmin ? `<a class="btn ${adminActive ? "" : "secondary"}" href="/admin" data-link>${ui("Admin panel", "Admin panel")}</a>` : "",
    canShop ? `<a class="btn ${shopActive ? "" : "secondary"}" href="/webshop-upravljanje" data-link>${ui("Webshop panel", "Webshop panel")}</a>` : "",
    canMeet ? `<a class="btn ${meetActive ? "" : "secondary"}" href="/meet-panel" data-link>${ui("Meet panel", "Meet panel")}</a>` : ""
  ].filter(Boolean).join("");
  return links ? `<div class="panel admin-wide panel-switch"><h3>${ui("Paneli", "Panels")}</h3><p>${ui("Prikazuju se samo paneli za koje ovaj email ima pristup.", "Only panels this email can access are shown.")}</p><div class="row-actions">${links}</div></div>` : "";
}

function isWebshopSeized() {
  return Boolean(state.data?.settings?.webshopSeizedMode);
}

function shopSeizedControl(settings = {}) {
  const active = Boolean(settings.webshopSeizedMode);
  return `<div class="panel admin-wide seized-control ${active ? "is-active" : ""}">
    <div>
      <h3>${ui("Webshop u izradi", "Webshop under construction")}</h3>
      <p>${ui("Kad je ukljuceno, javni webshop dobiva veliki zaplijenjeno overlay i kupci ne mogu klikati artikle ni slati narudzbe. Admin panel i dodavanje artikala rade normalno.", "When enabled, the public webshop gets a large seized overlay and customers cannot click products or place orders. Admin management still works normally.")}</p>
    </div>
    <form class="admin-form seized-form" data-form="shop-settings">
      <label class="check-label"><input type="checkbox" name="webshopSeizedMode" ${active ? "checked" : ""} /> ${ui("Webshop zaplijenjen / u izradi", "Webshop seized / under construction")}</label>
      <button class="btn ${active ? "danger" : ""}" type="submit">${active ? ui("Makni zapljenu", "Remove seizure") : ui("Ukljuci zapljenu", "Enable seizure")}</button>
    </form>
  </div>`;
}

function webshopSeizedOverlay() {
  return `<div class="webshop-seized-overlay" role="status" aria-live="polite">
    <div class="seized-tape tape-top">POLICIJA · STOP POLICIJA · POLICIJA · STOP POLICIJA · POLICIJA · STOP POLICIJA</div>
    <div class="seized-card">
      <img class="police-badge" src="/assets/policija-mup.png" alt="Policija" />
      <img src="/assets/2cv-outline.svg" alt="" />
      <span>${ui("WEBSHOP ZAPLIJENJEN", "WEBSHOP SEIZED")}</span>
      <h2>${ui("U izradi je, nema klikanja", "Under construction, no clicking")}</h2>
      <p>${ui("Ekipa slaze artikle, cijene i narudzbe. Webshop admin moze maknuti ovu blokadu u webshop panelu.", "The team is preparing products, prices and orders. A webshop admin can remove this block in the webshop panel.")}</p>
      <a class="btn seized-home" href="/" data-link>${ui("Povratak na pocetnu", "Back to home")}</a>
    </div>
    <div class="seized-tape tape-bottom">STOP POLICIJA · WEBSHOP U IZRADI · STOP POLICIJA · WEBSHOP U IZRADI · STOP POLICIJA</div>
  </div>`;
}

function enhancePasswordFields(root = document) {
  root.querySelectorAll('input[type="password"]:not([data-password-enhanced])').forEach(input => {
    const wrap = document.createElement("span");
    const button = document.createElement("button");
    wrap.className = "password-wrap";
    button.className = "password-peek";
    button.type = "button";
    button.setAttribute("aria-label", ui("Prikazi lozinku dok drzis pokazivac ovdje", "Show password while hovering here"));
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    input.dataset.passwordEnhanced = "true";
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    wrap.appendChild(button);
    const show = () => input.type = "text";
    const hide = () => input.type = "password";
    button.addEventListener("mouseenter", show);
    button.addEventListener("mouseleave", hide);
    button.addEventListener("focus", show);
    button.addEventListener("blur", hide);
    button.addEventListener("pointerdown", show);
    button.addEventListener("pointerup", hide);
    button.addEventListener("pointercancel", hide);
  });
}

function render() {
  syncLang();
  const path = location.pathname.replace(/\/$/, "") || "/";
  clearInterval(window.cuneriHeroTimer);
  if (state.user?.mustChangePassword && path !== "/admin") {
    history.replaceState({}, "", "/admin");
    adminPage().catch(error => toast(error.message));
  } else if (path === "/") home();
  else if (path === "/kontakt" || path === "/kontat") contactPage();
  else if (path === "/clanovi") membersPage();
  else if (path === "/maps") mapsPageV2();
  else if (path === "/povijest") historyPage();
  else if (path === "/webshop") shopPage().catch(error => toast(error.message));
  else if (path === "/webshop-upravljanje") shopManagePageV2().catch(error => toast(error.message));
  else if (path === "/meet-panel") meetPanelPage().catch(error => toast(error.message));
  else if (path === "/profil" || path === "/profile") userProfilePage();
  else if (path === "/login" || path === "/webshop-login") accessLoginPage("shop");
  else if (path === "/login-clanovi") accessLoginPage("shop");
  else if (path === "/terms" || path === "/therms") termsPageCurrent();
  else if (path === "/admin") adminPage().catch(error => toast(error.message));
  else errorPage(404, "Ova cesta ne vodi na Cuneri susret.");
  syncLang();
  enhancePasswordFields(app);
  requestAnimationFrame(() => enhancePasswordFields(app));
  prepareScrollAnimations();
  cookieBanner();
  window.scrollTo({ top: 0, behavior: "instant" });
}

async function refresh() {
  const [publicData, me] = await Promise.all([api("/api/public"), api("/api/me")]);
  state.data = publicData;
  state.user = me.user;
}

document.addEventListener("click", async event => {
  const link = event.target.closest("[data-link]");
  if (link && link.getAttribute("href")?.startsWith("/")) {
    event.preventDefault();
    navigate(link.getAttribute("href"));
  }
  const memberBtn = event.target.closest("[data-member]");
  if (memberBtn) openMember(memberBtn.dataset.member);
  if (event.target.closest("[data-close-detail]")) $("#detail").classList.remove("is-open");
  if (event.target.closest("[data-cookie-ok]")) {
    localStorage.setItem("cuneri_cookies", "ok");
    document.querySelector(".cookie-banner")?.remove();
  }
  if (event.target.closest("[data-weather-refresh]")) {
    sessionStorage.removeItem("cuneri_forecast");
    const forecastUpdate = loadForecast(true);
    render();
    await forecastUpdate;
    render();
    toast(state.forecast.status === "ready" ? "Prognoza je osvjezena." : state.forecast.error);
  }
  if (event.target.closest("[data-error-close]")) document.querySelector(".error-overlay")?.remove();
  const editUser = event.target.closest("[data-edit-user]");
  if (editUser) openAdminUserEditor(editUser.dataset.editUser);
  if (event.target.closest("[data-close-user-editor]")) document.querySelector("#adminUserEditor")?.remove();
  if (event.target.closest("[data-open-event-form]")) document.querySelector("#publicEventModal")?.removeAttribute("hidden");
  if (event.target.closest("[data-close-event-form]")) document.querySelector("#publicEventModal")?.setAttribute("hidden", "");
  if (event.target.closest("[data-reward-close]")) document.querySelector(".discount-reward")?.remove();
  if (event.target.closest("[data-copy-coupon]")) {
    await navigator.clipboard?.writeText("2CV10").catch(() => {});
    const label = document.querySelector("[data-copy-coupon] em");
    if (label) label.textContent = "Kod je kopiran";
  }
  const copySocial = event.target.closest("[data-copy-social]");
  if (copySocial) {
    await navigator.clipboard?.writeText(copySocial.dataset.copySocial).catch(() => {});
    toast(`Kopirano: ${copySocial.dataset.copySocial}`);
  }
  const downloadImages = event.target.closest("[data-download-images]");
  if (downloadImages) {
    downloadImages.dataset.downloadImages.split("|").filter(Boolean).forEach((url, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = url;
        link.download = imageFileName(url, "cuneri-slika");
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, index * 180);
    });
    toast("Download slika je pokrenut.");
  }
  if (event.target.closest("[data-cart-open]")) {
    document.querySelector("#cartDrawer")?.removeAttribute("hidden");
    syncCheckoutDelivery(document.querySelector("#cartDrawer") || document);
  }
  if (event.target.closest("[data-cart-close]")) document.querySelector("#cartDrawer")?.setAttribute("hidden", "");
  if (event.target.closest("[data-parcel-open]")) {
    const form = event.target.closest("form");
    const modal = form?.querySelector("[data-parcel-modal]");
    if (modal) {
      modal.querySelector("[data-parcel-locker-copy]").value = form.elements.parcelLocker?.value || "";
      modal.querySelector("[data-parcel-address-copy]").value = form.elements.parcelAddress?.value || "";
      modal.hidden = false;
    }
  }
  if (event.target.closest("[data-parcel-close]")) event.target.closest("[data-parcel-modal]")?.setAttribute("hidden", "");
  if (event.target.closest("[data-parcel-save]")) {
    const modal = event.target.closest("[data-parcel-modal]");
    const form = event.target.closest("form");
    if (form) {
      form.elements.parcelLocker.value = modal.querySelector("[data-parcel-locker-copy]").value;
      form.elements.parcelAddress.value = modal.querySelector("[data-parcel-address-copy]").value;
    }
    modal.hidden = true;
  }
  const productMore = event.target.closest("[data-product-more]");
  if (productMore) openProductDetail(productMore.dataset.productMore);
  if (event.target.closest("[data-product-close]")) document.querySelector("#productDetail")?.setAttribute("hidden", "");
  const discountCar = event.target.closest("[data-discount-car]");
  if (discountCar) {
    localStorage.setItem("cuneri_coupon", "2CV10");
    discountCar.remove();
    showDiscountReward();
  }
  const removeCart = event.target.closest("[data-cart-remove]");
  if (removeCart) {
    state.cart.splice(Number(removeCart.dataset.cartRemove), 1);
    saveCart();
    await shopPage();
    document.querySelector("#cartDrawer").hidden = false;
  }
  const deleteProduct = event.target.closest("[data-delete-product]");
  if (deleteProduct) {
    await api("/api/shop/manage/product", { method: "DELETE", body: { id: deleteProduct.dataset.deleteProduct } });
    await refresh();
    toast("Artikl je obrisan.");
    await shopManagePageV2();
  }
  const deleteUser = event.target.closest("[data-delete-user]");
  if (deleteUser) {
    const email = deleteUser.dataset.deleteUserEmail || "korisnika";
    if (!confirm(`Obrisati korisnika ${email}?`)) return;
    await api("/api/admin/user", { method: "DELETE", body: { id: deleteUser.dataset.deleteUser } });
    await refresh();
    toast("Korisnik je obrisan.");
    await adminPage();
    return;
  }
  const meetRemove = event.target.closest("[data-meet-remove]");
  if (meetRemove) {
    await api("/api/meet-manager/attendee", { method: "PUT", body: { eventId: meetRemove.dataset.meetRemove, attendeeId: meetRemove.dataset.attendeeId, memberId: meetRemove.dataset.memberId, action: "remove" } });
    await refresh();
    toast("Clan je maknut s popisa.");
    await meetPanelPage();
    return;
  }
  if (event.target.closest("[data-shop-order]")) {
    const result = await api("/api/shop/order", { method: "POST", body: { items: state.cart } });
    state.cart = [];
    saveCart();
    toast(`Narudzba ${result.order.id} je zaprimljena.`);
    await refresh();
    await shopPage();
  }
  const cityPin = event.target.closest("[data-map-city]");
  if (cityPin) {
    const panel = document.querySelector("#mapCityPanel");
    panel.innerHTML = cityEventsPanel(cityPin.dataset.mapCity);
    panel.hidden = false;
  }
  if (event.target.closest("[data-close-city]")) document.querySelector("#mapCityPanel")?.setAttribute("hidden", "");
  const eventMore = event.target.closest("[data-event-more]");
  if (eventMore) openEventDetail(eventMore.dataset.eventMore);
  if (event.target.closest("[data-close-event]")) document.querySelector("#eventDetail")?.setAttribute("hidden", "");
  const enableClubMeet = event.target.closest("[data-enable-club-meet]");
  if (enableClubMeet) {
    await api("/api/meet-manager/event", { method: "PUT", body: { eventId: enableClubMeet.dataset.enableClubMeet, clubMeet: true } });
    await refresh();
    toast("Digitalni popis je ukljucen za ovaj meet.");
    openEventDetail(enableClubMeet.dataset.enableClubMeet);
    return;
  }
  const attend = event.target.closest("[data-attend]");
  if (attend) {
    const eventId = attend.dataset.attend;
    const selectedEvent = state.data.events.find(item => item.id === eventId);
    const canAttendAsMember = state.user && (selectedEvent?.clubMeet || state.user.garageAccess || state.user.role === "admin");
    if (canAttendAsMember) {
      await api("/api/event/attend", { method: "POST", body: { eventId } });
      await refresh();
      toast("Dolazak je dodan.");
      openEventDetail(eventId);
    } else {
      document.querySelector(`form[data-event-id="${eventId}"]`)?.toggleAttribute("hidden");
    }
  }
  const toggleAttendees = event.target.closest("[data-toggle-attendees]");
  if (toggleAttendees) {
    document.querySelector(`[data-attendees="${toggleAttendees.dataset.toggleAttendees}"]`)?.toggleAttribute("hidden");
  }
  if (event.target.closest("[data-action='logout']")) {
    await api("/api/logout", { method: "POST" });
    state.user = null;
    toast(tr("saved"));
    navigate("/");
  }
});

document.addEventListener("submit", event => {
  const form = event.target.closest("form");
  if (!form) return;
  event.preventDefault();
  submitForm(form).catch(error => showErrorOverlay(error.message));
});

document.addEventListener("change", event => {
  if (event.target.closest("form[data-form='shop-checkout']")) {
    const form = event.target.closest("form");
    syncCheckoutDelivery(form);
    if (event.target.matches("[data-parcel-service]") && event.target.value) {
      form.querySelector("[data-parcel-modal]")?.removeAttribute("hidden");
    }
  }
});

document.querySelectorAll(".lang").forEach(btn => {
  btn.addEventListener("click", () => {
    state.lang = btn.dataset.lang;
    localStorage.setItem("cuneri_lang", state.lang);
    render();
  });
});

$("#menuToggle").addEventListener("click", () => {
  $("#navPanel").classList.contains("is-open") ? closeMenu() : openMenu();
});

window.addEventListener("popstate", render);

refresh()
  .then(() => {
    const forecastUpdate = loadForecast().finally(() => {
      const path = location.pathname.replace(/\/$/, "") || "/";
      if (path === "/") render();
    });
    render();
    setTimeout(() => $("#loader").classList.add("is-hidden"), 850);
    return forecastUpdate.catch(() => {});
  })
  .catch(error => {
    app.innerHTML = `<section class="login-shell"><div class="login-box"><h1>Greška</h1><p>${error.message}</p></div></section>`;
    $("#loader").classList.add("is-hidden");
  });
