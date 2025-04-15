export interface ICategory {
    _id?: string,
    name: string,
    subCategories?: ISubCategory[],
    products?: IProduct[],
    banners?: IBanner[],
    description: string,
};

export interface ISubCategory {
    _id?: string,
    name: string,
    parentCategory: ICategory,
    products?: IProduct[],
    description: string,
    banners?: IBanner[]
};

export interface IBanner {
    _id?: string,
    imageUrl: { url: string, publicId: string },
    bannerName: string,
    bannerType: "category-banner" | "collection-banner",
    validFrom?: string,
    validUpto?: string
};

export interface IProduct {
    gemStoneColour: string
    _id?: string,
    productId: string,
    code: string,
    name: string,
    category?: ICategory,
    subCategories?: ISubCategory[],
    collections?: ICollection[],
    goldWeight?: number,
    diamondWeight?: number,
    netWeight: number,
    solitareWeight: number,
    grossWeight?: number,
    noOfSolitares?: number,
    noOfMultiDiamonds?: number,
    multiDiamondWeight: number,
    totalKarats: number ,
    gender: "Male" | "Female" | "Neutral",
    goldColor: string,
    shapeOfSolitare?: string,
    shapeOfMultiDiamonds?: string,
    description?: string,
    stock: number,
    price: number,
    quantitySold: number,
    imageUrl: { url: string, publicId: string }[],
    isPendantFixed: boolean,
    containsGemstone: boolean,
    gemStoneWeightSol: number,
    isMrpProduct: boolean,
    addChain: boolean,
    pointersWeight: number,
    colouredStone: string [],
    gemStoneWeightPointer: number
};

export interface IGoldCoin {
    _id: string,
    name: string, 
    weight: number,
    karats: number,
    imageUrl: [{
        url: string,
        publicId: string,
    }],
    price: number
}

export interface ICartItem {
    product: IProduct,
    quantity: number,
    color: string,
    karat: number,
    totalPrice: number
};

export interface IWishListItem {
    // product: IProduct | IGoldCoin,
    product: IProduct,
    color: string,
    karat: number,
};

export interface IOrder {
    orderId: string,
    customerId: string,
    total: number,
    deliveryAddress?: {
        line1?: string,
        line2?: string,
        company?: string,
        city?: string,
        postalCode?: number,
        state?: string,
    },
    orderStatus: "Fulfilled" | "Pending" | "In-transit",
    cart?: ICartItem[],
    note?: string
};

export interface ICollection {
    _id?: string,
    name: string,
    banners?: [],
    products?: IProduct[]
};

export interface IUser {
    _id?: string,
    googleId?: string,
    img?: {
        link: string,
        source: string
    },
    verified?: boolean,
    firstName: string,
    lastName: string,
    phoneNumber: number,
    phoneNumberVerified: boolean,
    email: string,
    emailVerified: boolean,
    wishList: IWishListItem[]
    address?: {
        line1?: string,
        line2?: string,
        company?: string,
        city?: string,
        postalCode?: number,
        state?: string,
    },
    giftCards: IGiftCard[],
    cart: ICartItem[],
    orders: IOrder[],
    videoCallCart: ICartItem[],
    videoCalls: [
        {
            name: String,
            phoneNo: Number,
            status: "Pending" | "Concluded",
            email: String,
            createdAt?: String,
        }
    ]
    totalOrderAmount: number,
    luckyPoints: number,
    role?: "Customer"| "Admin" | "Guest",
    password?: string,
    comment?: string,
    refreshToken?: string,
    createdAt?: string,
    updatedAt?: string,
    __v?:0,
};

export interface IGiftCard {
    code: string
    amount: number
    occasion: string
    recipientName: string
    recipientEmail: string
    recipientPhone: number
    // sender: IUser,
    sender: string,
    message: string,
    validUpto: string,
    used: boolean,
    price: number,
    imageUrl: {
        url: string,
        publicId: string
    }
}