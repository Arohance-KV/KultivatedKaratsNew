import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getProductPriceDetails } from '@/utils/CalculateTotal';
import { ICartItem, IProduct } from '@/utils/interfaces';

interface RadioCardProps {
  value: string;
  label: string;
  description?: string;
}

const RadioCard: React.FC<RadioCardProps> = ({ value, label, description }) => (
  <div className="flex items-center space-x-2">
    <RadioGroupItem value={value} id={value} className="peer appearance-none w-4 h-4 border border-primary rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2 checked:bg-primary checked:border-primary" />
    <Label htmlFor={value} className="peer-checked:font-semibold">
      {label}
      {description && <div className="text-sm text-muted-foreground">{description}</div>}
    </Label>
  </div>
);

const videoCall: {
  name: String,
  phoneNo: Number,
  status: "Pending" | "Concluded",
  email: String,
  videoCallCart: [ { quantity: number, totalPrice: number, status: "Pending" | "Completed", color: string, product: { productId: string, name: string } }]
  // createdAt?: String,
} = {
    name: "Aaryan",
    phoneNo: 9301690113,
    status: "Pending",
    email: "Rohraaaryan@gmail.com",
    videoCallCart: [
      {
        quantity: 1,
        totalPrice: 5000,
        color: "white",
        status: "Pending",
        product: {
          productId: "p2",
          name: "A pendant"
        }
      }
    ]
};

export const Test = () => {
  return (
    <div className='bg-white rounded-md border p-6 border-[#E1C6B3]'>
      <p>Video call enquiry</p>
      <p>Name: </p>
      <p>Phone number: </p>
      <p>Email: </p>
      <p>In video call cart: </p>
      {videoCall?.videoCallCart?.map(cartItem => {
        return (
          <div className='flex flex-col gap-2'>
            <p>Product name: {cartItem?.product?.name}, ProductId: {cartItem?.product?.productId}</p>
            <p>Quantity: {cartItem?.quantity}, ProductId: {cartItem?.product?.productId}</p>
            
          </div>
        );
      })}
    </div>
  );
}