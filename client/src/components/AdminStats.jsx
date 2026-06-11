function AdminStats() {

  const stats = [

    {
      title: "Total Employees",
      value: "17",
    },

    {
      title: "Active Projects",
      value: "15",
    },

    {
      title: "Tasks Completed",
      value: "10",
    },

    {
      title: "Monthly Growth",
      value: "+18%",
    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      {

        stats.map((item, index) => (

          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-md"
          >

            <p className="text-gray-500">

              {item.title}

            </p>

            <h2 className="text-5xl font-bold text-gray-800 mt-4">

              {item.value}

            </h2>

          </div>

        ))

      }

    </div>

  );

}

export default AdminStats;