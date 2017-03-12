var cells = new Array(9);
var winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
for (var i = 0; i < cells.length; i++) {
    cells[i] = {
        id: i,
        player: '',
        status: false
    }
}

Vue.component('cell', {
    template: '#cell-template',
    props: ['clickable', 'linethrow'],
    computed: {},
    data: function() {
        return { currentSign: '' }
    },
    methods: {
        playerClick: function() {
            if (this.clickable) {
                var n = this.$el.id;
                if (!cells[n].player) {
                    this.setSign('cross');
                    this.$emit('ai-turn');
                }
            }
        },
        setSign: function(sign) {
            var n = this.$el.id;
            this.currentSign = sign;
            cells[n].player = sign;
        }
    }
})

Vue.component('cross', {
    template: '#cross-template'

})
Vue.component('zero', {
    template: '#zero-template'
})

new Vue({
    el: '#app',
    data: {
        numCell: cells,
        cellStatus: true,
        resMessage: ''
    },
    methods: {
        aiMove: function() {
            var winner = this.checkField();
            if (winner.winner) {
                this.endGame(winner);
                return;
            } else if (this.fieldIsFull()) {
                this.endGame();
                return;
            }
            var n = Math.floor(Math.random() * 9);
            if (!this.numCell[n].player) {
                this.$children[n].setSign('zero');
            } else {
                this.aiMove();
            }
            winner = this.checkField();
            if (winner.winner) {
                this.endGame(winner);
                return;
            } else if (this.fieldIsFull()) {
                this.endGame();
                return;
            }
        },
        checkField: function() {
            var win = false;
            var i = 0;
            do {
                win = this.checkWinCombo(winCombinations[i]);
                i++;
            } while (!win && (i < winCombinations.length));
            return { winner: win, combo: winCombinations[i - 1] };
        },
        checkWinCombo: function(cArr) {
            var cellArray = this.numCell;
            if ((cellArray[cArr[0]].player == 'cross') && (cellArray[cArr[1]].player == 'cross') && (cellArray[cArr[2]].player == 'cross') ||
                (cellArray[cArr[0]].player == 'zero') && (cellArray[cArr[1]].player == 'zero') && (cellArray[cArr[2]].player == 'zero')) {
                return cellArray[cArr[0]].player;
            }
            return false;
        },
        fieldIsFull: function() {
            if (this.numCell[0].player && this.numCell[1].player && this.numCell[2].player && this.numCell[3].player && this.numCell[4].player &&
                this.numCell[5].player && this.numCell[6].player && this.numCell[7].player && this.numCell[8].player) {
                return true;
            }
            return false;
        },
        endGame: function(winner) {
            this.cellStatus = false;
            if (winner) {
                for (var i = 0; i < winner.combo.length; i++) {
                    this.numCell[winner.combo[i]].status = true;
                }
                this.resMessage = (winner.winner == 'cross' ? 'You' : 'AI') + ' Win!';
            } else {
                this.resMessage = 'Nobody win...';
            }
            console.log('End Game');
        }

    }
})