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
import { isEmpty } from "lodash";
import { mapOrder } from "utilities/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "utilities/drapDrop";
import { createNewColumn, fetchBoardDetails } from "actions/ApiCall/index";

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
    const boardId = "62d552182419a1d3924afd66";
    fetchBoardDetails(boardId).then((board) => {
      setBoard(board);
      //sort column theo columnOrder and sort card theo cardOrder
      setColumns(mapOrder(board.columns, board.columnOrder, "_id"));
    });
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
    console.log({ dropResult });
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;

    console.log({ newBoard });

    setColumns(newColumns);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];

      let currentColumns = newColumns.find((c) => c._id === columnId);
      currentColumns.cards = applyDrag(currentColumns.cards, dropResult);
      currentColumns.cardOrder = currentColumns.cards.map((i) => i._id);
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
      title: newColumnTitle.trim(),
      boardId: board._id,
    };

    createNewColumn(newColumnToAdd).then((column) => {
      let newColumns = [...columns];
      newColumns.push(column);

      let newBoard = { ...board };
      newBoard.columnOrder = newColumns.map((c) => c._id);
      newBoard.columns = newColumns;

      console.log({ newBoard });

      setColumns(newColumns);
      setBoard(newBoard);
      setNewColumnTitle("");

      toggleOpenNewColumnForm();
    });
  };

  const onUpDateColumnState = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate._id;

    let newColumns = [...columns];
    const columnIndexToUpdate = newColumns.findIndex(
      (i) => i._id === columnIdToUpdate
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
    newBoard.columnOrder = newColumns.map((c) => c._id);
    newBoard.columns = newColumns;

    // console.log(newBoard);

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
                onUpDateColumnState={onUpDateColumnState}
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
