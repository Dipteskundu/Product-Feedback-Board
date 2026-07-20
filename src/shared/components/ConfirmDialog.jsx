import Modal from './Modal';
import Button from './Button';
import { COLORS } from '../constants/tokens';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 style={{ margin: '0 0 8px', color: COLORS.ink }}>{title}</h3>
      <p style={{ margin: '0 0 24px', color: COLORS.inkMuted }}>{message}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
