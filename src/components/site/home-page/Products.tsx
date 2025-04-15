import { ArrowUpDown, Filter, Loader2 } from "lucide-react";
// import { Input } from "../../ui/input";
import { UIsideBar } from "./Solitare"
import { Button } from "../../ui/button";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IProduct } from "../../../utils/interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Products = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryFilter = queryParams.get("category-filter");

    const [ filters, setFilters ] = useState({
        gender: [],
        price: {
            max: 10000000,
            min: 0
        },
        gemStone: false,
        gemStoneColour: []
    });

    const productDataFromStore: IProduct[] = useSelector((state: any) => state.website.productData);

    const [ products, setProducts ] = useState<IProduct[]>([]);

    const navigate = useNavigate();

    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        if ( categoryFilter ) {
            console.log(categoryFilter, productDataFromStore[0]?.category)
            setProducts(productDataFromStore.filter(p => p.category?.name?.toLowerCase() == categoryFilter?.toLowerCase()))
            setIsLoading(false);
            return console.log(products);
        };
        setProducts(productDataFromStore);
        setIsLoading(false);
    }, [ productDataFromStore ]);

    const [ showFilter, setShowFilter ] = useState<Boolean>(false);
    const [ showSortOptions, setShowSortOptions ] = useState<Boolean>(false);

    return (
        <div className="w-full relative playfair-display text-white pb-14">
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div className="sm:bg-[#E1C6B3] sm:mt-56 mt-14 gap-4 flex flex-col sm:p-14 px-4 items-center sm:w-[80%] w-full justify-self-center rounded-t-[50px] aspect-video">
                <div id="top-bar" className="items-center flex w-full text-white text-3xl">
                    <p className="flex items-center flex-1">
                        <p className="sm:text-white sm:block hidden sm:text-lg text-sm text-[#E1C6B3]">
                            Products
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
                                        setProducts(productDataFromStore?.map((product: IProduct) => ({
                                            ...product,
                                            // products: [...(product || [])].sort((a: IProduct, b: IProduct) => (b?.price ?? 0) - (a?.price ?? 0))
                                        })));                  
                                        setShowSortOptions(!showSortOptions);                      
                                    }}>Price: high to low</Button>
                                    <Button className="bg-transparent hover:bg-gray-800/10 text-black rounded-t-none" variant={"ghost"} onClick={(e) => {
                                        e.preventDefault();
                                        setProducts(productDataFromStore.map((products: IProduct) => ({
                                            ...products,
                                            // products: [...(collection.products || [])].sort((a: IProduct, b: IProduct) => (a?.price ?? 0) - (b?.price ?? 0))
                                        })));
                                        setShowSortOptions(!showSortOptions);                      
                                    }}>Price: low to high</Button>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <Button className="rounded-full m-0 px-3 py-4" variant={"ghost"} onClick={() => {
                                setShowFilter(!showFilter);
                            }}>
                                <Filter className="fill-[#A68A7E] stroke-[#A68A7E] w-10 h-10"/>
                            </Button>
                            {showFilter && (
                                <div className="min-w-14 z-50 absolute flex flex-col border border-[#A68A7E] p-6 bottom-[150%] right-0 rounded-lg bg-white text-[#A68A7E]">
                                    <div className="flex text-lg items-center gap-2">
                                        Gender:
                                        <div className="flex justify-center items-center gap-2">
                                            <Label>Male</Label>
                                            <Checkbox />
                                        </div>
                                        <div className="flex justify-center items-center gap-2">
                                            <Label>Female</Label>
                                            <Checkbox />
                                        </div>
                                    </div>
                                    <div className="flex justify-center text-lg items-center gap-2">
                                        Price:
                                        <RadioGroup defaultValue={filters?.price?.max == 20000 ? "<20k" : filters?.price?.max == 40000 ? "<40k" : filters?.price?.max == 60000 ? "<60k" : filters?.price?.max == 80000 ? "<80k" : filters?.price?.max == 100000 ? "<100k" : ">100k"}
                                            className="flex gap-4" onValueChange={(value) => {
                                                switch (value) {
                                                    case "<20k":
                                                        setFilters({ ...filters, price: { min: 0, max: 20000 }});
                                                    break;
                                                    case "<40k":
                                                        setFilters({ ...filters, price: { min: 0, max: 40000 }});
                                                    break;
                                                    case "<60k":
                                                        setFilters({ ...filters, price: { min: 0, max: 60000 }});
                                                    break;
                                                    case "<80k":
                                                        setFilters({ ...filters, price: { min: 0, max: 80000 }});
                                                    break;
                                                    case "<100k":
                                                        setFilters({ ...filters, price: { min: 0, max: 100000 }});
                                                    break;
                                                    case ">100k":
                                                        setFilters({ ...filters, price: { min: 0, max: 10000000 }});
                                                    break;
                                                }
                                            }}
                                        >
                                            <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="<20k" id="<20k" />
                                            <Label className="text-nowrap" htmlFor="<20k">0 - 20k</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="<40k" id="<40k" />
                                            <Label className="text-nowrap" htmlFor="<40k">{"<"} 40k</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="<60k" id="<60k" />
                                            <Label className="text-nowrap" htmlFor="<60k">{"<"} 60k</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="<80k" id="<80k" />
                                            <Label className="text-nowrap" htmlFor="<80k">{"<"} 80k</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="<100k" id="<100k" />
                                            <Label className="text-nowrap" htmlFor="<100k">{"<"} 100k</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                            <RadioGroupItem value=">100k" id=">100k" />
                                            <Label className="text-nowrap" htmlFor=">100k">{">"} 100k</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* {collections?.map((collection : ICollection) => {
                    return <Collection data={collection} navigate={navigate} />
                })} */}
                {<div id="sub-collection-section" className="gap-8 w-full">
                    <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 items-center justify-center">
                        {isLoading ? <Loader2 className="sm:stroke-white stroke-[#E1C6B3] self-center justify-self-center" /> : products?.map((item : IProduct) => {
                            // return ((item?.price > filters?.price?.min && item?.price < filters?.price?.max) && (filters?.gemStoneColour?.filter((colour:string)  => colour?.toLowerCase()?.trim() == item?.gemStoneColour).length > 0) ) ? (
                            // return ((item?.price > filters?.price?.min && item?.price < filters?.price?.max)) ? (
                            return (<button className="flex flex-col col-span-1 hover:cursor-pointer hover:scale-105 transition-all gap-4" onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/product/${item?._id}`);
                                }}>
                                    <img src={item?.imageUrl[0]?.url} alt="" className="bg-white sm:min-w-56 object-cover aspect-square"/>
                                    <div className="sm:text-white text-[#E1C6B3] text-[4px] flex justify-between">
                                        {/* <p className="capitalize w-1/2 text-[8px] sm:text-sm">Name: {item.name}</p> */}
                                        {/* <p className="w-1/2 text-[8px] sm:text-sm">Base price: {item.price}</p> */}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>}
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