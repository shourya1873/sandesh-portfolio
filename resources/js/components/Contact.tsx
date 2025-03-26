import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;


const Contact = () => {

    const [submitted, setSubmitted] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            subject: '',
            message: '',
        }
    });

    const onSubmit = async (data: ContactFormValues) => {
        console.log('Form submitted:', data);
        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_URL}/contact`, data);
            if(res.status === 200) {
                toast.success("Contact form submittted successfully")
            }
            setSubmitted(true);
        } catch (err) {
            toast.error("Something went wrong")
            setSubmitted(false);
            console.log(err);
        }
        form.reset();
    };

    return (
        <section className={'bg-black flex justify-center pt-10'}>
            <div className={'max-w-[1275px] w-full h-[776px] bg-[#141414] p-10'}>
                <h3 className={'uppercase text-5xl text-center font-bold'}>Get in touch</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full flex flex-col items-center">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className={'w-full sm:w-1/2'}>
                                    <FormLabel className={'text-lg'}>Name</FormLabel>
                                    <FormControl>
                                        <Input className={'h-[50px]'} placeholder="name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className={'w-full sm:w-1/2'}>
                                    <FormLabel className={'text-lg'}>Phone</FormLabel>
                                    <FormControl>
                                        <Input className={'h-[50px]'} placeholder="phone" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className={'w-full sm:w-1/2'}>
                                    <FormLabel className={'text-lg'}>Email</FormLabel>
                                    <FormControl>
                                        <Input className={'h-[50px]'} placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem className={'w-full sm:w-1/2'}>
                                    <FormLabel className={'text-lg'}>Subject</FormLabel>
                                    <FormControl>
                                        <Input className={'h-[50px]'} placeholder="subject" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem className={'w-full sm:w-1/2'}>
                                    <FormLabel className={'text-lg'}>Message</FormLabel>
                                    <FormControl>
                                        <Textarea className={'h-[100px]'} rows={5} placeholder="message" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className={'w-full sm:w-1/2 cursor-pointer'}>Submit</Button>
                    </form>
                </Form>
            </div>
        </section>
    );
};

export default Contact;
