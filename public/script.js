const $ = s => document.querySelector(s);
const grads = ['#2563eb,#7c3aed','#7c3aed,#f97316','#0d9488,#2563eb','#f97316,#7c3aed','#2563eb,#0d9488','#7c3aed,#0d9488'];
const icons = { annotation: '🎯', web: '🌐', ai: '🤖' };
let projects = [];

fetch('/api/services').then(r => r.json()).then(list => {
  $('#serviceGrid').innerHTML = list.map(s => `<div class="card hover reveal"><div class="ico">${s.icon}</div><h3>${s.title}</h3><p>${s.text}</p></div>`).join('');
  observe();
});
fetch('/api/projects').then(r => r.json()).then(p => { projects = p; render('all'); });

function render(f) {
  const list = projects.filter(p => f === 'all' || p.cat === f);
  $('#projectGrid').innerHTML = list.map((p, i) => `<div class="card hover reveal">
    <div class="thumb" style="background:linear-gradient(135deg,${grads[i % 6].split(',')[0]},${grads[i % 6].split(',')[1]})">${icons[p.cat]}</div>
    <h3>${p.title}</h3><p>${p.text}</p><span class="tag">${p.result}</span></div>`).join('');
  observe();
}
$('#filters').addEventListener('click', e => {
  if (!e.target.dataset.f) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active'); render(e.target.dataset.f);
});

function observe() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } }), { threshold: .15 });
  document.querySelectorAll('.reveal:not(.show)').forEach(el => io.observe(el));
}
document.querySelectorAll('.step,.stat').forEach(el => el.classList.add('reveal')); observe();

const counters = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; counters.unobserve(e.target);
  const n = +e.target.dataset.count; let c = 0;
  const t = setInterval(() => { c += Math.max(1, Math.ceil(n / 50)); if (c >= n) { c = n; clearInterval(t); } e.target.textContent = c; }, 30);
}));
document.querySelectorAll('[data-count]').forEach(el => counters.observe(el));

addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', scrollY > 20));
$('#burger').onclick = () => $('#menu').classList.toggle('open');
$('#menu').onclick = () => $('#menu').classList.remove('open');
$('#yr').textContent = new Date().getFullYear();

$('#form').addEventListener('submit', async e => {
  e.preventDefault();
  const st = $('#status'); st.className = ''; st.textContent = 'Sending...';
  try {
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(e.target))) });
    const d = await res.json();
    if (!d.ok) throw new Error(d.error);
    st.className = 'ok'; st.textContent = 'Thank you! We will reply within 24 hours.'; e.target.reset();
  } catch (err) { st.className = 'err'; st.textContent = err.message || 'Something went wrong.'; }
});
