let selectedMinutes = 20;
let duration = selectedMinutes * 60 * 1000;
const circumference = 2 * Math.PI * 146;
const timer = document.getElementById('timer');
const progress = document.getElementById('progress');
const toggle = document.getElementById('toggle');
const label = document.getElementById('toggle-label');
const icon = document.getElementById('play-icon');
const status = document.getElementById('status');
const announcement = document.getElementById('announcement');
const title = document.getElementById('title');
const description = document.getElementById('description');
const initialTitle = title.textContent;
const initialDescription = description.textContent;
let remaining = duration;
let deadline = 0;
let running = false;
let interval;
const decrease = document.getElementById('decrease');
const increase = document.getElementById('increase');

function updateSettings() {
  const minutes = selectedMinutes;
  document.getElementById('duration-label').textContent = `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  decrease.disabled = running || minutes <= 1;
  increase.disabled = running || minutes >= 180;
  document.getElementById('settings-hint').textContent = running ? 'Pause para ajustar o tempo' : 'Ajustar o tempo reinicia o contador';
}

progress.style.strokeDasharray = circumference;

function render() {
  const seconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(seconds / 60);
  const time = `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  timer.textContent = time;
  timer.setAttribute('aria-label', `${minutes} minutos e ${seconds % 60} segundos restantes`);
  progress.style.strokeDashoffset = circumference * (1 - remaining / duration);
  document.title = `${time} - Intervalo`;
}

function finish() {
  running = false;
  clearInterval(interval);
  remaining = 0;
  document.body.classList.add('finished');
  title.textContent = 'Vamos voltar para a oficina!';
  description.textContent = 'O intervalo acabou. Vamos continuar nossa oficina de React.';
  status.textContent = 'INTERVALO CONCLUÍDO';
  announcement.textContent = 'Prepare seu editor: é hora de voltar a programar!';
  label.textContent = 'Iniciar novo intervalo';
  icon.textContent = '▶';
  updateSettings();
  render();
}

function tick() {
  if (!running) return;
  remaining = Math.max(0, deadline - Date.now());
  if (remaining === 0) finish();
  else render();
}

function reset() {
  clearInterval(interval);
  running = false;
  duration = selectedMinutes * 60 * 1000;
  remaining = duration;
  document.body.classList.remove('finished');
  title.textContent = initialTitle;
  description.textContent = initialDescription;
  status.textContent = 'PRONTO PARA COMEÇAR';
  announcement.textContent = '';
  label.textContent = 'Iniciar intervalo';
  icon.textContent = '▶';
  updateSettings();
  render();
}

toggle.addEventListener('click', () => {
  if (running) {
    tick();
    if (!running) return;
    running = false;
    clearInterval(interval);
    label.textContent = 'Continuar intervalo';
    icon.textContent = '▶';
    status.textContent = 'CONTADOR PAUSADO';
    updateSettings();
    return;
  }
  if (remaining === 0) reset();
  deadline = Date.now() + remaining;
  running = true;
  label.textContent = 'Pausar intervalo';
  icon.textContent = 'Ⅱ';
  status.textContent = 'INTERVALO EM ANDAMENTO';
  updateSettings();
  interval = setInterval(tick, 200);
  tick();
});

document.getElementById('reset').addEventListener('click', reset);
document.addEventListener('visibilitychange', tick);
function adjustTime(change) {
  if (running) return;
  selectedMinutes = Math.min(180, Math.max(1, selectedMinutes + change));
  reset();
}
decrease.addEventListener('click', () => adjustTime(-1));
increase.addEventListener('click', () => adjustTime(1));
reset();
