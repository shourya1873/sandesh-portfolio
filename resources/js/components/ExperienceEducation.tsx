export default function ExperienceEducation() {
    const experience = [
        { year: 'OCT 2019 - MAR 2025', title: 'FULL STACK DEVELOPER', company: 'CODILAR TECHNOLOGIES' },
        { year: 'MAR 2025 - PRESENT', title: 'SENIOR SOFTWARE ENGINEER', company: 'TECH MAHINDRA' },
    ];

    const education = [{ year: '2015 - 2019', title: 'B.TECH in CSE', school: 'Visveswaraya University' }];

    return (
        <section className="bg-black px-6 py-16 text-white md:px-16">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
                {/* Experience Section */}
                <div>
                    <h2 className="flex items-center gap-2 font-bold text-white md:text-2xl">
                        <span className="text-4xl text-pink-500">🏅</span> <span className="text-4xl">My Experience</span>
                    </h2>
                    <div className="mt-6 flex flex-col gap-6">
                        {experience.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#161616] p-6 shadow-md transition-all duration-300 hover:border-[#ff014f] hover:shadow-[0px_0px_15px_#ff014f]"
                            >
                                <p className="text-xl font-semibold text-pink-500">{item.year}</p>
                                <h3 className="text-2xl leading-[1.14] font-bold">{item.title}</h3>
                                <p className="text-lg text-gray-400">{item.company}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education Section */}
                <div>
                    <h2 className="flex items-center gap-2 font-bold text-white md:text-2xl">
                        <span className="text-4xl text-pink-500">🎓</span> <span className="text-4xl">My Experience</span>
                    </h2>
                    <div className="mt-6 flex flex-col gap-6">
                        {education.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-2 rounded-2xl border border-white/5 bg-[#161616] p-6 shadow-md transition-all duration-300 hover:border-[#ff014f] hover:shadow-[0px_0px_15px_#ff014f]"
                            >
                                <p className="text-xl font-semibold text-pink-500">{item.year}</p>
                                <h3 className="text-2xl leading-[1.14] font-bold">{item.title}</h3>
                                <p className="text-lg text-gray-400">{item.school}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
