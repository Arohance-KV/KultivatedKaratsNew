import { ArrowUpDown } from "lucide-react";
// import { Input } from "../../ui/input";
import { UIsideBar } from "./Solitare"
import { Button } from "../../ui/button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ICollection, IProduct } from "../../../utils/interfaces";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";

const Collection = ({ data, navigate } : { data : ICollection, navigate: NavigateFunction}) => {
    
    if (!data?.products?.length) return null;

    return (
        <div>
            <div id={`${data?.name?.trim()?.toLowerCase()}`} className="w-full my-8 h-auto text-white">
                <p className="capitalize font-bold textxl sm:text-white text-[#E1C6B3]">{data.name}</p>
            </div>
            <div id="sub-collection-section" className="gap-8 w-full">
                <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 items-center justify-center">
                    {data?.products?.map((item: IProduct) => (
                        <button
                            key={item._id}
                            className="flex flex-col col-span-1 hover:cursor-pointer hover:scale-105 transition-all gap-4"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/product/${item?._id}`);
                            }}
                        >
                            <img
                                src={item?.imageUrl[0]?.url}
                                alt={item?.name}
                                className="bg-white sm:min-w-56 object-cover aspect-square"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export const Collections = () => {

    const collectionsFromStore = useSelector((state: any) => state.website.collections);

    const navigate = useNavigate();
    const [ collections, setCollections ] = useState<ICollection[]>([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const filter = queryParams.get("filter");

    useEffect(() => {
        let filteredCollections = collectionsFromStore.map((collection: ICollection) => {
            let products = collection.products || [];

            if (filter === "60k") {
                products = products.filter(product => product.price < 60000);
            } else if (filter === "30k") {
                products = products.filter(product => product.price < 30000);
            } else if (filter === "15k") {
                products = products.filter(product => product.price < 15000);
            }

            return {
                ...collection,
                products
            };
        });

        setCollections(filteredCollections);
    }, [collectionsFromStore, filter]);
    // const [ showFilter, setShowFilter ] = useState<Boolean>(true);
    const [ showSortOptions, setShowSortOptions ] = useState<Boolean>(false); 

    return (
        <div className="w-full relative playfair-display text-white pb-14">
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div className="sm:bg-[#E1C6B3] sm:mt-56 mt-14 gap-4 flex flex-col sm:p-14 px-4 items-center sm:w-[80%] w-full justify-self-center rounded-t-[50px] aspect-video">
                <div id="top-bar" className="items-center flex w-full text-white text-3xl">
                    <p className="flex items-center flex-1">
                        <p className="sm:text-white sm:block sm:text-lg text-sm text-[#e3b493]">
                            Collections
                        </p>
                        <div className="relative ml-4 sm:block hidden bg-white w-[80px] h-[1px]">
                            <div className="w-2 h-2 rounded-full bg-[#fff] absolute left-[0px] top-1/2 -translate-y-1/2"></div>
                        </div>    
                    </p>
                    <div className="flex items-center gap-4 justify-self-end">
                        {/* <div className="relative w-full">
                            <Input type="text" placeholder="Search" className="pl-6 h-8 border-[#A68A7E] border-2 bg-transparent text-[#A68A7E] placeholder:text-[#A68A7E]" />
                            <Search className="absolute top-1/2 left-2 -translate-y-1/2 w-3 h-3 stroke-[#A68A7E] stroke-2"/>
                        </div> */}
                        <div className="relative">
                            <Button className="rounded-full m-0 px-3 py-4" variant={"ghost"} onClick={() => {
                                setShowSortOptions(!showSortOptions);
                            }}>
                                <ArrowUpDown className="fill-[#A68A7E] stroke-[#A68A7E] w-10 h-10"/>
                            </Button>
                            {showSortOptions && (
                                <div className="bg-white rounded-md text-black flex-col absolute min-w-24 top-[150%] left-0 -translate-x-1/2 flex">
                                    <Button className="bg-transparent hover:bg-gray-800/10 text-black rounded-b-none" variant={"ghost"} onClick={(e) => {
                                        e.preventDefault();
                                        // setCollections(collections => collections.map(collectionsFromStore))
                                        setCollections(collectionsFromStore.map((collection: ICollection) => ({
                                            ...collection,
                                            products: [...(collection.products || [])].sort((a: IProduct, b: IProduct) => (b?.price ?? 0) - (a?.price ?? 0))
                                        })));                  
                                        setShowSortOptions(!showSortOptions);                      
                                    }}>Price: high to low</Button>
                                    <Button className="bg-transparent hover:bg-gray-800/10 text-black rounded-t-none" variant={"ghost"} onClick={(e) => {
                                        e.preventDefault();
                                        setCollections(collectionsFromStore.map((collection: ICollection) => ({
                                            ...collection,
                                            products: [...(collection.products || [])].sort((a: IProduct, b: IProduct) => (a?.price ?? 0) - (b?.price ?? 0))
                                        })));
                                        setShowSortOptions(!showSortOptions);                      
                                    }}>Price: low to high</Button>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            {/* <Button className="rounded-full m-0 px-3 py-4" variant={"ghost"} onClick={() => {
                                setShowFilter(!showFilter);
                            }}>
                                <Filter className="fill-[#A68A7E] stroke-[#A68A7E] w-10 h-10"/>
                            </Button> */}
                            {/* {showFilter && (
                                <div className="min-w-14 absolute top-[150%] right-0 bg-gray-600/50">hello</div>
                            )} */}
                        </div>
                    </div>
                </div>
                <div className="w-full flex-wrap flex gap-2">
                    {collections?.map((collection: ICollection) => {
                        return (
                            <a className="border sm:border-white border-[#E1C6B3] text-[#E1C6B3] sm:text-white px-4 py-2 rounded-md" href={`#${collection?.name?.trim()?.toLowerCase()}`}>{collection?.name}</a>
                        );
                    })}
                </div>
                {collections?.map((collection : ICollection) => {
                    return <Collection data={collection} navigate={navigate} />
                })}
                {/* <div id="tabs" className="w-full my-8 text-white">
                    Collection 1
                </div>
                <div id="sub-collection-section" className="flex gap-8 flex-col w-full">
                    <p>Sub category 1</p>
                    <div className="flex gap-4 items-center justify-center">
                        {[0, 1, 2, 3].map(item => {
                            return (
                                <div className="flex flex-col gap-4 col-span-1">
                                    <img src="" alt="" className="w-56 bg-white aspect-video"/>
                                    <div className="text-white flex justify-between">
                                        <p>Name:</p>
                                        <p>Price:</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <p>Sub category 2</p>
                    <div className="flex gap-4 items-center justify-center">
                        {[0, 1, 2, 3].map(item => {
                            return (
                                <div className="flex flex-col gap-4 col-span-1">
                                    <img src="" alt="" className="bg-white w-56 aspect-video"/>
                                    <div className="text-white flex justify-between">
                                        <p>Name:</p>
                                        <p>Price:</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div> */}
            </div>
        </div>
    );
}