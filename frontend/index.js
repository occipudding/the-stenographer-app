// VARIABLES
const main = document.querySelector("#main");
const sidebar = document.querySelector("#sidebar");
const usernameContainer = document.querySelector("#username-container");
const topicsList = document.querySelector("#topics-list");
const notesContainer = document.querySelector("#notes-container");

// FETCHES
fetch('http://localhost:3000/users').then(resp => resp.json()).then(users => {
  usernameContainer.innerText = users[Math.floor(Math.random() * users.length)].name;
});

fetch('http://localhost:3000/topics').then(resp => resp.json()).then(addTopicsToSidebar);

// EVENT LISTENERS
sidebar.addEventListener('mouseover', e => {
  e.target.style.width = "250px";
  main.style.marginLeft = "250px";
});

sidebar.addEventListener('mouseleave', e => {
  e.target.style.width = "0.5%";
  main.style.marginLeft = "0";
});

sidebar.addEventListener('click', addNotesToDOM);

// FUNCTIONS
function addTopicsToSidebar(topics) {
  topicsList.innerHTML = '';
  topics.forEach(topic => {
    let tagsString = 'Tags: ';
    topic.tags.forEach(tag => {
      if(tag == topic.tags[topic.tags.length - 1]) {
        tagsString += `${tag}`;
      } else {
        tagsString += `${tag}, `;
      }
    });
    topicsList.innerHTML += `
      <li id="topic-${topic.id}" class="topic-item sidebar-text" title="${tagsString}">${topic.title}</li>
    `
  });
}

function addNotesToDOM(e) {
  const topicNotes = [];
  if(e.target.className.includes('topic-item')) {
    notesContainer.innerHTML = '';
    fetch(`http://localhost:3000/notes`).then(resp => resp.json()).then(notes => {
      const filteredNotes = notes.filter(note => note.topic_id == +e.target.id.split('-')[1]);
      filteredNotes.forEach(note => {
        notesContainer.innerHTML += `
          <li>${note.content}</li>
        `
      })
    });
  }
}
