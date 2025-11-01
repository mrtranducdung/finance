const DeleteConfirmModal = ({ isOpen, type, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-6 border border-white-20 max-w-sm w-full">
        <h3 className="text-white text-2xl font-bold mb-2">Xác nhận xóa</h3>
        <p className="text-white-70 mb-6">
          Bạn có chắc muốn xóa {type === 'card' ? 'thẻ' : 'khoản chi'} này không?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn btn-cancel flex-1">
            Hủy
          </button>
          <button onClick={onConfirm} className="btn btn-delete flex-1">
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;