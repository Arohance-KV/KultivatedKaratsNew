import {
    ArrowLeft,
    ArrowRight,
    // ArrowRight,
    Facebook, Gem, Instagram, Mouse, Stamp, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { gsap } from "gsap";
import { useEffect
    // , useRef
    // , useRef
    , useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { cn } from "@/lib/utils";
import { BLOGDATA, FACEBOOK, INSTAGRAM, WHATSAPP } from "@/utils/constants";
// import { TestimonialCard } from "./Text";
import Marquee from "react-fast-marquee";
import { Carousel as BlogCarousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Carousel, { ArrowProps, DotProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '../../../styles/carousel-override.css';
const Reel = ({ reel, navigate } : { navigate: any, reel: {title: string, url: string, product: {
    imageUrl: {
        url: string,
        // publicId: string,
    },
    name: string,
    _id: string
} }}) => {
    return (
        <div onClick={(e) => {
            e.preventDefault();
            navigate(`/product/${reel?.product?._id}`)
        }} className="flex flex-col w-auto hover:cursor-pointer sm:w-[calc(300px*0.85)] sm:h-[450px] playfair-display rounded-xl">
            <div className="bg-[#E1C6B3] rounded-t-[inherit] flex flex-[0.85]">
                    {/* <video src={reel.url}></video> */}
                <video src={reel.url} className="rounded-[inherit] sm:h-[calc(0.85*450px)] w-[inherit] sm:min-w-full" muted={true} controls={false} autoPlay={true}></video>
            </div>
            {/* ToDo: change when mapped to product <div className="flex-[0.15] py-2 flex items-center gap-4 px-4 bg-gradient-to-b from-white to-[#E1C6B3] rounded-b-[inherit]"> */}
            <div className="flex-[0.15] py-2 flex justify-center items-center gap-4 px-4 bg-gradient-to-b from-white to-[#E1C6B3] rounded-b-[inherit]">
                <div id="reels-image" className="rounded-full bg-[#E1C6B3] sm:h-14 h-8 aspect-square">
                    <img src={reel.product?.imageUrl?.url} className="w-full h-full rounded-[inherit]"></img>
                </div>
                {/* <div className="text-[#A68A7E]">
                    {reel?.title}
                </div> */}
            </div>
        </div>
    );
};
gsap.registerPlugin(ScrollTrigger);
// let elementRotate: number;
const REELS_DATA = [
    {
        title: 'reel 1',
        url: '/KultivatedKaratsAssets/reel-1.mp4',
        product: {
            _id: "67fe5db118a0ffb695357a6e",
            imageUrl: {
                url: "http://res.cloudinary.com/dthrjonaq/image/upload/v1744261782/daadis.in/pdnb7kmxorfjiptf7asx.jpg",
                publicId: "",
            },
            name: "The Kriti Ring",
        }
    },
    {
        title: 'reel 2',
        // url: 'https:',
        url: '/KultivatedKaratsAssets/reel-2.mp4',
        product: {
            _id: "67fe5da918a0ffb695357a62",
            imageUrl: {
                url: "http://res.cloudinary.com/dthrjonaq/image/upload/v1744261751/daadis.in/zj6mql9ty5ffblk0rmt2.jpg",
                publicId: "",
            },
            name: "The Leya Ring"
        }
    },
    {
        title: 'reel 1',
        url: '/KultivatedKaratsAssets/reel-3.mp4',
        product: {
            _id: "67fe5da718a0ffb695357a5f",
            name: "The Charvi Ring",
            imageUrl: {
                url: "http://res.cloudinary.com/dthrjonaq/image/upload/v1744261742/daadis.in/rfwdgwbcn2a8u6e42hts.webp",
                publidId: ""
            }
        }
    },
];
// const scrollAnimationTimeline = gsap.timeline();
export const TESTIMONIALS = [
    {
        customerName: "Karandeep",
        rating: 5,
        descripttion: `I couldn’t be happier with my decision to purchase a lab-grown diamond from Kultivated Carats! From start to finish, the experience was exceptional.`,
        sourceLogo: {
            url: `/male.png`,
            publicId: ""
        }
    },
    {
        customerName: "Ritu Jain",
        rating: 5,
        descripttion: `All the jewellery is uniquely and thoughtfully designed and each piece is very meticulously created. You won't be disappointed. I highly recommend their collection!!!`,
        sourceLogo: {
            url: `/female.png`,
            publicId: ""
        }
    },
    {
        customerName: "Shashank SK",
        rating: 5,
        descripttion: `Exceptional quality and service! Kultivated Karats delivers brilliant lab grown diamonds with unmatched elegance.👏`,
        sourceLogo: {
            url: `/male.png`,
            publicId: ""
        }
    },
   
];
export const ReviewCard = ({ name, rating, review, imageUrl, className } : { name: string, rating: number, review: string, imageUrl: string, className: string }) => {
    const renderStars = () => {
      const filledStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
 
      let stars = [];
      for (let i = 0; i < 5; i++) {
        if (i < filledStars) {
          stars.push(<span key={i} className="text-white text-xl">★</span>);
        } else if (i === filledStars && hasHalfStar) {
          stars.push(<span key={i} className="text-white text-xl">★</span>); // You'd need a half-star icon for this
        } else {
          stars.push(<span key={i} className="text-white text-xl">☆</span>);
        }
      }
      return stars;
    };
 
    return (
      <div className={"bg-[#E1C6B3] rounded-[15px] p-6 flex items-center sm:h-[222px] w-full sm:w-[350px] "+className}>
        <div className="bg-white rounded-full w-[20%] h-[full] mr-6 flex-shrink-0">
          <img src={imageUrl} className="w-full h-full rounded-[inherit]" alt="" />
        </div>
        <div>
          <h3 className="text-white text-xl font-normal mb-2 tracking-wider">
            {name}
          </h3>
          <div className="flex items-center mb-2">
            {renderStars()}
          </div>
          <p className="text-white text-xs sm:text-base font-normal tracking-wide leading-6">
            {review}
          </p>
        </div>
      </div>
    );
};
 
export const HomePage = () => {
    useEffect(() => {
        gsap.to("#hero-section", {
            // width: "100%",
            opacity: "100%"
            // scrollTrigger:
        });
        // Categories element animation
        // gsap.to("#categories-hover-element", {
        // translateX: "75%",
        // duration: 2
        // });
        gsap.to("#categories", {
            opacity: "100%",
            scrollTrigger: {
                trigger: "#categories",
                scroller: "body",
                // markers: true,
                start: "top 10%",
                // snap: 0.7
                // scrub: true
            },
            duration: 1
        });
        gsap.to("#reels-section", {
            opacity: "100%",
            scrollTrigger: {
                trigger: "#reels-section",
                scroller: "body",
                // markers: true,
                start: "top 10%",
                // snap: 0.7
                // scrub: true
            },
            duration: 1
        });
        gsap.to("#testimonials", {
            opacity: "100%",
            scrollTrigger: {
                trigger: "#testimonials",
                scroller: "body",
                // markers: true,
                start: "top 10%",
                // snap: 0.7
                // scrub: true
            },
            duration: 1
        });
        // collections section animation
        gsap.to("#collections-home-element", {
            scrollTrigger: {
                trigger: "#collections",
                scroller: "body",
                // markers: true,
                start: "top 10%",
                // snap: 0.7
                // scrub: true
            },
            onComplete: () => {
                gsap.to(".collection-split-svg", {
                    onComplete: () => {
                        gsap.to("#collections-text", {
                            opacity: "100%"
                        });
                        gsap.to("#collections-home-banner", {
                            opacity: "100%"
                        });
                    },
                    // clipPath: "circle(100% at center)",
                    // width: "auto",
                    translateX: 0,
                    duration: 1
                });
            },
            opacity: "100%",
            duration: 1
        })
       
        gsap.to("#categories-hover-element", {
           
        });
        gsap.to("#shop-by-budget", {
            scrollTrigger: {
                trigger: "#shop-by-budget",
                scroller: "body",
                start: "top 10%",
                // markers: true
            },
            onComplete: () => {
                gsap.to(".shop-by-budget-hexagon", {
                    // width: "500px",
                    // clipPath: "polygon(50% -50%,100% 50%,50% 150%,0 50%)",
                    rotate: "-45deg",
                });
                // gsap.to("#shop-by-budget-hexagon-2", {
                // width: "300px"
                // });
                // gsap.to("#shop-by-budget-hexagon-3", {
                // width: "150px"
                // });
            },
            opacity: "100%",
            duration: 1
        });
       
        gsap.to("#about-section-first", {
            scrollTrigger: {
                trigger: "#about-section",
                scroller: "body",
                start: "top 10%",
                // markers: true
            },
            translateX: 0,
            duration: 1
        });
        gsap.to("#about-section-second", {
            scrollTrigger: {
                trigger: "#about-section",
                scroller: "body",
                start: "top 10%",
                // markers: true,
            },
            duration: 1,
            translateX: 0,
        });
            // about us section animation
            gsap.to("#about-us-main", {
                scrollTrigger: {
                    trigger: "#about-us-section-2",
                    scroller: "body",
                    // markers: true,
                    start: "top 10%",
                    // snap: 0.7
                    // scrub: true
                },
                // scrollSnapType: "y mandatory",
                onComplete: () => {
                    gsap.to("#border-element", {
                        top: "-5%",
                        bottom: "-5%",
                        left: "-5%",
                        right: "-5%",
                        onComplete: () => {
                            gsap.to("#about-us-banner", {
                                backgroundColor: "#E1C6B3",
                            });
                            gsap.to("#about-us-section-text", {
                                backgroundColor: "#E1C6B3",
                                color: "#fff",
                            });
                            gsap.to("#about-us-second-image", {
                                height: "200px",
                                width: "200px",
                                onComplete: () => {
                                    gsap.to("#about-us-first-image", {
                                        height: "150px",
                                        width: "150px",
                                        onComplete: () => {
                                            gsap.to("#about-us-banner", {
                                                width: "60%",
                                            });
                                            gsap.to("#about-us-line-element-1", {
                                                opacity: "100%",
                                                right: "60%"
                                            });
                                            gsap.to("#about-us-line-element-2", {
                                                opacity: "100%",
                                                left: "-40%"
                                            });
                                            gsap.to("#about-us-first-image", {
                                                rotateZ: "45deg"
                                            });
                                        }
                                    })
                                }
                            });
                        },
                    });
                },
                opacity: "100%",
                duration: 1,
            });
            // gsap.timeline({ repeat: -1, yoyo: true }) // repeat forever
            // .to("#categories-hover-element", {
            // translateX: "300px",
            // duration: 2,
            // rotateZ: 80,
            // onComplete: () => {
            // // @ts-ignore
            // // categoriesImageRef.current.src = "/earring.png";
            // }
            // })
            // .to("#categories-hover-element", {
            // translateX: "560px",
            // duration: 2,
            // rotateZ: 100,
            // onComplete: () => {
            // // @ts-ignore
            // // categoriesImageRef.current.src = "/pendent.png";
            // }
            // })
            // .to("#categories-hover-element", {
            // translateX: "0",
            // duration: 2,
            // rotateZ: 75,
            // onComplete: () => {
            // // @ts-ignore
            // // categoriesImageRef.current.src = "/ring.png";
            // }
            // });
    }, []);
    const navigate = useNavigate();
    // const categoriesImageRef = useRef(null);
    const [ aboutUsEmblem, setAboutUsEmblem ] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
          setAboutUsEmblem(prev => (prev >= 3 ? 0 : prev + 1));
        }, 3000);
     
        return () => clearInterval(interval); // good cleanup
    }, []);
    const CustomLeftArrow = ({ onClick, ...rest }: ArrowProps) => {
        const {
            // carouselState: { currentSlide },
        } = rest;
        return (
            <Button variant={"ghost"}
                onClick={onClick}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-[#a68a7e] text-white hover:text-[#BFA6A1] px-4 py-2 p-4 w-0 h-0 flex justify-center items-center rounded-full shadow-md"
                aria-label="Next"
            >
                <ArrowLeft className="" />
            </Button>
        );
    };
    const CustomRightArrow = ({ onClick, ...rest }: ArrowProps) => {
        const {
            // carouselState: { currentSlide },
        } = rest;
        return (
            <Button variant={"ghost"}
                onClick={onClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-[#a68a7e] text-white hover:text-[#BFA6A1] px-4 py-2 p-4 w-0 h-0 flex justify-center items-center rounded-full shadow-md"
                aria-label="Next"
            >
                <ArrowRight className="" />
            </Button>
        );
    };
    const CustomDot = ({ onClick, active }: DotProps) => (
        <button
          onClick={onClick}
          className={`w-3 h-3 rounded-full mx-1 border-2 border-[#a68a7e] ${active ? 'bg-[#BFA6A1]' : 'bg-transparent'}`}
        />
    );
    return (
        <>
            <div className="sm:hidden w-full gap-14 min-h-screen flex-col flex">
                <section className="w-[80%] aspect-square bg-white self-center mt-14">
                    <Carousel
                            customDot={<CustomDot />}
                            customRightArrow={<CustomRightArrow onClick={() => {}} />}
                            customLeftArrow={<CustomLeftArrow onClick={() => {}} />}
                            additionalTransfrom={0}
                            arrows
                            autoPlaySpeed={3000}
                            centerMode={false}
                            className="home-page-carousel absolute top-0 left-0 right-0 sm:h-[90vh] h-full w-full"
                            containerClass="home-page-carousel-container"
                            dotListClass="absolute! bottom-8!"
                            draggable
                            focusOnSelect={false}
                            infinite
                            itemClass=""
                            keyBoardControl
                            minimumTouchDrag={80}
                            pauseOnHover
                            renderArrowsWhenDisabled={false}
                            renderButtonGroupOutside={false}
                            renderDotsOutside={false}
                            responsive={{
                                desktop: {
                                breakpoint: {
                                    max: 3000,
                                    min: 1024
                                },
                                items: 1
                                },
                                mobile: {
                                breakpoint: {
                                    max: 464,
                                    min: 0
                                },
                                items: 1
                                },
                                tablet: {
                                breakpoint: {
                                    max: 1024,
                                    min: 464
                                },
                                items: 1
                                }
                            }}
                            rewind={false}
                            rewindWithAnimation={false}
                            rtl={false}
                            shouldResetAutoplay
                            showDots
                            sliderClass=""
                            slidesToSlide={1}
                            swipeable
                        >
                            {/* <img src="/banner.png" className="absolute top-0 left-0 right-0 sm:h-[90vh] h-full w-full object-cover" alt="" /> */}
                            {/*<img src="/mobile-newbanner.jpg" className="w-full h-full object-cover" alt="" />*/}
                            {/*<img src="/mobile-banner.png" className="w-full h-full object-cover" alt="" />*/}
                            <img src="https://res.cloudinary.com/dmrgscauc/image/upload/v1757503912/1_tsrnz5.png" className="w-full h-full m-auto object-cover" alt="" />
                            <img src="https://res.cloudinary.com/dmrgscauc/image/upload/v1757503912/2_vp3zzc.png" className="w-full h-full m-auto object-cover" alt="" />
                        </Carousel>
                </section>
                <section className="inria-serif-regular text-[#BFA6A1] flex flex-col justify-center items-center gap-4">
                    <p className="text-center px-4">
                        At Kultivated Karats, trust is our foundation. From pure diamonds to honest service, we ensure jewelry you can cherish with confidence
                    </p>
                    <div className="flex gap-4 scale-60 sm:scale-100">
                        <div id="card" className="rounded-[25%] shadow-[0px_0px_20px_0px_rgba(119,96,23,0.25)] flex p-4 items-center justify-center border-[#C5B2A1] border-2 text-[#C5B2A1] flex-col w-[150px] aspect-square">
                            <Truck className="w-[50%] h-[50%] stroke-2"/>
                            <span className="text-sm font-bold text-center">Free shipping</span>
                        </div>
                        <div id="card" className="rounded-[25%] sm:hidden flex shadow-[0px_0px_20px_0px_rgba(119,96,23,0.25)] p-4 items-center justify-center border-[#C5B2A1] border-2 text-[#C5B2A1] flex-col w-[150px] aspect-square">
                            <Gem className="w-[50%] h-[50%] stroke-2"/>
                            <span className="font-bold text-center text-sm">Tested and certified diamonds</span>
                        </div>
                        <div id="card" className="rounded-[25%] sm:hidden flex shadow-[0px_0px_20px_0px_rgba(119,96,23,0.25)] p-4 items-center justify-center border-[#C5B2A1] border-2 text-[#C5B2A1] flex-col w-[150px] aspect-square">
                            <Stamp className="w-[50%] h-[50%] stroke-2"/>
                            <span className="font-bold text-sm text-center">Hallmark pure gold</span>
                        </div>
                    </div>
                </section>
                <section className="w-full ">
                    <div className="w-[30%] aspect-[10/16] relative bg justify-self-center rounded-t-full">
                    <img src="/KultivatedKaratsAssets/collage_3.png" className="absolute top-0 bottom-0 left-0 right-0 h-full object-cover rounded-b-2xl rounded-[inherit]" alt="" />
                        {/* <div className="absolute bg-red-600 top-[-5%] bottom-[-5%] left-[-5%] right-[-5%] z-[-100] bg-transparent rounded-t-[inherit] rounded-b-[inherit] border border-[#BFA6A1] "></div> */}
                        <div id="border-element" className="absolute top-[0] bottom-[0] left-[0] right-[0] z-[-100] bg-transparent rounded-t-[inherit] rounded-b-[inherit] border border-[#BFA6A1] "></div>
                        <img alt="img-1" src="/KultivatedKaratsAssets/collage_1.png" className="bg-[#E1C6B3] object-cover absolute !w-20 aspect-square rotate-45 translate-x-[50%] translate-y-1/3 bottom-0 right-[0%] rounded-lg z-[-10]" />
                        <img alt="img-2" src="/KultivatedKaratsAssets/collage_2.png" className="bg-[#E1C6B3] object-cover absolute top-[-10px] left-[0%] -translate-x-[70%] rounded-full w-24 aspect-square z-[-10]" />
                        <div id="about-us-line-element-1" className="border-[0.5px] opacity-0 border-[#BFA6A1] h-0 absolute bottom-[-15%] right-[100%] left-0">
                            <div className="w-2 h-2 rounded-full bg-[#BFA6A1] absolute right-[0] top-1/2 translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>
                </section>
                <section className="w-[90%] justify-self-center flex flex-col items-center justify-center gap-8 self-center relative mt-14">
                    <div className="relative w-full h-68">
                        <p className="text-center inria-serif-regular text-[#BFA6A1] text-6xl">Collections</p>
                        <img src="./hand.png" alt="" className="absolute w-48 top-0 left-1/2 -translate-x-1/2" />
                    </div>
                    <p className="text-[#BFA6A1] text-center">
                        Explore the exquisite collections by Kultivated Karats, where elegance meets perfection.
                        Discover timeless jewelry crafted with brilliance, elegance, and sustainable luxury at Kultivated Karats.
                    </p>
                    <Button onClick={(e) => {
                        e.preventDefault();
                        navigate("/products");
                    }} className="bg-[#E9D6C8] px-10 text-white rounded-none transition-all border-2 hover:text-[#BFA6A1] hover:bg-white border-[#BFA6A1]">See more</Button>
                    <div id="carousel" className="bg-pink-300/30 aspect-video h-[80%]">
                        <img src="/KultivatedKaratsAssets/collections-banner.png" className="w-full h-full object-cover" alt="" />
                    </div>
                </section>
                <section className="w-full flex flex-col gap-8 justify-center my-14 items-center">
                    <p className="text-[#E1C6B3] inria-serif-regular my-4 text-3xl">Shop by categories</p>
                    <div onClick={(e) => {
                        e.preventDefault();
                        navigate("/products?category-filter=ring");
                    }} className="border text-white inria-serif-regular flex-col justify-center items-center border-[#BFA6A1] w-[80%] flex bg-[#BFA6A1]">
                        <img src="/mobile-rings.png" className="w-full bg-white aspect-square" alt="" />
                        <p className="py-4">Rings</p>
                    </div>
                    <div onClick={(e) => {
                        e.preventDefault();
                        navigate("/products?category-filter=earring");
                    }} className="border text-white inria-serif-regular flex-col justify-center items-center border-[#BFA6A1] w-[80%] flex bg-[#BFA6A1]">
                        <img src="/mobile-earings.png" className="w-full bg-white aspect-square" alt="" />
                        <p className="py-4">Earings</p>
                    </div>
                    <div onClick={(e) => {
                        e.preventDefault();
                        navigate("/products?category-filter=pendant");
                    }} className="border text-white inria-serif-regular flex-col justify-center items-center border-[#BFA6A1] w-[80%] flex bg-[#BFA6A1]">
                        <img src="/mobile-pendant.png" className="w-full bg-white aspect-square" alt="" />
                        <p className="py-4">Pendants</p>
                    </div>
                </section>
                <section className="w-[80%] my-14 justify-self-center self-center justify-center items-center flex flex-col gap-4 text-[#BFA6A1] text-center">
                    <p className="text-3xl">Shop by look</p>
                    <div className="flex flex-col gap-4">
                        {REELS_DATA.map(reel => {
                            return (
                                <>
                                    <Reel navigate={navigate} reel={reel} />
                                </>
                            )
                        })}
                    </div>
                </section>
                <section className="mt-14">
                    <div className="bg-[#BFA6A1] w-full relative h-28">
                        <img src="/KultivatedKaratsAssets/about-us-2.png" alt="" className="h-full absolute left-1/2 scale-150 -translate-x-1/2 object-cover" />
                    </div>
                    <p className="text-[#BFA6A1] w-[80%] self-center justify-self-center text-center mt-14">
                        Lab-grown diamonds capture the beauty of everlasting love—pure, radiant, and ethically crafted. Each sparkle tells a story of brilliance without compromise, a promise of sustainability and elegance. Wear a gem that shines with emotion, reflecting your values and timeless grace.
                    </p>
                    <div className="mt-14 items-center justify-between flex">
                        <svg width="61" height="31" viewBox="0 0 61 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line y1="0.5" x2="61" y2="0.5" stroke="#BFA6A1"/>
                            <line y1="30.5" x2="61" y2="30.5" stroke="#BFA6A1"/>
                            <line y1="15.5" x2="38" y2="15.5" stroke="#BFA6A1"/>
                        </svg>
                        <img src="/KultivatedKaratsAssets/about-us-2_2.png" className="w-1/2 aspect-square" alt="" />
                        <svg width="61" height="31" viewBox="0 0 61 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line y1="-0.5" x2="61" y2="-0.5" transform="matrix(-1 0 0 1 61.0024 1)" stroke="#BFA6A1"/>
                            <line y1="-0.5" x2="61" y2="-0.5" transform="matrix(-1 0 0 1 61.0024 31)" stroke="#BFA6A1"/>
                            <line y1="-0.5" x2="38" y2="-0.5" transform="matrix(-1 0 0 1 61.0024 16)" stroke="#BFA6A1"/>
                        </svg>
                    </div>
                    <p className="text-[#BFA6A1] w-[80%] self-center justify-self-center text-center mt-14">
                        Kultivated Karats has redefined luxury by blending tradition with innovation, offering exquisite lab-grown diamond jewelry that embodies purity, brilliance, and sustainability. As a leader in the industry, we craft pieces that tell stories—of love, elegance, and conscious choices. Our commitment to excellence ensures every jewel sparkles with emotion, making us a trusted name in fine jewelry.
                    </p>
                </section>
                <section className="w-[90%] justify-self-center flex flex-col my-14 justify-center items-center self-center">
                    {/* <div className="flex-1 flex w-full relative">
                        <div className="flex-1 ">
                            <div className="text-[#BFA6A1] w-full text-nowrap text-[200%] mb-14">
                                What people say
                            </div>
                        </div>
                        <div className="sm:flex-1 flex-[0.25] relative">
                            <div className="h-[100px] right-0 -bottom-[50%] z-50 absolute aspect-square rounded-full bg-[#A68A7E]">
                                <img src="https://i2.wp.com/appfinite.com/wp-content/plugins/wp-first-letter-avatar/images/default/256/latin_k.png?ssl=1" className="w-full h-full object-cover rounded-full" alt="" />
                            </div>
                        </div>
                        <img src="/double-quotes.svg" className="z-0 sm:-bottom-[22%] -bottom-[70%] scale-50 sm:scale-100 absolute sm:left-[50%] left-0 sm:-translate-x-1/2" alt="" />
                    </div> */}
                    <div className="text-[#BFA6A1] justify-evenly gap-4 flex flex-col items-center w-full h-full text-[200%] sm:mb-0 sm:text-[500%]">
                        What people say
                        <div className="flex flex-col gap-4">
                            {TESTIMONIALS.map(testimonial => <ReviewCard name={testimonial?.customerName} rating={testimonial?.rating} imageUrl={testimonial?.sourceLogo?.url} className="" review={testimonial?.descripttion} />)}
                        </div>
                    </div>
                </section>
                {/* <section className="w-full flex gap-4 justify-evenly flex-col items-center">
                    <p className="blog-section-fade text-3xl text-[#BFA6A1]">Read the blog</p>
                    <div className="flex flex-col gap-4 justify-evenly w-full items-center">
                        {BLOGDATA?.map((blog) => (
                            <div className="">
                                <img src={ blog?.blogImageUrl?.url } className="w-32 aspect-video" />
                            </div>
                        ))}
                    </div>
                </section> */}
                <BlogSection />
            </div>
            <div id="home-page-main-container" className="home-page-carousel-container min-h-[100vh] sm:flex hidden flex-col gap-10 items-center sm:mb-14">
                <section id="hero-section" className="sm:h-[100vh] h-[50vh] w-full opacity-0 relative sm:snap-start">
                    <div id="hero-section-banner" className="sm:h-[90vh] h-[50vh] bg-[#E1C6B3] sm:w-full w-[90%] self-center justify-self-center relative">
                        <Carousel
                            customDot={<CustomDot />}
                            customRightArrow={<CustomRightArrow onClick={() => {}} />}
                            customLeftArrow={<CustomLeftArrow onClick={() => {}} />}
                            additionalTransfrom={0}
                            arrows
                            autoPlaySpeed={3000}
                            centerMode={false}
                            className="home-page-carousel absolute top-0 left-0 right-0 sm:h-[90vh] h-full w-full"
                            containerClass="home-page-carousel-container"
                            dotListClass="absolute! bottom-8!"
                            draggable
                            focusOnSelect={false}
                            infinite
                            itemClass=""
                            keyBoardControl
                            minimumTouchDrag={80}
                            pauseOnHover
                            renderArrowsWhenDisabled={false}
                            renderButtonGroupOutside={false}
                            renderDotsOutside={false}
                            responsive={{
                                desktop: {
                                breakpoint: {
                                    max: 3000,
                                    min: 1024
                                },
                                items: 1
                                },
                                mobile: {
                                breakpoint: {
                                    max: 464,
                                    min: 0
                                },
                                items: 1
                                },
                                tablet: {
                                breakpoint: {
                                    max: 1024,
                                    min: 464
                                },
                                items: 1
                                }
                            }}
                            rewind={false}
                            rewindWithAnimation={false}
                            rtl={false}
                            shouldResetAutoplay
                            showDots
                            sliderClass=""
                            slidesToSlide={1}
                            swipeable
                        >
                            {/* <img src="/banner.png" className="absolute top-0 left-0 right-0 sm:h-[90vh] h-full w-full object-cover" alt="" /> */}
                            {/*<img src="https://res.cloudinary.com/dmrgscauc/image/upload/v1755953570/NewBanner_1_raguzv.jpg" className="w-full h-full m-auto object-cover" alt="" />*/}
                            <img src="https://res.cloudinary.com/dmrgscauc/image/upload/v1757503592/1_btquhe.png" className="w-full h-full m-auto object-cover" alt="" />
                            <img src="https://res.cloudinary.com/dmrgscauc/image/upload/v1757503602/2_v1z8tm.png" className="w-full h-full m-auto object-cover" alt="" />
                        </Carousel>
                        <div id="social-links" className="flex text-white flex-col gap-4 w-auto absolute right-[5%] bottom-[15%]">
                            <Link to={INSTAGRAM}>
                                <Instagram />
                            </Link>
                            <Link to={FACEBOOK}>
                                <Facebook />
                            </Link>
                            {/* <Link to={YOUTUBE} className="hover:opacity-75">
                                <Youtube size={24} />
                            </Link> */}
                            <Link to={WHATSAPP} className="hover:opacity-75">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" stroke="#fff" fill="#fff" color="#fff" width="24" height="24" viewBox="0 0 32 32">
                                    <path fill-rule="evenodd" d="M 24.503906 7.503906 C 22.246094 5.246094 19.246094 4 16.050781 4 C 9.464844 4 4.101563 9.359375 4.101563 15.945313 C 4.097656 18.050781 4.648438 20.105469 5.695313 21.917969 L 4 28.109375 L 10.335938 26.445313 C 12.078125 27.398438 14.046875 27.898438 16.046875 27.902344 L 16.050781 27.902344 C 22.636719 27.902344 27.996094 22.542969 28 15.953125 C 28 12.761719 26.757813 9.761719 24.503906 7.503906 Z M 16.050781 25.882813 L 16.046875 25.882813 C 14.265625 25.882813 12.515625 25.402344 10.992188 24.5 L 10.628906 24.285156 L 6.867188 25.269531 L 7.871094 21.605469 L 7.636719 21.230469 C 6.640625 19.648438 6.117188 17.820313 6.117188 15.945313 C 6.117188 10.472656 10.574219 6.019531 16.054688 6.019531 C 18.707031 6.019531 21.199219 7.054688 23.074219 8.929688 C 24.949219 10.808594 25.980469 13.300781 25.980469 15.953125 C 25.980469 21.429688 21.523438 25.882813 16.050781 25.882813 Z M 21.496094 18.445313 C 21.199219 18.296875 19.730469 17.574219 19.457031 17.476563 C 19.183594 17.375 18.984375 17.328125 18.785156 17.625 C 18.585938 17.925781 18.015625 18.597656 17.839844 18.796875 C 17.667969 18.992188 17.492188 19.019531 17.195313 18.871094 C 16.894531 18.722656 15.933594 18.40625 14.792969 17.386719 C 13.90625 16.597656 13.304688 15.617188 13.132813 15.320313 C 12.957031 15.019531 13.113281 14.859375 13.261719 14.710938 C 13.398438 14.578125 13.5625 14.363281 13.710938 14.1875 C 13.859375 14.015625 13.910156 13.890625 14.011719 13.691406 C 14.109375 13.492188 14.058594 13.316406 13.984375 13.167969 C 13.910156 13.019531 13.3125 11.546875 13.0625 10.949219 C 12.820313 10.367188 12.574219 10.449219 12.390625 10.4375 C 12.21875 10.429688 12.019531 10.429688 11.820313 10.429688 C 11.621094 10.429688 11.296875 10.503906 11.023438 10.804688 C 10.75 11.101563 9.980469 11.824219 9.980469 13.292969 C 9.980469 14.761719 11.050781 16.183594 11.199219 16.382813 C 11.347656 16.578125 13.304688 19.59375 16.300781 20.886719 C 17.011719 21.195313 17.566406 21.378906 18 21.515625 C 18.714844 21.742188 19.367188 21.710938 19.882813 21.636719 C 20.457031 21.550781 21.648438 20.914063 21.898438 20.214844 C 22.144531 19.519531 22.144531 18.921875 22.070313 18.796875 C 21.996094 18.671875 21.796875 18.597656 21.496094 18.445313 Z"></path>
                                </svg>
                            </Link>
                            {/* <Link to={LINKEDIN} className="hover:opacity-75">
                                <Linkedin size={24} />
                            </Link> */}
                        </div>
                    </div>
                    {/* Hero section */}
                    <div className="sm:flex h-[10vh] justify-center hidden items-center">
                        <Mouse className="stroke-[#E1C6B3] w-10 h-10"/>
                    </div>
                </section>
                <section id="about-us-section" className="flex sm:mt-14 gap-4 sm:gap-14 items-center h-auto sm:self-end flex-col sm:flex-row mb-10 w-[85%] sm:justify-self-end justify-self-center self-center justify-between">
                    <div className="italic sm:hidden p-4 sm:text-2xl text-sm text-[#BFA6A1] flex justify-center items-center">
                        At Kultivated Karats, trust is our foundation. From pure diamonds to honest service, we ensure jewelry you can cherish with confidence
                    </div>
                    <Button onClick={() => navigate("/about")} className="bg-[#BFA6A1] mb-8 text-white! px-4 rounded-none sm:hidden block">About us</Button>
                    <div className="flex gap-4 scale-50 sm:scale-100">
                        <div id="card" className="rounded-[25%] overflow-hidden shadow-[0px_0px_20px_0px_rgba(119,96,23,0.25)] flex p-4 items-center justify-center border-[#C5B2A1] border-2 text-[#C5B2A1] flex-col max-w-[150px] aspect-square">
                            {aboutUsEmblem == 0 ? <>
                                <Truck className="max-w-[50%] max-h-[50%] stroke-2"/>
                                <span className="text-nowrap font-bold">Free shipping</span>
                            </> : aboutUsEmblem == 1 ? <>
                                <Gem className="max-w-[50%] max-h-[50%] stroke-2"/>
                                <span className="font-bold text-center text-sm">Tested and certified diamonds</span>
                            </> : <>
                                <Stamp className="max-w-[50%] max-h-[50%] stroke-2"/>
                                <span className="font-bold text-sm text-center">Hallmark pure gold</span>
                            </>}
                        </div>
                    </div>
                    <div className="sm:flex hidden items-center h-full flex-1 w-[400px] sm:visible">
                        <Link to={"/about"}>
                            <Button className="uppercase text-sm rounded-none text-white px-10 bg-[#BFA6A1]">About us</Button>
                        </Link>
                        <div className="flex-[0.5] border-1 h-[5px] w-full border-[#BFA6A1] bg-[#BFA6A1]"></div>
                        <div className="relative h-[150px] w-full flex-1">
                            <div className="border-[#BFA6A1] text-[#BFA6A1] italic p-10 border-4 flex justify-center items-center w-[97%] text-wrap h-[90%] bottom-0 left-0 absolute">
                                At Kultivated Karats, trust is our foundation. From pure diamonds to honest service, we ensure jewelry you can cherish with confidence
                            </div>
                            <div className="border-[#BFA6A1] p-10 border-4 flex justify-center items-center w-[97%] text-wrap h-[90%] top-0 right-0 absolute">
                               
                            </div>
                        </div>
                    </div>
                </section>
                <section id="about-us-section-2" className="h-screen w-full sm:flex justify-center items-center snap-start">
                    <div id="about-us-banner" className="relative bg-transparent rounded-l-full w-[20%] self-center h-[300px] mt-56 mb-56 justify-self-center">
                        <div className="absolute h-[450px] w-[350px] top-[50%] flex justify-center items-center -translate-y-1/2">
                            <div id="about-us-main" className="bg-[#E1C6B3] opacity-0 relative h-full flex justify-center items-center w-[100%] rounded-t-full rounded-b-lg border-spacing-10" style={{
                                // backgroundImage: "url('https://images5.alphacoders.com/433/thumb-1920-433550.jpg')",
                                // backgroundRepeat: "no-repeat",
                                // backgroundPosition: "0"
                            }}>
                                <img src="/KultivatedKaratsAssets/collage_3.png" className="absolute top-0 bottom-0 left-0 right-0 h-full object-cover rounded-b-2xl rounded-[inherit]" alt="" />
                                {/* <div className="absolute bg-red-600 top-[-5%] bottom-[-5%] left-[-5%] right-[-5%] z-[-100] bg-transparent rounded-t-[inherit] rounded-b-[inherit] border border-[#BFA6A1] "></div> */}
                                <div id="border-element" className="absolute top-[0] bottom-[0] left-[0] right-[0] z-[-100] bg-transparent rounded-t-[inherit] rounded-b-[inherit] border border-[#BFA6A1] "></div>
                                <img alt="img-1" src="/KultivatedKaratsAssets/collage_1.png" id="about-us-first-image" className="bg-[#E1C6B3] object-cover absolute translate-x-[70%] translate-y-1/3 bottom-0 right-[0%] rounded-lg h-[0px] w-[0px] z-[-10]" />
                                <img alt="img-2" src="/KultivatedKaratsAssets/collage_2.png" id="about-us-second-image" className="bg-[#E1C6B3] object-cover absolute top-[-10px] left-[0%] -translate-x-[70%] rounded-full h-[0] w-[0] z-[-10]" />
                                <div id="about-us-line-element-1" className="border-[0.5px] opacity-0 border-[#BFA6A1] h-0 absolute bottom-[-15%] right-[100%] left-0">
                                    <div className="w-2 h-2 rounded-full bg-[#BFA6A1] absolute right-[0] top-1/2 translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                                <div id="about-us-line-element-2" className="border-[0.5px] opacity-0 border-[#BFA6A1] h-0 absolute top-[50%] -left-[10%] right-[110%] rotate-180">
                                    <div className="w-2 h-2 rounded-full bg-[#BFA6A1] absolute right-[0] top-1/2 translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                            </div>
                        </div>
                        <div id="about-us-section-text" className="bg-transparent w-[50%] flex justify-center items-center h-full libre-bodoni font-bold text-white text-center pr-14 self-end justify-self-end">
                            Kultivated Karats brings you the perfect blend of tradition and innovation with our exquisite lab-grown diamond jewelry. Crafted with precision and sustainability in mind, our diamonds offer the same brilliance and elegance as natural ones while being ethically sourced. Whether it's a timeless solitaire, a statement necklace, or everyday luxury, our collection ensures beauty without compromise. Celebrate your moments with eco-friendly, conflict-free diamonds that shine forever.
                        </div>
                    </div>
                </section>
                {/* <section id="categories" className="playfair-display hidden opacity-0 relative w-full flex items-center snap-start h-[100vh] flex-col" */}
                <section id="categories" className="playfair-display opacity-0 relative w-full items-center snap-start max-h-screen flex-col"
                // onMouseMove={( event ) => {
                    // if ( event.pageX < 465 || event.pageX > 1200 ) return;
                    // if ( event.pageX < 750 )
                    // elementRotate = (75 + ((event.pageX-465) / 10));
                    // else
                    // elementRotate = (75 + ((event.pageX-465) / 10)) - (((event.pageX - 465) * 1) / 30);
                    // console.log(event.pageX, elementRotate);
                    // gsap.to("#categories-hover-element", {
                    // // translateX: event.pageX,
                    // // x: (event.pageX > 500) && (event.pageX < 1200) ? event.pageX-465 : "",
                    // x: event.pageX-465,
                    // duration: 0.5,
                    // rotateZ: elementRotate,
                    // });
                // }}
                >
                    {/* <div className="gap-4 py-[5%] flex text-[#BFA6A1] text-[75px] h-[100%] justify-center w-[80%] relative">
                        <div className="flex-1 h-full cursor-pointer flex justify-center items-center z-10" onClick={(e) => {
                            e.preventDefault();
                            navigate("/products?category-filter=ring");
                        }}>Rings</div>
                        <div className="flex-1 h-full cursor-pointer flex justify-center items-center z-10" onClick={(e) => {
                            e.preventDefault();
                            navigate("/products?category-filter=earrings");
                        }}>Earings</div>
                        <div className="flex-1 h-full cursor-pointer flex justify-center items-center z-10" onClick={(e) => {
                            e.preventDefault();
                            navigate("/products?category-filter=pendant");
                        }} >Pendants</div>
                        <div id="categories-hover-element" className="absolute bg-[#E9D6C8] z-[20] w-[350px] top-1/2 flex justify-end items-end -translate-y-1/2 left-[10%] aspect-video rotate-[75deg]">
                            <img ref={categoriesImageRef} src="/ring.png" className="absolute right-0 top-0 bottom-0 left-0" alt="" />
                        </div>
                    </div> */}
                    <Button onClick={(e) => {
                        e.preventDefault();
                        navigate("/products?category-filter=bangle");
                    }} className="hover:bg-transparent text-[#BFA6A1] absolute bottom-[5%] right-[10%] bg-transparent playpen-sans text-2xl hover:scale-110 transition-all z-10">See more <ArrowRight /></Button>
                    <div id="links" className="gap-4 absolute top-0 flex left-[10%] right-[10%] items-center bottom-0">
                        <Link to={`/products?category-filter=ring`} className="h-[80%] flex-1"></Link>
                        <Link to={`/products?category-filter=earring`} className="h-[80%] flex-1"></Link>
                        <Link to={`/products?category-filter=pendant`} className="h-[80%] flex-1"></Link>
                    </div>
                    <img src={"/category-section-animation.gif"} className="object-cover h-screen w-[80%] self-center justify-self-center" />
                </section>
                <section id="shop-by-budget" className="w-full snap-start opacity-0 min-h-screen playfair-display relative mb-14 justify-center items-center">
                    {/* <div className="flex bg-yellow-900/50 rotate-z-[-30deg] w-[80%] justify-between overflow-x-hidden overflow-y-hidden py-10"> */}
                        <div onClick={(e) => {
                            e.preventDefault();
                            navigate("/collections?filter=100k");
                        }} id="shop-by-budget-hexagon-1" className="w-[500px] shop-by-budget-hexagon hover:cursor-pointer absolute overflow-hidden flex justify-center items-center top-[20%] left-[10%]" style={{
                        // <div id="shop-by-budget-hexagon-1" className="hover:cursor-pointer absolute overflow-hidden flex justify-center items-center top-[20%] left-[10%]" style={{
                            aspectRatio: "1/cos(30deg)",
                            // borderRadius: "9999px",
                            clipPath: "polygon(50% -50%,100% 50%,50% 150%,0 50%)",
                            backgroundColor: "#BFA6A1",
                            // rotate: "-45deg"
                        }}>
                            <p className="z-10 rotate-z-[30deg] text-white text-9xl">
                                100k
                            </p>
                            <img src="/KultivatedKaratsAssets/shop-by-budget-1.png" className="top-0 bottom-0 hover:cursor-pointer rotate-z-[30deg] left-0 right-0 object-cover absolute" alt="" />
                        </div>
                        <div onClick={(e) => {
                            e.preventDefault();
                            navigate("/collections?filter=75k");
                        }} id="shop-by-budget-hexagon-2" className="w-[300px] shop-by-budget-hexagon absolute hover:cursor-pointer overflow-hidden flex justify-center items-center top-[15%] left-[45%]" style={{
                        // <div id="shop-by-budget-hexagon-2" className="absolute hover:cursor-pointer overflow-hidden flex justify-center items-center top-[15%] left-[45%]" style={{
                            aspectRatio: "1/cos(30deg)",
                            clipPath: "polygon(50% -50%,100% 50%,50% 150%,0 50%)",
                            backgroundColor: "#BFA6A1",
                            // rotate: "-45deg"
                        }}>
                            <p className="z-10 rotate-z-[30deg] text-white text-6xl">
                                75k
                            </p>
                            <img src="/KultivatedKaratsAssets/shop-by-budget-2.png" className="top-0 bottom-0 rotate-z-[30deg] left-0 right-0 object-cover absolute" alt="" />
                        </div>
                        {/* <div className="w-[250px] z-10 absolute overflow-hidden flex justify-center items-center top-[5%] left-[32%]" style={{
                            aspectRatio: "1/cos(30deg)",
                            clipPath: "polygon(50% -50%,100% 50%,50% 150%,0 50%)",
                            border: "1px solid #BFA6A1",
                            rotate: "-45deg"
                        }}>
                            <p className="z-[50] rotate-z-[30deg] text-white text-2xl">
                                15k
                            </p>
                            <img src="/katana.svg" className="top-0 bottom-0 rotate-z-[30deg] left-0 right-0 object-cover absolute" alt="" />
                        </div> */}
                        <div onClick={(e) => {
                            e.preventDefault();
                            navigate("/collections?filter=50k");
                        }} id="shop-by-budget-hexagon-3" className="w-[150px] shop-by-budget-hexagon shop-by-budget-hexagon z-10 absolute hover:cursor-pointer overflow-hidden flex justify-center items-center top-[15%] right-[22%]" style={{
                        // <div id="shop-by-budget-hexagon-3" className="z-10 absolute hover:cursor-pointer overflow-hidden flex justify-center items-center top-[15%] right-[22%]" style={{
                            aspectRatio: "1/cos(30deg)",
                            clipPath: "polygon(50% -50%,100% 50%,50% 150%,0 50%)",
                            backgroundColor: "#BFA6A1",
                            // rotate: "-45deg"
                        }}>
                            <p className="z-[50] rotate-z-[30deg] text-white text-3xl">
                                50k
                            </p>
                            <img src="/KultivatedKaratsAssets/shop-by-budget-3.png" className="top-0 bottom-0 rotate-z-[30deg] left-0 right-0 object-cover absolute" alt="" />
                        </div>
                        <div className="text-[#BFA6A1] leading-30 absolute bottom-0 right-0 -z-0 text-wrap h-auto text-8xl w-96">
                            Shop <br />by <br/>budget
                        </div>
                </section>
                <section id="collections" className="self-center justify-self-center snap-start w-[80%] h-[100vh]">
                    <div className="flex h-full flex-col">
                        {/* <p id="collections-home-heading" style={{
                            // clipPath: "circle(0% at center)"
                        }} className="flex self-center overflow-x-hidden w-0 justify-center sorts-mill-goudy-regular text-[#E1C6B3] p-0 m-0 z-[100] items-center justify-self-center tracking-wide text-[220px]">
                            Collections
                        </p> */}
                        <div className="collections-home-heading-text flex justify-center">
                            <div className="flex-1 flex justify-end overflow-hidden">
                                <img className="collection-split-svg translate-x-[100%]" src="/collections-text-1.svg"/>
                            </div>
                            <div className="flex-1 overflow-hidden relative">
                                <img className="collection-split-svg -translate-x-[100%]" src="/collections-text-2.svg"/>
                            </div>
                        </div>
                        <div id="collections-home-element" className="absolute opacity-0 left-1/2 -translate-x-1/2 z-[100] h-[85%] w-[30%]">
                            <img src="/hand.png" alt="" className="h-full" />
                        </div>
                        <div id="collections-text" className="flex opacity-0 justify-between gap-0 h-full flex-1">
                            <div className="flex flex-col flex-[0.33] playpen-sans h-full">
                                <p className="flex-1 text-[#BFA6A1] font-bold">
                                    Explore the exquisite collections by Kultivated Karats, where elegance meets perfection.
                                </p>
                                <p className="flex-1 text-[#BFA6A1] playpen-sans">
                                    Discover timeless jewelry crafted with brilliance, elegance, and sustainable luxury at Kultivated Karats.
                                </p>
                                <div className="flex-1">
                                    <Button onClick={(e) => {
                                        e.preventDefault();
                                        navigate("/products");
                                    }} className="bg-[#E9D6C8] px-10 text-white rounded-none transition-all border-2 hover:text-[#BFA6A1] hover:bg-white border-[#BFA6A1]">See more</Button>
                                </div>
                            </div>
                            {/* <div className="flex-[0.33] bg-red-600/30 w-full">
                                Image
                            </div> */}
                            <div id="collections-home-banner" className="flex-[0.33] opacity-0 flex justify-center items-center">
                                <div id="carousel" className="bg-pink-300/30 aspect-video h-[60%]">
                                    <img src="/KultivatedKaratsAssets/collections-banner.png" className="w-full h-full object-cover" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* <section id="reels-section" className="w-[80%] hidden playfair-display h-screen snap-start items-center justify-center flex flex-col gap-12 self-center justify-self-center"> */}
                <section id="reels-section" className="w-[80%] playfair-display min-h-screen snap-start flex-col gap-12 self-center justify-self-center">
                    <p className="text-[#BFA6A1] text-center text-8xl">
                        Shop by look
                    </p>
                    <div className="flex gap-12 mt-14 justify-center playfair-display! flex-wrap">
                        {REELS_DATA.map(reel => {
                            return (
                                <>
                                    <Reel reel={reel} navigate={navigate} />
                                </>
                            )
                        })}
                    </div>
                </section>
                <section id="about-section" className="sm:w-[80%] sm:h-screen overflow-x-hidden snap-start flex flex-col aspect-video justify-self-center">
                {/* <section id="about-section" className="w-[80%] h-screen bg-pink-600 overflow-x-hidden snap-start aspect-video justify-self-center"> */}
                    <div id="about-section-first" className="flex inria-serif-regular flex-[0.45] items-center -translate-x-[1500px]">
                        <div className="bg-[#BFA6A1] relative flex-[0.45] h-[70%] flex">
                            <img src="/KultivatedKaratsAssets/about-us-2.png" className="w-[66%] h-[140%] object-cover absolute top-[-20%] left-[10%]" alt="" />
                        </div>
                        <div className="flex-[0.55] text-[#8a7875]">
                            {/* <div className=" -translate-x-[10%] text-xl w-[90%]"> */}
                            <div className="text-xl w-[90%]">
                                Lab-grown diamonds capture the beauty of everlasting love—pure, radiant, and ethically crafted. Each sparkle tells a story of brilliance without compromise, a promise of sustainability and elegance. Wear a gem that shines with emotion, reflecting your values and timeless grace.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-[0.55] translate-x-[1500px]" id="about-section-second">
                        <div className="flex-1 flex items-center justify-end">
                            <div className="border-2 w-[95%] h-[70%] border-r-0 border-[#BFA6A1] flex justify-center items-center px-[10%] inria-serif-regular text-[#BFA6A1]">
                                Kultivated Karats has redefined luxury by blending tradition with innovation, offering exquisite lab-grown diamond jewelry that embodies purity, brilliance, and sustainability. As a leader in the industry, we craft pieces that tell stories—of love, elegance, and conscious choices. Our commitment to excellence ensures every jewel sparkles with emotion, making us a trusted name in fine jewelry.
                            </div>
                        </div>
                        <img src="/KultivatedKaratsAssets/about-us-2_2.png" alt="" className="bg-pink-300/40 border-none object-cover h-full w-[30%]" />
                    </div>
                </section>
                <section id="testimonials" className="w-[80%] opacity-0 snap-start playfair-display! justify-self-center sm:h-screen flex flex-col">
                    <div className="flex-1 flex-col flex w-full relative">
                        <div className="flex-1 ">
                            <div className="text-[#BFA6A1] justify-evenly flex flex-col items-center w-full h-full text-[200%] mb-14 sm:mb-0 sm:text-[500%]">
                                What people say
                                <Marquee className="flex rounded-md justify-evenly items-center w-full" autoFill speed={100}>
                                    {TESTIMONIALS.map(testimonial => <ReviewCard name={testimonial?.customerName} className="mr-4 sm:w-[656px]" rating={testimonial?.rating} imageUrl={testimonial?.sourceLogo?.url} review={testimonial?.descripttion} />)}
                                </Marquee>
                            </div>
                        </div>
                        {/* <div className="sm:flex-1 flex-[0.25] relative">
                            <div className="sm:h-[80%] h-[100px] right-0 sm:-bottom-[20%] -bottom-[10%] z-50 absolute aspect-square rounded-full bg-[#A68A7E]">
                                <img src="https://i2.wp.com/appfinite.com/wp-content/plugins/wp-first-letter-avatar/images/default/256/latin_k.png?ssl=1" className="w-full h-full object-cover rounded-full" alt="" />
                            </div>
                        </div> */}
                        {/* <img src="/double-quotes.svg" className="z-0 sm:-bottom-[22%] -bottom-[70%] scale-50 sm:scale-100 absolute sm:left-[50%] left-0 sm:-translate-x-1/2" alt="" /> */}
                    </div>
                    {/* <div className="flex-1 w-full sm:rounded-ee-[200px] rounded-ee-[100px] flex items-center pt-[5%] pl-[5%] bg-[#BFA6A1] z-10">
                        <div className="inria-serif-regular w-[70%] h-[100%] relative rounded-[inherit] sm:text-3xl text-lg text-white">
                            I couldn’t be happier with my decision to purchase a lab-grown diamond from Kultivated Carats! From start to finish, the experience was exceptional. The website was easy to navigate, and I really appreciated the transparency about the diamond’s origin and the sustainable practices behind its creation.
                            <div className="absolute font-[montserrat] bottom-[10%] italic right-0 text-sm">
                                Karandeep
                            </div>
                        </div>
                    </div> */}
                </section>
                <BlogSection />
            </div>
        </>
    );
};
const BlogSection = () => {
    const navigate = useNavigate();
    useEffect(() => {
        gsap.fromTo(".blog-section-fade", {
            opacity: "0%"
        }, {
            scrollTrigger: {
                trigger: "#blog-section",
                scroller: "body",
                // markers: true,
                start: "top 10%",
                // snap: 0.7
                // scrub: true
            },
            opacity: "100%",
            duration: 1
        });
    }, []);
    return (
        <>
            <section id="blog-section-mobile" className="w-[100%] sm:hidden flex flex-col text-[#BFA6A1] playfair-display">
                <p className="text-xl text-center w-full relative">Our blog</p>
                {/* <p className="">Discover the Brilliance Behind Every Gem Where Every Karat Tells a Story.</p> */}
                <div className="p-[5%] justify-evenly gap-[5%] flex flex-col w-full flex-1">
                    <BlogCarousel className="relative w-[80%] self-center">
                        <CarouselContent>
                            <CarouselItem>
                                <div className="flex flex-col rounded-md flex-1">
                                    <img src={BLOGDATA[0]?.blogImageUrl?.url} className="w-full rounded-t-[inherit] flex-1" />
                                    <div className="flex flex-col p-6 gap-4 flex-1 rounded-b-[inherit] bg-red-500/5 w-full">
                                        <p className="font-bold">
                                            {BLOGDATA[0]?.title}
                                        </p>
                                        <p className="text-wrap">
                                            {BLOGDATA[0]?.blogContent?.description}
                                        </p>
                                        <div className="flex-1 flex items-end">
                                            <Link to={`/blogs/${BLOGDATA[0]?._id}`} className="font-extrabold w-20 text-sm bg-transparent text-[#A68A7E] hover:bg-transparent hover:underline shadow-none">Read more</Link>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div className="flex flex-col rounded-md flex-1">
                                    <img src={BLOGDATA[1]?.blogImageUrl?.url} className="w-full rounded-t-[inherit] flex-1" />
                                    <div className="flex flex-col p-6 gap-4 flex-1 rounded-b-[inherit] bg-red-500/5 w-full">
                                        <p className="font-bold">
                                            {BLOGDATA[1]?.title}
                                        </p>
                                        <p className="text-wrap">
                                            {BLOGDATA[1]?.blogContent?.description}
                                        </p>
                                        <div className="flex-1 flex items-end">
                                            <Link to={`/blogs/${BLOGDATA[1]?._id}`} className="font-extrabold w-20 text-sm bg-transparent text-[#A68A7E] hover:bg-transparent hover:underline shadow-none">Read more</Link>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                            <CarouselItem>
                                <div className="flex-col flex rounded-md flex-1">
                                    <img src={BLOGDATA[2]?.blogImageUrl?.url} className="w-full rounded-t-[inherit] flex-1" />
                                    <div className="flex flex-col p-6 gap-4 flex-1 rounded-b-[inherit] bg-red-500/5 w-full">
                                        <p className="font-bold">
                                            {BLOGDATA[2]?.title}
                                        </p>
                                        <p className="text-wrap">
                                            {BLOGDATA[2]?.blogContent?.description}
                                        </p>
                                        <div className="flex-1 flex items-end">
                                            <Link to={`/blogs/${BLOGDATA[2]?._id}`} className="font-extrabold w-20 text-sm bg-transparent text-[#A68A7E] hover:bg-transparent hover:underline shadow-none">Read more</Link>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious className=""/>
                        <CarouselNext className=""/>
                    </BlogCarousel>
                    {/* }} className="absolute right-0 text-xl hover:text-[#A68A7E] top-1/2 m-0 -translate-1/2" variant={"ghost"}>See more</Button> */}
                </div>
                <Button onClick={(e) => {
                    e.preventDefault();
                    navigate("/blogs");
                }} className="text-xl text-[#A68A7E] m-0" variant={"ghost"}>See more</Button>
            </section>
            <section id="blog-section" className="w-[100%] py-4 sm:flex hidden relative playfair-display transition-all snap-start text-[#BFA6A1] min-h-screen items-center gap-4 flex-col">
                <p className="sm:text-5xl text-center w-full relative">Our blog</p>
                <p className="sm:text-lg">Discover the Brilliance Behind Every Gem Where Every Karat Tells a Story.</p>
                <div className="p-[5%] justify-evenly gap-[5%] flex w-full flex-1">
                    <div className="flex flex-col rounded-md flex-1">
                        <img src={BLOGDATA[0]?.blogImageUrl?.url} className="w-full rounded-t-[inherit] flex-1" />
                        <div className="flex flex-col p-6 gap-4 flex-1 rounded-b-[inherit] bg-red-500/5 w-full">
                            <p className="font-bold">
                                {BLOGDATA[0]?.title}
                            </p>
                            <p className="text-wrap">
                                {BLOGDATA[0]?.blogContent?.description}
                            </p>
                            <div className="flex-1 flex items-end">
                                <Link to={`/blogs/${BLOGDATA[0]?._id}`} className="font-extrabold w-20 text-sm bg-transparent text-[#A68A7E] hover:bg-transparent hover:underline shadow-none">Read more</Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col rounded-md flex-1">
                        <img src={BLOGDATA[1]?.blogImageUrl?.url} className="w-full rounded-t-[inherit] flex-1" />
                        <div className="flex flex-col p-6 gap-4 flex-1 rounded-b-[inherit] bg-red-500/5 w-full">
                            <p className="font-bold">
                                {BLOGDATA[1]?.title}
                            </p>
                            <p className="text-wrap">
                                {BLOGDATA[1]?.blogContent?.description}
                            </p>
                            <div className="flex-1 flex items-end">
                                <Link to={`/blogs/${BLOGDATA[1]?._id}`} className="font-extrabold w-20 text-sm bg-transparent text-[#A68A7E] hover:bg-transparent hover:underline shadow-none">Read more</Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex-col flex rounded-md flex-1">
                        <img src={BLOGDATA[2]?.blogImageUrl?.url} className="w-full rounded-t-[inherit] flex-1" />
                        <div className="flex flex-col p-6 gap-4 flex-1 rounded-b-[inherit] bg-red-500/5 w-full">
                            <p className="font-bold">
                                {BLOGDATA[2]?.title}
                            </p>
                            <p className="text-wrap">
                                {BLOGDATA[2]?.blogContent?.description}
                            </p>
                            <div className="flex-1 flex items-end">
                                <Link to={`/blogs/${BLOGDATA[2]?._id}`} className="font-extrabold w-20 text-sm bg-transparent text-[#A68A7E] hover:bg-transparent hover:underline shadow-none">Read more</Link>
                            </div>
                        </div>
                    </div>
                    {/* }} className="absolute right-0 text-xl hover:text-[#A68A7E] top-1/2 m-0 -translate-1/2" variant={"ghost"}>See more</Button> */}
                </div>
                <Button onClick={(e) => {
                    e.preventDefault();
                    navigate("/blogs");
                }} className="text-xl hover:text-[#A68A7E] m-0" variant={"ghost"}>See more</Button>
            </section>
        </>
    );
};