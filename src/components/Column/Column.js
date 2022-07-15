import Card from "components/Card/Card";
import ConfirmModal from "components/Common/ConfirmModal";
import React, { useCallback, useEffect, useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { Container, Draggable } from "react-smooth-dnd";
import { mapOrder } from "utilities/sorts";
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from "utilities/contans";
import "./column.scss";
import {
  saveContentAfterPressEnter,
  selectAllInlineText,
} from "utilities/contentEditTable";

const Column = (props) => {
  const { column, onCardDrop, onUpDateColumn } = props;
  const cards = mapOrder(column.cards, column.cardOrder, "id");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [columnTitle, setColumnTile] = useState("");
  const handelColumnTitleChange = useCallback(
    (e) => setColumnTile(e.target.value),
    []
  );

  useEffect(() => {
    setColumnTile(column.title);
  }, [column.title]);

  //handle
  const toggleConfirmModalAction = () => setShowConfirmModal(!showConfirmModal);

  const onConfirmModalAction = (type) => {
    console.log(type);
    if (type === MODAL_ACTION_CLOSE) {
      //do something..
    }

    // delete column
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true,
      };
      onUpDateColumn(newColumn);
    }
    toggleConfirmModalAction();
  };

  // update title column
  const handelColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle,
    };
    onUpDateColumn(newColumn);
  };

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            className="trello-content-edit-table"
            type="text"
            size="sm"
            value={columnTitle}
            spellCheck="false"
            onClick={selectAllInlineText}
            onChange={handelColumnTitleChange}
            onBlur={handelColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              size="sm"
              className="dropdown-btn"
            />

            <Dropdown.Menu>
              <Dropdown.Item>Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleConfirmModalAction}>
                Remove...
              </Dropdown.Item>
              <Dropdown.Item>
                Move all cards in this column (beta)...
              </Dropdown.Item>
              <Dropdown.Item>
                Archive all cards in this column (beta)...
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="patrickDev-columns"
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "cards-drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
      </div>
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon" /> Add another
        </div>
      </footer>

      {/* modal */}
      <ConfirmModal
        show={showConfirmModal}
        onActions={onConfirmModalAction}
        title="Remove column"
        content={`Are you sure you want to remove <strong>${column.title}</strong>! <br/> All related card also be remove!`}
      />
    </div>
  );
};

export default Column;
