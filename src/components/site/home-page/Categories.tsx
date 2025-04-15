import { useEffect, useState } from "react";
import { UIsideBar } from "./Solitare";
import { ICategory } from "@/utils/interfaces";
import { Link } from "react-router-dom";

export const Categories = () => {

    const [ categoryData, setCategoryData ] = useState<ICategory[]>([]);

    useEffect(() => {
        (async function () {
            try {
                // @ts-ignore
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}categories/get-all-categories`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });
    
                if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
                
                const data = await response.json();
                setCategoryData(data.data);
                console.log(data.data);
                
            } catch (error) {
                console.log(error);
            }
        })()
    }, []);

    return (
        <div className="w-full relative playfair-display text-white pb-14">
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div className="sm:bg-[#E1C6B3] sm:mt-56 mt-14 gap-4 flex flex-col sm:p-14 px-4 items-center sm:w-[80%] w-full justify-self-center rounded-t-[50px] aspect-video">
                <div id="top-bar" className="items-center flex w-full text-white text-3xl">
                    <p className="flex items-center flex-1">
                        <p className="sm:text-white sm:block hidden sm:text-lg text-sm text-[#E1C6B3]">
                            Categories
                        </p>
                        <div className="relative ml-4 sm:block hidden bg-white w-[80px] h-[1px]">
                            <div className="w-2 h-2 rounded-full bg-[#fff] absolute left-[0px] top-1/2 -translate-y-1/2"></div>
                        </div>    
                    </p>
                </div>
                <div id="categories-section" className="flex gap-4 flex-wrap justify-center">
                    {categoryData?.map(category => {
                        return(
                            <div className="h-[200px] aspect-square">
                                <Link to={`/products?category-filter=${category?.name?.toLocaleLowerCase().trim()}`} className="flex h-full gap-2 flex-col">
                                    <img src="" className="bg-white w-full flex-1" />
                                    <p className="capitalize">
                                        {category?.name}
                                    </p>
                                </Link>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}