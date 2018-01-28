// storage controller

// item controller
const ItemCtrl = (function() {
  const Item = function(id, name, time) {
    this.id = id;
    this.name = name;
    this.time = time;
  };
  const state = {
    items: [
      // { id: 0, name: 'scales', time: 60 },
      // { id: 1, name: 'koussevitsky', time: 45 },
      // { id: 2, name: 'bach', time: 75 },
    ],
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
  };
})();

//ui controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemName: '#activity-name',
    itemTime: '#time-length',
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
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
  };
})();

//app controller
const App = (function(ItemCtrl, UICtrl) {
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  };
  const itemAddSubmit = function(e) {
    e.preventDefault();
    const input = UICtrl.getItemInput();
    if (input.name !== '' && input.time !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.time);
      UICtrl.addListItem(newItem);
      UICtrl.clearItemInputs();
    }
  };
  return {
    init: function() {
      const items = ItemCtrl.getState();
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

App.init();
