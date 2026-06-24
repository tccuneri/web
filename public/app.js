const state = {
  lang: localStorage.getItem("cuneri_lang") || "hr",
  data: null,
  user: null,
  heroIndex: 0,
  cart: JSON.parse(localStorage.getItem("cuneri_cart") || "[]")
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
    contactText: "Pošalji poruku klubu. U ovoj lokalnoj verziji email završava u data/email-inbox.json.",
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
    contactText: "Send a message to the club. In this local version email is written to data/email-inbox.json.",
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

function tr(key) {
  return t[state.lang][key] || key;
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

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("is-open");
  setTimeout(() => node.classList.remove("is-open"), 2600);
}

function syncLang() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = tr(node.dataset.i18n);
  });
  document.querySelectorAll(".lang").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === state.lang));
  const account = document.querySelector("#headerAccount");
  if (account) account.innerHTML = state.user
    ? `<button type="button" data-action="logout" title="Odjava"><span class="person-icon">&#9679;</span><b>${escapeHtml(state.user.name || state.user.email)} / LOGOUT</b></button>`
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
    <section class="section alt shop-account">${shopAccountV2(account)}</section>
    ${clubFooter()}`;
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

function shopAccountV2(account) {
  if (!state.user) return `<div class="section-head"><h2>Webshop racun</h2><p>Odvojena prijava za kupce, reset lozinke i registracija nalaze se na jednom sigurnom mjestu.</p></div><div class="panel shop-login-callout"><h3>Vec imas racun?</h3><a class="btn" href="/webshop-login" data-link>Webshop login / registracija</a><p>Kupnju mozes dovrsiti i kao gost iz kosarice.</p></div>`;
  return shopAccount(account);
}

function shopAccount(account) {
  if (!state.user) return `<div class="section-head"><h2>Webshop racun</h2><p>Otvori racun za pracenje narudzbi i spremanje dostave.</p></div><div class="shop-auth-grid"><form class="form-box" data-form="shop-register"><h3>Registracija</h3><label>Email<input required type="email" name="email" /></label><label>Lozinka<input required type="password" minlength="8" name="password" /></label><button class="btn">Otvori racun</button></form><form class="form-box" data-form="shop-reset"><h3>Reset lozinke</h3><label>Email<input required type="email" name="email" /></label><button class="btn secondary">Posalji privremenu lozinku</button></form></div>`;
  const profile = account?.profile || {};
  return `<div class="section-head"><h2>Moj webshop racun</h2><p>${escapeHtml(state.user.email)}</p></div>${["admin", "shop_manager"].includes(state.user.role) ? `<a class="btn" href="/webshop-upravljanje" data-link>Upravljanje webshopom</a>` : ""}<div class="shop-account-grid"><form class="form-box" data-form="shop-profile"><h3>Podaci za dostavu</h3><label>Ime<input required name="firstName" value="${escapeHtml(profile.firstName || "")}" /></label><label>Prezime<input required name="lastName" value="${escapeHtml(profile.lastName || "")}" /></label><label>Telefon<input required name="phone" value="${escapeHtml(profile.phone || "")}" /></label><label>Nacin dostave<select name="deliveryType"><option value="address">Kucna adresa</option><option value="parcel">Paketomat</option></select></label><label>Adresa<input name="address" value="${escapeHtml(profile.address || "")}" /></label><label>Grad<input name="city" value="${escapeHtml(profile.city || "")}" /></label><label>Postanski broj<input name="postalCode" value="${escapeHtml(profile.postalCode || "")}" /></label><label>Sluzba paketomata<select name="parcelService"><option value="">Odaberi</option><option>GLS</option><option>Hrvatska posta</option><option>BOX NOW</option></select></label><label>Broj / oznaka paketomata<input name="parcelLocker" value="${escapeHtml(profile.parcelLocker || "")}" placeholder="Provjeri online pa upisi oznaku" /></label><button class="btn">Spremi podatke</button></form><div class="panel"><h3>Moje narudzbe</h3>${(account?.orders || []).map(order => `<div class="order-row"><strong>${order.id}</strong><span>${order.status} · ${euro(order.total)}</span><small>${new Date(order.createdAt).toLocaleDateString("hr-HR")}</small></div>`).join("") || "<p>Jos nemas narudzbi.</p>"}</div></div>`;
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
  app.innerHTML = `<section class="section alt shop-admin-page"><div class="section-head"><h2>Webshop upravljanje</h2><p>Jednostavno uređivanje bez koda.</p></div><div class="admin-grid"><div class="panel admin-wide"><h3>1. Upload slike</h3><form class="admin-form" data-form="shop-upload"><label>JPG ili PNG<input required type="file" name="image" accept="image/png,image/jpeg" /></label><button class="btn">Upload slike</button><label>Dobiveni URL slike<input id="shopUploadResult" readonly placeholder="/uploads/..." /></label></form></div><div class="panel admin-wide"><h3>2. Dodaj novi artikl</h3>${productForm({ active: true })}</div><div class="admin-wide product-admin-list"><h3>Postojeci artikli</h3>${shop.products.map(productForm).join("")}</div><div class="panel admin-wide"><h3>Kuponi</h3><div class="coupon-grid">${shop.coupons.map(coupon => `<form class="coupon-card" data-form="shop-coupon"><input type="hidden" name="id" value="${coupon.id}" /><label>Kod<input required name="code" value="${escapeHtml(coupon.code)}" /></label><label>Popust %<input required type="number" min="1" max="100" name="percent" value="${coupon.percent}" /></label><label>Maksimalno koristenja<input required type="number" min="1" name="maxUses" value="${coupon.maxUses}" /></label><span>Iskoristeno: ${coupon.usedCount || 0}</span><label class="check-label"><input type="checkbox" name="firstOrderOnly" ${coupon.firstOrderOnly ? "checked" : ""} /> Samo prva kupnja</label><label class="check-label"><input type="checkbox" name="active" ${coupon.active !== false ? "checked" : ""} /> Aktivan</label><button class="btn">Spremi kupon</button></form>`).join("")}<form class="coupon-card new" data-form="shop-coupon"><h4>Novi kupon</h4><label>Kod<input required name="code" /></label><label>Popust %<input required type="number" min="1" max="100" name="percent" /></label><label>Broj koristenja<input required type="number" min="1" name="maxUses" value="1" /></label><label class="check-label"><input type="checkbox" name="firstOrderOnly" /> Samo prva kupnja</label><label class="check-label"><input type="checkbox" name="active" checked /> Aktivan</label><button class="btn">Dodaj kupon</button></form></div></div><div class="panel admin-wide"><h3>Narudzbe i dostava</h3><div class="admin-list">${shop.orders.map(order => `<form class="order-manage" data-form="shop-order"><input type="hidden" name="id" value="${order.id}" /><div><strong>${order.id} · ${escapeHtml(order.profile.firstName || "")} ${escapeHtml(order.profile.lastName || "")}</strong><small>${escapeHtml(order.customerEmail)} · ${escapeHtml(order.profile.address || order.profile.parcelLocker || "")} · ${escapeHtml(order.profile.parcelService || "")}</small><small>${order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")} · ${euro(order.total)}</small></div><select name="status">${["Nova", "Potvrdena", "U pripremi", "Poslana", "Preuzeta", "Otkazana"].map(status => `<option${status === order.status ? " selected" : ""}>${status}</option>`).join("")}</select><button class="btn secondary">Spremi</button></form>`).join("") || "Nema narudzbi."}</div></div></div></section>`;
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
          <p>info@cuneri.hr</p>
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
  if (!attendees.length) return `<p class="admin-help">Još nema prijavljenih dolazaka.</p>`;
  return attendees.map(item => `<div class="attendee-row"><strong>${escapeHtml(item.name || "Gost")}</strong><span>${escapeHtml(item.car || "Auto")}</span></div>`).join("");
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
  const count = (event.attendees || []).length;
  const member = state.user ? state.data.members.find(item => item.userId === state.user.id) : null;
  const cars = member?.cars || [];
  const isAttending = (event.attendees || []).some(item => item.mine || item.userId === state.user?.id);
  return `<div class="event-detail-backdrop" data-close-event></div><article class="event-card event-card-detail" id="${event.id}">
    <button class="map-close event-close" data-close-event aria-label="Zatvori">&times;</button>
    <img src="${event.image || "/assets/hero-night.svg"}" alt="${escapeHtml(event.title)}" />
    <h3>${escapeHtml(event.title)}</h3>
    <div class="event-date">${escapeHtml(event.date)} &middot; ${escapeHtml(event.time || "")} &middot; ${escapeHtml(event.city || "")}</div>
    ${event.location || event.address ? `<p class="event-location">${escapeHtml(event.location || event.address)}</p>` : ""}
    <p>${escapeHtml(event.description || "")}</p><div class="event-count"><strong>${count}</strong><span> ljudi dolazi</span></div>
    <div class="event-actions">${state.user ? loggedInAttend(event, cars, isAttending) : `<button class="btn" data-attend="${event.id}">DOLAZIM</button>`}<button class="btn secondary" data-toggle-attendees="${event.id}">Popis dolazaka (${count})</button></div>
    <form class="guest-form" data-form="guest-attend" data-event-id="${event.id}" hidden>
      <label>Ime<input required name="firstName" /></label><label>Prezime<input required name="lastName" /></label>
      <label>Instagram<input name="instagram" /></label><label>Auto (marka / model / boja)<input required name="car" placeholder="VW Golf, crni" /></label>
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
  const isGarage = mode === "garage";
  app.innerHTML = `<section class="login-shell access-login"><div class="access-login-grid"><div class="login-box"><span class="kicker">${isGarage ? "CLUB GARAGE" : "CUNERI STORE"}</span><h1>${isGarage ? "Prijava clanova" : "Webshop login"}</h1><p>${isGarage ? "Pristup imaju samo email adrese koje je odobrio administrator kluba." : "Prijavi se za spremljene adrese i pregled narudzbi. Kupnja kao gost i dalje je moguca."}</p><form class="admin-form" data-form="login"><input type="hidden" name="loginMode" value="${mode}" /><label>Email / username<input required name="username" /></label><label>Lozinka<input required type="password" name="password" /></label><button class="btn">Prijava</button></form><a class="text-link" href="${isGarage ? "/webshop-login" : "/login-clanovi"}" data-link>${isGarage ? "Idi na webshop login" : "Idi na login za clanove"}</a></div>${isGarage ? "" : `<div class="login-side"><form class="form-box" data-form="shop-reset"><h3>Zaboravljena lozinka</h3><label>Email<input required type="email" name="email" /></label><button class="btn secondary">Posalji reset email</button></form><form class="form-box" data-form="shop-register"><h3>Postani webshop korisnik</h3><label>Ime<input required name="firstName" /></label><label>Prezime<input required name="lastName" /></label><label>Email<input required type="email" name="email" /></label><label>Lozinka<input required minlength="8" type="password" name="password" /></label><label>Ponovi lozinku<input required minlength="8" type="password" name="passwordConfirm" /></label><button class="btn">Registracija</button></form></div>`}</div></section>`;
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

async function submitForm(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  const type = form.dataset.form;
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
    const profile = { firstName: data.firstName, lastName: data.lastName, phone: data.phone, deliveryType: data.deliveryType, address: data.address, city: data.city, postalCode: data.postalCode, parcelService: data.parcelService, parcelLocker: data.parcelLocker };
    const result = await api("/api/shop/order", { method: "POST", body: { items: state.cart, email: data.email, profile, couponCode: data.couponCode } });
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
    navigate(data.loginMode === "shop" || state.user.role === "customer" ? "/webshop" : "/admin");
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
  else if (path === "/login" || path === "/webshop-login") accessLoginPage("shop");
  else if (path === "/login-clanovi") accessLoginPage("garage");
  else if (path === "/terms" || path === "/therms") termsPageCurrent();
  else if (path === "/admin") adminPage().catch(error => toast(error.message));
  else errorPage(404, "Ova cesta ne vodi na Cuneri susret.");
  syncLang();
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
  if (event.target.closest("[data-error-close]")) document.querySelector(".error-overlay")?.remove();
  if (event.target.closest("[data-open-event-form]")) document.querySelector("#publicEventModal")?.removeAttribute("hidden");
  if (event.target.closest("[data-close-event-form]")) document.querySelector("#publicEventModal")?.setAttribute("hidden", "");
  if (event.target.closest("[data-reward-close]")) document.querySelector(".discount-reward")?.remove();
  if (event.target.closest("[data-copy-coupon]")) {
    await navigator.clipboard?.writeText("2CV10").catch(() => {});
    const label = document.querySelector("[data-copy-coupon] em");
    if (label) label.textContent = "Kod je kopiran";
  }
  if (event.target.closest("[data-cart-open]")) document.querySelector("#cartDrawer")?.removeAttribute("hidden");
  if (event.target.closest("[data-cart-close]")) document.querySelector("#cartDrawer")?.setAttribute("hidden", "");
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
  const attend = event.target.closest("[data-attend]");
  if (attend) {
    const eventId = attend.dataset.attend;
    if (state.user) {
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
    render();
    setTimeout(() => $("#loader").classList.add("is-hidden"), 850);
  })
  .catch(error => {
    app.innerHTML = `<section class="login-shell"><div class="login-box"><h1>Greška</h1><p>${error.message}</p></div></section>`;
    $("#loader").classList.add("is-hidden");
  });
