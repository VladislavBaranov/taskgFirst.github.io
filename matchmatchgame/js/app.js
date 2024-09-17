   
class Game {
    constructor() {
        this.gameTable = null;
        this.playground = null;
        this.controlPanel = null;
        this.cardsTemp = ['✻','✼','❈','❇','✲','❊','✽','❃','✲'];
        this.cards = [];
        this.campareArray = [];
        this.timeStart = null;
        this.currentTime = null;
        this.timer = null;
        this.flip = this.flip.bind(this);
        this.cardType = 'front-cover-1';
        this.acountclicks=0;
    }

    timerStart() {
        this.timerStop(); 
        this.timeStart = new Date();
        this.timer = setInterval(() => {
            let distance = (new Date() - this.timeStart);
            const m = Math.floor((distance  % (1000 * 60 * 60)) / (1000 * 60));
            const mm = m < 10 ? `0${m}` : m;
            const s = Math.floor((distance % (1000 * 60)) / 1000);
            const ss = s < 10 ? `0${s}` : s;
            this.currentTime= `${mm}:${ss}`;
            this.controlPanel.querySelector('.time').innerHTML =  '- '+this.currentTime+' -';
            console.log(`${mm}:${ss}`);
        },1000 );
    }

    timerStop() {
        clearInterval(this.timer);  
    }

    mixer(numberOfCards) {
        let shuffle = function(a) {
          let j, x, i;
          for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
          }
        }
        let values = [];
        for (let i = 0; i < numberOfCards; i++) {
          values.push(this.cardsTemp[i]);
          values.push(this.cardsTemp[i]);
        }
        shuffle(values);
        this.cards = values;
    }  

    easy() {
        this.mixer(4);
        this.start();
    }

    medium() {
        this.mixer(6);
        this.start();
    }

    hard() {
        this.mixer(8);
        this.start();
    }

    initHtml() {
        this.gameTable = document.querySelector('#game-memory');
        this.playground = document.querySelector('.playground');
        this.controlPanel = document.querySelector('.control-panel');

        [...this.controlPanel.querySelectorAll('.card-type > div')].forEach((item) => {
            item.addEventListener('click', (e) => {
                [...document.querySelectorAll('.card-type .active')].forEach(i => i.classList.remove('active'))
                e.target.classList.add('active');
                this.cardType = e.target.attributes.getNamedItem('data-type').nodeValue;
            });
        });

        this.rules();

    }


    drawCards() {
        return this.cards.map((item, index) => {
            return `<div class="card-container">
                    <div class="card">
                      <div class="front ${this.cardType}">
                      </div>
                      <div class="back">
                        ${item}
                      </div>
                    </div>
                    </div>`;
        }).join('');
    }

    compare(cardValue) {
        if (this.campareArray.length === 1) {
            this.campareArray.push(cardValue);
            if (this.campareArray[0] === this.campareArray[1]) {
                setTimeout(() => {
                    [...this.playground.querySelectorAll('.flip')].forEach(card => {
                        card.classList.add('pair');
                        card.removeEventListener('click', this.flip)
                    });

                    [...this.playground.querySelectorAll('.pair')].length === this.cards.length && this.finish();
                    this.campareArray = []
                }, 1000)
            }
            else {
                setTimeout(() => {
                    [...this.playground.querySelectorAll('.flip:not(.pair)')].forEach(card => card.classList.remove('flip')) 
                    this.campareArray = []
                }, 1000)
            }
        }
        else {
            this.campareArray.push(cardValue);   
        }
        console.log(this.campareArray)
    }

    flip(e) {
        if (this.campareArray.length === 2)
            return;
        let carentsCard = e.target.closest('.card-container');
        carentsCard.classList.toggle('flip');
        this.compare(carentsCard.querySelector('.back').innerHTML.trim());
    }

    handleCard() {
        [...this.playground.querySelectorAll('.card-container')].forEach(card => {
            card.addEventListener('click', this.flip)
        })
    }
    counter(){
        this.acountclicks = 0;
        this.gameTable.onclick = (e)=> {
            if (!e.target.classList.contains('front')) 
                return;
            this.acountclicks++;
            console.log(this.acountclicks); }
    }

    showChoseCard(flag){
        flag
        ? document.querySelector('.card-type').classList.add('hide')
        : document.querySelector('.card-type').classList.remove('hide');
    }

    start() {
        this.playground.innerHTML = this.drawCards();
        this.handleCard();
        this.timerStart();
        this.showChoseCard(true);
        this.counter();
    }

    exit() {
        this.rules();
        this.timerStop();
        this.showChoseCard(false);
        this.controlPanel.querySelector('.time').innerHTML = '';
    }

    finish() {
        this.timerStop();
        this.playground.innerHTML = ` Congratulations! Your time:  ${this.currentTime}. Acount of clicks: ${this.acountclicks}`;
        this.showChoseCard(false);
        this.controlPanel.querySelector('.time').innerHTML = '';
    }

    rules() {
        this.playground.innerHTML = `Welcome to match-match-game! The rules are simple: play and win!`;
    }

    handler() {
        [...this.controlPanel.querySelectorAll('.button')].forEach(item => {
            let handler = item.attributes.getNamedItem('data-handler').nodeValue || 'exit'; 
            item.addEventListener('click', this[handler].bind(this));
        })
    }

    init() {
        this.initHtml();
        this.handler();
    }
}

let game = new Game();

game.init();
