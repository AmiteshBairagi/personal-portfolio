import { hobbiesData } from "./hobbiesData";

export default function HobbiesMasonry() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-cyan-400 mb-10 text-center">
        My Hobbies
      </h2>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {hobbiesData.map((hobby, i) => (
          <div
            key={i}
            className="break-inside-avoid bg-gradient-to-br from-cyan-900/20 to-cyan-700/10 border border-cyan-500/10 rounded-2xl p-5 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition transform"
          >
            <div className="text-3xl mb-2">{hobby.icon}</div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-1">
              {hobby.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {hobby.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
