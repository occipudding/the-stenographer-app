// ------------------ VARIABLES -----------------------------
const main = document.querySelector("#main");
const sidebar = document.querySelector("#sidebar");
const usernameContainer = document.querySelector("#username-container");
const topicsList = document.querySelector("#topics-list");
const topicDeleteBtn = document.querySelector('#delete-topic');
const mainContainer = document.querySelector('.main-container')
const notesContainer = document.querySelector("#notes-container");
let currentTopic;

// modal variables
const newTopicAnchor = document.querySelector('#new-topic')
const modal = document.querySelector('#modal')
const closeBtn = document.querySelector(".close-btn")
const modalForm = document.querySelector("#modal-form")

//login variables
let currentUser = ""
const loginForm = document.querySelector("#login-form")


if (currentUser === "") {

// --- login events ---
loginForm.addEventListener('submit', getOrPostUser)

// --- login fetch ---
function getOrPostUser(e) {
  e.preventDefault()
  const nameInput = document.querySelector("#user-name").value

  fetch(`http://localhost:3000/users/${nameInput}`, {
    method: 'POST',
    headers: {'Content-Type' : 'application/json'}
  })
  .then(res => res.json())
  .then(user => {
      currentUser = user
      loginForm.style.display = "none"
      loggedIn()
    })
  }
}


function loggedIn() {
  usernameContainer.innerText = currentUser.name

  fetchMyTopics()

  function fetchMyTopics() {
    fetch('http://localhost:3000/topics')
    .then(res => res.json())
    .then(data => {
      const currUserTopics = data.filter(topic => topic.user.id === currentUser.id)
      addTopicsToSidebar(currUserTopics)
    })
  }

  function fetchAllTopics() {
    fetch(`http://localhost:3000/topics`)
    .then(res => res.json())
    .then(addTopicsToSidebar)
  }

  function fetchOneTopic(e) {
    const topicId = +e.target.id.split('-')[1];
    fetch(`http://localhost:3000/topics/${topicId}`)
    .then(res => res.json())
    .then(topic => addNotesToDOM(e, topic))
  }

  function deleteTopic(e) {
    const topicId = e.target.dataset.id
    if (e.target.id === "delete-topic") {
      fetch(`http://localhost:3000/topics/${topicId}`, {
        method: 'DELETE'
      })
      // topicsList.childNodes.find(child => {
        // debugger

      // })
      .then(() => {
      fetchMyTopics()
      topicDeleteBtn.style.display = "none"
      e.path[1].previousElementSibling.innerHTML =' '
      e.path[2].children[0].innerText =' '
    })
  }
}

  function postTopic(e) {
    e.preventDefault()
    const titleInput = document.querySelector("#topic-title").value
    const tagsInput = document.querySelector("#topic-tags").value

    fetch('http://localhost:3000/topics', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        title: titleInput,
        tags: tagsInput,
        user_id: currentUser.id
      })
    })
    .then(res => res.json())
    .then(topics => {
      oneTopicToSideBar(topics)
      modalForm.reset()
      modal.style.display = "none"
    })
  }

    function fetchNotes(e) {
      fetch(`http://localhost:3000/notes`).then(resp => resp.json()).then(notes => {
        notesContainer.style.border = "1px solid rgba(0, 0, 0, 0.3)";
        const filteredNotes = notes.filter(note => note.topic_id == +e.target.id.split('-')[1]);
        filteredNotes.sort((a,b) => a.id - b.id).forEach(note => {
          if(!note.ancestry) {
            addNoteToDOM(notesContainer, note)
          } else {
            const parentContainer = document.querySelector(`li[id="${note.ancestry.includes('/') ? +note.ancestry.split('/')[note.ancestry.split('/').length - 1] : +note.ancestry}"]`);
            addNoteToDOM(parentContainer, note);
          }
        })
      });
    }

  // ------------------ EVENT LISTENERS -------------------------
  // -- sidebar events
  sidebar.addEventListener('mouseover', e => {
    e.target.style.width = "250px";
    main.style.marginLeft = "250px";
  })

  sidebar.addEventListener('mouseleave', e => {
    e.target.style.width = "0.5%";
    main.style.marginLeft = "0";
  })

  sidebar.addEventListener('click', sidebarClickHandler);

  function sidebarClickHandler(e) {
    if (e.target.id === "switch-topics") {
      switchSidebarTopics(e)
    } else if (e.target.className.includes("topic-item")) {
      fetchOneTopic(e)
    }
  }
  // --
  notesContainer.addEventListener('click', noteClickHandler);

  topicDeleteBtn.addEventListener('click', deleteTopic) // here here here

  // -- modal events
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

  // -- modal form events
  modalForm.addEventListener('submit', postTopic)

  // ----------------------- FUNCTIONS -----------------------------
  function addTopicsToSidebar(topics) {
    topicsList.innerHTML = '';
    topics.forEach(topic => {
      oneTopicToSideBar(topic)
    });
  }

  function oneTopicToSideBar(topic) {
    const tagsToString = 'Tags: ' + topic.tags.join(', ')
    topicsList.innerHTML += `
    <li id="topic-${topic.id}" class="topic-item sidebar-text" title="${tagsToString}">${topic.title}</li>
    `
  }

  function switchSidebarTopics(e) {
      const switchTopicsAnchor = document.querySelector("#switch-topics")
      if (switchTopicsAnchor.innerText === "See All Topics") {
        fetchAllTopics()
        switchTopicsAnchor.innerText = "See My Topics"
      } else {
        fetchMyTopics()
        switchTopicsAnchor.innerText = "See All Topics"
      }
    }

  function addNotesToDOM(e, topicData) {
    currentTopic = +e.target.id.split('-')[1];
    // debugger
    // fetchOneTopic(topicId).then(topic => {currentTopic = topic})
    document.querySelector('h1').innerHTML = topicData.title;
    if (topicData.user.id === currentUser.id) {
      topicDeleteBtn.style.display = "block"
      topicDeleteBtn.dataset.id = topicData.id
    } else {
      topicDeleteBtn.style.display = "none"
    }

    if(e.target.className.includes('topic-item')) {
      notesContainer.innerHTML = `
        <a id="new-top-level-note" class="add-note" style="font-size: 25px;" title="Create a new top level note">+</a>
      `;
      fetchNotes(e);
  }
}

function postNote(e, curForm) {
  fetch('http://localhost:3000/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: e.target.querySelector("#new-note-text").value,
      topic_id: currentTopic,
      ancestry: e.target.parentNode.tagName === 'LI' ? (/\d+/.test(e.target.parentNode.getAttribute('ancestry')) ? e.target.parentNode.getAttribute('ancestry') + '/' + e.target.parentNode.id : e.target.parentNode.id.toString()) : null
    })
  }).then(resp => resp.json()).then(data => {
    if(e.target.parentNode.id !== 'new-top-level-note') {
      addNoteToDOM(e.target.parentNode, data);
    } else {
      addNoteToDOM(notesContainer, data);
    }
    e.target.parentNode.id !== 'new-top-level-note' ? e.target.parentNode.removeChild(curForm) : document.querySelector('#new-top-level-note').removeChild(document.querySelector('form'));
  });
}

function formHandler(el) {
  const curForm = el.querySelector('form');
  if(!!curForm) {
    curForm.addEventListener('submit', e => {
      e.preventDefault();
      postNote(e, curForm);
      curForm.reset();
    });
  }
}

function addTopLevelNote(e) {
  addNoteFormToDOM(e.target);
  formHandler(e.target);
}

function addChildNote(e) {
  const targetLi = e.target.parentNode;
  addNoteFormToDOM(targetLi);
  formHandler(targetLi);
}

function deleteNote(e) {
  const noteId = e.target.parentNode.id;
  const noteTree = document.querySelectorAll(`li[ancestry*="${noteId}"]`);
  const noteTreeArray = [];
  noteTree.forEach(note => noteTreeArray.unshift(note));
  noteTreeArray.forEach(note => {
    fetch(`http://localhost:3000/notes/${note.id}`, {
    method: 'delete'
    });
    note.parentNode.removeChild(note);
  });
  fetch(`http://localhost:3000/notes/${noteId}`, {
    method: 'delete'
  })
  e.target.parentNode.parentNode.removeChild(e.target.parentNode);
}

function editNote(e) {
  if(e.target.parentNode.getAttribute('contenteditable') ==  'false') {
    e.target.innerText = '✐';
    e.target.parentNode.setAttribute('contenteditable', 'true');
  } else {
    e.target.innerText = '✎';
    e.target.parentNode.setAttribute('contenteditable', 'false');
  }
}

function noteClickHandler(e) {
  if(e.target.className.includes('add-note') && !e.target.className.includes('add-child-note')) addTopLevelNote(e);
  if(e.target.className.includes('add-child-note')) addChildNote(e);
  if(e.target.className.includes('remove-note')) deleteNote(e);
  if(e.target.className.includes('edit-note')) editNote(e);
}

function addNoteToDOM(container, note) {
  const newNoteHTML = `
    <li id=${note.id} title="Created by: ${usernameContainer.innerText}" ancestry=${note.ancestry} contenteditable="false">${note.content}&nbsp;&nbsp;&nbsp;&nbsp;<a class="add-note add-child-note" style="font-size: 25px;" title="Add a child note">+</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="remove-note" style="font-size: 25px;" title="Delete this note and all children">-</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="edit-note" style="font-size: 25px;" title="Edit this note">✎</a></li>
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
    if(noteLi.querySelector('form')) {
      noteLi.removeChild(document.querySelector('form'));
    } else {
      if(document.querySelector('form')) document.querySelector('form').parentNode.removeChild(document.querySelector('form'));
      const form = document.createElement('form');
      const newNoteText = document.createElement('input');
      const submit = document.createElement('input');
      newNoteText.type = 'text';
      newNoteText.id = 'new-note-text';
      newNoteText.style.width = '400px';
      submit.type = 'submit';
      submit.name = 'submit';
      form.append(newNoteText);
      form.append(submit);
      noteLi.insertBefore(form, noteLi.querySelectorAll('ul')[0]);
      newNoteText.focus();
      newNoteText.select();
    }
  }

  }
