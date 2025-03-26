const About = () => {
    return (
        <section className="bg-black px-6 py-16 text-white md:px-16" id="about">
            <div className="mx-auto grid h-auto max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-2">
                {/* Left Side - Experience & UI/UX Card */}
                <div className="relative flex h-full flex-col gap-6 rounded-[20px] transition-all duration-100 hover:shadow-[0px_0px_15px_#ff014f]">
                    <div className="flex h-full flex-col items-center justify-center rounded-[20px] border border-white/5 bg-[#161616]/30 p-[64px_80px] shadow-[15px_26.023px_50px_rgba(253,196,72,0.04)] backdrop-blur-[35px]">
                        <h2 className="text-6xl font-bold">5+</h2>
                        <p className="text-3xl font-semibold">Years Of Experience</p>
                    </div>
                </div>

                {/* Right Side - About Me */}
                <div>
                    <p className="color-pink text-lg font-bold uppercase">About Me</p>
                    <h1 className="mt-2 text-5xl leading-tight font-bold md:text-4xl">
                        Boost Business Strategic <br /> Solutions with Me
                    </h1>
                    <p className="mt-4 text-lg">
                        🚀 Passionate Full-Stack & E-Commerce Developer with over 5 years of experience building scalable and high-performance
                        applications. I specialize in Magento, MERN stack, and Next.js, with deep expertise in React Native and Expo for mobile app
                        development. 💡 Apart from web and mobile development, I am also exploring Machine Learning for intelligent automation in
                        e-commerce and recommendation engines. <br /> <br />
                        🔹 Key Achievements: Certified Adobe Commerce Developer - Deep Magento expertise Led a team that launched 5+ high-traffic
                        e-commerce platforms Developed and optimized React Native apps with Expo Built scalable MERN & Next.js applications with
                        modern APIs 🔍 I am open to discussing collaborations, freelance projects, and leadership roles in software development,
                        e-commerce, and AI.{' '}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
