const data = [
  {
      id: 1,
      name: 'Петя',
      friends: [10, 2, 6],
  },
  {
      id: 2,
      name: 'Вася',
      friends: [5, 1, 3],
  },
  {
      id: 3,
      name: 'Оля',
      friends: [9, 4, 3],
  },
  {
      id: 4,
      name: 'Максим',
      friends: [11, 12, 2],
  },
  {
      id: 5,
      name: 'Елена',
      friends: [7, 8, 4],
  },
  {
      id: 6,
      name: 'Иван',
      friends: [6, 1, 12],
  },
  {
      id: 7,
      name: 'Никита',
      friends: [1, 8, 5],
  },
  {
      id: 8,
      name: 'Марат',
      friends: [11, 12, 10],
  },
  {
      id: 9,
      name: 'Анатолий',
      friends: [1, 2, 3],
  },
  {
      id: 10,
      name: 'Наташа',
      friends: [8, 4, 2],
  },
  {
      id: 11,
      name: 'Марина',
      friends: [1, 5, 8],
  },
  {
      id: 12,
      name: 'Кирилл',
      friends: [5, 2, 12],
  }
]

function getNotFriendsList(idsList, person) {
  const notFriendsList = []
  for (let i = 0; notFriendsList.length < 3; i++) {
    if (!person.friends.includes(idsList[i])) {
      notFriendsList.push(idsList[i])
    }
  }
  return notFriendsList
}

function getMappedData(data) {
	const res = {}
  const allIds = data.map(person => person.id)

	data.forEach(person => {
  	const notFriends = getNotFriendsList(allIds, person)
    
    if (res[person.id]) {
    	res[person.id] = {...person, ...res[person.id], notFriends}
     } else {
     	res[person.id] = {...person, notFriends, popularity: 0}
     }
    
    person.friends.forEach(friendId => {
    	if (res[friendId]) {
        res[friendId] = {...res[friendId], popularity: ++res[friendId].popularity}
      } else {
      	res[friendId] = {popularity: 1}
      }
    })
  	
  })
  return res
}

function getFirstPopularPeople(n, mappedData) {
  return Object.values(mappedData).sort((a, b) => {
    if (a.popularity === b.popularity) {
      if (a.name < b.name) {
        return -1
      } else if (a.name > b.name) {
        return 1
      } else {
        return 0
      }
    } else {
      return b.popularity - a.popularity
    }
  }).slice(0, n)
}

function renderListItem(person) {
  return `
    <li data-id="${person.id}">
      <strong>${person.name}</strong>
    </li>
  `
}

function renderContactsList(mappedData) {
  let listContent = ''
  Object.values(mappedData).forEach(person => {
    listContent += renderListItem(person)
  })
  return listContent
}

function renderDetailsListItem(person) {
  return `
    <li>
      <i class="fa fa-male"></i>
      <span >${person.name}</span>
    </li>
  `
}

function renderDetailsListTitle(title) {
  return `
    <li class="people-title">${title}</li>
  `
}

function renderDetailsList(personId, mappedData, popularPeople) {
  let listContent = ''
  const person = mappedData[personId]
  listContent += renderDetailsListTitle('Друзья')
  listContent += person.friends.reduce((acc, friendId) => acc + renderDetailsListItem(mappedData[friendId]),'')
  listContent += renderDetailsListTitle('Не в друзьях')
  listContent += person.notFriends.reduce((acc, humanId) => acc + renderDetailsListItem(mappedData[humanId]),'')
  listContent += renderDetailsListTitle('Популярные люди')
  listContent += popularPeople.reduce((acc, human) => acc + renderDetailsListItem(human),'')
  return listContent
}

function showDetails(evt, options) {
  const {mappedData, listView, detailsView, detailsList, nameWrapper, popularPeople} = options
  const target = evt.target
  const id = target.dataset.id || target.closest('li').dataset.id
  const isListItem = Boolean(id)
  if (isListItem) {
    listView.style.zIndex = -1
    nameWrapper.innerHTML = mappedData[id].name
    detailsList.innerHTML = renderDetailsList(id, mappedData, popularPeople)
    detailsView.style.zIndex = 1
  }
}

function showContacts(list, details) {
  list.style.zIndex = 1
  details.style.zIndex = -1
}

function init() {
  const mappedData = getMappedData(data)
  const popularPeople = getFirstPopularPeople(3, mappedData)
  const contactsList = document.querySelector('.contacts-list')
  const listView = document.querySelector('.list-view')
  const detailsList = document.querySelector('.details-list')
  const detailsView = document.querySelector('.details-view')
  const backButton = document.querySelector('#container .details-view .back')
  const nameWrapper = document.querySelector('.background span')
  contactsList.innerHTML = renderContactsList(mappedData)

  contactsList.addEventListener('click', (evt) => {
    const options = { mappedData, listView, detailsView, detailsList, nameWrapper, popularPeople }
    showDetails(evt, options)
  })
  
  backButton.addEventListener('click', () => showContacts(listView, detailsView))
}

window.addEventListener('DOMContentLoaded', init)







