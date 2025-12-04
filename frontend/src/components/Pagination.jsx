export default function Pagination() {
  return (
    <div className="flex justify-center gap-3 py-6">

      <span className="px-3 py-1 bg-black text-white rounded-md">1</span>
      <span className="px-3 py-1 cursor-pointer">2</span>
      <span className="px-3 py-1 cursor-pointer">3</span>
      <span className="px-3 py-1 cursor-pointer">...</span>
      <span className="px-3 py-1 cursor-pointer">67</span>
      <span className="px-3 py-1 cursor-pointer">68</span>

    </div>
  );
}
