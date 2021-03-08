function getRandomColor() {
  return (
    "rgb(" +
    Math.floor(Math.random() * 255) +
    "," +
    Math.floor(Math.random() * 255) +
    "," +
    Math.floor(Math.random() * 255) +
    ")"
  );
}

var cards = {};

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

const state = {
  lastSelected: null,
  attCount: 0,
  matchCount: 0,
  totalCards: 4,
};

function shuffle() {
  var container = document.getElementById("card-box");
  var elementsArray = Array.prototype.slice.call(
    container.getElementsByClassName("card")
  );
  elementsArray.forEach(function (element) {
    container.removeChild(element);
  });
  shuffleArray(elementsArray);
  elementsArray.forEach(function (element) {
    container.appendChild(element);
  });
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function animateMatch(e1, e2) {
  e1.style.opacity = `0.2`;
  e2.style.opacity = `0.2`;
}

function flipCard(target) {
  target.style.backgroundColor = target.dataset.colorID;
  if (state.lastSelected == null) {
    state.lastSelected = target;
    return;
  } else {
    state.attCount++;
    if (target.dataset.colorID == state.lastSelected.dataset.colorID) {
      state.matchCount++;

      state.lastSelected.style.opacity = `0.2`;
      target.style.opacity = `0.2`;

      target.removeEventListener(`click`, () => {});
      state.lastSelected.removeEventListener(`click`, () => {});
      animateMatch(target, state.lastSelected);

      state.lastSelected = null;
    } else {
      setTimeout(() => {
        state.lastSelected.style.backgroundColor = `seagreen`;
        target.style.backgroundColor = `seagreen`;
        state.lastSelected = null;
      }, 1000);
    }
  }
  AfterFlipTest();
}

function AfterFlipTest() {
  if (state.matchCount === Object.size(cards)) {
    clearInterval(swInt);
    document.querySelector(`#result`).textContent = `Your time is: ${
      document.querySelector(`#timer`).textContent
    }`;
    document.querySelector(`#restart`).style.visibility = `visible`;
  }
}

function ResetTimer() {
  let sTime;
  let passedTime = 0;
  document.querySelector("#timer").innerText = "00:00:00";
  startTime = Date.now();
  setTimeout(() => {
    clearInterval(swInt);
  }, 60 * 60 * 1000);
  swInt = setInterval(() => {
    let elapsed = new Date(Date.now() - startTime + passedTime);
    let sec = ("0" + elapsed.getSeconds()).slice(-2);
    let minutes = ("0" + elapsed.getMinutes()).slice(-2);
    let milisec = ("0" + parseInt(elapsed.getMilliseconds() / 10)).slice(-2);
    const time = `${minutes}:${sec}:${milisec}`;
    document.querySelector("#timer").innerText = time;
  }, 10);
}

function GenerateSingleCard(value) {
  const container = document.getElementById("card-box");
  container.innerHtml = "";
  const c = document.createElement(`div`);

  c.classList.add(`card`);
  c.dataset.colorID = value;
  document.querySelector(`#card-box`).appendChild(c);

  c.addEventListener(`click`, (e) => {
    flipCard(e.target);
  });
  return c;
}

function generateCards(num) {
  let i = 1;
  while (i <= num / 2) {
    const color = getRandomColor();
    if (!cards[color]) {
      cards[color] = 1;
      i++;
      document
        .querySelector(`#card-box`)
        .appendChild(GenerateSingleCard(color));
      document
        .querySelector(`#card-box`)
        .appendChild(GenerateSingleCard(color));
    }
  }
}

function SetRestartButtons() {
  document.querySelector(`#start`).addEventListener(`click`, () => {
    startGame(state.totalCards);
  });

  document.querySelector(`#restartbutton`).addEventListener(`click`, () => {
    document.querySelector(`#restart`).style.visibility = `hidden`;
    state.totalCards = document.querySelector(`#options`).value;
    startGame(state.totalCards);
  });
}

function startGame(numOfCards) {
  cards = {};
  //   for (const prop in cards) {
  //     delete prop;
  //   }

  document.querySelector(`#card-box`).innerHTML = ``;
  generateCards(numOfCards);
  state.lastSelected = null;
  state.attCount = 0;
  state.matchCount = 0;
  shuffle();
  ResetTimer();
  SetRestartButtons();
}

function Welcome() {
  document.querySelector(`#start`).addEventListener(`click`, () => {
    document.querySelector(`#welcome`).style.visibility = `hidden`;
    startGame(state.totalCards);
  });
}

Welcome();
