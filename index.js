import { keys, digits, controls } from './src/data.js';

const wrapper = document.createElement('div');
wrapper.className = 'wrapper';
document.body.append(wrapper);

const input = document.createElement('textarea');
wrapper.append(input);

const keyboard = document.createElement('div');
keyboard.className = 'keyboard-container';
wrapper.append(keyboard);

let language = localStorage.getItem('lang') || 'eng';
let isShift = false;
let isCapsActive = false;

function createKeys(keysArr, keyClassName, keyValue) {
  for (let i = 0; i < keysArr.length; i += 1) {
    const element = document.createElement('div');
    element.setAttribute('class', 'key');
    element.classList.add(keyClassName);
    element.setAttribute('id', keysArr[i].code);
    element.innerText = keyClassName === 'letter' ? keysArr[i][keyValue][0] : keysArr[i][keyValue];
    keyboard.appendChild(element);
  }
}
createKeys(digits, 'digit', 'digit');
createKeys(keys, 'letter', language);
createKeys(controls, 'control', 'value');
document.getElementById('lang').innerText = language.toUpperCase();

function toggleCaps() {
  document.querySelectorAll('.key.letter').forEach((e) => {
    e.textContent = isCapsActive ? e.textContent.toLowerCase() : e.textContent.toUpperCase();
  });
  document.getElementById('CapsLock').classList.toggle('ctrl-active');
  isCapsActive = isCapsActive !== true;
}

function toggleLang() {
  if (language === 'eng') {
    document.querySelectorAll('.key.letter').forEach((e, i) => {
      e.innerText = isCapsActive ? keys[i].ru[0].toUpperCase() : keys[i].ru[0];
    });
    language = 'ru';
    localStorage.setItem('lang', 'ru');
    document.getElementById('lang').innerText = 'RU';
  } else {
    document.querySelectorAll('.key.letter').forEach((e, i) => {
      e.innerText = isCapsActive ? keys[i].eng[0].toUpperCase() : keys[i].eng[0];
    });
    language = 'eng';
    localStorage.setItem('lang', 'eng');
    document.getElementById('lang').innerText = 'ENG';
  }
}

function toggleShift() {
  document.querySelectorAll('.key.digit').forEach((e, i) => {
    e.innerText = isShift ? digits[i].digit : digits[i].shift;
  });
  document.querySelectorAll('.key.letter').forEach((e, i) => {
    if (isShift) {
      if (keys[i][language].length === 2) {
        e.innerText = keys[i][language][0];
      } else {
        e.innerText = e.textContent.toLowerCase();
      }
    } else if (keys[i][language].length === 2) {
      e.innerText = keys[i][language][1];
    } else {
      e.innerText = e.textContent.toUpperCase();
    }
  });
  isShift = isShift !== true;
}

function controlKeys(key) {
  if (key === 'CapsLock') toggleCaps();
  if (key === 'Tab') input.textContent += '    ';
  if (key === 'Backspace') input.textContent = input.textContent.slice(0, -1);
  if (key === 'Enter') input.textContent += '\n';
  if (key === 'ArrowLeft') input.textContent += '←';
  if (key === 'ArrowRight') input.textContent += '→';
  if (key === 'ArrowUp') input.textContent += '↑';
  if (key === 'ArrowDown') input.textContent += '↓';
  if (key === 'lang') toggleLang();
  if (key.includes('Shift')) toggleShift();
}

document.addEventListener('keydown', (event) => {
  event.preventDefault();
  const pressedKey = document.getElementById(event.code);
  if (pressedKey) {
    pressedKey.classList.add('key-active');
    if (pressedKey.className.includes('letter') || pressedKey.className.includes('digit')) {
      input.textContent += pressedKey.textContent;
    } else if (!event.shiftKey) {
      controlKeys(event.code);
    }
    if (!event.repeat && event.shiftKey) toggleShift();
    if (event.code === 'AltLeft' && (event.ctrlKey || event.metaKey)) {
      toggleLang();
    }
  }
});

document.addEventListener('keyup', (event) => {
  const key = document.getElementById(event.code);
  if (key) key.classList.remove('key-active');
  if (event.code.includes('Shift')) toggleShift();
});

keyboard.addEventListener('mousedown', (event) => {
  if (event.target.className.includes('key ')) {
    event.target.classList.add('key-active');
  }
});

keyboard.addEventListener('mouseup', (event) => {
  event.target.classList.remove('key-active');
});

keyboard.addEventListener('mouseout', (event) => {
  event.target.classList.remove('key-active');
});

keyboard.addEventListener('click', (event) => {
  if (event.target.className === 'key letter' || event.target.className === 'key digit') {
    input.textContent += event.target.textContent;
    if (isShift) toggleShift();
  } else {
    controlKeys(event.target.id);
  }
});

const footer = document.createElement('footer');
footer.innerHTML = '<p>Change language - Ctrl + Alt Left or ENG/RU<br >OS Windows<br >&copy; Anna Karp</p>';
wrapper.append(footer);
