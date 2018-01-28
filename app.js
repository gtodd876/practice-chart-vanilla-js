// storage controller
const StorageCtrl = (function() {
  return {
    storeItem: function(item) {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearAllItemsFromStorage: function() {
      localStorage.removeItem('items');
    },
  };
})();
// item controller
const ItemCtrl = (function() {
  const Item = function(id, name, time) {
    this.id = id;
    this.name = name;
    this.time = time;
  };
  const state = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalTime: 0,
  };
  return {
    getState: function() {
      return state.items;
    },
    addItem: function(name, time) {
      let ID;
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      time = parseInt(time);
      newItem = new Item(ID, name, time);
      state.items.push(newItem);
      return newItem;
    },
    logData: function() {
      return state;
    },
    getTotalTime: function() {
      let total = 0;

      state.items.forEach(item => {
        total += item.time;
      });

      state.totalTime = total;
      return state.totalTime;
    },
    getItemById: function(id) {
      let found = null;
      state.items.forEach(item => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      const ids = state.items.map(item => {
        return item.id;
      });
      const index = ids.indexOf(id);
      state.items.splice(index, 1);
    },
    clearAllItems: function() {
      state.items = [];
    },
    updateItem: function(name, time) {
      time = parseInt(time);
      let found = null;
      state.items.forEach(item => {
        if (item.id === state.currentItem.id) {
          item.name = name;
          item.time = time;
          console.log(item);
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item) {
      state.currentItem = item;
    },
    getCurrentItem: function() {
      return state.currentItem;
    },
  };
})();

//ui controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemName: '#activity-name',
    itemTime: '#time-length',
    totalTime: '.total-practice',
    clearBtn: '.clear-btn',
  };
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(item => {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong>
          <em>${item.time} Minutes</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
        `;
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addListItem: function(item) {
      document.querySelector(UISelectors.itemList).style.display = 'block';
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong>
      <em>${item.time} Minutes</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(listItem => {
        const itemId = listItem.getAttribute('id');
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong>
          <em>${item.time} Minutes</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    getSelectors: function() {
      return UISelectors;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        time: document.querySelector(UISelectors.itemTime).value,
      };
    },
    clearItemInputs: function() {
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemTime).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemTime).value = ItemCtrl.getCurrentItem().time;
      UICtrl.showEditState();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(item => {
        item.remove();
      });
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalTime: function(totalTime) {
      document.querySelector(UISelectors.totalTime).textContent = totalTime;
    },
    clearEditState: function(e) {
      UICtrl.clearItemInputs();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
  };
})();

//app controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    document.querySelector(UISelectors.backBtn).addEventListener('click', itemEditCancel);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  };
  const itemEditCancel = function(e) {
    e.preventDefault();
    UICtrl.clearEditState();
  };
  const itemAddSubmit = function(e) {
    e.preventDefault();
    const input = UICtrl.getItemInput();
    if (input.name !== '' && input.time !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.time);
      UICtrl.addListItem(newItem);
      const totalTime = ItemCtrl.getTotalTime();
      UICtrl.showTotalTime(totalTime);
      StorageCtrl.storeItem(newItem);
      UICtrl.clearItemInputs();
    }
  };
  const itemDeleteSubmit = function(e) {
    e.preventDefault();
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id);
    const totalTime = ItemCtrl.getTotalTime();
    UICtrl.showTotalTime(totalTime);
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    UICtrl.clearEditState();
  };
  const itemEditClick = function(e) {
    e.preventDefault();
    if (e.target.classList.contains('edit-item')) {
      const listId = e.target.parentNode.parentNode.id;
      const listIdArr = listId.split('-');
      const id = parseInt(listIdArr[1]);
      const itemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.addItemToForm();
    }
  };
  const itemUpdateSubmit = function(e) {
    e.preventDefault();
    const input = UICtrl.getItemInput();
    const updatedItem = ItemCtrl.updateItem(input.name, input.time);
    UICtrl.updateListItem(updatedItem);
    const totalTime = ItemCtrl.getTotalTime();
    UICtrl.showTotalTime(totalTime);
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();
  };
  const clearAllItemsClick = function() {
    ItemCtrl.clearAllItems();
    UICtrl.removeItems();
    const totalTime = ItemCtrl.getTotalTime();
    UICtrl.showTotalTime(totalTime);
    StorageCtrl.clearAllItemsFromStorage();
    UICtrl.clearEditState();
    UICtrl.hideList();
  };
  return {
    init: function() {
      UICtrl.clearEditState();
      const items = ItemCtrl.getState();
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }
      const totalTime = ItemCtrl.getTotalTime();
      UICtrl.showTotalTime(totalTime);

      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
