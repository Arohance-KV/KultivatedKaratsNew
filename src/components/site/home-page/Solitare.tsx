import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { cn } from '../../../lib/utils';
import { gsap } from "gsap";
import { getSolitareHtml } from '@/utils/utilityFunctions';
import { Loader2 } from 'lucide-react';

const shapeOptions = [
    {
      value: 'Round',
      label: 'Round',
      imgSrc: '/solitare-shapes/gemstone_10582460.png',
      gradient: 'from-[#C8C8C8] to-[#E9E9E9]',
    },
    {
      value: 'Pear',
      label: 'Pear',
      imgSrc: '/solitare-shapes/pear.png',
      gradient: 'from-[#C8C8C8] to-[#E9E9E9]',
    },
    {
      value: 'Heart',
      label: 'Heart',
      imgSrc: '/solitare-shapes/heart.png',
      gradient: 'from-[#C8C8C8] to-[#E9E9E9]',
    },
    {
      value: 'Princess',
      label: 'Princess',
      imgSrc: '/solitare-shapes/princess.png',
      gradient: 'from-[#C8C8C8] to-[#E9E9E9]',
    },
    {
      value: 'Marquise',
      label: 'Marquise',
      imgSrc: '/solitare-shapes/marquise.png',
      gradient: 'from-[#C8C8C8] to-[#E9E9E9]',
    },
    {
      value: 'Oval',
      label: 'Oval',
      imgSrc: '/solitare-shapes/oval.png',
      gradient: 'from-[#C8C8C8] to-[#E9E9E9]',
    },
    {
      value: 'Emerald',
      label: 'Emerald',
      imgSrc: '/solitare-shapes/emerald.png',
      gradient: 'from-[#C8C8C8] to-[#E9E9E9]',
    },
    {
      value: 'Radiant',
      label: 'Radiant',
      imgSrc: '/solitare-shapes/radiant.png',
      gradient: 'from-[#C8C8C8] to-[#E9E9E9]',
    },
    {
      value: 'Cushion',
      label: 'Cushion',
      imgSrc: '/solitare-shapes/cushion.png',
      gradient: 'from-[#C8C8C8] to-[#E9E9E9]',
    },
];
  
enum Shapes {
    Round = 'Round',
    Pear = 'Pear',
    Heart = 'Heart',
    Princess = 'Princess',
    Marquise = 'Marquise',
    Oval = 'Oval',
    Emerald = 'Emerald',
    Radiant = 'Radiant',
    Cushion = 'Cushion',
};
  
enum Colour {
    D = 'D',
    E = 'E',
    F = 'F',
};
  

export const formSchema = z.object({
    email: z.string().email('Enter a valid email address!').min(0), // Add email validation
    shape: z.nativeEnum(Shapes, {
      required_error: 'Shape is required!',
    }),
    carat: z.coerce.number({
      required_error: 'Carat is required!',
      invalid_type_error: 'Enter a valid number!',
    }),
    colour: z.nativeEnum(Colour, {
      required_error: 'Colour is required!',
    }),
    goldWeight: z.coerce.number({
      required_error: 'Gold weight is required!',
      invalid_type_error: 'Enter a valid number!',
    }),
    phoneNo: z.coerce
      .number({
        required_error: 'Phone number is required!',
        invalid_type_error: 'Enter a valid number!',
      })
      .refine(
        (value) => {
          // Ensure the phone number contains only digits and is of valid length
          const phoneRegex = /^[0-9]{10}$/;
          return phoneRegex.test(value + '');
        },
        {
          message: 'Invalid phone number. It must only contain 10 digits!.',
        }
      ),
    multiDiamonds: z.boolean().default(false),
    noOfDiamonds: z.coerce
      .number()
      .min(2, { message: 'No of stones cannot be less than 2!' })
      .optional(),
    additionalRequirements: z.string().optional(),
});
  
export const UIsideBar = ({ side } : { side : "left" | "right" }) => {

    useEffect(() => {
        gsap.to("#third", {
            width: "25px",
            duration: 0.33,
            onComplete: () => {
                gsap.to("#second", {
                    width: "35px",
                    duration: 0.33,
                    // delay: -0.15,
                    onComplete: () => {
                        gsap.to("#first", {
                            width: "45px",
                            duration: 0.33,
                            // delay: -0.15,
                            onComplete: () => {
                                gsap.to("#solitare-main", {
                                    opacity: "100%",
                                    duration: 1.5
                                });
                            }
                        });
                    },
                });
            }
        });
    }, []);

    return (
        <>
            <div id='first' className={cn('-top-[50px] hidden sm:block absolute bottom-0 bg-[#BFA6A173] rounded-tr-full z-[5]', side == "left" ? "left-0 " : "right-0 -scale-x-[1]")} />
            <div id='second' className={cn('-top-[50px] bottom-0 absolute hidden sm:block bg-[#BFA6A1A6] rounded-tr-full z-[10]', side == "left" ? "left-0" : "right-0 -scale-x-[1]")} />
            <div id='third' className={cn('-top-[50px] bottom-0 absolute bg-[#BFA6A1] hidden sm:block rounded-tr-full z-[15]', side == "left" ? "left-0" : "right-0 -scale-x-[1]")} />
        </>
    );
}

export const Solitare = () => {

    const [showNoOfDiamonds, setShowNoOfDiamonds] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          shape: Shapes.Round, // Default value
        },
    });
    
    const [ isSubmitButtonLoading, setIsSubmitButtonLoading ] = useState(false);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        setIsSubmitButtonLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}email/send-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ email: { from: import.meta.env.VITE_TO_EMAIL, to: [ import.meta.env.VITE_TO_EMAIL, "maheksampat@gmail.com" ], subject: `Solitare enquiry from : ${values?.email}`, html: getSolitareHtml(values) }})
            });
        
            const data = await response.json();
            console.log(data);

        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitButtonLoading(false);
        }
    };

    return (
        <div className='w-full relative text-[#E1C6B3]! pb-14'>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div id='solitare-main' className="sm:bg-[#E1C6B3] opacity-0 sm:mt-56 mt-0 gap-4 flex flex-col items-center sm:w-[80%] w-full justify-self-center rounded-tr-[100px] sm:aspect-video">
                <div className="w-full mt-14 text-center text-[#E1C6B3] sm:text-white ">
                    <p className="inria-serif-regular text-3xl">
                        Create your own solitare                    
                    </p>
                </div>
                <Form {...form}>
                    <form className="flex-1 inria-serif-regular w-full p-[5%] sm:grid sm:grid-cols-3 flex flex-col sm:grid-rows-3 sm:text-white text-[#E1C6B3] gap-8" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="col-span-2  row-span-2">
                            <FormField
                                control={form.control}
                                name="shape"
                                render={({ field }) => (
                                <FormItem className='h-full'>
                                    <FormControl>
                                    <div id="shape" className="flex h-full flex-col">
                                        {/* <p>Select a shape</p> */}
                                        <RadioGroup
                                            {...field}
                                            value={field.value}
                                            onValueChange={(value) => field.onChange(value)} // Correctly updates form value
                                            className="grid sm:grid-cols-3 grid-cols-2 sm:gap-8 items-center h-[100%]"
                                        >
                                            {shapeOptions.map((shape) => (
                                                <Label
                                                    key={shape.value}
                                                    // className=""
                                                    className={`flex text-[#E1C6B3] h-full bg-white inria-serif-regular items-center sm:space-x-2 group relative cursor-pointer rounded-lg pl-5 shadow-md transition focus:outline-none data-[checked]:ring-1 data-[checked]:ring-[#E1C6B3] my-2 sm:max-w-sm text-[6px] sm:text-[16px]`}
                                                >
                                                    <RadioGroupItem
                                                        value={shape.value}
                                                        id={`r-${shape.value}`}
                                                        className=''
                                                    />
                                                    <Label
                                                        htmlFor={`r-${shape.value}`}
                                                        className="flex py-4 pr-5 items-center gap-1 rounded-r-[inherit] w-full cursor-pointer"
                                                    >
                                                        <img
                                                            src={shape.imgSrc}
                                                            alt={shape.label}
                                                            className="sm:w-[20px] w-[10px]"
                                                        />
                                                        {shape.label}
                                                    </Label>
                                                </Label>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-2 row-span-1 text-[#E1C6B3] sm:text-white">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className='w-full h-1/2 flex flex-col'>
                                        <FormControl className='w-full h-full'>
                                            <div className='grid grid-cols-4 sm:text-white text-[#E1C6B3]  gap-4 items-center'>
                                                <p className='col-span-1 sm:text-white text-[#E1C6B3]'>Email Address</p>
                                                <Input {...field} className='col-span-3 border-white' placeholder="" type="email" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="additionalRequirements"
                                render={({ field }) => (
                                    <FormItem className="gap-4 space-y-0 items-center grid h-1/2 w-full grid-cols-4">
                                    <FormLabel className="col-span-1">Any Additional requests?</FormLabel>
                                    <FormControl className='col-span-3'>
                                        <Textarea
                                            className="min-h-[73px] resize-none border-white"
                                            placeholder="Type any additional details here."
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="col-span-1 row-span-1">
                            <FormField
                                control={form.control}
                                name="phoneNo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col justify-center h-1/2 items-center w-full">
                                    {/* <FormLabel /> */}
                                        <FormControl>
                                            <div
                                                id="gold-weight"
                                                className="grid grid-cols-4 w-full gap-4 justify-center items-center"
                                            >
                                            <p className='col-span-1 flex justify-center items-center'>Phone number :</p>
                                            <Input {...field} type="number" className="no-spinner col-span-3 border-white" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className='flex justify-center items-center self-center justify-self-center' />
                                        <FormDescription />
                                    </FormItem>
                                )}
                            />
                            <div className='h-1/2 hidden sm:block w-full relative'>
                                <Button disabled={isSubmitButtonLoading} className='bg-transparent absolute hover:text-[#E1C6B3] px-[20%] sm:hover:bg-white hover:bg-[#E1C6B3] right-0 bottom-0 border-white text-white border'>{ isSubmitButtonLoading ? <Loader2 className='w-4 h-4 animate-spin' /> :  `Request a quote`}</Button>
                            </div>
                            <Button disabled={isSubmitButtonLoading} className='bg-transparent block sm:hidden absolute hover:text-[#E1C6B3] px-[20%] sm:hover:bg-white hover:bg-[#E1C6B3] right-5 bottom-5 border-white text-white border'>{ isSubmitButtonLoading ? <Loader2 className='w-4 h-4 animate-spin' /> :  `Request a quote`}</Button>
                        </div>
                        <div className="col-start-3 grid grid-rows-5 row-start-1 col-span-1 row-span-2">
                            <FormField
                                control={form.control}
                                name="colour"
                                render={({ field }) => (
                                <FormItem className="flex flex-col justify-center relative items-center">
                                    <FormControl>
                                    <div
                                        id="colour"
                                        className="grid grid-cols-4 w-full  gap-4"
                                    >
                                        <p className='col-span-1 flex items-center'>colour :</p>
                                        <RadioGroup
                                            // value={field.value}
                                            onValueChange={(value) => field.onChange(value)} // Correctly updates form value
                                            {...field}
                                            className="col-span-3 text-[#E1C6B3] flex justify-between items-center"
                                        >
                                        <Label className="flex rounded-md hover:cursor-pointer h-full py-4 px-2 bg-white justify-center items-center gap-2">
                                            <RadioGroupItem value={Colour.D} id="r1" />
                                            <Label htmlFor="r1">D</Label>
                                        </Label>
                                        <Label className="flex justify-center hover:cursor-pointer items-center gap-2 rounded-md h-full py-4 px-2 bg-white">
                                            <RadioGroupItem value={Colour.E} id="r2" />
                                            <Label htmlFor="r2">E</Label>
                                        </Label>
                                        <Label className="flex justify-center hover:cursor-pointer items-center gap-2 rounded-md h-full py-4 px-2 bg-white">
                                            <RadioGroupItem value={Colour.F} id="r3" />
                                            <Label htmlFor="r3">F</Label>
                                        </Label>
                                        </RadioGroup>
                                    </div>
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage className='' />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="carat"
                                render={({ field }) => (
                                <FormItem className="flex justify-center items-center w-full flex-col">
                                    <FormControl>
                                    <div
                                        id="carat"
                                        className="grid gap-4 grid-cols-4 w-full"
                                    >
                                        <p className='col-span-1 flex items-center'>Carat :</p>
                                        <Input {...field} placeholder="" className='col-span-3 border-white' type="number" />
                                    </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="goldWeight"
                                render={({ field }) => (
                                    <FormItem className="flex justify-center items-center flex-col w-full">
                                        <FormControl>
                                        <div
                                            id="gold-weight"
                                            className="grid gap-4 grid-cols-4 w-full"
                                        >
                                            <p className='col-span-1 flex items-center'>Gold weight</p>
                                            <Input {...field} placeholder="" className='col-span-3 border-white' type="number" />
                                        </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="multiDiamonds"
                                render={({ field }) => (
                                    <FormItem className="flex justify-center flex-col items-center w-full">
                                        <FormControl className=''>
                                                <div
                                                    id="multi-diamonds"
                                                    {...field}
                                                    className="w-full flex justify-between items-center gap-4"
                                                >
                                                    <p>Requirement of multiple stones :</p>
                                                    <Checkbox
                                                        className='!data-[state=checked]:bg-[#E1C6B3] data-[state=checked]:text-[#E1C6B3] border-white'
                                                        // className='border-white'
                                                        checked={field.value}
                                                        onCheckedChange={(checked: boolean) => {
                                                            setShowNoOfDiamonds(checked);
                                                            field.onChange(checked);
                                                        }}
                                                    >
                                                        {/* <Gem className='bg-red-600 w-4 h-4 stroke-yellow-600' /> */}
                                                    </Checkbox>
                                                </div>
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {(
                                <FormField
                                control={form.control}
                                name="noOfDiamonds"
                                render={({ field }) => (
                                    <FormItem className="flex justify-center items-center flex-col w-full">
                                    {/* <FormLabel /> */}
                                    <FormControl>
                                        <div
                                            id="gold-weight"
                                            className="grid grid-cols-4 w-full gap-4"
                                        >
                                        <p className={cn('col-span-1 text-gray-500 flex justify-center items-center gap-4', form.getValues('multiDiamonds') && 'text-white')}>No of stones</p>
                                        <Input
                                            className='col-span-3 border-white'
                                            {...field}
                                            disabled={!showNoOfDiamonds}
                                            type="number"
                                        />
                                        </div>
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            )}
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}