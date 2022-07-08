import React from "react";
import "./card.scss";

const Card = (props) => {
  const { card } = props;
  return (
    <li className="card-item">
      {card?.cover && (
        <img src={card?.cover} className="card-cover" alt="patrick_dev" />
      )}
      {card?.title}
    </li>
  );
};

export default Card;
