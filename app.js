/* ============ Employee Self-Service Portal — shared script (DEMO / mock data) ============
   NOTE: Everything here is front-end only. Real authorization MUST be done in the backend.
   Later, replace the mock functions with fetch() calls to your /api/... endpoints.
   ================================================================================== */

const ICONS = {
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  cal:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/>',
  doc:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  down:'<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check:'<path d="M5 12l5 5 9-10"/>',
  wallet:'<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><circle cx="16.5" cy="14.5" r="1"/>',
  inbox:'<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>'
};
const icon = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`;

/* ---------- Helpers ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d){ try{ const v = sessionStorage.getItem(k); return v ? JSON.parse(v) : d; }catch{ return d; } },
  set(k, v){ try{ sessionStorage.setItem(k, JSON.stringify(v)); }catch{} }
};
const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
const money = n => '₹ ' + Number(n).toLocaleString('en-IN');

function toast(msg, type='success'){
  let box = $('#toasts'); if(!box){ box = document.createElement('div'); box.id='toasts'; box.setAttribute('aria-live','polite'); document.body.appendChild(box); }
  const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg; box.appendChild(t);
  setTimeout(() => t.remove(), 3800);
}

/* =====================================================================
   DEMO DATA — 5 team members (fictional). Only these emails can log in.
   Shared demo password: DemoPass@2026!
   ===================================================================== */
const DEMO_PASSWORD = 'DemoPass@2026!';

const DEMO_USERS = {
  'santhiya@gmail.com': {
    name:'Santhiya K', role:'Employee', id:'EMP-3001', dept:'Engineering', title:'Software Engineer',
    manager:'Manoranjani', joined:'2023-03-06', email:'santhiya@gmail.com', basic:62000, taxRate:0.10,
    balance:{ 'Annual Leave':6, 'Sick Leave':2, 'Casual Leave':1 },
    address:{ line1:'12, Lakeview Residency', line2:'Anna Nagar', city:'Chennai', state:'Tamil Nadu', postal:'600040', country:'India' },
    leaves:[
      { id:'LV-S3001A', type:'Annual Leave', start:'2026-08-10', end:'2026-08-14', days:5, status:'Approved', reason:'Family trip' },
      { id:'LV-S3001B', type:'Sick Leave',   start:'2026-09-03', end:'2026-09-04', days:2, status:'Approved', reason:'Fever' },
      { id:'LV-S3001C', type:'Casual Leave', start:'2026-11-20', end:'2026-11-20', days:1, status:'Pending',  reason:'Personal work' },
      { id:'LV-S3001D', type:'Annual Leave', start:'2026-05-18', end:'2026-05-19', days:2, status:'Rejected', reason:'Short break' }
    ]
  },
  'swetha@gmail.com': {
    name:'Swetha', role:'Employee', id:'EMP-3002', dept:'Design', title:'UI/UX Designer',
    manager:'Manoranjani', joined:'2022-11-14', email:'swetha@gmail.com', basic:55000, taxRate:0.08,
    balance:{ 'Annual Leave':10, 'Sick Leave':1, 'Casual Leave':3 },
    address:{ line1:'45, Gandhi Nagar', line2:'RS Puram', city:'Coimbatore', state:'Tamil Nadu', postal:'641002', country:'India' },
    leaves:[
      { id:'LV-S3002A', type:'Annual Leave', start:'2026-06-15', end:'2026-06-26', days:10, status:'Approved', reason:'Wedding in family' },
      { id:'LV-S3002B', type:'Casual Leave', start:'2026-07-08', end:'2026-07-10', days:3,  status:'Approved', reason:'Personal work' },
      { id:'LV-S3002C', type:'Sick Leave',   start:'2026-10-05', end:'2026-10-05', days:1,  status:'Approved', reason:'Migraine' },
      { id:'LV-S3002D', type:'Annual Leave', start:'2026-12-28', end:'2026-12-31', days:4,  status:'Pending',  reason:'Year-end holidays' }
    ]
  },
  'manoranjani@gmail.com': {
    name:'Manoranjani', role:'Manager', id:'EMP-3003', dept:'Engineering', title:'Engineering Manager',
    manager:'Rohan Mehta', joined:'2019-07-01', email:'manoranjani@gmail.com', basic:98000, taxRate:0.18,
    balance:{ 'Annual Leave':9, 'Sick Leave':0, 'Casual Leave':2 },
    address:{ line1:'7, Temple View Street', line2:'KK Nagar', city:'Madurai', state:'Tamil Nadu', postal:'625020', country:'India' },
    leaves:[
      { id:'LV-S3003A', type:'Annual Leave', start:'2026-04-20', end:'2026-05-01', days:9, status:'Approved', reason:'Vacation' },
      { id:'LV-S3003B', type:'Casual Leave', start:'2026-09-14', end:'2026-09-15', days:2, status:'Approved', reason:'Personal work' },
      { id:'LV-S3003C', type:'Annual Leave', start:'2027-01-12', end:'2027-01-14', days:3, status:'Pending',  reason:'Pongal holidays' }
    ]
  },
  'sahana@gmail.com': {
    name:'Sahana', role:'Employee', id:'EMP-3004', dept:'Quality Assurance', title:'QA Engineer',
    manager:'Manoranjani', joined:'2024-01-08', email:'sahana@gmail.com', basic:48000, taxRate:0.05,
    balance:{ 'Annual Leave':3, 'Sick Leave':4, 'Casual Leave':0 },
    address:{ line1:'88, Green Park Layout', line2:'Whitefield', city:'Bengaluru', state:'Karnataka', postal:'560066', country:'India' },
    leaves:[
      { id:'LV-S3004A', type:'Annual Leave', start:'2026-03-09', end:'2026-03-11', days:3, status:'Approved', reason:'Travel' },
      { id:'LV-S3004B', type:'Sick Leave',   start:'2026-08-24', end:'2026-08-27', days:4, status:'Approved', reason:'Viral fever' },
      { id:'LV-S3004C', type:'Casual Leave', start:'2026-10-02', end:'2026-10-02', days:1, status:'Cancelled', reason:'Plans changed' }
    ]
  },
  'vithiya@gmail.com': {
    name:'Vithiya', role:'Employee', id:'EMP-3005', dept:'Operations', title:'Business Analyst',
    manager:'Manoranjani', joined:'2021-09-20', email:'vithiya@gmail.com', basic:58000, taxRate:0.09,
    balance:{ 'Annual Leave':12, 'Sick Leave':2, 'Casual Leave':2 },
    address:{ line1:'23, Cauvery Colony', line2:'Srirangam', city:'Tiruchirappalli', state:'Tamil Nadu', postal:'620006', country:'India' },
    leaves:[
      { id:'LV-S3005A', type:'Annual Leave', start:'2026-05-04', end:'2026-05-15', days:10, status:'Approved', reason:'Higher studies exam' },
      { id:'LV-S3005B', type:'Annual Leave', start:'2026-11-23', end:'2026-11-24', days:2,  status:'Approved', reason:'Family function' },
      { id:'LV-S3005C', type:'Sick Leave',   start:'2026-07-21', end:'2026-07-22', days:2,  status:'Approved', reason:'Dental surgery' },
      { id:'LV-S3005D', type:'Casual Leave', start:'2026-12-10', end:'2026-12-11', days:2,  status:'Pending',  reason:'Personal work' }
    ]
  }
};

const LEAVE_TOTALS = { 'Annual Leave':24, 'Sick Leave':10, 'Casual Leave':6 };
/* LEAVE_BALANCE is filled for the logged-in user at the bottom of this file */
const LEAVE_BALANCE = [];

/* Any email can log in. The 5 team members above keep their own data;
   every other email gets a profile whose NAME comes from the email
   (e.g. ravi.kumar@gmail.com -> "Ravi Kumar") and whose other data is generated from the email. */
const _generated = {};
function profileFor(email){
  email = String(email || '').trim().toLowerCase();
  if(DEMO_USERS[email]) return DEMO_USERS[email];
  if(_generated[email]) return _generated[email];

  let h = 0; for(const c of email) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const words = email.split('@')[0].replace(/[0-9]+/g,' ').split(/[._\-+\s]+/).filter(Boolean);
  const name = (words.length ? words : ['User']).map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const jobs = [['Engineering','Software Engineer'],['Design','UI/UX Designer'],['Quality Assurance','QA Engineer'],['Operations','Business Analyst'],['Finance','Accounts Executive'],['Human Resources','HR Executive']];
  const cities = [['Chennai','Tamil Nadu','600001'],['Coimbatore','Tamil Nadu','641001'],['Madurai','Tamil Nadu','625001'],['Bengaluru','Karnataka','560001'],['Hyderabad','Telangana','500001'],['Pune','Maharashtra','411001']];
  const [dept, title] = jobs[h % jobs.length], [city, state, postal] = cities[(h >>> 3) % cities.length];
  const basic = 40000 + (h % 12) * 4000;
  const pad = n => String(n).padStart(2,'0');
  const y = 2020 + (h % 5);
  const tag = (h % 0xFFFFFF).toString(16).toUpperCase().padStart(6,'0');

  return _generated[email] = {
    name, role:'Employee', id:'EMP-' + (4000 + h % 1000), dept, title, manager:'Manoranjani',
    joined: `${y}-${pad(1 + h % 12)}-${pad(1 + h % 27)}`, email, basic, taxRate: 0.05 + (h % 8) / 100,
    balance:{ 'Annual Leave': 2 + h % 9, 'Sick Leave': h % 4, 'Casual Leave': h % 3 },
    address:{ line1: `${1 + h % 99}, Main Road`, line2:'Gandhi Nagar', city, state, postal, country:'India' },
    leaves:[
      { id:'LV-G' + tag.slice(0,5) + 'A', type:'Annual Leave', start:'2026-07-13', end:'2026-07-15', days:3, status:'Approved', reason:'Family function' },
      { id:'LV-G' + tag.slice(0,5) + 'B', type:'Sick Leave',   start:'2026-09-22', end:'2026-09-22', days:1, status:'Approved', reason:'Cold and fever' },
      { id:'LV-G' + tag.slice(0,5) + 'C', type:'Casual Leave', start:'2026-12-04', end:'2026-12-04', days:1, status:'Pending',  reason:'Personal work' }
    ]
  };
}

/* ---------- Session (front-end convenience only) ---------- */
const session = {
  get: () => store.get('user', null),
  login(email){
    const u = profileFor(email);
    const { leaves, address, balance, basic, taxRate, ...safe } = u;   // keep the session object small
    store.set('user', { ...safe, loginAt: Date.now() });
    return u;
  },
  logout(){ try{ sessionStorage.clear(); }catch{} location.href = 'index.html'; }
};
const currentData = () => { const s = session.get(); return s ? profileFor(s.email) : null; };

/* ---------- Per-user data ---------- */
function seedLeaves(){ const d = currentData(); return d ? d.leaves.map(l => ({...l})) : []; }
const getLeaves = () => { const s = store.get('leaves', null); if(s) return s; const seeded = seedLeaves(); store.set('leaves', seeded); return seeded; };
const saveLeaves = l => store.set('leaves', l);

function seedPayslips(){
  const d = currentData(); if(!d) return [];
  const m = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const out = [];
  for(let i=0;i<15;i++){
    const dt = new Date(2026, 9 - i, 1);
    const basic = d.basic, hra = Math.round(basic*0.40), allow = Math.round(basic*0.15);
    const pf = Math.round(basic*0.12), tax = Math.round((basic+hra+allow)*d.taxRate);
    out.push({
      id: 'PS-' + d.id.slice(-4) + '-' + (dt.getFullYear()*100 + dt.getMonth()+1),
      month: m[dt.getMonth()], year: dt.getFullYear(), basic, hra, allow, pf, tax,
      gross: basic+hra+allow, net: basic+hra+allow-pf-tax, status: i===0 ? 'Processing' : 'Paid'
    });
  }
  return out;
}

const getAddress = () => store.get('address', null) || (() => {
  const d = currentData(); const a = d ? d.address : {};
  return { res:{...a}, mail:{...a}, updated:'2026-08-21' };
})();

/* Manager-only: pending requests from direct reports (demo data derived from the other users) */
function seedTeamRequests(){
  const s = session.get(); if(!s || s.role !== 'Manager') return [];
  const out = [];
  Object.values(DEMO_USERS).forEach(u => {
    if(u.manager !== s.name) return;               // only people who report to this manager
    u.leaves.filter(l => l.status === 'Pending').forEach(l => out.push({ id:l.id, name:u.name, type:l.type, start:l.start, end:l.end, days:l.days, status:'Pending' }));
  });
  return out;
}

/* ---------- App shell (sidebar + topbar) ---------- */
const NAV = [
  { href:'dashboard.html', label:'Dashboard',  ic:'home', key:'dashboard' },
  { href:'profile.html',   label:'My Profile', ic:'user', key:'profile' },
  { href:'leave.html',     label:'Leave',      ic:'cal',  key:'leave' },
  { href:'payslip.html',   label:'Payslips',   ic:'doc',  key:'payslip' }
];
function initShell(active, title){
  const user = session.get();
  if(!user){ location.replace('index.html'); return null; }   // UX guard only — backend must enforce auth
  $('#sidebar').innerHTML = `
    <div class="brand"><span class="logo">${icon('shield')}</span><span>Employee Portal<small>Self-Service</small></span></div>
    <div class="nav-label">Menu</div>
    <nav class="nav" aria-label="Main">${NAV.map(n => `<a href="${n.href}" class="${n.key===active?'active':''}" ${n.key===active?'aria-current="page"':''}>${icon(n.ic)}${n.label}</a>`).join('')}</nav>
    <div class="side-foot"><b>${icon('lock')} Secure session</b>Your data is private and visible only to you.</div>`;
  const initials = user.name.split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase();
  $('#topbar').innerHTML = `
    <button class="menu-btn" id="menuBtn" aria-label="Open menu">${icon('menu')}</button>
    <h1>${esc(title)}</h1><span class="spacer"></span>
    <div class="user-chip"><span class="avatar">${esc(initials)}</span><div>${esc(user.name)}<br><small>${esc(user.role)}</small></div></div>
    <button class="btn btn-outline btn-sm" id="logoutBtn">${icon('logout')}Logout</button>`;
  $('#menuBtn').onclick = () => $('#sidebar').classList.toggle('open');
  $('#logoutBtn').onclick = () => session.logout();
  return user;
}

/* ---------- Validation helpers ---------- */
function setError(input, msg){
  const f = input.closest('.field'); if(!f) return;
  f.classList.toggle('invalid', !!msg);
  const e = $('.err', f); if(e) e.textContent = msg || '';
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
}
const clearErrors = form => $$('.field', form).forEach(f => { f.classList.remove('invalid'); $$('input,select,textarea', f).forEach(i => i.removeAttribute('aria-invalid')); });
function daysBetween(a, b){ return Math.round((new Date(b) - new Date(a)) / 86400000) + 1; }
function overlaps(s1, e1, s2, e2){ return s1 <= e2 && s2 <= e1; }

/* ---------- Modal ---------- */
function openModal(html){
  let bg = $('#modalBg');
  if(!bg){ bg = document.createElement('div'); bg.id = 'modalBg'; bg.className='modal-bg'; bg.setAttribute('role','dialog'); bg.setAttribute('aria-modal','true'); document.body.appendChild(bg);
    bg.addEventListener('click', e => { if(e.target === bg) closeModal(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); }); }
  bg.innerHTML = `<div class="modal">${html}</div>`; bg.classList.add('open');
  const f = $('button, input', bg); if(f) f.focus();
}
const closeModal = () => { const b = $('#modalBg'); if(b) b.classList.remove('open'); };

/* ---------- Fill leave balances for the logged-in user (runs on every page load) ---------- */
(function(){
  const d = currentData(); if(!d) return;
  Object.keys(LEAVE_TOTALS).forEach(type => LEAVE_BALANCE.push({ type, total: LEAVE_TOTALS[type], used: d.balance[type] ?? 0 }));
})();