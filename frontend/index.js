// VARIABLES
const main = document.querySelector("#main");
const sidebar = document.querySelector("#sidebar");
const usernameContainer = document.querySelector("#username-container");
const topicsList = document.querySelector("#topics-list");
const notesContainer = document.querySelector("#notes-container");
let currentTopic;

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
notesContainer.addEventListener('click', noteClickHandler);

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
  currentTopic = +e.target.id.split('-')[1];
  if(e.target.className.includes('topic-item')) {
    notesContainer.innerHTML = '';
    fetch(`http://localhost:3000/notes`).then(resp => resp.json()).then(notes => {
      const filteredNotes = notes.filter(note => note.topic_id == +e.target.id.split('-')[1]);
      filteredNotes.forEach(note => {
        addNoteToDOM(notesContainer, note);
        // console.log(note);
      })
    });
  }
}

function noteClickHandler(e) {
  if(e.target.className.includes('add-note') && !e.target.className.includes('add-child-note')) console.log('add parent note');
  if(e.target.className.includes('add-child-note')) {
    const targetLi = e.target.parentNode;
    addNoteFormToDOM(targetLi);
    const curForm = targetLi.querySelector('form');
    curForm.addEventListener('submit', e => {
      e.preventDefault();
      // console.log(e.target.querySelector("#new-note-text").value)
      fetch('http://localhost:3000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: e.target.querySelector("#new-note-text").value,
          topic_id: currentTopic,
          ancestry: e.target.parentNode.tagName === 'LI' ? (e.target.parentNode.ancestry ? e.target.parentNode.ancestry + '/' + e.target.parentNode.id : e.target.parentNode.id.toString()) : null
        })
      }).then(resp => resp.json()).then(data => {
        addNoteToDOM(e.target.parentNode, data)
        e.target.parentNode.removeChild(curForm);
        // console.log(e.target.parentNode);
      })
      // console.log(e.target.parentNode.ancestry);
      curForm.reset();
    });
  }
  if(e.target.className.includes('remove-note')) console.log('rmv note');
}

function addNoteToDOM(container, note) {
  const newNoteHTML = `
    <li id=${note.id} title="Created by: someuser" ancestry=${note.ancestry}>${note.content}&nbsp;&nbsp;&nbsp;&nbsp;<a class="add-note add-child-note" style="font-size: 25px;" title="Add a child note">+</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="remove-note" style="font-size: 25px;" title="Delete this note and all children">-</a></li>
    `
  if(container.tagName === 'LI') {
    const nestedUl = document.createElement('ul');
    nestedUl.innerHTML = newNoteHTML;
    container.append(nestedUl);
  } else {
    container.innerHTML += newNoteHTML;
  }
}

function addNoteFormToDOM(noteLi) {
  noteLi.innerHTML += `
    <form>
      <input id="new-note-text" type="text">
      <input type="submit" name="submit">
    </form>
  `
}
