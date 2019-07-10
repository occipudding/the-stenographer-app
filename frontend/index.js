// ------------------ VARIABLES -----------------------------
const main = document.querySelector("#main");
const sidebar = document.querySelector("#sidebar");
const usernameContainer = document.querySelector("#username-container");
const topicsList = document.querySelector("#topics-list");
const notesContainer = document.querySelector("#notes-container");

// modal variables
const newTopicAnchor = document.querySelector('#new-topic')
const modal = document.querySelector('#modal')
const closeBtn = document.querySelector(".close-btn")
const modalForm = document.querySelector("#modal-form")

// ------------------- FETCHES -------------------------------
fetch('http://localhost:3000/users').then(resp => resp.json()).then(users => {
  usernameContainer.innerText = users[Math.floor(Math.random() * users.length)].name;
});

fetch('http://localhost:3000/topics').then(resp => resp.json()).then(addTopicsToSidebar);

function postTopic(e) {
  e.preventDefault()
  const titleInput = document.querySelector("#title-input").value
  const tagsInput = document.querySelector("#tags-input").value

  // debugger

  fetch('http://localhost:3000/topics', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      title: titleInput,
      tags: tagsInput,
      user_id: 319
    })
  })
  .then(res => res.json())
  .then(newTopicToSideBar)

}

// ------------------ EVENT LISTENERS -------------------------
sidebar.addEventListener('mouseover', e => {
  e.target.style.width = "250px";
  main.style.marginLeft = "250px";
});

sidebar.addEventListener('mouseleave', e => {
  e.target.style.width = "0.5%";
  main.style.marginLeft = "0";
});

sidebar.addEventListener('click', addNotesToDOM);

// modal events
newTopicAnchor.addEventListener('click', e => {
  modal.style.display = "block"
})

closeBtn.addEventListener('click', e => {
  modal.style.display = "none"
})

window.addEventListener('click', e => {
  if (e.target == modal){
    modal.style.display = "none"
  }
})

// modal form events

modalForm.addEventListener('submit', postTopic)

// ----------------------- FUNCTIONS -----------------------------
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

function newTopicToSideBar(topic) {
  const tagsToString = topic.tags.join(', ')
  topicsList.innerHTML += `
  <li id="topic-${topic.id}" class="topic-item sidebar-text" title="${tagsToString}">${topic.title}</li>
  `
  modalForm.reset()
  modal.style.display = "none"
  console.log('done')

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
