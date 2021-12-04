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

class App {
  static #hasInstance = false
  static #instance = null

  constructor(config) {
    if (App.#hasInstance) {
      console.warn('Instance is already exist. Returning existing instance')
      return App.#instance
    }
    const { data, selectors } = config
    const { container, contactsList, detailsList, backButton, nameWrapper } = selectors
    this.container = document.querySelector(container)
    this.contactsList = document.querySelector(contactsList)
    this.detailsList = document.querySelector(detailsList)
    this.backButton = document.querySelector(backButton)
    this.nameWrapper = document.querySelector(nameWrapper)
    this.data = data
    this.allIds = data.map(person => person.id)
    this.mappedData = this.getMappedData(data)
    this.popularPeople = this.getPopularPeopleList(3)
    this.initApp()
    App.#instance = this
    App.#hasInstance = true
  }

  getNotFriendsList(person, quantity = 3) {
    const notFriendsList = []
    for (let i = 0; notFriendsList.length < quantity; i++) {
      if (!person.friends.includes(this.allIds[i])) {
        notFriendsList.push(this.allIds[i])
      }
    }
    return notFriendsList
  }

  getMappedData(data) {
    const res = {}
  
    data.forEach(person => {
      const notFriends = this.getNotFriendsList(person, 3)
      
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

  getPopularPeopleList(quantity = 3) {
    return Object.values(this.mappedData).sort((a, b) => {
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
    }).slice(0, quantity)
  }

  renderListItem(person) {
    return `
      <li data-id="${person.id}">
        <strong>${person.name}</strong>
      </li>
    `
  }

  renderContactsList() {
    let listContent = ''
    Object.values(this.mappedData).forEach(person => {
      listContent += this.renderListItem(person)
    })
    return listContent
  }

  renderDetailsListItem(person) {
    return `
      <li>
        <i class="fa fa-male"></i>
        <span >${person.name}</span>
      </li>
    `
  }

  renderDetailsListTitle(title) {
    return `
      <li class="people-title">${title}</li>
    `
  }

  renderDetailsList(personId) {
    let listContent = ''
    const person = this.mappedData[personId]
    listContent += this.renderDetailsListTitle('Друзья')
    listContent += person.friends.reduce((acc, friendId) => acc + this.renderDetailsListItem(this.mappedData[friendId]),'')
    listContent += this.renderDetailsListTitle('Не в друзьях')
    listContent += person.notFriends.reduce((acc, humanId) => acc + this.renderDetailsListItem(this.mappedData[humanId]),'')
    listContent += this.renderDetailsListTitle('Популярные люди')
    listContent += this.popularPeople.reduce((acc, human) => acc + this.renderDetailsListItem(human),'')
    return listContent
  }

  showDetails(evt) {
    const target = evt.target
    const id = target.dataset.id || target.closest('li').dataset.id
    const isListItem = Boolean(id)
    if (isListItem) {
      this.container.classList.add('details')
      this.nameWrapper.innerHTML = this.mappedData[id].name
      this.detailsList.innerHTML = this.renderDetailsList(id)
    }
  }

  hideDetails() {
    this.container.classList.remove('details')
  }

  initApp() {
    this.contactsList.innerHTML = this.renderContactsList(this.mappedData)
    this.contactsList.addEventListener('click', this.showDetails.bind(this))
    this.backButton.addEventListener('click', this.hideDetails.bind(this))
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const config = {
    data,
    selectors: {
      container: '#container',
      contactsList: '.contacts-list', 
      detailsList: '.details-list', 
      backButton: '#container .details-view .back', 
      nameWrapper: '.background span'
    }
  }
  new App(config)
})







