import { useNavigate } from "react-router-dom";
import { UIsideBar } from "./Solitare";
import { goldRate24K } from "@/utils/CalculateTotal";

export const GOLDCOINS = [
    {
        _id: "1",
        name: "1g Gold Coin", 
        weight: 1,
        karats: 24,
        imageUrl: [{
            url: "/gc-1.png",
            publicId: "",
        }],
        price: Math.round((goldRate24K + (goldRate24K * (16 / 100)))) 
    },
    {
        _id: "2",
        name: "2g Gold Coin",
        weight: 2,
        karats: 24,
        imageUrl: [{
            url: "/gc-2.png",
            publicId: "",
        }],
        price: Math.round((goldRate24K + (goldRate24K * (16 / 100))) * 2)
    },
    {
        _id: "5",
        name: "5g Gold Coin",
        netWeight: 5,
        karats: 24,
        imageUrl: [{
            url: "/gc-5.png",
            publicId: "",
        }],
        price: Math.round((goldRate24K + (goldRate24K * (16 / 100))) * 5)
    },
    {
        _id: "10",
        name: "10g Gold Coin",
        weight: 10,
        karats: 24,
        imageUrl: [{
            url: "/gc-10.png",
            publicId: "",
        }],
        price: Math.round((goldRate24K + (goldRate24K * (16 / 100))) * 10)
    },
    {
        _id: "20",
        name: "20g Gold Coin",
        weight: 20,
        karats: 24,
        imageUrl: [{
            url: "/gc-20.png",
            publicId: "",
        }],
        price: Math.round((goldRate24K + (goldRate24K * (16 / 100))) * 20)
    },
    {
        _id: "50",
        name: "50g Gold Coin",
        weight: 10,
        karats: 24,
        imageUrl: [{
            url: "/gc-50.png",
            publicId: "",
        }],
        price: Math.round((goldRate24K + (goldRate24K * (16 / 100))) * 50)
    },
    {
        _id: "100",
        name: "100g Gold Coin",
        weight: 100,
        karats: 24,
        imageUrl: [{
            url: "/gc-100.png",
            publicId: "",
        }],
        price: Math.round((goldRate24K + (goldRate24K * (16 / 100))) * 100)
    },
];

export const GoldCoins = () => {

    const navigate = useNavigate();

    return (
        <section className="relative w-full min-h-screen mt-56">
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div className="sm:bg-[#E1C6B3] sm:mt-56 mt-14 gap-4 flex flex-col sm:p-14 px-4 items-center sm:w-[80%] w-full justify-self-center rounded-t-[50px] aspect-video">
                <div id="top-bar" className="items-center flex w-full text-white text-3xl">
                    <p className="flex items-center flex-1">
                        <p className="sm:text-white sm:block hidden sm:text-lg text-sm text-[#E1C6B3]">
                            Gold Coins
                        </p>
                        <div className="relative ml-4 sm:block hidden bg-white w-[80px] h-[1px]">
                            <div className="w-2 h-2 rounded-full bg-[#fff] absolute left-[0px] top-1/2 -translate-y-1/2"></div>
                        </div>    
                    </p>    
                </div>
                <div id="sub-collection-section" className="gap-8 w-full">
                    <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 items-center justify-center">
                        {GOLDCOINS?.map((item) => {
                            return (
                                <button className="flex flex-col col-span-1 hover:cursor-pointer hover:scale-105 transition-all gap-4" onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/gold-coin/${item?.weight}`);
                                }}>
                                    <img src={item?.imageUrl[0]?.url} alt="" className="bg-white sm:min-w-56 object-cover aspect-square"/>
                                    <div className="sm:text-white text-[#E1C6B3] text-[4px] flex justify-between">
                                        <p className="capitalize w-1/2 text-[8px] sm:text-sm">{item.name}</p>
                                        {/* <p className="w-1/2 text-[8px] sm:text-sm">Base price: {item.price}</p> */}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};