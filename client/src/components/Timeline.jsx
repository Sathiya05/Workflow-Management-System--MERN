function Timeline() {

  const steps = [

    "Planning",
    "Design",
    "Development",
    "Testing",
    "Deployment",

  ];

  return (

    <div className="bg-white p-8 rounded-3xl shadow-md">

      <h2 className="text-2xl font-bold text-gray-800">

        Project Timeline

      </h2>

      <div className="flex flex-wrap items-center gap-5 mt-10">

        {

          steps.map((step, index) => (

            <div
              key={index}
              className="flex items-center gap-5"
            >

              <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl">

                {step}

              </div>

              {

                index !== steps.length - 1 && (

                  <div className="w-10 h-1 bg-blue-300 rounded-full">

                  </div>

                )

              }

            </div>

          ))

        }

      </div>

    </div>

  );

}

export default Timeline;