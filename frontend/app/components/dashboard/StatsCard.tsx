/* type StatsCardProps = {
  title: string;
  value: number | string;
  color?: string;
};

export default function StatsCard({ title, value, color = "blue" }: StatsCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow text-center border hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className={`text-3xl font-bold text-${color}-600 mt-1`}>{value}</h3>
    </div>
  );
}
 */
import { ReactNode } from "react";

type StatsCardProps = {
  title: string;
  value: number | string;
  color: string;
  icon: ReactNode;
};

export default function StatsCard({ title, value, color, icon }: StatsCardProps) {
  return (
    <div
      className={`flex items-center justify-between bg-${color}-50 border-l-4 border-${color}-600 rounded-xl p-5 shadow-sm hover:shadow-md transition`}
    >
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 bg-${color}-600 text-white rounded-full`}>{icon}</div>
    </div>
  );
}
