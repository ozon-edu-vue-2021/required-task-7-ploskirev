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

  /**
   * 
   * @param {Object} config - объект конфигурации, имеет поля data - исходные данные, selectors - селекторы необходимых элементов
   * @returns {Object} - инстанс приложения (только один (синглтон))
   */
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

  /**
   * Метод для формирования массива с айдишниками контактов, 
   * которые не являются друзьями конкретного контакта.
   * Если список уже был получен, вернет существующий список
   * @param {Object} person - объект контакта из списка контактов
   * @param {Number} quantity - Количество элементов возвращаемого массива 
   * @returns {Array} - массив самых айдишников контактов, которых нет в друзьях
   */
  getNotFriendsList(person, quantity = 3) {
    if (person.notFriends) {
      return person.notFriends
    }
    const notFriendsList = []
    for (let i = 0; notFriendsList.length < quantity; i++) {
      if (!person.friends.includes(this.allIds[i]) && (this.allIds[i] !== person.id)) {
        notFriendsList.push(this.allIds[i])
      }
    }
    return notFriendsList
  }

  /**
   * Метод для преобразования исходного массива в объект с ключами - id контактов
   * Также подсчитывает индекс популярности для каждого контакта 
   * и формирует список "недрузей" вызывая для каждого this.getNotFriendsList
   * Далее используется именно этот список для снижения сложности
   * Если уже есть вычисленная ранее структура, вернет ее
   * @param {Array} data - Массив исходных данных (список контактов)
   * @returns {Object} - Преобразованный список контактов, приведенный к объекту
   */
  getMappedData(data) {
    if (this.mappedData) {
      return this.mappedData
    }

    const res = {}
    data.forEach(person => {
      const notFriends = this.getNotFriendsList(person, 3)

      res[person.id] = res[person.id] ? 
        {...person, ...res[person.id], notFriends} : 
        {...person, notFriends, popularity: 0}
      
      person.friends.forEach(friendId => {
        res[friendId] = res[friendId] ? 
          {...res[friendId], popularity: ++res[friendId].popularity} : 
          {popularity: 1}
      })
    })
    return res
  }

  /**
   * Метод для получения списка популярных людей
   * Если ранее список уже был вычислен, вернет вычисленный список
   * @param {Number} quantity - Количество элементов возвращаемого массива 
   * @returns {Array} - массив самых популярных людей, отсортированный по популярности и именам
   */
  getPopularPeopleList(quantity = 3) {
    if (this.popularPeople) {
      return this.popularPeople
    }
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

  /**
   * Метод возвращает разметку для элемента списка контактов
   * @param {Object} person - объект контакта из списка контактов
   * @returns {String} - строка с разметкой для элемента списка контактов
   */
  renderListItem(person) {
    return `
      <li data-id="${person.id}">
        <strong>${person.name}</strong>
      </li>
    `
  }

  /**
   * Метод рендерит список контактов в список, полученный через селектор 'ContactsList'
   * @returns {undefined}
   */
  renderContactsList() {
    let listContent = ''
    Object.values(this.mappedData).forEach(person => {
      listContent += this.renderListItem(person)
    })
    this.contactsList.innerHTML = listContent
  }

  /**
   * Метод возвращает разметку для элемента details списка
   * @param {Object} person - объект контакта из списка контактов
   * @returns {String} - строка с разметкой для элемента списка details
   */
  renderDetailsListItem(person) {
    return `
      <li>
        <i class="fa fa-male"></i>
        <span >${person.name}</span>
      </li>
    `
  }

  /**
   * Метод возвращает разметку для заголовка в списке details
   * @param {String} title - Заголовок
   * @returns {String} - строка с разметкой для заголовка в списке details
   */
  renderDetailsListTitle(title) {
    return `
      <li class="people-title">${title}</li>
    `
  }

  /**
   * Метод рендера для отрисовки списка details конкретного элемента списка контактов
   * @param {String} personId -  id контакта, для которого нужно отрисовать список details
   * @returns {undefined}
   */
  renderDetailsList(personId) {
    let listContent = ''
    const person = this.mappedData[personId]
    listContent += this.renderDetailsListTitle('Друзья')
    listContent += person.friends.reduce((acc, friendId) => acc + this.renderDetailsListItem(this.mappedData[friendId]),'')
    listContent += this.renderDetailsListTitle('Не в друзьях')
    listContent += person.notFriends.reduce((acc, humanId) => acc + this.renderDetailsListItem(this.mappedData[humanId]),'')
    listContent += this.renderDetailsListTitle('Популярные люди')
    listContent += this.popularPeople.reduce((acc, human) => acc + this.renderDetailsListItem(human),'')
    this.detailsList.innerHTML = listContent
  }

  /**
   * Метод для отрисовки имени выбранного контакта
   * @param {String} id - id контакта, для которого нужно отрисовать список details
   * @returns {undefined}
   */
  renderName(id) {
    const name = this.mappedData[id].name
    this.nameWrapper.innerHTML = name
  }

   /**
    * Метод для отрисовки и показа details списка конкретного контакта
    * @param {Object} evt - объект события
    */
  showDetails(evt) {
    const target = evt.target
    const id = target.dataset.id || target.closest('li').dataset.id
    const isListItem = Boolean(id)
    if (isListItem) {
      this.container.classList.add('details')
      this.renderName(id)
      this.renderDetailsList(id)
    }
  }

  /**
   * Метод для сокрытия details списка конкретного контакта
   */
  hideDetails() {
    this.container.classList.remove('details')
  }

  /**
   * Метод для инициализации приложения
   * Отрисовывает список контактов
   * Вешает обработчики событий
   */
  initApp() {
    this.renderContactsList(this.mappedData)
    this.contactsList.addEventListener('click', this.showDetails.bind(this))
    this.backButton.addEventListener('click', this.hideDetails.bind(this))
    setTimeout(() => {this.container.classList.remove('initial')}, 0)
  }
}

/**
 * Стартуем приложение по готовности DOM
 */
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







