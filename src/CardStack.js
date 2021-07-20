import Card from "./Card";
import Axios from "axios";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import "./CardStack.css";

const CardStack = () => {
    const [cards, setCards] = useState([]);
    const [deckId, setDeckId] = useState(null);
    const [cardsRemaining, setCardsRemaining] = useState(0);
    const [isAutoDrawing, setIsAutoDrawing] = useState(false);
    const drawInterval = useRef();

    const getNewDeck = async () => {
        const res = await Axios.get(`http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
        setDeckId(res.data.deck_id);
        setCardsRemaining(res.data.remaining);
    }

    const drawCard = async () => {
        if (cardsRemaining < 1) {
            alert("No more cards left!");
            return;
        }
        try {
            const res = await Axios.get(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            if(res.data.success){
                const cardData = res.data.cards[0];
                cardData.key = uuid();
                setCardsRemaining(res.data.remaining);
                setCards(currentCards => [...currentCards, cardData]);
            }
        }catch(err){
            console.error(err);
        }
    };

    const toggleAutoDraw = () => {
        setIsAutoDrawing(() => !isAutoDrawing);
    };

    useEffect(() => {
        if (isAutoDrawing) {
            drawInterval.current = setInterval(drawCard, 250);
        } else {
            clearInterval(drawInterval.current);
        }
    }, [isAutoDrawing]);

    useEffect(() => {
        getNewDeck();
    }, []);

    return (
        <>
            {cardsRemaining < 1 && <div className="error">There are no cards left!</div>}
            {deckId && <button onClick={drawCard}>Draw a Card</button>}
            {deckId && <button onClick={toggleAutoDraw}>{isAutoDrawing ? "Stop" : "Start"} Autodrawing</button>}
            <div className="card-stack" style={{ paddingTop: "5rem" }}>
                {cards.map(card => <Card cardData={card} key={card.key} />)}
            </div>
        </>
    );
};

export default CardStack;