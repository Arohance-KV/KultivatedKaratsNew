import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactUs = () => {
  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    subject: z.string().optional(),
    message: z.string().min(10, {
      message: 'Message must be at least 10 characters.',
    }),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log('Validation Errors on Submit:', errors);
    console.log('Form submitted:', data);
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}email/send-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ email: { from: import.meta.env.VITE_TO_EMAIL, to: [ import.meta.env.VITE_TO_EMAIL, "maheksampat@gmail.com" ], subject: `Solitare enquiry from : ${data?.email}`, html: `email:${data?.email}<br />Message: ${data?.message}` }})
        });
    
        const responseData = await response.json();
        console.log(responseData);

    } catch (error) {
        console.log(error);
    }
  };

  return (
    <section className="mt-56 min-h-screen w-full flex">
      <div className="w-full !inria-serif-regular text-[#E1C6B3]  flex-1 mx-auto p-6">
        <div className="mb-6 inria-serif-regular">
          <h2 className="text-2xl font-semibold mb-2">Connect with us.</h2>
          <p className="text-sm text-gray-600">
            Have questions or are you ready to place an order? Our dedicated
            customer support team is just a click away. Feel free to reach out via
            our website or contact details provided below.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 inria-serif-regular">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <input
              id="name"
              placeholder="..."
              {...register('name')}
              className="border rounded p-2 w-full text-black" // Added basic styling
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              placeholder="m@example.com"
              {...register('email')}
              className="border rounded p-2 w-full text-black" // Added basic styling
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <input
              id="subject"
              placeholder="..."
              {...register('subject')}
              className="border rounded p-2 w-full text-black" // Added basic styling
            />
            {errors.subject && (
              <p className="text-red-500 text-xs">{errors.subject?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              placeholder="..."
              className="resize-none border rounded p-2 w-full h-24 text-black" // Added basic styling
              {...register('message')}
            />
            {errors.message && (
              <p className="text-red-500 text-xs">{errors.message?.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full bg-gray-900 text-white">
            Send Message
          </Button>
        </form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">More Links</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              info@cultivatedkarats.com
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              +91 99014 45209
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Street no 11, Basavanna Temple St, AK Colony, Adugodi, Bengaluru,
              Karnataka 560030
            </div>
          </div>
        </div>
      </div>
      <div className='flex-1'>
        <img src={'/contact-us-banner.png'} alt="Contact-us-banner" className='bg-white' />
      </div>
    </section>
  );
};