import React from "react"
import { motion } from "motion/react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const SkillsCard = ({ name, image }: { name: string; image: string }) => {
    return (
        <Card className="w-full h-auto min-h-[180px] sm:min-h-[200px] lg:min-h-[225px] transition-all duration-300 hover:shadow-lg">
            <CardContent className="flex flex-col justify-center items-center h-full gap-4 p-4 sm:p-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center">
                    <Image
                        src={image}
                        alt={name}
                        width={120}
                        height={120}
                        className={`object-contain ${name === "Next.js" || name === "Pinecone" ? "mt-4" : ""}`}
                    />
                </div>
                <motion.div
                    className="text-center text-sm sm:text-base font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {name}
                </motion.div>
            </CardContent>
        </Card>
    )
}

export default SkillsCard
