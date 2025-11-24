export default function KPIcard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded shadow hover:shadow-lg">
      <span className="text-sm text-gray-500">{title}</span>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}
