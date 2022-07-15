import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import HTMLReactParser from "html-react-parser";
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from "utilities/contans";

function ConfirmModal(props) {
  const { title, content, show, onActions } = props;

  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      onHide={() => onActions("close")}
    >
      <Modal.Header closeButton>
        <Modal.Title className="h5">{HTMLReactParser(title)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{HTMLReactParser(content)}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => onActions(MODAL_ACTION_CLOSE)}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => onActions(MODAL_ACTION_CONFIRM)}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
