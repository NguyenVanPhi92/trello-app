import Column from "components/Column/Column";
import React, { useEffect, useState } from "react";
import "./BoardContent.scss";
import { initialData } from "actions/initalData";
import { isEmpty } from "lodash";
import { mapOrder } from "utilities/sorts";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "utilities/draoDrop";

const BoardContent = () => {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

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

  if (isEmpty(board)) {
    return (
      <div className="not-found" style={{ padding: "10px", color: "white" }}>
        Board not found!
      </div>
    );
  }

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
              <Column column={column} onCardDrop={onCardDrop} />
            </Draggable>
          ))}
        </Container>
        <div className="add-new-column">
          <i className="fa fa-plus icon" /> Add another column
        </div>
      </div>
    </>
  );
};

export default BoardContent;
