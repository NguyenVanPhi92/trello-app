import Column from "components/Column/Column";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Container as BootstrapContainer,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import "./BoardContent.scss";
import { initialData } from "actions/initalData";
import { isEmpty } from "lodash";
import { mapOrder } from "utilities/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "utilities/draoDrop";

const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const onNewColumnTitleChange = useCallback(
    (e) => setNewColumnTitle(e.target.value),
    []
  );

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm((state) => !state);
  };

  const newColumnInputRef = useRef(null);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === "board-1"
    );

    if (boardFromDB) {
      setBoard(boardFromDB);

      //sort column
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, "id"));
    }
  }, []);

  // focus thẻ input
  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [openNewColumnForm]);

  if (isEmpty(board)) {
    return (
      <div className="not-found" style={{ padding: "10px", color: "white" }}>
        Board not found!
      </div>
    );
  }

  //handle
  const onColumnDrop = (dropResult) => {
    console.log(dropResult);
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    console.log(newBoard);

    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];

      let currentColumns = newColumns.find((c) => c.id === columnId);
      currentColumns.cards = applyDrag(currentColumns.cards, dropResult);
      currentColumns.cardOrder = currentColumns.cards.map((i) => i.id);
      // console.log(currentColumns);

      setColumns(newColumns);
    }
  };

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substring(2, 5), //5 random character
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: [],
    };

    let newColumns = [...columns];
    newColumns.push(newColumnToAdd);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    console.log(newBoard);

    setColumns(newColumns);
    setBoard(newBoard);
    setNewColumnTitle("");

    toggleOpenNewColumnForm();
  };

  const onUpDateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id;

    let newColumns = [...columns];
    const columnIndexToUpdate = newColumns.findIndex(
      (i) => i.id === columnIdToUpdate
    );

    if (newColumnToUpdate._destroy) {
      // remove column
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      //update or add new column info
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
      // console.log(newColumnToUpdate);
    }

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    console.log(newBoard);

    setColumns(newColumns);
    setBoard(newBoard);
  };

  return (
    <>
      <div className="board-content">
        <Container
          orientation="horizontal"
          onDrop={onColumnDrop} // lấy dữ liệu khi di chuyển board or card
          getChildPayload={(index) => columns[index]}
          dragHandleSelector=".column-drag-handle"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "column-drop-preview",
          }}
        >
          {columns?.map((column, index) => (
            <Draggable key={index}>
              <Column
                column={column}
                onCardDrop={onCardDrop}
                onUpDateColumn={onUpDateColumn}
              />
            </Draggable>
          ))}
        </Container>

        <BootstrapContainer className="trello-container">
          {!openNewColumnForm && (
            <Row>
              <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
                <i className="fa fa-plus icon" /> Add another column
              </Col>
            </Row>
          )}

          {openNewColumnForm && (
            <Row>
              <Col className="enter-new-column">
                <Form.Control
                  className="input-enter-new-column"
                  type="text"
                  size="sm"
                  placeholder="Enter column title..."
                  ref={newColumnInputRef}
                  value={newColumnTitle}
                  onChange={onNewColumnTitleChange}
                  onKeyDown={(event) => event.key === "Enter" && addNewColumn()}
                />
                <Button variant="success" size="sm" onClick={addNewColumn}>
                  Add column
                </Button>
                <span className="cancel-icon" onClick={toggleOpenNewColumnForm}>
                  <i className="fa fa-trash icon" />
                </span>
              </Col>
            </Row>
          )}
        </BootstrapContainer>
      </div>
    </>
  );
};

export default BoardContent;
