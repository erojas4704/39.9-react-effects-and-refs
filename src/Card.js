import { useState } from "react";
import "./Card.css";

const Card = ({ cardData }) => {
    const [rotation, setRotation] = useState(Math.random() * 360);
    
    if (!cardData) return <div>Loading...</div>
    const { image, code } = cardData;

    return (
        <div className="card" style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "center center" }}>
            <img src={image} alt={code} />
        </div >
    );
};

export default Card;