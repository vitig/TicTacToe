var cells = new Array(9);
for (var i = 0; i < cells.length; i++) {
    cells[i] = {
        id: i,
        player: '',
        wcomb: false
    }
}

Vue.component('cell', {
    template: '#cell-template',
    props: ['clickable', 'linethrow'],
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
        cellArray: cells,
        cellStatus: true,
        resMessage: '',
        winCombinations: [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ],
    },
    methods: {
        aiMove: function() {
            if (this.hasWinner()) {
                return;
            }
            var n = this.aiTurn();
            this.$children[n].setSign('zero');

            this.hasWinner();
        },
        hasWinner: function() {
            var winner = this.checkField();
            if (winner.winner) {
                this.endGame(winner);
                return true;
            } else if (this.fieldIsFull()) {
                this.endGame();
                return true;
            }
            return false;
        },
        checkField: function() {
            var win = false;
            var i = 0;
            do {
                win = this.checkWinCombo(this.winCombinations[i]);
                i++;
            } while (!win && (i < this.winCombinations.length));
            return { winner: win, combo: this.winCombinations[i - 1] };
        },
        checkWinCombo: function(cArr) {
            if ((cells[cArr[0]].player == 'cross') && (cells[cArr[1]].player == 'cross') && (cells[cArr[2]].player == 'cross') ||
                (cells[cArr[0]].player == 'zero') && (cells[cArr[1]].player == 'zero') && (cells[cArr[2]].player == 'zero')) {
                return cells[cArr[0]].player;
            }
            return false;
        },
        fieldIsFull: function() {
            if (cells[0].player && cells[1].player && cells[2].player && cells[3].player && cells[4].player &&
                cells[5].player && cells[6].player && cells[7].player && cells[8].player) {
                return true;
            }
            return false;
        },
        endGame: function(winner) {
            this.cellStatus = false;
            if (winner) {
                for (var i = 0; i < winner.combo.length; i++) {
                    cells[winner.combo[i]].wcomb = true;
                }
                this.resMessage = (winner.winner == 'cross' ? 'You' : 'Computer') + ' Win!';
            } else {
                this.resMessage = 'Draw';
            }
        },
        aiTurn: function() {
            var position = this.checkThird('zero');
            if (position === false) {
                position = this.checkThird('cross');
            }
            if (position === false) {
                position = this.checkSecond();
            }
            if (position === false) {
                position = this.aiRndTurn();
            }
            return position;
        },
        checkThird: function(symbol) {
            for (var i = 0; i < this.winCombinations.length; i++) {
                var cmb = this.winCombinations[i];
                if (cells[cmb[0]].player == symbol && cells[cmb[1]].player == symbol && !cells[cmb[2]].player) {
                    return cmb[2];
                } else if (cells[cmb[0]].player == symbol && cells[cmb[2]].player == symbol && !cells[cmb[1]].player) {
                    return cmb[1];
                } else if (cells[cmb[1]].player == symbol && cells[cmb[2]].player == symbol && !cells[cmb[0]].player) {
                    return cmb[0];
                }
            }
            return false;
        },
        checkSecond: function() {
            for (var i = 0; i < this.winCombinations.length; i++) {
                var cmb = this.winCombinations[i];
                if ((cells[cmb[0]].player == 'zero') && (!cells[cmb[1]].player) && (!cells[cmb[2]].player)) {
                    return cmb[1];
                } else if ((cells[cmb[1]].player == 'zero') && (!cells[cmb[2]].player) && (!cells[cmb[0]].player)) {
                    return cmb[2];
                } else if ((cells[cmb[1]].player == 'zero') && (!cells[cmb[0]].player) && (!cells[cmb[2]].player)) {
                    return cmb[0];
                } else if ((cells[cmb[2]].player == 'zero') && (!cells[cmb[1]].player) && (!cells[cmb[0]].player)) {
                    return cmb[1];
                }
            }
            return false;
        },
        aiRndTurn: function() {
            var n = Math.floor(Math.random() * 9);
            if (!cells[n].player) {
                return n;
            } else {
                return (this.aiRndTurn());
            }
        }

    }
})