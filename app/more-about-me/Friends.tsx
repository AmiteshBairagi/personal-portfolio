"use client";
import Image from "next/image";

export default function Friends() {
  const friendGroups = [
    {
      title: "Childhood Friends",
      friends: [
        { name: "Rohit", img: "/friends/rohit.jpg" },
        { name: "Karan", img: "/friends/karan.jpg" },
        { name: "Saurabh", img: "/friends/saurabh.jpg" },
      ],
    },
    {
      title: "School Friends",
      friends: [
        { name: "Ankit", img: "/friends/ankit.jpg" },
        { name: "Pooja", img: "/friends/pooja.jpg" },
        { name: "Ritika", img: "/friends/ritika.jpg" },
      ],
    },
    {
      title: "College Friends",
      friends: [
        { name: "Vivek", img: "/friends/vivek.jpg" },
        { name: "Sneha", img: "/friends/sneha.jpg" },
        { name: "Rahul", img: "/friends/rahul.jpg" },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-semibold text-cyan-400">My Friends</h2>
      {friendGroups.map((group, i) => (
        <div key={i}>
          <h3 className="text-xl font-semibold text-cyan-300 mb-4">
            {group.title}
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {group.friends.map((f, j) => (
              <div
                key={j}
                className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-cyan-500 transition"
              >
                <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={f.img}
                    alt={f.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-center text-slate-200 font-medium">
                  {f.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
