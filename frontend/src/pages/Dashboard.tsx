import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  HiUsers,
  HiShoppingBag,
  HiShoppingCart,
  HiCash,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCreditCard,
} from "react-icons/hi";


const allStatCards = [
  {
    type: "primary",
    title: "Total Customers",
    value: "4,425",
    icon: <HiUsers size={28} />,
    color: "bg-purple-500",
  },
  {
    type: "primary",
    title: "Total Products",
    value: "5,230",
    icon: <HiShoppingBag size={28} />,
    color: "bg-green-500",
  },
  {
    type: "primary",
    title: "Total Orders",
    value: "1,024",
    icon: <HiShoppingCart size={28} />,
    color: "bg-blue-500",
  },
  {
    type: "primary",
    title: "Total Revenue",
    value: "$89,402",
    icon: <HiCash size={28} />,
    color: "bg-red-500",
  },
  {
    title: "Revenue This Month",
    value: "$12,650",
    icon: <HiCash size={28} />, 
    color: "bg-blue-500",
  },
  {
    title: "Pending Orders",
    value: "78",
    icon: <HiOutlineClock size={28} />,
    color: "bg-yellow-500",
  },
  {
    title: "Completed Orders",
    value: "946",
    icon: <HiOutlineCheckCircle size={28} />,
    color: "bg-green-500", 
  },
  {
    title: "Pending Payments",
    value: "31",
    icon: <HiOutlineCreditCard size={28} />,
    color: "bg-red-500", 
  },
];

const productSales = [
  {
    no: 1,
    name: "Tomatoes",
    status: "Active",
    sold: 5,
    views: 320,
    img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=40&h=40",
  },
  {
    no: 2,
    name: "Bananas",
    status: "Active",
    sold: 6,
    views: 150,
    img: "https://images.unsplash.com/photo-1574226516831-e1dff420e12c?auto=format&fit=crop&w=40&h=40",
  },
  {
    no: 3,
    name: "Carrots",
    status: "Active",
    sold: 4,
    views: 250,
    img: "https://images.unsplash.com/photo-1582515073490-3998137d7b1c?auto=format&fit=crop&w=40&h=40",
  },
  {
    no: 4,
    name: "Bell Peppers",
    status: "Active",
    sold: 9,
    views: 160,
    img: "https://images.unsplash.com/photo-1592928301233-bce7a7c4b4cb?auto=format&fit=crop&w=40&h=40",
  },
];


const dailyOrdersData = [
  { name: "M", Orders: 12, Views: 4000 },
  { name: "T", Orders: 30, Views: 5000 },
  { name: "W", Orders: 20, Views: 3000 },
  { name: "T", Orders: 10, Views: 2000 },
  { name: "F", Orders: 40, Views: 5000 },
  { name: "S", Orders: 30, Views: 6000 },
];

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {allStatCards.map((card, index) => (
          <div
            key={index}
            className="bg-[#f7f7f7] p-6 rounded-xl shadow-md flex items-center gap-6"
          >
            <div className={`p-4 rounded-full text-white ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-[#144a31] text-lg font-bold">{card.title}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#f7f7f7] p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Product Sales</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#144a31]">
                <th className="pb-3">No</th>
                <th className="pb-3">Product</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Sold</th>
                <th className="pb-3">Views</th>
              </tr>
            </thead>
            <tbody>
              {productSales.map((product) => (
                <tr
                  key={product.no}
                  className="text-xl border-t border-gray-200 hover:bg-[#387c403d]"
                >
                  <td className="py-4">{product.no}</td>
                  <td className="py-4 flex items-center gap-3">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    {product.name}
                  </td>
                  <td className="py-4">
                    <span className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-sm">
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4">{product.sold}</td>
                  <td className="py-4">{product.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#f7f7f7] p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Daily Orders & Views</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={dailyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Orders"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Views"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
