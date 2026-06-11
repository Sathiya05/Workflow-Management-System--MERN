import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

function PerformanceCharts() {

  const data = [

    { name: "Completed", value: 80 },
    { name: "Pending", value: 20 },

  ];

  const COLORS = [
    "#2563eb",
    "#dbeafe",
  ];

  return (

    <div className="bg-white p-8 rounded-3xl shadow-md">

      <h2 className="text-2xl font-bold text-gray-800">

        Performance Analytics

      </h2>

      <div className="h-[300px] mt-8">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              innerRadius={80}
              outerRadius={110}
              dataKey="value"
            >

              {

                data.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />

                ))

              }

            </Pie>

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default PerformanceCharts;