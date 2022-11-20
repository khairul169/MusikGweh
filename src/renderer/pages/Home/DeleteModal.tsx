import React from 'react';
import Modal from 'renderer/components/Modal';
import { TrackData } from 'renderer/utils';

type Props = {
  track?: TrackData;
  isOpen: boolean;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
};

const DeleteModal = ({ track, isOpen, onClose, onConfirm }: Props) => {
  return (
    <Modal
      title="Hapus item?"
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onClose}
      onConfirm={onConfirm}
      confirmText="Ya, Hapus"
    >
      <p>{`Apakah anda yakin ingin menghapus ${
        track?.title || 'item ini'
      } ?`}</p>
    </Modal>
  );
};

DeleteModal.defaultProps = {
  track: null,
};

export default React.memo(DeleteModal);
