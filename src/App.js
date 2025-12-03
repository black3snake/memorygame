import './App.css';
import config from "./config";
import React from "react";
import Card from "./components/Card";
import Popup from 'reactjs-popup';

class App extends React.Component {

    constructor() {
        super();
        this.state = {cards: [], clicks: 0, isPopupVisible: false};
    }

    componentDidMount() {
        this.startGame();
    }

    startGame() {
        this.setState( {
        cards: this.preparedCards(), clicks: 0, isPopupVisible: false
        })
    }

    preparedCards() {
        let id = 1;
        return [...config.cards, ...config.cards]
            .sort(() => Math.random() - 0.5)
            .map(item => ({...item, id: id++, isOpened: false, isCompleted: false}));
    }

    choiceCardHandler(openItem) {

        if (openItem.isCompleted || this.state.cards.filter(item => item.isOpened).length >= 2) {
            return;
        }

        this.setState({
            cards: this.state.cards.map(item => {
              return item.id === openItem.id ? {...item, isOpened: true} : item;
            })
        }, () => {
            this.processChoosingCards();
            // console.log(this.state.cards);
        });

        this.setState({
            clicks: this.state.clicks + 1
        })
    }

    processChoosingCards() {
        const openCards = this.state.cards.filter(item => item.isOpened);
        if (openCards.length === 2) {
            if (openCards[0].name ===  openCards[1].name) {
                this.setState({
                    cards: this.state.cards.map(item => {
                        if (item.id === openCards[0].id || item.id === openCards[1].id) {
                            item.isCompleted = true;
                        }

                        item.isOpened = false;
                        return item;
                    })
                }, () => {
                    this.checkForAllCompletedCards();
                })


            } else {
                setTimeout(() => {
                    this.setState({
                        cards: this.state.cards.map(item => {
                            item.isOpened = false;
                            return item;
                        })
                    })
                }, 1000)
            }
        }
    }

    checkForAllCompletedCards() {
        if (this.state.cards.every(item => item.isCompleted)) {
            this.setState({
                isPopupVisible: true,
            })
        }
    }

    closeModal() {
        this.setState({
            isPopupVisible: false,
        })
        this.startGame();
    }

    render() {

        return (
            <div className="App">
                <header className="header">Memory Game</header>
                <div className="game">
                    <div className="score">
                        Нажатий: {this.state.clicks}
                    </div>
                    <div className="cards">
                        {
                            this.state.cards.map(card => (
                                <Card item={card} key={card.id} isShowed={card.isOpened || card.isCompleted}
                                      onChoice={this.choiceCardHandler.bind(this)}/>
                            ))
                        }
                    </div>
                </div>
                <Popup open={this.state.isPopupVisible} closeOnDocumentClick onClose={this.closeModal.bind(this)}>
                    <div className="modal">
                        <span className="close" onClick={this.closeModal.bind(this)}>
                            &times;
                        </span>
                        Игра завершена! Ваш результат: {this.state.clicks} кликов!
                    </div>
                </Popup>
            </div>
        );
    }
}

export default App;
