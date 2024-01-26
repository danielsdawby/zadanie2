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
    }
})