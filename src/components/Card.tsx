import React from 'react';
import {motion} from "motion/react"
import Image from 'next/image';
import {
    Card,
    CardContent,
} from "@/components/ui/card"

const SkillsCard = ({name, image}: {name: string, image: string}) => {
    return (
        <Card className="w-[188px] h-[225px]">
            <CardContent className={'flex flex-col justify-between h-full gap-4'}>
                <Image src={image} alt={name} width={150} height={150} className={name === 'Next.js' || name === 'Pinecone' ? 'mt-14' : ''}/>
                <motion.div className={'text-center'}>{name}</motion.div>
            </CardContent>
        </Card>
    );
};
export default SkillsCard;