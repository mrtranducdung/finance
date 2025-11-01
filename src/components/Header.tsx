interface HeaderProps {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header = ({ currentMonth, setCurrentMonth, onExport, onImport }: HeaderProps) => {
  return (
    <div className="text-center py-6">
      <h1 className="text-3xl font-bold text-white mb-2">Finance Tracker</h1>
      <input
        type="month"
        value={currentMonth}
        onChange={(e) => setCurrentMonth(e.target.value)}
        className="glass rounded-lg px-4 py-2 text-white outline-none border-none bg-transparent"
      />

      <div className="flex gap-2 mt-3 justify-center">
        <button onClick={onExport} className="btn btn-export text-sm">
          📥 Sao lưu dữ liệu
        </button>
        <label className="btn btn-import text-sm cursor-pointer">
          📤 Khôi phục dữ liệu
          <input 
            type="file" 
            accept=".json" 
            onChange={onImport} 
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default Header;