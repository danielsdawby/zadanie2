const storageKey = 'notes-app';
const storageData = localStorage.getItem(storageKey);

const initialData = storageData ? JSON.parse(storageData) : {
    firstColumn: [],
    secondColumn: [],
    thirdColumn: []
};

const app = new Vue({
    el: '#app',
    data: {
        firstColumn: initialData.firstColumn,
        secondColumn: initialData.secondColumn,
        thirdColumn: initialData.thirdColumn,
        groupName: null,

        noteTitle: '',
        items: []
    },
    watch: {
        firstColumn: {
            handler: function (newFirstColumn) {
                this.saveData();
            },
            deep: true
        },
        secondColumn: {
            handler: function (newSecondColumn) {
                this.saveData();
                this.checkDisableFirstColumn();
            },
            deep: true
        },
        thirdColumn: {
            handler: function (newThirdColumn) {
                this.saveData();
            },
            deep: true
        },
        items: {
            handler: function (newItems) {
                this.saveData();
                this.checkDisableFirstColumn();
            },
            deep: true
        }
    },
    methods: {

        saveData: function () {
          const data = {
            firstColumn: this.firstColumn,
            secondColumn: this.secondColumn,
            thirdColumn: this.thirdColumn,
            items: this.items
          };
          localStorage.setItem(storageKey, JSON.stringify(data));
        },
        canDeleteGroup: function (group) {
          return group.items.every(item => !item.checked);
        },
        deleteNoteGroup(groupId) {
          this.firstColumn = this.firstColumn.filter(group => group.id !== groupId);
          this.secondColumn = this.secondColumn.filter(group => group.id !== groupId);
          this.thirdColumn = this.thirdColumn.filter(group => group.id !== groupId);
          this.saveDataToLocalStorage();
        },
        updateProgress: function (card, item) {
            const checkedCount = card.items.filter(item => item.checked).length;
            const progress = (checkedCount / card.items.length) * 100;
            card.isComplete = progress === 100;
      
            if (this.secondColumn.length === 5) {
              const areAllSecondColumnComplete = this.secondColumn.every(note => note.isComplete);
      
              this.firstColumn.forEach(note => {
                note.items.forEach(item => {
                  if (item.checked) {
                    item.disabled = true;
                  } else {
                    item.disabled = areAllSecondColumnComplete;
                  }
                });
              });
            }
      
            if (item.checked) {
              item.disabled = true;
            } else {
              item.disabled = false;
              this.checkDisableFirstColumn();
            }
      
            this.checkMoveCard();
          },
      
          MoveFirstColm: function () {
            this.firstColumn.forEach(card => {
              const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
      
              const isMaxSecondColumn = this.secondColumn.length >= 5;
      
              if (isMaxSecondColumn && progress >= 50) {
                this.firstColumn.forEach(note => {
                  note.items.forEach(item => {
                    item.disabled = true;
                  });
                });
              }
      
              if (progress >= 50 && !isMaxSecondColumn) {
                this.secondColumn.push(card);
                this.firstColumn.splice(this.firstColumn.indexOf(card), 1);
                this.MoveSecondColm();
              }
            });
          },
      
          MoveSecondColm: function () {
            this.secondColumn.forEach(card => {
              const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
              if (progress === 100) {
                card.isComplete = true;
                card.lastChecked = new Date().toLocaleString();
                this.thirdColumn.push(card);
                this.secondColumn.splice(this.secondColumn.indexOf(card), 1);
                this.MoveFirstColm();
              }
            })
          },
      
          checkMoveCard: function () {
            this.MoveFirstColm();
            this.MoveSecondColm();
          },
    }
})