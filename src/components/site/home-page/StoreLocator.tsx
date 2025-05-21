import { useState } from "react";
import { UIsideBar } from "./Solitare"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

const CITIES = [
    { 
        name: "Indore",
        iFrame: <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.1395287051296!2d75.8794588748156!3d22.723054727440122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fdf66fdd73f7%3A0xe264dd826b9421b6!2sKultivated%20karats%20-%20Indore!5e0!3m2!1sen!2sin!4v1743437367374!5m2!1sen!2sin" className="rounded-md w-full h-full sm:80%" width="80%" height="100%" loading="lazy"></iframe>,
        location: "",
    },
    { 
        name: "Chandigarh",
        iFrame: <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.260211297885!2d76.8410788753721!3d30.711084374594698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390f93e04a33787d%3A0x44d0ce2e572f8705!2sKultivated%20Karats%20-%20Chandigarh!5e0!3m2!1sen!2sin!4v1743439407443!5m2!1sen!2sin" className="rounded-md w-full h-full sm:80%" width="80%" height="100%" loading="lazy"></iframe>,
        location: "",
    },
    { 
        iFrame: <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.4412787477204!2d77.60587177484085!3d12.943590687369232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae154af3ed4c2d%3A0xc6c6a1628e3a979!2sKultivated%20Karats!5e0!3m2!1sen!2sin!4v1743439439976!5m2!1sen!2sin" className="rounded-md w-full sm:80% h-full" width="80%" height="100%" loading="lazy"></iframe>,
        name: "Bengaluru",
        location: "",
    },
];

export const StoreLocator = () => {

    const [ selectedCity, setSelectedCity ] = useState<String>(CITIES[0]?.name);

    return (
        <div className="min-h-screen relative sm:pb-14 sm:mb-0 mb-56">
                <UIsideBar side="left"/>
                <UIsideBar side="right"/>
                <div className="bg-[#E1C6B3] sm:mt-56 mt-14 justify-self-center w-[80%]  sm:min-h-56 h-auto rounded-lg">
                    <img src="/KultivatedKaratsAssets/storeLocatorBanner.png" className="h-full w-full object-cover rounded-[inherit]" alt="" />
                </div>
                <div className="flex flex-col sm:hidden mt-8 w-[90%] self-center justify-self-center min-h-[calc(100vh-300px)]">
                    <Tabs defaultValue={CITIES[0]?.name} className="h-full flex justify-between flex-col">
                        <TabsList className="flex gap-4 justify-between w-full">
                            {CITIES?.map(City => {
                                return (
                                    <TabsTrigger value={City?.name} className="capitalize  playfair-display">
                                        {City?.name}
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                        <div className="capitalize mt-14 flex w-full h-[calc(100vh-500px)] self-justify-center self-center flex-col">
                            {CITIES?.map(City => {
                                return (
                                    <TabsContent value={City?.name} className="capitalize flex w-full h-full flex-col">
                                        {City?.iFrame}
                                        {City?.location}
                                    </TabsContent>
                                )
                            })}
                        </div>
                    </Tabs>
                </div>
                <div className="sm:flex hidden w-[80%] justify-self-center flex-col sm:flex-row h-auto gap-4 sm:gap-8">
                    <div className="bg-[#E1C6B3] sm:flex text-white inria-serif-regular mt-28 gap-4 flex-col items-center py-8 sm:flex-[0.25] justify-self-center sm:rounded-tr-[100px] aspect-video">
                        {CITIES.map(City => {
                            return (
                                <p onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedCity(City?.name)
                                }} className="p-2 hover:cursor-pointer">{City?.name}</p>
                            );
                        })}
                    </div>
                    <div className="bg-[#E1C6B3] py-4 mt-28 gap-4 flex flex-col items-center flex-[0.75] justify-self-center sm:rounded-tr-[100px] rounded-md aspect-video">
                        <p className="text-3xl inria-serif-regular text-[white]">
                            {CITIES?.filter(city => city?.name == selectedCity)[0]?.name}
                        </p>
                        {CITIES?.filter(city => city?.name == selectedCity)[0]?.iFrame}
                        {CITIES?.filter(city => city?.name == selectedCity)[0]?.location}
                    </div>


                </div>
        </div>
    );
}