let users = [];
let requestedUser = null;
let contentFiltered = null;
let contentStatistics = null;
let filteredUsers = [];

let resultsSpan = null;
let resultParagraph = null;
let processedUsers = [];
let NameInput = null;
let button = null;

window.addEventListener('load', () => {
  contentFiltered = document.querySelector('#contentFilteredInner');
  contentStatistics = document.querySelector('#contentStatistics');
  resultsSpan = document.querySelector('#totalResults');
  resultParagraph = document.querySelector('#results');
  NameInput = document.querySelector('#requestedName');
  button = document.querySelector('#searchButton');

  doFetch();
  NameInput.focus();
});

async function doFetch() {
  let request = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  let json = await request.json();
  users = Array.from(json.results);

  processUserInformation(users);

  NameInput.addEventListener('keyup', (event) => handlePressedEnter(event));
  button.addEventListener('click', handleClick);
  render();
}

function render() {
  renderFiltered();
  renderStatistics();
}

function renderFiltered() {
  let filteredHtml = `<div>`;

  resultsSpan.textContent = filteredUsers.length;

  filteredUsers.forEach((user) => {
    const { name, age, picture } = user;
    let userDiv = `
    <div class="person">
    <img src="${picture}"/><span> ${name}, ${age} anos </span>
    </div> 
    `;
    filteredHtml += userDiv;
  });
  filteredHtml += '</div>';

  contentFiltered.innerHTML = filteredHtml;
}

function renderStatistics() {
  let maleNumber = 0;
  let femaleNumber = 0;
  let totalAge = 0;
  let averageAge = 0;
  filteredUsers.forEach((user) => {
    if (user.gender === 'male') {
      maleNumber = maleNumber + 1;
    }
    if (user.gender === 'female') {
      femaleNumber = femaleNumber + 1;
    }
    totalAge = totalAge + parseInt(user.age);
    averageAge = totalAge / filteredUsers.length;
  });
  averageAge = averageAge.toFixed(2);
  let statisticsHTML = `
  <p> Homens: ${maleNumber}</p>
  <p> Mulheres: ${femaleNumber}</p>
  <p> Soma das idades: ${totalAge}</p>
  <p> Média das Idades: ${averageAge} </p>

  `;
  contentStatistics.innerHTML = statisticsHTML;
}

function processUserInformation(allUsers) {
  allUsers.forEach((user) => {
    const {
      name: { first: firstName },
      name: { last: lastName },
      dob: { age },
      gender,
      picture: { large: picture },
    } = user;

    const object = {
      name: `${firstName} ${lastName}`,
      age: `${age}`,
      gender: `${gender}`,
      picture: `${picture}`,
    };

    processedUsers = [...processedUsers, object];
  });
}

function findUser(userName) {
  userName = userName.toLowerCase();

  processedUsers.forEach((user) => {
    let name = user.name.toLowerCase();

    if (name.indexOf(userName, 0) !== -1) {
      showUser(user);
    }
  });
}

function showUser(user) {
  filteredUsers = [...filteredUsers, user];
  filteredUsers.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}
function handlePressedEnter(event) {
  filteredUsers = [];
  if (event.key === 'Enter') {
    if (NameInput.value.length >= 1) {
      findUser(event.target.value);
      console.log(NameInput);
    }
    render();
  }
}

function handleClick() {
  filteredUsers = [];
  if (NameInput.value !== '') {
    filteredUsers = [];
    findUser(NameInput.value);
  }
  render();
}
