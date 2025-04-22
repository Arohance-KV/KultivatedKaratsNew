// import { useEffect, useState } from 'react';
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { getProductPriceDetails } from '@/utils/CalculateTotal';
// import { ICartItem, IProduct } from '@/utils/interfaces';
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