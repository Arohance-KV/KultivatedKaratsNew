import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, LoaderCircle, MoreHorizontal, PencilIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ICategory, IProduct } from "@/utils/interfaces";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { ToastSuccess, ToastWarning } from "@/utils/UtilityComponents";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useSelector } from "react-redux";

const COLOURS = {
  border: "#A68A7E",
  textLight: "#E1C6B3",
  textDark: "#BFA6A1 "
};

export const productFormSchema = z.object({
  productId: z.string(),
  name: z.string().min(1, { message: "Product name should be at least 1 character long!" }).max(30, { message: "Product name cannot be more than 30 characters!"}),
  description: z.string(),
  category: z.string(),
  collections: z.string().array().optional(),
  goldWeight: z.string().optional(),
  diamondWeight: z.string().optional(),
  netWeight: z.string().optional(),
  solitareWeight: z.string().optional(),
  grossWeight: z.string().optional(),
  noOfSolitares: z.string().optional(),
  noOfMultiDiamonds: z.string().optional(),
  multiDiamondWeight: z.string().optional(),    
  gender: z.string().array().optional(),
  shapeOfSolitare: z.string().optional(),
  shapeOfMultiDiamonds: z.string().optional(),
  shapeOfPointers: z.string().optional(),
  noOfPointers: z.string().optional(),
  gemStoneColour: z.string().array().optional(),
  isPendantFixed: z.boolean().optional(),    
  containsGemstone: z.boolean().optional(),
  gemStoneWeightSol: z.string().optional(),
  isMrpProduct: z.boolean(),
  pointersWeight: z.string().optional(),
  gemStoneWeightPointer: z.string().optional(),
  // gemStoneColour: z.string().optional(),
  imageUrl: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
  })).min(1, "Select at least one image!").optional(),
  price: z.string().min(0, { message: "The price cannot be negative!"}),
});

const getProducts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/get-all-products`, {
      method: "GET",
      headers: {
        "content-type": "application/json"
      },
    });

    const data = await response.json();

    if ( !response.ok ) throw new Error("Failed to load products");

    console.log(data);

    return(data.data);  
  
  } catch (error) {
    console.log(error);
  }
};

export const columns: ColumnDef<IProduct>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "",
    accessorKey: "imageUrl",
    cell: ({ row }) => {

      console.log(row.original.imageUrl[0].url);
      
      
        return <div className={`capitalize inria-serif-regular`}>
            <img className={`w-10 h-10 rounded-md object-cover`} src={row?.original?.imageUrl?.[0]?.url} alt=""/>
        </div>
    },
  },
  {
    accessorKey: "productId",
    header: "Product ID",
    cell: ({ row }) => (
      <div className={`capitalize inria-serif-regular"`}>{row.getValue("productId")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className={`capitalize inria-serif-regular`}>{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "containsGemstone",
    header: "Gemstone product",
    cell: ({ row }) => (
      <div className={`capitalize inria-serif-regular`}>{row.getValue("conatinsGemstone") ? "Yes" : "No"}</div>
    ),
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Email
  //         <ArrowUpDown />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => <div className={`lowercase">{row.getValue("email")}</div>,
  // },
  {
    accessorKey: "price",
    header: () => <div className={`inria-serif-regular`}>Base price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)

      return <div className={`font-medium inria-serif-regular`}>{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // const payment = row.original

      const [ productData, setProductData ] = React.useState(row.original);
      const categoryDataFromStore: ICategory[] = useSelector((state: any) => state.website.categories);
      const [ isDialogOpen, setIsDialogOpen ] = React.useState(false);
      const [ isTrashButtonLoading, setIsTrashButtonLoading ] = React.useState(false);
      const [ isButtonLoading, setIsButtonLoading ] = React.useState(false);
      const [ categories, setCategories ] = React.useState<ICategory[]>();

      React.useEffect(() => {
        setCategories(categoryDataFromStore)
      }, [ categoryDataFromStore ]);

      const productForm = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
          productId: productData?.productId,
          name: productData?.name,
          // productDescription: productData?.productDescription,
          category: productData?.category?.name,
          imageUrl: [],
          price: productData?.price+"",
        }
      });

      const handleProductDelete = async () => {
        setIsTrashButtonLoading(true);
        try {
          // @ts-ignore
          const response = await fetch(`http://localhost:${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/delete-a-product/${productData._id!}`, {
              method: "DELETE",
              headers: {
                  "Content-Type": "application/json",
              },
              credentials: 'include',
          });
      
          const data = await response.json();
      
          if ( !response.ok ){
            if ( data.type )
            console.log(data);
            throw new Error("error" + response);
          }
      
          const products = await getProducts();
      
          console.log(data, products);
          setProductData(products);
          
          // toast.success("Product deleted successfully!", { description: productData.productName!, className: "font-[quicksand]", icon: <ToastSuccess /> });
          window.location.reload();
        } catch (error: any) {
          console.log(error);
          // toast.error("Product deletion failed!", { description: productData.productName!, className: "font-[quicksand]", icon: <ToastFaliure /> })
        }
        setIsTrashButtonLoading(false);
      };

      const onProductEditFormSubmit = async (values: z.infer<typeof productFormSchema>) => {
        setIsButtonLoading(true);
        console.log("form submitted");
        console.log(values);
        try {
          // @ts-ignore
          const response = await fetch(`http://localhost:${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/edit-product/${productData._id}`, {
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
              },
              credentials: 'include',
              // body: JSON.stringify({ updatedProductFromReq : {...values, weight: { number: Number(values.weight), unit: "g" }, price: Number(values.price), stock: Number(values.stock), dimensions: { l : Number(values.dimensions.l), b : Number(values.dimensions.b), h : Number(values.dimensions.h)}}})
          });
    
          const data = await response.json();
    
          if ( !response.ok ){
            if ( data.type )
              productForm.setError(data.type, { type: "manual", message: data?.errorMessage });
            console.log(data);
            throw new Error("error" + response);
          }
          setProductData(await getProducts());
          setIsDialogOpen(false);
          toast.success("Product updated successfully!", { description: data?.data?.productName, className: "font-[quicksand]", icon: <ToastSuccess /> });
          window.location.reload();
        } catch (error: any) {
          console.log(error);
          if ( error?.kind === "ObjectId") productForm.setError(error.type, {type: "manual", message: error.errorMessage});
          if ( error?.type ) productForm.setError(error.type, { type: "manual", message: error.errorMessage });
          toast.error("Failed to update product!", { description: error.errorMessage, className: "font-[quicksand]", icon: <ToastWarning /> });
        }
        setIsButtonLoading(false);
      };


      return (
        <>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
            </DialogTrigger>
            <DialogContent className={`min-w-[800px] !inria-serif-regluar !text-[${COLOURS?.textDark}] flex justify-end gap-4 px-4 flex-col bg-white border-[${COLOURS?.border}]`}>
              <DialogHeader>
                <DialogTitle>Update product details</DialogTitle>
                <DialogDescription>
                    Make changes to your the product details here. Click save changes when you're done.
                </DialogDescription>
              </DialogHeader>
              <Form {...productForm}>
                <form onSubmit={productForm.handleSubmit(onProductEditFormSubmit)} className={`grid pb-10 grid-cols-2 gap-8 py-4`}>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                    <Label htmlFor="name">
                      Product ID
                    </Label>
                    <FormField
                      control={productForm.control}
                      name="productId"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-[color-#f66]`}>
                          <FormControl>
                            <Input {...field} placeholder={productData?.productId} className={`col-span-3 focus-visible:ring-primaryDark`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Product name
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.name} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Contains gemstone
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="containsGemstone"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            {/* <Input placeholder={productData?.name} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} /> */}
                            <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Pointers weight
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="pointersWeight"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Gold weight
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="goldWeight"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Diamond weight
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="diamondWeight"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Gross weight
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="grossWeight"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        No of solitares
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="noOfSolitares"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Is mrp product
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="isMrpProduct"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            {/* <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} /> */}
                            <Checkbox defaultChecked={productData?.isMrpProduct} checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        No of multidiamonds
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="noOfMultiDiamonds"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Shape of solitare
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="shapeOfSolitare"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Shape of multidiamonds
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="shapeOfMultiDiamonds"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Shape of pointers
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="shapeOfPointers"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        No of pointers
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="noOfPointers"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.pointersWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Gemstone colour
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="gemStoneColour"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.gemStoneColour+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Solitare weight
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="solitareWeight"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.solitareWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Gemstone pointer weight
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="gemStoneWeightPointer"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.gemStoneWeightPointer+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Gemstone solitare weight
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="gemStoneWeightSol"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.gemStoneWeightSol+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Multidiamond weight
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="multiDiamondWeight"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.multiDiamondWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Net weight
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="netWeight"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            <Input defaultValue={productData?.netWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} />
                            {/* <Checkbox defaultChecked={productData?.containsGemstone} checked={field.value} onCheckedChange={field.onChange} /> */}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                        Pendant fixed
                      </Label>
                      <FormField
                      control={productForm.control}
                      name="isPendantFixed"
                      render={({ field }) => (
                        <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                          <FormControl>
                            {/* <Input placeholder={productData?.netWeight+""} className={`col-span-3 focus-visible:ring-primaryDark`}  {...field} /> */}
                            <Checkbox defaultChecked={productData?.isPendantFixed} checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                      Product description
                      </Label>
                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className={`col-span-3 focus-visible:ring-primaryDark`}>
                            <FormControl>
                              <Input placeholder={productData?.description} className={`col-span-3 focus-visible:ring-primaryDark`} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="name">
                      Product Category
                      </Label>
                      <FormField
                        control={productForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className={`col-span-3 focus:ring-primaryDark focus-visible:ring-primaryDark`}>
                            <FormControl>
                            {/* Todo: find out the reason for the default value not being set */}
                            <Select onValueChange={field.onChange} {...field} defaultValue={categories?.[0]?._id} >
                              <SelectTrigger className={`col-span-3 bg-white text focus:ring-primaryDark focus-visible:ring-primaryDark`}>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent {...field} className={`focus:ring-primaryDark bg-white focus-visible:ring-primaryDark active-visible:ring-primaryDark`}>
                                <SelectGroup {...field}>
                                  <SelectLabel>Select category</SelectLabel>
                                  {categories?.map((category: ICategory) => <SelectItem key={category?.name} value={category?._id!}>{category?.name}</SelectItem>)}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>
                  <div className={`grid grid-cols-4 items-center gap-4`}>
                      <Label htmlFor="username">
                      Images
                      </Label>
                      <div className={`flex h-full items-center gap-4 flex-wrap justify-between col-span-3`}>
                        {productData?.imageUrl?.map(image => <div className={`h-14 w-14`}>
                          <img src={image?.url} className={`rounded-md object-cover w-full h-full`} alt="" />
                        </div>)}
                      </div>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className={`inria-serif-regular h-8 w-8 p-0`}>
                <span className={`sr-only inria-serif-regular`}>Open menu</span>
                <MoreHorizontal />
              </Button>
              {/* open menu */}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className={`inria-serif-regular z-50 bg-white`}>
              {/* <DropdownMenuLabel>Edit your product</DropdownMenuLabel> */}
              <DropdownMenuItem
                // onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                <Button onClick={() => {
                  setIsDialogOpen(true);
                }} className={`hover:text-yellow-500 w-full grid-cols-3 gap-2 items-center justify-start h-12`} variant={"ghost"}>
                  <PencilIcon className={`w-4 h-4 col-start-1 col-span-1`} />
                  <span className={`col-start-2 col-span-2`}>Edit</span>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={`p-0`}><Button disabled={isTrashButtonLoading} onClick={async () => {
                await handleProductDelete();
              }} className={`hover:text-red-500 w-full flex justify-start items-center gap-2`} variant={"ghost"}>{!isTrashButtonLoading ? <Trash2 className={`w-4 h-4`} /> : <LoaderCircle className={`w-4 h-4 animate-spin`}/>} Delete</Button></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    },
  },
]

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
 
  const [ productData, setProductData ] = React.useState<IProduct[]>([]);

  React.useEffect(() => {
    (async function () {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/get-all-products`, {
          method: "GET",
          headers: {
            "content-type": "application/json"
          },
        });
  
        const data = await response.json();
  
        if ( !response.ok ) throw new Error("Failed to load products");

        console.log(data);

        setProductData(data.data);  
      
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const table = useReactTable<IProduct>({
    data: productData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className={`w-full h-full max-h-screen`}>
      <div className={`flex items-center py-4`}>
        {/* <Input
          placeholder="Filter by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className={`max-w-sm"
        /> */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className={`capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className={`rounded-md border`}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className={`h-24 text-center`}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className={`flex items-center justify-end space-x-2 py-4`}>
        <div className={`text-muted-foreground flex-1 text-sm`}>
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className={`space-x-2`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export const DashboardProductsPage = () => {
  return (
    <div className={`bg-red-500/20 w-full h-full p-4 pt-0 relative pointer-events-auto overflow-y-scroll no-scrollbar`}>
      <DataTableDemo />
    </div>
  )
}