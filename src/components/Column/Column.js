import Card from "components/Card/Card";
import ConfirmModal from "components/Common/ConfirmModal";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import { Container, Draggable } from "react-smooth-dnd";
import { mapOrder } from "utilities/sorts";
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from "utilities/constants";
import "./column.scss";
import {
  saveContentAfterPressEnter,
  selectAllInlineText,
} from "utilities/contentEditTable";
import { cloneDeep } from "lodash";

const Column = (props) => {
  const { column, onCardDrop, onUpDateColumn } = props;
  const cards = mapOrder(column.cards, column.cardOrder, "_id");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const [columnTitle, setColumnTile] = useState("");
  const handelColumnTitleChange = useCallback(
    (e) => setColumnTile(e.target.value),
    []
  );
  const [newCardTitle, setNewCardTitle] = useState("");
  const handleNewCardTitle = useCallback(
    (e) => setNewCardTitle(e.target.value),
    []
  );
  const newCardTextareaRef = useRef(null);

  useEffect(() => {
    setColumnTile(column.title);
  }, [column.title]);

  // focus thẻ input
  useEffect(() => {
    if (newCardTextareaRef && newCardTextareaRef.current) {
      newCardTextareaRef.current.focus();
      newCardTextareaRef.current.select();
    }
  }, [openNewCardForm]);

  //handle

  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm((state) => !state);
  };
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

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardTextareaRef.current.focus();
      return;
    }
    const newCardToAdd = {
      id: Math.random().toString(36).substring(2, 5), //5 random character
      boardId: column.boardId,
      columnId: column._id,
      title: newCardTitle.trim(),
      cover: null,
    };

    // console.log(column);
    let newColumn = cloneDeep(column); // clone lại column use cloneDeep
    newColumn.cards.push(newCardToAdd); // add new card mới
    newColumn.cardOrder.push(newCardToAdd._id); // add id of card vào
    // console.log(newColumn);

    onUpDateColumn(newColumn);
    setNewCardTitle("");
    toggleOpenNewCardForm();
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
              <Dropdown.Item onClick={toggleOpenNewCardForm}>
                Add card...
              </Dropdown.Item>
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
          onDrop={(dropResult) => onCardDrop(column._id, dropResult)}
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

        {openNewCardForm && (
          <div className="add-new-card-area">
            <Form.Control
              className="textarea-enter-new-card"
              type="text"
              size="sm"
              as="textarea"
              rows="3"
              placeholder="Enter a title for this card..."
              ref={newCardTextareaRef}
              onChange={handleNewCardTitle}
              value={newCardTitle}
              onKeyDown={(event) => event.key === "Enter" && addNewCard()}
            />
          </div>
        )}
      </div>
      <footer>
        {openNewCardForm && (
          <div className="add-new-card-actions">
            <Button variant="success" size="sm" onClick={addNewCard}>
              Add card
            </Button>
            <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
              <i className="fa fa-trash icon" />
            </span>
          </div>
        )}
        {!openNewCardForm && (
          <div className="footer-actions" onClick={toggleOpenNewCardForm}>
            <i className="fa fa-plus icon" /> Add another
          </div>
        )}
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
