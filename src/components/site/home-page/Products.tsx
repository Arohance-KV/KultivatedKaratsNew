import { ArrowUpDown, Filter, Loader2, X } from "lucide-react";
// import { Input } from "../../ui/input";
import { UIsideBar } from "./Solitare"
import { Button } from "../../ui/button";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { ICategory, ICollection, IProduct } from "../../../utils/interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { smallRandomBanners } from "@/utils/constants";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { SelectItem, Value } from "@radix-ui/react-select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
// import { ScrollArea } from "@/components/ui/scroll-area";

export const Products = () => {

    // const [ isClearFilterLoading, setIsClearFilterLoading ] = useState(false);
    const [ isApplyFilterLoading, setIsApplyFilterLoading ] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [ categoryFilter, setCategoryFilter ] = useState(queryParams.get("category-filter"));

    const [ filters, setFilters ] = useState<{
        gender: {
            male: boolean,
            female: boolean
        };
        price: { max: number; min: number };
        // gemStone: boolean;
        // gemStoneColour: string[];
        categories: string[],
        collections: string[],
        meta: {
            total: number,
            page: number,
            totalPages: number
        }
      }>({
        gender: {
            male: false,
            female: false,
        },
        price: {
            max: 100000000,
            min: 0
        },
        // gemStone: false,
        // gemStoneColour: [],
        categories: [],
        collections: [],
        meta: {
            total: 0,
            page: 1,
            totalPages: 1
        }
    });

    const categoryDataFromStore: ICategory[] = useSelector((state: any) => state.website.categories);
    const collectionDataFromStore: ICollection[] = useSelector((state: any) => state.website.collections);

    // const productDataFromStore = useSelector((state: any) => state.website.productData)

    const [ products, setProducts ] = useState<IProduct[]>([]);

    const [ isProductsLoading, setIsProductsLoading ] = useState(false);

    const navigate = useNavigate();

    // const [ isLoading, setIsLoading ] = useState(true);

    const [ randomBanner, setRandomBanner ]= useState({
        name: "",
		imageUrl: {
			url: "",
			publicId: "",
		},
		link: ""
    });

    const visibleProductsCount = 39;

    const [ currentPage, setCurrentPage ] = useState(1);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [ currentPage ]);

    const getProducts = async () => {
        setIsProductsLoading(true);
        try {
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/get-products?page=${currentPage}?limit=${visibleProductsCount}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ filters: filters })
            });
            // console.log(response);

            if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
            
            const data = await response.json();
            // dispatch(setProductData(data.data));
            console.log(data.data);
            setFilters({ ...filters, meta: data.data.meta });
            // filters.meta = data.data.meta;
            return (data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsProductsLoading(false);
        }
    };

    // useEffect(() => {
    //     (async function () {
    //         await getProducts();
    //     })();
    // }, [ visibleProductsCount ]);

    const dialogRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setRandomBanner(smallRandomBanners[Math.floor(Math.random() * 4)]);
        function handleClickOutside(event: MouseEvent) {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                setDialogOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    useEffect(() => {
        ( async function () {
            if ( categoryFilter ) {
                const category = categoryDataFromStore?.filter(category => {
                    console.log(category?.name?.trim()?.toLowerCase(), categoryFilter!.trim()?.toLowerCase())
                    return (category?.name?.trim()?.toLowerCase() == categoryFilter!.trim()?.toLowerCase());
                })?.[0];
                if ( !( filters.categories.includes(category?._id!) ) ) {
                    filters.categories.push(category?._id!)
                    setFilters({ ...filters, categories: filters.categories });
                }
                // if ( category?.products )
                // setIsLoading(false);
                console.log(filters)
            }
            const productResponse = await getProducts(); 
            setProducts(productResponse?.data);
            // setIsLoading(false);
            return console.log(categoryDataFromStore, categoryFilter, products, productResponse);
        })();
    }, [ currentPage, categoryDataFromStore ]);

    // useEffect(() => {
    //     ( async function () {
    //         if ( categoryFilter ) {
    //             const category = categoryDataFromStore?.filter(category => {
    //                 console.log(category?.name?.trim()?.toLowerCase(), categoryFilter.trim()?.toLowerCase())
    //                 return (category?.name?.trim()?.toLowerCase() == categoryFilter.trim()?.toLowerCase());
    //             })?.[0];
    //             if ( !( filters.categories.includes(category?._id!) ) )
    //                 filters.categories.push(category?._id!);
    //             // if ( category?.products )
    //             // setIsLoading(false);
    //         }
    //         const productResponse = await getProducts(); 
    //         setProducts(productResponse?.data);
    //         setIsLoading(false);
    //         return console.log(categoryDataFromStore, categoryFilter, products, productResponse);
    //     })();
    // }, [ products ]);

    // const [ showFilter, setShowFilter ] = useState<Boolean>(false);
    const [ showSortOptions, setShowSortOptions ] = useState<Boolean>(false);
    const [ dialogOpen, setDialogOpen ] = useState(false);

    // const clearFilters = () => {
    //     setFilters({
    //         gender: {
    //             male: false,
    //             female: false,
    //         },
    //         price: {
    //             max: 100000000,
    //             min: 0
    //         },
    //         // gemStone: false,
    //         // gemStoneColour: [],
    //         categories: [],
    //         collections: [],
    //         meta: {
    //             total: 0,
    //             page: 1,
    //             totalPages: 1
    //         }
    //     });
    // };

    return (
        <div className="w-full relative playfair-display text-white pb-14">
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div className="sm:bg-[#E1C6B3] relative sm:mt-56 mt-14 gap-4 flex flex-col sm:p-14 px-4 items-center sm:w-[80%] w-full justify-self-center rounded-t-[50px] aspect-video">
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
                        <div className="relative">
                        <Button className="rounded-full m-0 px-3 py-4" variant={"ghost"} onClick={() => {
                                setShowSortOptions(!showSortOptions);
                            }}>
                                <ArrowUpDown className="fill-[#A68A7E] stroke-[#A68A7E] w-10 h-10"/>
                            </Button>
                            {showSortOptions && (
                                <div className="bg-white rounded-md z-50 text-black flex-col absolute min-w-24 top-[150%] left-0 -translate-x-1/2 flex">
                                    <Button className="bg-transparent hover:bg-gray-800/10 text-black rounded-b-none" variant={"ghost"} onClick={(e) => {
                                        e.preventDefault();
                                        setProducts([...products].sort((a, b) => b.price - a.price));
                                        setShowSortOptions(!showSortOptions);                      
                                    }}>Price: high to low</Button>
                                    <Button className="bg-transparent hover:bg-gray-800/10 text-black rounded-t-none" variant={"ghost"} onClick={(e) => {
                                        e.preventDefault();
                                        setProducts([...products].sort((a, b) => a.price - b.price));
                                        setShowSortOptions(!showSortOptions);                      
                                    }}>Price: low to high</Button>
                                </div>
                            )}
                            <Button className="rounded-full m-0 px-3 py-4" variant={"ghost"} onClick={() => setDialogOpen(!dialogOpen)}>
                                <Filter className="fill-[#A68A7E] stroke-[#A68A7E] w-10 h-10"/>
                            </Button>
                            <div className={cn("w-screen h-screen z-50 fixed top-0 bottom-0 right-0 left-0 bg-gray-500/50", dialogOpen ? "visible" : "hidden")}>
                                <div ref={dialogRef} className="fixed sm:w-[550px] rounded-md border-[#A68A7E] border p-8  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] inria-serif-regular text-[#A68A7E] bg-white">
                                    <div className="flex justify-between">
                                        <div>Filters</div>
                                        <Button onClick={() => setDialogOpen(false)} className="text-[#A68A7E] border border-[#A68A7E] bg-white hover:bg-[#A68A7E] hover:text-white rounded-full w-4 h-4 aspect-square p-0 m-0 py-3"><X className=" w-2 aspect-square" /></Button>
                                    </div>
                                    <div className="grid gap-4 py-4 ">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Gender
                                            </Label>
                                            <div className="flex items-center text-sm gap-2">
                                                Male
                                                <Checkbox defaultChecked={filters.gender.male} onCheckedChange={(value) => {
                                                    setFilters({ ...filters, gender: { ...filters.gender, male: (value as boolean) } })
                                                }} className=""/>
                                            </div>
                                            <div className="flex text-sm items-center gap-2">
                                                Female
                                                <Checkbox defaultChecked={filters.gender.female} onCheckedChange={(value) => {
                                                    setFilters({ ...filters, gender: { ...filters.gender, female: (value as boolean) } })
                                                }} className=""/>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="username" className="text-right sm:col-span-1 col-span-2">
                                                Category
                                            </Label>
                                            <Accordion type="single" collapsible className="col-span-2 sm:col-span-3 w-full">
                                                <AccordionItem value="item-1 col-span-3 w-full">
                                                    <AccordionTrigger>Select categories</AccordionTrigger>
                                                    <AccordionContent className="rounded-md border border-inherit pt-4 px-4 flex flex-wrap gap-4 w-full">
                                                        {categoryDataFromStore?.map(category => {
                                                            return (
                                                                <div className="flex justify-center items-center gap-2">
                                                                    <Label className="capitalize">{category?.name}</Label>
                                                                    <Checkbox defaultChecked={filters.categories.includes(category?._id!)} className="capitalize" onCheckedChange={(value) => {
                                                                        if ( value )
                                                                            return filters.categories.push(category?._id!);
                                                                        setFilters({ ...filters, categories: filters.categories.filter(
                                                                            (id) => id !== category?._id
                                                                        ) });
                                                                    }} value={category?._id!}>{category?.name}</Checkbox>
                                                                </div>
                                                            )
                                                        })}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="username" className="text-right col-span-2 sm:col-span-1">
                                                Collections
                                            </Label>
                                            <Accordion type="single" collapsible className="sm:col-span-3 col-span-2 w-full">
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger>Select collections</AccordionTrigger>
                                                    <AccordionContent className="w-auto flex sm:gap-4 gap-2 sm:pt-4 sm:px-4 sm:h-auto sm:overflow-visible h-24 overflow-y-scroll flex-wrap sm:border rounded-md">
                                                        {/* <ScrollArea className="flex gap-4 flex-wrap bg-yellow-100 h-14">   */}
                                                            {/* <div>     */}
                                                                {collectionDataFromStore?.map(collection => {
                                                                    return (
                                                                        <div className="gap-2 flex justify-center items-center">
                                                                            <Label className="capitalize">{collection?.name}</Label>
                                                                            <Checkbox defaultChecked={filters.collections.includes(collection?._id!)} className="capitalize" onCheckedChange={(value) => {
                                                                                if ( value )
                                                                                    return setFilters({ ...filters, collections: [ ...filters.collections, collection?._id! ] }) 
                                                                                setFilters({ ...filters, collections: filters.collections.filter(
                                                                                    (id) => id !== collection?._id
                                                                                ) });
                                                                            }} value={collection?._id!}>{collection?.name}</Checkbox>
                                                                        </div>
                                                                    )
                                                                })}
                                                            {/* </div>   */}
                                                        {/* </ScrollArea> */}
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>                                    
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="username" className="text-right">
                                                Price
                                            </Label>
                                            <RadioGroup defaultValue={filters?.price?.max == 20000 ? "<20k" : filters?.price?.max == 40000 ? "<40k" : filters?.price?.max == 60000 ? "<60k" : filters?.price?.max == 80000 ? "<80k" : filters?.price?.max == 100000 ? "<100k" : filters?.price?.min == 100000 ? ">100k" : ""}
                                                className="flex flex-wrap w-full col-span-3 gap-4" onValueChange={(value) => {
                                                    switch (value) {
                                                        case "<20k":
                                                            setFilters({ ...filters, price: { min: 0, max: 20000 } });
                                                        break;
                                                        case "<40k":
                                                            setFilters({ ...filters, price: {min: 0, max: 40000 } });
                                                        break;
                                                        case "<60k":
                                                            setFilters({ ...filters, price: { min: 0, max: 60000 } });
                                                        break;
                                                        case "<80k":
                                                            setFilters({ ...filters, price: { min: 0, max: 80000 } });
                                                        break;
                                                        case "<100k":
                                                            setFilters({ ...filters, price: { min: 0, max: 100000 } });
                                                        break;
                                                        case ">100k":
                                                            setFilters({ ...filters, price: { min: 80000, max: 10000000 } });
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
                                        <div className="flex sm:gap-0 gap-2 justify-between">
                                            {/* <Button disabled={isClearFilterLoading} variant={"ghost"} className="bg-white border stroke-[#A68A7E] hover:stroke-white border-[#A68A7E] hover:text-white hover:bg-[#A68A7E] self-center justify-self-center" onClick={ async () => {
                                                setIsClearFilterLoading(true);
                                                setFilters({
                                                    gender: {
                                                        male: false,
                                                        female: false,
                                                    },
                                                    price: {
                                                        max: 100000000,
                                                        min: 0
                                                    },
                                                    // gemStone: false,
                                                    // gemStoneColour: [],
                                                    categories: [],
                                                    collections: [],
                                                    meta: {
                                                        total: 0,
                                                        page: 1,
                                                        totalPages: 1
                                                    }
                                                });
                                                const data = await getProducts();
                                                setProducts(data.data);
                                                setDialogOpen(false);
                                                setIsClearFilterLoading(false);
                                            }}>{isClearFilterLoading ? <Loader2 className="w-4 aspect-square"/> : "Clear filters"}</Button> */}
                                            <Button disabled={isApplyFilterLoading} variant={"ghost"} className="bg-white justify-self-end border stroke-[#A68A7E] hover:stroke-white border-[#A68A7E] hover:text-white hover:bg-[#A68A7E] self-center" onClick={ async () => {
                                                setIsApplyFilterLoading(true);
                                                const data = await getProducts();
                                                setProducts(data.data);
                                                setDialogOpen(false);
                                                setIsApplyFilterLoading(false);
                                            }}>{isApplyFilterLoading ? <Loader2 className="w-4 animate-spin aspect-square"/> : "Apply filters"}</Button>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                {<div id="products-section" className="gap-8 relative w-full">
                    <div className="grid min-h-full sm:grid-cols-4 grid-cols-2 gap-4 items-center justify-center">
                        {randomBanner?.name != "" && <a onClick={() => {
                            setCategoryFilter(queryParams.get("category-filter"));
                        }} href={randomBanner?.link} className="col-span-1 w-full h-full row-span-1 row-start-[-2] col-start-1">
                            <img src={randomBanner?.imageUrl!?.url} className="w-full h-full object-cover" alt="" />
                        </a>}
                        {isProductsLoading ? <Loader2 className="sm:stroke-white animate-spin stroke-[#E1C6B3] self-center justify-self-center" /> : products
                        /*?.filter((item: IProduct) => {
                        const withinPriceRange =
                            item.price >= filters.price.min && item.price <= filters.price.max;

                        const matchesGender =
                            filters.gender.length === 0 ||
                            filters.gender.includes(item.gender?.toLowerCase());

                        return withinPriceRange && matchesGender;
                        })*/?.map((item : IProduct) => {
                            // return ((item?.price > filters?.price?.min && item?.price < filters?.price?.max) && (filters?.gemStoneColour?.filter((colour:string)  => colour?.toLowerCase()?.trim() == item?.gemStoneColour).length > 0) ) ? (
                            // return ((item?.price > filters?.price?.min && item?.price < filters?.price?.max)) ? (
                                // return (<button className="flex w-full h-full bg-green-500 flex-col col-span-1 hover:cursor-pointer hover:scale-105 transition-all gap-4" onClick={(e) => {
                                return (<button className="flex flex-col col-span-1 hover:cursor-pointer hover:scale-105 transition-all gap-4" onClick={(e) => {
                                    e.preventDefault();
                                    navigate(`/product/${item?._id}`);
                                }}>
                                    {item?.imageUrl ? <img src={item?.imageUrl[0]?.url} alt="" className="bg-white sm:min-w-56 object-cover aspect-square"/> : <div className="stroke-[#A68A7E] bg-white sm:min-w-56 object-cover aspect-square" ><Loader2 className="w-4 aspect-square animate-spin" /></div>}
                                        <div className="sm:text-white text-[#E1C6B3] text-[4px] flex justify-between">
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>}
            </div>
            <Pagination className="absolute m-auto left-1/2 -translate-x-1/2 sm:w-auto w-[95vw] text-[#A68A7E] -bottom-4 sm:bottom-4">
                <PaginationContent className="max-w-[95vw] sm:text-base text-xs flex flex-wrap justify-center">
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {[...Array(filters.meta.totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                            isActive={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            >
                            {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, filters.meta.totalPages))}
                            className={currentPage === filters.meta.total ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};