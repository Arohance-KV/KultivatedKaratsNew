import { ArrowRight, Facebook, Gem, Instagram, Mouse, Stamp, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { gsap } from "gsap";
import { useEffect
    // , useRef
    , useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { BLOGDATA, FACEBOOK, INSTAGRAM } from "@/utils/constants";
// import { TestimonialCard } from "./Text";
import Marquee from "react-fast-marquee";

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
        }} className="flex flex-col w-auto hover:cursor-pointer sm:width-[calc(300*0.85)] sm:h-[450px] playfair-display rounded-xl">
            <div className="bg-[#E1C6B3] rounded-t-[inherit] flex-[0.85]">
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
            _id: "67de6a20eab64aa971fae0c8",
            imageUrl: {
                url: "http://res.cloudinary.com/dthrjonaq/image/upload/v1742293610/daadis.in/ldjehkhrq8itxckesytw.jpg",
                publicId: "",
            },
            name: "The Adhira Ring",
        }
    },
    {
        title: 'reel 1',
        // url: 'https:',
        url: '/KultivatedKaratsAssets/reel-2.mp4',
        product: { 
            _id: "67de6a20eab64aa971fae0c9", 
            imageUrl: {
                url: "http://res.cloudinary.com/dthrjonaq/image/upload/v1742293615/daadis.in/qtxsyfnvnyobfp6c0nmk.webp",
                publicId: "",
            },
            name: "The Charvi Ring"
        }
    },
    {
        title: 'reel 1',
        url: '/KultivatedKaratsAssets/reel-3.mp4',
        product: {
            _id: "67de6a20eab64aa971fae0ca",
            name: "The Ishani Ring",
            imageUrl: {
                url: "http://res.cloudinary.com/dthrjonaq/image/upload/v1742293618/daadis.in/eqjdi9qnooesvlkqn99c.jpg",
                publidId: ""
            }
        }
    },
];

// const scrollAnimationTimeline = gsap.timeline();

const TESTIMONIALS = [
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
      <div className={"bg-[#E1C6B3] rounded-[15px] p-6 flex items-center sm:h-[222px] w-[350px] "+className}>
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
        //     translateX: "75%",
        //     duration: 2
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
                //     width: "300px"
                // });
                // gsap.to("#shop-by-budget-hexagon-3", {
                //     width: "150px"
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
            // gsap.to("#categories-hover-element", {
            //     translateX: "300px",
            //     duration: 1.5,
            //     rotateZ: 80,
            //     onComplete: () => {
            //         gsap.to("#categories-hover-element", {                        
            //             translateX: "560px",
            //             duration: 1.5,
            //             rotateZ: 100,
            //             yoyo: true,
            //             onComplete: () => {
            //                 gsap.to("#categories-hover-element", {                        
            //                     translateX: "0",
            //                     duration: 1.5,
            //                     rotateZ: 75,
            //                     yoyo: true
            //                 });
            //             }
            //         });
                    
            //     },
            //     yoyo: true
            // });
            gsap.timeline({ repeat: -1, yoyo: true }) // repeat forever
            .to("#categories-hover-element", {
                translateX: "300px",
                duration: 2,
                rotateZ: 80,
                onComplete: () => {
                        // @ts-ignore
                        categoriesImageRef.current.src = "/earring.png";
                }
            })
            .to("#categories-hover-element", {
                translateX: "560px",
                duration: 2,
                rotateZ: 100,
                onComplete: () => {
                    // @ts-ignore
                    categoriesImageRef.current.src = "/pendent.png";
                }
            })
            .to("#categories-hover-element", {
                translateX: "0",
                duration: 2,
                rotateZ: 75,
                onComplete: () => {
                    // @ts-ignore
                    categoriesImageRef.current.src = "/ring.png";
                }
            });
    }, []);

    const navigate = useNavigate();

    const categoriesImageRef = useRef(null);

    const [ aboutUsEmblem, setAboutUsEmblem ] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
          setAboutUsEmblem(prev => (prev >= 3 ? 0 : prev + 1));
        }, 3000);
      
        return () => clearInterval(interval); // good cleanup
    }, []);

    return (
        <>
            <div className="sm:hidden w-full gap-14 min-h-screen flex-col flex">
                <section className="w-[80%] aspect-square bg-white self-center mt-14">
                    <img src="/mobile-banner.png" className="w-full h-full object-cover" alt="" />
                </section>
                <section className="inria-serif-regular text-[#BFA6A1] flex flex-col justify-center items-center gap-4">
                    <p className="text-center px-4">
                        At Kultivated Karats, trust is our foundation. From pure diamonds to honest service, we ensure jewelry you can cherish with confidence
                    </p>
                    <div className="flex gap-4 scale-60  sm:scale-100">
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
                    <img src="/KultivatedKaratsAssets/collage_3.png" className="absolute top-0 bottom-0 left-0 right-0 h-full object-cover rounded-b-2xl  rounded-[inherit]" alt="" />
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
                        navigate("/collections");
                    }} className="bg-[#E9D6C8] px-10 text-white rounded-none transition-all border-2 hover:text-[#BFA6A1] hover:bg-white border-[#BFA6A1]">See more</Button>
                    <div id="carousel" className="bg-pink-300/30 aspect-video h-[80%]">
                        <img src="/KultivatedKaratsAssets/collections-banner.png" className="w-full h-full object-cover" alt="" />
                    </div>
                </section>
                <section className="w-full flex flex-col gap-8 justify-center my-14 items-center">
                    <p className="text-[#E1C6B3] inria-serif-regular my-4 text-3xl">Shop by categories</p>
                    <div onClick={(e) => {
                        e.preventDefault();
                        navigate("/collections");
                    }} className="border text-white inria-serif-regular flex-col justify-center items-center border-[#BFA6A1] w-[80%] flex bg-[#BFA6A1]">
                        <img src="/mobile-rings.png" className="w-full bg-white aspect-square" alt="" />
                        <p className="py-4">Rings</p>
                    </div>
                    <div className="border text-white inria-serif-regular flex-col justify-center items-center border-[#BFA6A1] w-[80%] flex bg-[#BFA6A1]">
                        <img src="/mobile-earings.png" className="w-full bg-white aspect-square" alt="" />
                        <p className="py-4">Earings</p>
                    </div>
                    <div className="border text-white inria-serif-regular flex-col justify-center items-center border-[#BFA6A1] w-[80%] flex bg-[#BFA6A1]">
                        <img src="/mobile-pendant.png" className="w-full bg-white aspect-square" alt="" />
                        <p className="py-4">Pendants</p>
                    </div>
                </section>
                <section className="w-[80%] my-14 justify-self-center self-center justify-center items-center flex flex-col gap-4 text-[#BFA6A1] text-center">
                    <p className="text-3xl">Shop by look</p>
                    <div className="flex flex-row gap-4">
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
                        <div>
                            {TESTIMONIALS.map(testimonial => <ReviewCard name={testimonial?.customerName} rating={testimonial?.rating} imageUrl={testimonial?.sourceLogo?.url} className="" review={testimonial?.descripttion} />)}
                        </div>
                    </div>
                </section>
                <section className="w-full flex gap-4 justify-evenly flex-col items-center">
                    <p className="blog-section-fade text-3xl text-[#BFA6A1]">Read the blog</p>    
                    <div className="flex justify-evenly w-full items-center">
                        {BLOGDATA?.map((blog) => (
                            <div className="">
                                <img src={ blog?.blogImageUrl?.url } className="w-32 aspect-video" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <div id="home-page-main-container" className="min-h-[100vh] sm:flex hidden flex-col gap-10 items-center sm:mb-14">
                <section id="hero-section" className="sm:h-[100vh] h-[50vh] w-full opacity-0 relative sm:snap-start">
                    <div id="hero-section-banner" className="sm:h-[90vh] h-[50vh] bg-[#E1C6B3] sm:w-full w-[90%] self-center justify-self-center relative">
                        <img src="/banner.png" className="absolute top-0 left-0 right-0 sm:h-[90vh] h-full w-full object-cover" alt="" />
                        <div id="social-links" className="flex text-white flex-col gap-4 w-auto absolute right-[5%] bottom-[15%]">
                            <Link to={INSTAGRAM}>
                                <Instagram />
                            </Link>
                            <Link to={FACEBOOK}>
                                <Facebook />
                            </Link>
                        </div>
                    </div>
                    {/* Hero section */}
                    <div className="sm:flex h-[10vh] justify-center hidden items-center">
                        <Mouse className="stroke-[#E1C6B3] w-10 h-10"/>
                    </div>
                </section>
                <section id="about-us-section" className="flex sm:mt-14 gap-4 sm:gap-14 items-center h-auto sm:self-end flex-col sm:flex-row mb-10 w-[85%] sm:justify-self-end justify-self-center self-center justify-between">
                    <div className="italic sm:hidden p-4 sm:text-2xl text-sm  text-[#BFA6A1] flex justify-center items-center">
                        At Kultivated Karats, trust is our foundation. From pure diamonds to honest service, we ensure jewelry you can cherish with confidence
                    </div>
                    <Button onClick={() => navigate("/about")} className="bg-[#BFA6A1] mb-8 text-white px-4 rounded-none sm:hidden block">About us</Button>
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
                            <Button className="uppercase text-sm rounded-none px-10 bg-[#BFA6A1]">About us</Button>
                        </Link>
                        <div className="flex-[0.5] border-1 h-[5px] w-full bg-[#BFA6A1]"></div>
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
                                <img src="/KultivatedKaratsAssets/collage_3.png" className="absolute top-0 bottom-0 left-0 right-0 h-full object-cover rounded-b-2xl  rounded-[inherit]" alt="" />
                                {/* <div className="absolute bg-red-600 top-[-5%] bottom-[-5%] left-[-5%] right-[-5%] z-[-100] bg-transparent rounded-t-[inherit] rounded-b-[inherit] border border-[#BFA6A1] "></div> */}
                                <div id="border-element" className="absolute top-[0] bottom-[0] left-[0] right-[0] z-[-100] bg-transparent rounded-t-[inherit] rounded-b-[inherit] border border-[#BFA6A1] "></div>
                                <img alt="img-1" src="/KultivatedKaratsAssets/collage_1.png" id="about-us-first-image" className="bg-[#E1C6B3] object-cover absolute  translate-x-[70%] translate-y-1/3 bottom-0 right-[0%] rounded-lg h-[0px] w-[0px] z-[-10]" />
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
                <section id="categories" className="playfair-display opacity-0 relative w-full flex items-center snap-start h-[100vh] overflow-hidden flex-col" 
                // onMouseMove={( event ) => {
                    // if ( event.pageX < 465 || event.pageX > 1200 ) return;
                    // if ( event.pageX < 750 )
                    //     elementRotate = (75 + ((event.pageX-465) / 10)); 
                    // else
                    // elementRotate = (75 + ((event.pageX-465) / 10)) - (((event.pageX - 465) * 1) / 30);
                    // console.log(event.pageX, elementRotate);
                    // gsap.to("#categories-hover-element", {
                    //     // translateX: event.pageX,
                    //     // x: (event.pageX > 500) && (event.pageX < 1200) ? event.pageX-465 : "",
                    //     x: event.pageX-465,
                    //     duration: 0.5,
                    //     rotateZ: elementRotate,
                    // });
                // }}
                >
                    <div className="gap-4 py-[5%] flex text-[#BFA6A1] text-[75px] h-[100%] justify-center w-[80%] relative ">
                        <div className="flex-1 h-full cursor-pointer flex justify-center items-center z-10" onClick={(e) => {
                            e.preventDefault();
                            navigate("/products?category-filter=ring");
                        // }} onMouseOver={() => {
                            // @ts-ignore
                            // categoriesImageRef.current.src = "/ring.png";
                        }}>Rings</div>
                        <div className="flex-1 h-full cursor-pointer  flex justify-center items-center z-10" onClick={(e) => {
                            e.preventDefault();
                            navigate("/products?category-filter=earrings");
                        }}>Earings</div>
                        <div className="flex-1 h-full cursor-pointer  flex justify-center items-center z-10" onClick={(e) => {
                            e.preventDefault();
                            navigate("/products?category-filter=pendant");
                        }} >Pendants</div>
                        <div id="categories-hover-element" className="absolute bg-[#E9D6C8] z-[0] w-[350px] top-1/2 flex justify-end items-end -translate-y-1/2 overflow-hidden left-[10%] aspect-video rotate-[75deg]">
                            <img ref={categoriesImageRef} src="/ring.png" className="-rotate-[120deg] h-auto -translate-y-[10%] w-[70%]" alt="" />
                        </div>
                    </div>
                        <Button onClick={(e) => {
                            e.preventDefault();
                            navigate("/categories");
                        }} className="hover:bg-transparent text-[#BFA6A1] absolute bottom-[5%] right-[10%] bg-transparent playpen-sans text-2xl hover:scale-110 transition-all">See more <ArrowRight /></Button>
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
                        {/* <div className="w-[300px] h-[300px] flex justify-center items-center relative" style={{
                            aspectRatio: "1/cos(30deg)",
                            clipPath: "polygon(50% -50%,100% 50%,50% 150%,0 50%)",
                            backgroundColor: "tomato",
                            rotate: "-30deg"
                        }}>
                            <p className="z-10 rotate-z-[30deg] text-white text-2xl">
                                30k
                            </p>
                            <img src="/katana.svg" className="top-0 bottom-0 rotate-z-[30deg] left-0 right-0 object-cover absolute" alt="" />
                        </div>
                        <div className="w-[100px] h-[100px] overflow-hidden flex justify-center items-center relative" style={{
                            aspectRatio: "1/cos(30deg)",
                            clipPath: "polygon(50% -50%,100% 50%,50% 150%,0 50%)",
                            backgroundColor: "tomato",
                            // rotate: "-30deg"
                        }}>
                            <p className="z-10 rotate-z-[30deg] text-white text-2xl">
                                15k
                            </p>
                            <img src="/katana.svg" className="top-0 bottom-0 rotate-z-[30deg] left-0 right-0 object-cover absolute" alt="" />
                        </div> */}
                        {/* <img src="/katana.svg" className="bg-red-800" alt="" /> */}   

                    {/* </div> */}
                </section>
                <section id="collections" className="self-center justify-self-center snap-start w-[80%] h-[100vh]">
                    <div className="flex h-full flex-col">
                        {/* <p id="collections-home-heading" style={{
                            // clipPath: "circle(0% at center)"
                        }} className="flex self-center overflow-x-hidden w-0 justify-center sorts-mill-goudy-regular text-[#E1C6B3] p-0 m-0 z-[100] items-center justify-self-center tracking-wide text-[220px]">
                            Collections
                        </p> */}
                        <div className="collections-home-heading-text flex  justify-center">
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
                                        navigate("/collections");
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
                <section id="shop-by" className="w-[80%] hidden h-[100vh] snap-start overflow-hidden  self-center justify-self-center">
                <svg width="1207" height="863" className="" viewBox="0 0 1207 863" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_382_892" className="[mask-type:luminance]" maskUnits="userSpaceOnUse" x="1" y="221" width="614" height="641">
                    <path d="M368.878 221.959C371.096 220.713 373.905 221.502 375.151 223.721L614.236 649.601C615.482 651.819 614.693 654.628 612.474 655.874L247.614 860.703C245.395 861.949 242.586 861.16 241.34 858.941L2.25539 433.062C1.0097 430.843 1.79867 428.034 4.0176 426.789L368.878 221.959Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask0_382_892)">
                    <mask id="mask1_382_892" className="[mask-type:luminance]" maskUnits="userSpaceOnUse" x="61" y="324" width="494" height="435">
                    <path d="M429.816 755.043C429.312 755.9 428.386 756.42 427.392 756.404L185.375 752.678C184.391 752.663 183.489 752.125 183.007 751.267L63.8032 538.931C63.3213 538.073 63.3322 537.023 63.8318 536.175L186.675 327.619C187.18 326.762 188.105 326.243 189.1 326.258L431.116 329.984C432.101 329.999 433.003 330.537 433.484 331.395L552.688 543.731C553.17 544.589 553.159 545.639 552.659 546.487L429.816 755.043Z" fill="white" stroke="white" stroke-width="3.68604"/>
                    </mask>
                    <g mask="url(#mask1_382_892)">
                    <path d="M368.878 221.959C371.096 220.713 373.905 221.502 375.151 223.721L614.325 649.76C615.571 651.978 614.782 654.787 612.563 656.033L247.703 860.862C245.484 862.108 242.675 861.319 241.43 859.1L2.25539 433.062C1.0097 430.843 1.79867 428.034 4.0176 426.789L368.878 221.959Z" fill="#BFA6A1"/>
                    </g>
                    </g>
                    <mask id="mask2_382_892" className="[mask-type:luminance]" maskUnits="userSpaceOnUse" x="452" y="75" width="468" height="488">
                    <path d="M731.917 76.1892C733.605 75.2414 735.742 75.8417 736.689 77.5299L918.59 401.546C919.537 403.235 918.937 405.371 917.249 406.319L639.657 562.157C637.969 563.105 635.832 562.504 634.884 560.816L452.984 236.8C452.036 235.112 452.636 232.975 454.325 232.027L731.917 76.1892Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask2_382_892)">
                    <mask id="mask3_382_892" className="[mask-type:luminance]" maskUnits="userSpaceOnUse" x="498" y="154" width="376" height="331">
                    <path d="M777.665 481.407C777.411 481.838 776.946 482.099 776.446 482.091L592.316 479.256C591.821 479.249 591.367 478.978 591.125 478.547L500.433 316.998C500.191 316.566 500.196 316.039 500.447 315.612L593.909 156.939C594.162 156.509 594.628 156.247 595.127 156.255L595.16 154.14L595.127 156.255L779.258 159.09C779.753 159.098 780.206 159.368 780.449 159.799L871.141 321.348C871.383 321.78 871.378 322.308 871.126 322.734L777.665 481.407Z" fill="white" stroke="white" stroke-width="4.23142"/>
                    </mask>
                    <g mask="url(#mask3_382_892)">
                    <path d="M731.917 76.1892C733.605 75.2414 735.742 75.8417 736.689 77.5299L918.658 401.667C919.605 403.356 919.005 405.492 917.317 406.44L639.725 562.278C638.037 563.226 635.9 562.626 634.952 560.937L452.984 236.8C452.036 235.112 452.636 232.975 454.325 232.027L731.917 76.1892Z" fill="#BFA6A1"/>
                    </g>
                    </g>
                    <mask id="mask4_382_892" className="[mask-type:luminance]" maskUnits="userSpaceOnUse" x="824" y="0" width="290" height="303">
                    <path d="M997.483 1.06302C998.529 0.475931 999.853 0.847765 1000.44 1.89354L1113.12 202.608C1113.71 203.654 1113.33 204.978 1112.29 205.565L940.332 302.1C939.287 302.687 937.963 302.315 937.376 301.27L824.696 100.555C824.109 99.5089 824.481 98.1852 825.527 97.5981L997.483 1.06302Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask4_382_892)">
                    <mask id="mask5_382_892" className="[mask-type:luminance]" maskUnits="userSpaceOnUse" x="852" y="49" width="234" height="205">
                    <path d="M1025.13 251.67C1025.12 251.687 1025.1 251.698 1025.08 251.698L911.019 249.941C911.007 249.941 910.996 249.938 910.987 249.931C910.981 249.926 910.975 249.92 910.971 249.913L854.791 149.84C854.781 149.823 854.781 149.801 854.791 149.784L852.968 148.711L854.791 149.784L912.687 51.493C912.697 51.4757 912.716 51.4652 912.736 51.4655L1026.8 53.2217C1026.82 53.222 1026.84 53.2329 1026.84 53.2502L1083.02 153.323C1083.03 153.34 1083.03 153.362 1083.02 153.379L1025.13 251.67Z" fill="white" stroke="white" stroke-width="4.23142"/>
                    </mask>
                    <g mask="url(#mask5_382_892)">
                    <path d="M997.483 1.06302C998.529 0.475931 999.853 0.847765 1000.44 1.89354L1113.16 202.683C1113.75 203.729 1113.38 205.053 1112.33 205.64L940.374 302.175C939.329 302.762 938.005 302.39 937.418 301.344L824.696 100.555C824.109 99.5089 824.481 98.1852 825.527 97.5981L997.483 1.06302Z" fill="#BFA6A1"/>
                    </g>
                    </g>
                    <g opacity="0.5">
                    <mask id="mask6_382_892" className="[mask-type:luminance]" maskUnits="userSpaceOnUse" x="240" y="0" width="290" height="303">
                    <path d="M413.547 1.06302C414.593 0.475931 415.917 0.847765 416.504 1.89354L529.183 202.608C529.77 203.654 529.399 204.978 528.353 205.565L356.396 302.1C355.35 302.687 354.027 302.315 353.44 301.27L240.76 100.555C240.173 99.5089 240.545 98.1852 241.59 97.5981L413.547 1.06302Z" fill="white"/>
                    <path d="M413.618 1.18925C414.594 0.641305 415.83 0.988351 416.377 1.9644L529.057 202.679C529.605 203.655 529.258 204.891 528.282 205.439L356.325 301.974C355.349 302.522 354.114 302.175 353.566 301.199L240.886 100.484C240.338 99.5078 240.685 98.2723 241.661 97.7244L413.618 1.18925Z" stroke="white" stroke-width="0.289535"/>
                    </mask>
                    <g mask="url(#mask6_382_892)">
                    <mask id="mask7_382_892" className="[mask-type:luminance]" maskUnits="userSpaceOnUse" x="268" y="49" width="234" height="205">
                    <path d="M442.267 252.303C442.029 252.707 441.593 252.952 441.125 252.945L327.063 251.188C326.599 251.181 326.174 250.928 325.947 250.523L269.767 150.45C269.54 150.046 269.545 149.551 269.781 149.151L327.676 50.86C327.914 50.4563 328.35 50.2113 328.819 50.2185L442.88 51.9748C443.344 51.9819 443.769 52.2352 443.996 52.6397L500.176 152.713C500.403 153.117 500.398 153.612 500.163 154.012L442.267 252.303Z" stroke="white" stroke-width="1.73721"/>
                    </mask>
                    <g mask="url(#mask7_382_892)">
                    <path d="M413.547 1.06302C414.593 0.475931 415.917 0.847765 416.504 1.89354L529.225 202.683C529.813 203.729 529.441 205.053 528.395 205.64L356.438 302.175C355.392 302.762 354.069 302.39 353.482 301.344L240.76 100.555C240.173 99.5089 240.545 98.1852 241.59 97.5981L413.547 1.06302Z" fill="#BFA6A1"/>
                    </g>
                    </g>
                    </g>
                    <g opacity="0.5">
                    <mask id="mask8_382_892" className="[mask-type:luminance]" maskUnits="userSpaceOnUse" x="552" y="518" width="290" height="303">
                    <path d="M725.826 518.989C726.872 518.402 728.196 518.774 728.783 519.82L841.462 720.535C842.05 721.58 841.678 722.904 840.632 723.491L668.675 820.026C667.629 820.613 666.306 820.242 665.719 819.196L553.039 618.481C552.452 617.435 552.824 616.111 553.869 615.524L725.826 518.989Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask8_382_892)">
                    <mask id="mask9_382_892" className="[mask-type:luminance]" maskUnits="userSpaceOnUse" x="581" y="567" width="233" height="205">
                    <path d="M754.546 770.229C754.308 770.633 753.872 770.878 753.404 770.871L639.342 769.115C638.878 769.107 638.453 768.854 638.226 768.45L582.046 668.377C581.819 667.972 581.824 667.477 582.06 667.078L639.955 568.786C640.193 568.383 640.629 568.138 641.098 568.145L755.159 569.901C755.623 569.908 756.048 570.161 756.275 570.566L812.455 670.639C812.682 671.043 812.677 671.538 812.442 671.938L754.546 770.229Z" stroke="white" stroke-width="1.73721"/>
                    </mask>
                    <g mask="url(#mask9_382_892)">
                    <path d="M725.826 518.989C726.872 518.402 728.196 518.774 728.783 519.82L841.504 720.61C842.092 721.655 841.72 722.979 840.674 723.566L668.717 820.101C667.671 820.688 666.348 820.317 665.761 819.271L553.039 618.481C552.452 617.435 552.824 616.111 553.869 615.524L725.826 518.989Z" fill="#BFA6A1"/>
                    </g>
                    </g>
                    </g>
                    <path d="M902.367 379.111C905.607 379.111 908.07 379.5 909.755 380.278C911.44 380.99 912.93 381.8 914.226 382.708C915.004 383.161 915.619 383.518 916.073 383.777C916.591 383.971 917.077 384.068 917.531 384.068C918.179 384.068 918.633 383.712 918.892 382.999C919.216 382.286 919.475 381.217 919.669 379.791H921.905C921.84 380.893 921.743 382.222 921.614 383.777C921.549 385.267 921.484 387.276 921.419 389.803C921.419 392.266 921.419 395.538 921.419 399.621H919.183C918.989 396.51 918.309 393.53 917.142 390.678C915.976 387.827 914.259 385.494 911.99 383.68C909.787 381.865 906.871 380.958 903.242 380.958C899.808 380.958 896.956 381.995 894.688 384.068C892.485 386.142 891.383 388.864 891.383 392.233C891.383 395.15 892.129 397.612 893.619 399.621C895.11 401.565 897.086 403.347 899.548 404.967C902.076 406.522 904.797 408.207 907.714 410.022C911.083 412.095 914.064 414.169 916.656 416.243C919.313 418.251 921.387 420.487 922.877 422.95C924.432 425.412 925.21 428.393 925.21 431.892C925.21 436.04 924.27 439.474 922.391 442.196C920.512 444.917 918.017 446.959 914.907 448.32C911.796 449.68 908.362 450.361 904.603 450.361C901.169 450.361 898.447 449.972 896.438 449.194C894.429 448.417 892.712 447.607 891.286 446.764C889.861 445.857 888.759 445.403 887.981 445.403C887.333 445.403 886.847 445.76 886.523 446.473C886.264 447.186 886.037 448.255 885.843 449.68H883.607C883.737 448.32 883.802 446.732 883.802 444.917C883.866 443.038 883.899 440.608 883.899 437.627C883.964 434.646 883.996 430.888 883.996 426.352H886.232C886.491 430.24 887.204 433.869 888.37 437.238C889.601 440.608 891.448 443.33 893.911 445.403C896.438 447.412 899.775 448.417 903.923 448.417C906.061 448.417 908.07 447.996 909.949 447.153C911.893 446.246 913.481 444.853 914.712 442.973C915.943 441.029 916.559 438.534 916.559 435.489C916.559 432.832 915.911 430.531 914.615 428.587C913.384 426.579 911.634 424.732 909.366 423.047C907.098 421.297 904.441 419.515 901.395 417.701C898.35 415.821 895.498 413.91 892.841 411.966C890.185 410.022 888.046 407.786 886.426 405.259C884.871 402.667 884.093 399.556 884.093 395.927C884.093 392.104 884.936 388.961 886.62 386.499C888.37 383.971 890.638 382.124 893.425 380.958C896.211 379.727 899.192 379.111 902.367 379.111ZM948.057 372.89V409.244C949.741 404.837 952.074 401.792 955.055 400.107C958.101 398.422 961.276 397.58 964.581 397.58C967.044 397.58 969.085 397.904 970.705 398.552C972.39 399.2 973.783 400.107 974.885 401.273C976.116 402.569 976.991 404.189 977.509 406.133C978.027 408.078 978.287 410.702 978.287 414.007V439.96C978.287 442.682 978.837 444.529 979.939 445.501C981.106 446.473 983.017 446.959 985.674 446.959V449C984.572 448.935 982.888 448.87 980.62 448.806C978.351 448.676 976.148 448.611 974.01 448.611C971.871 448.611 969.765 448.676 967.692 448.806C965.683 448.87 964.16 448.935 963.123 449V446.959C965.456 446.959 967.108 446.473 968.08 445.501C969.052 444.529 969.538 442.682 969.538 439.96V411.868C969.538 409.86 969.376 408.013 969.052 406.328C968.728 404.643 967.983 403.282 966.817 402.245C965.715 401.209 963.998 400.69 961.665 400.69C959.008 400.69 956.643 401.435 954.569 402.926C952.56 404.416 950.973 406.49 949.806 409.147C948.64 411.804 948.057 414.849 948.057 418.284V439.96C948.057 442.682 948.543 444.529 949.515 445.501C950.487 446.473 952.139 446.959 954.472 446.959V449C953.435 448.935 951.88 448.87 949.806 448.806C947.797 448.676 945.724 448.611 943.585 448.611C941.447 448.611 939.243 448.676 936.975 448.806C934.707 448.87 933.022 448.935 931.921 449V446.959C934.578 446.959 936.457 446.473 937.559 445.501C938.725 444.529 939.308 442.682 939.308 439.96V384.554C939.308 381.638 938.79 379.5 937.753 378.139C936.716 376.713 934.772 376.001 931.921 376.001V373.959C933.995 374.154 936.003 374.251 937.947 374.251C939.827 374.251 941.609 374.154 943.294 373.959C945.043 373.7 946.631 373.344 948.057 372.89ZM1013.76 397.58C1017.9 397.58 1021.63 398.487 1024.93 400.301C1028.24 402.116 1030.86 404.967 1032.81 408.855C1034.82 412.743 1035.82 417.798 1035.82 424.019C1035.82 430.24 1034.82 435.294 1032.81 439.183C1030.86 443.006 1028.24 445.825 1024.93 447.639C1021.63 449.454 1017.9 450.361 1013.76 450.361C1009.67 450.361 1005.95 449.454 1002.58 447.639C999.272 445.825 996.615 443.006 994.606 439.183C992.662 435.294 991.69 430.24 991.69 424.019C991.69 417.798 992.662 412.743 994.606 408.855C996.615 404.967 999.272 402.116 1002.58 400.301C1005.95 398.487 1009.67 397.58 1013.76 397.58ZM1013.76 399.524C1010.06 399.524 1007.02 401.435 1004.62 405.259C1002.29 409.082 1001.12 415.335 1001.12 424.019C1001.12 432.702 1002.29 438.956 1004.62 442.779C1007.02 446.538 1010.06 448.417 1013.76 448.417C1017.45 448.417 1020.46 446.538 1022.79 442.779C1025.19 438.956 1026.39 432.702 1026.39 424.019C1026.39 415.335 1025.19 409.082 1022.79 405.259C1020.46 401.435 1017.45 399.524 1013.76 399.524ZM1058.65 397.871V457.554C1058.65 460.34 1059.46 462.187 1061.08 463.094C1062.76 464.066 1065.06 464.552 1067.98 464.552V466.594C1066.55 466.529 1064.58 466.432 1062.05 466.302C1059.52 466.237 1056.83 466.205 1053.98 466.205C1051.97 466.205 1049.96 466.237 1047.96 466.302C1046.01 466.432 1044.52 466.529 1043.48 466.594V464.552C1045.82 464.552 1047.47 464.131 1048.44 463.289C1049.41 462.446 1049.9 460.859 1049.9 458.526V409.536C1049.9 406.62 1049.38 404.481 1048.34 403.12C1047.31 401.695 1045.36 400.982 1042.51 400.982V398.94C1044.59 399.135 1046.6 399.232 1048.54 399.232C1050.42 399.232 1052.2 399.135 1053.89 398.94C1055.64 398.681 1057.22 398.325 1058.65 397.871ZM1074.2 397.58C1077.64 397.58 1080.71 398.519 1083.44 400.399C1086.16 402.213 1088.3 404.902 1089.85 408.466C1091.47 412.03 1092.28 416.437 1092.28 421.686C1092.28 425.185 1091.86 428.652 1091.02 432.087C1090.17 435.456 1088.85 438.534 1087.03 441.321C1085.28 444.043 1082.98 446.246 1080.13 447.931C1077.34 449.551 1073.97 450.361 1070.02 450.361C1066.98 450.361 1064.32 449.648 1062.05 448.222C1059.85 446.797 1058.36 445.079 1057.58 443.071L1058.55 441.71C1059.46 443.524 1060.75 445.047 1062.44 446.278C1064.19 447.51 1066.36 448.125 1068.95 448.125C1072.58 448.125 1075.4 446.991 1077.41 444.723C1079.42 442.455 1080.81 439.442 1081.59 435.683C1082.43 431.86 1082.85 427.648 1082.85 423.047C1082.85 417.863 1082.43 413.618 1081.59 410.313C1080.75 407.008 1079.48 404.546 1077.8 402.926C1076.11 401.306 1074.04 400.496 1071.58 400.496C1068.4 400.496 1065.52 401.824 1062.93 404.481C1060.33 407.073 1058.68 411.026 1057.97 416.34L1056.8 414.979C1057.51 409.471 1059.46 405.194 1062.63 402.148C1065.87 399.102 1069.73 397.58 1074.2 397.58ZM909.172 527.58C914.485 527.58 918.892 529.783 922.391 534.189C925.89 538.531 927.64 545.141 927.64 554.019C927.64 559.851 926.636 564.744 924.627 568.696C922.683 572.585 920.058 575.501 916.753 577.445C913.448 579.389 909.852 580.361 905.964 580.361C902.724 580.361 899.581 579.454 896.535 577.639C893.554 575.76 891.319 573.006 889.828 569.377L891.772 570.446C893.392 573.038 895.401 574.982 897.799 576.278C900.196 577.51 902.659 578.125 905.186 578.125C909.528 578.125 912.768 576.181 914.907 572.293C917.11 568.34 918.211 562.249 918.211 554.019C918.211 548.77 917.79 544.396 916.948 540.896C916.105 537.397 914.809 534.805 913.06 533.12C911.31 531.371 909.074 530.496 906.353 530.496C903.372 530.496 900.585 531.857 897.993 534.578C895.466 537.235 893.911 541.156 893.327 546.34L892.161 544.979C892.874 539.471 894.786 535.194 897.896 532.148C901.071 529.102 904.83 527.58 909.172 527.58ZM894.008 502.89V573.945C893.165 574.658 892.291 575.403 891.383 576.181C890.541 576.894 889.699 577.607 888.856 578.32C888.014 579.032 887.139 579.778 886.232 580.555L884.579 579.875C884.838 578.968 885 578.06 885.065 577.153C885.195 576.181 885.26 575.209 885.26 574.237V514.554C885.26 511.638 884.741 509.5 883.704 508.139C882.668 506.713 880.723 506.001 877.872 506.001V503.959C879.946 504.154 881.955 504.251 883.899 504.251C885.778 504.251 887.56 504.154 889.245 503.959C890.995 503.7 892.582 503.344 894.008 502.89ZM979.419 528.94V530.885C978.188 531.014 977.054 531.565 976.017 532.537C974.98 533.509 974.008 535.226 973.101 537.689L957.159 579.486H955.507L937.622 536.425C936.39 533.898 935.159 532.375 933.928 531.857C932.761 531.273 931.789 530.982 931.012 530.982V528.94C932.437 529.135 933.928 529.297 935.483 529.426C937.038 529.491 938.723 529.524 940.538 529.524C942.547 529.524 944.653 529.459 946.856 529.329C949.124 529.2 951.23 529.07 953.174 528.94V530.982C951.554 530.982 950.096 531.111 948.8 531.371C947.569 531.565 946.791 532.245 946.467 533.412C946.143 534.513 946.532 536.425 947.634 539.147L959.59 568.794L959.006 568.988L970.087 540.022C970.93 537.883 971.254 536.198 971.059 534.967C970.93 533.671 970.282 532.699 969.115 532.051C967.949 531.403 966.199 531.014 963.866 530.885V528.94C965.033 529.005 966.037 529.07 966.88 529.135C967.722 529.135 968.532 529.167 969.31 529.232C970.152 529.232 971.059 529.232 972.031 529.232C973.522 529.232 974.85 529.2 976.017 529.135C977.248 529.07 978.382 529.005 979.419 528.94ZM957.159 579.486L953.855 587.943C953.207 589.563 952.526 590.924 951.813 592.025C951.165 593.127 950.452 594.034 949.675 594.747C948.638 595.719 947.407 596.367 945.981 596.691C944.555 597.08 943.259 597.274 942.093 597.274C940.862 597.274 939.728 597.047 938.691 596.594C937.719 596.14 936.941 595.46 936.358 594.552C935.775 593.71 935.483 592.673 935.483 591.442C935.483 589.887 935.937 588.623 936.844 587.651C937.751 586.744 939.015 586.29 940.635 586.29C941.996 586.29 943.162 586.679 944.134 587.457C945.106 588.234 945.592 589.368 945.592 590.859C945.592 591.96 945.333 592.868 944.815 593.58C944.296 594.293 943.681 594.844 942.968 595.233C943.097 595.298 943.195 595.33 943.259 595.33C943.389 595.33 943.486 595.33 943.551 595.33C945.301 595.33 946.856 594.714 948.217 593.483C949.578 592.317 950.776 590.405 951.813 587.748L955.313 578.708L957.159 579.486ZM909.172 657.58C914.485 657.58 918.892 659.783 922.391 664.189C925.89 668.531 927.64 675.141 927.64 684.019C927.64 689.851 926.636 694.744 924.627 698.696C922.683 702.585 920.058 705.501 916.753 707.445C913.448 709.389 909.852 710.361 905.964 710.361C902.724 710.361 899.581 709.454 896.535 707.639C893.554 705.76 891.319 703.006 889.828 699.377L891.772 700.446C893.392 703.038 895.401 704.982 897.799 706.278C900.196 707.51 902.659 708.125 905.186 708.125C909.528 708.125 912.768 706.181 914.907 702.293C917.11 698.34 918.211 692.249 918.211 684.019C918.211 678.77 917.79 674.396 916.948 670.896C916.105 667.397 914.809 664.805 913.06 663.12C911.31 661.371 909.074 660.496 906.353 660.496C903.372 660.496 900.585 661.857 897.993 664.578C895.466 667.235 893.911 671.156 893.327 676.34L892.161 674.979C892.874 669.471 894.786 665.194 897.896 662.148C901.071 659.102 904.83 657.58 909.172 657.58ZM894.008 632.89V703.945C893.165 704.658 892.291 705.403 891.383 706.181C890.541 706.894 889.699 707.607 888.856 708.32C888.014 709.032 887.139 709.778 886.232 710.555L884.579 709.875C884.838 708.968 885 708.06 885.065 707.153C885.195 706.181 885.26 705.209 885.26 704.237V644.554C885.26 641.638 884.741 639.5 883.704 638.139C882.668 636.713 880.723 636.001 877.872 636.001V633.959C879.946 634.154 881.955 634.251 883.899 634.251C885.778 634.251 887.56 634.154 889.245 633.959C890.995 633.7 892.582 633.344 894.008 632.89ZM979.204 657.871V698.502C979.204 701.418 979.722 703.589 980.759 705.015C981.861 706.376 983.805 707.056 986.591 707.056V709.097C984.583 708.903 982.574 708.806 980.565 708.806C978.686 708.806 976.871 708.903 975.121 709.097C973.437 709.292 971.881 709.648 970.456 710.166V698.696C968.836 702.909 966.535 705.922 963.554 707.736C960.638 709.486 957.625 710.361 954.514 710.361C952.246 710.361 950.27 710.037 948.585 709.389C946.9 708.741 945.507 707.834 944.405 706.667C943.174 705.371 942.332 703.686 941.878 701.613C941.424 699.539 941.198 696.979 941.198 693.934V669.536C941.198 666.62 940.679 664.481 939.642 663.12C938.606 661.695 936.662 660.982 933.81 660.982V658.94C935.884 659.135 937.893 659.232 939.837 659.232C941.716 659.232 943.498 659.135 945.183 658.94C946.933 658.681 948.52 658.325 949.946 657.871V696.072C949.946 698.081 950.076 699.928 950.335 701.613C950.594 703.297 951.242 704.658 952.279 705.695C953.316 706.732 955 707.25 957.333 707.25C959.861 707.25 962.096 706.473 964.04 704.917C966.049 703.362 967.604 701.256 968.706 698.599C969.873 695.942 970.456 692.962 970.456 689.657V669.536C970.456 666.62 969.937 664.481 968.9 663.12C967.864 661.695 965.92 660.982 963.068 660.982V658.94C965.142 659.135 967.151 659.232 969.095 659.232C970.974 659.232 972.756 659.135 974.441 658.94C976.191 658.681 977.778 658.325 979.204 657.871ZM1035.78 632.793V698.405C1035.78 701.321 1036.3 703.492 1037.34 704.917C1038.44 706.278 1040.38 706.959 1043.17 706.959V709C1041.16 708.806 1039.15 708.708 1037.14 708.708C1035.26 708.708 1033.45 708.806 1031.7 709C1030.01 709.194 1028.46 709.551 1027.03 710.069V644.457C1027.03 641.541 1026.51 639.403 1025.48 638.042C1024.44 636.616 1022.5 635.903 1019.65 635.903V633.862C1021.72 634.057 1023.73 634.154 1025.67 634.154C1027.55 634.154 1029.33 634.057 1031.02 633.862C1032.77 633.603 1034.36 633.246 1035.78 632.793ZM1015.37 657.58C1018.22 657.58 1020.88 658.26 1023.34 659.621C1025.87 660.982 1027.55 663.315 1028.39 666.62L1027.13 667.592C1026.22 664.87 1024.8 662.893 1022.85 661.662C1020.97 660.431 1018.74 659.815 1016.15 659.815C1012.32 659.815 1009.12 661.792 1006.52 665.745C1004 669.698 1002.76 675.789 1002.83 684.019C1002.83 689.268 1003.32 693.642 1004.29 697.141C1005.32 700.576 1006.81 703.168 1008.76 704.917C1010.77 706.602 1013.2 707.445 1016.05 707.445C1018.77 707.445 1021.23 706.278 1023.44 703.945C1025.64 701.613 1026.97 698.178 1027.42 693.642L1028.59 695.003C1028.07 699.928 1026.48 703.719 1023.83 706.376C1021.23 709.032 1017.7 710.361 1013.23 710.361C1009.21 710.361 1005.68 709.389 1002.64 707.445C999.654 705.501 997.354 702.585 995.734 698.696C994.179 694.808 993.401 689.916 993.401 684.019C993.401 678.122 994.405 673.229 996.414 669.341C998.488 665.388 1001.18 662.44 1004.48 660.496C1007.85 658.552 1011.48 657.58 1015.37 657.58ZM1065.92 727.274C1062.49 727.274 1059.25 726.918 1056.2 726.205C1053.15 725.492 1050.69 724.358 1048.81 722.803C1047 721.312 1046.09 719.401 1046.09 717.068C1046.09 714.8 1047 712.856 1048.81 711.236C1050.63 709.616 1053.09 708.384 1056.2 707.542L1056.78 709.097C1055.36 709.551 1054.22 710.458 1053.38 711.819C1052.54 713.18 1052.12 714.703 1052.12 716.387C1052.12 719.368 1053.48 721.636 1056.2 723.192C1058.99 724.812 1062.58 725.622 1066.99 725.622C1069.9 725.622 1072.76 725.233 1075.54 724.455C1078.33 723.742 1080.63 722.511 1082.44 720.762C1084.26 719.012 1085.17 716.711 1085.17 713.86C1085.17 711.722 1084.39 709.972 1082.83 708.611C1081.34 707.186 1078.36 706.473 1073.89 706.473H1066.7C1064.62 706.473 1062.61 706.311 1060.67 705.987C1058.73 705.663 1057.14 704.982 1055.91 703.945C1054.68 702.909 1054.06 701.321 1054.06 699.183C1054.06 696.979 1054.97 694.873 1056.78 692.864C1058.6 690.791 1061.93 688.685 1066.79 686.546L1067.96 687.421C1065.76 688.587 1063.85 689.786 1062.23 691.017C1060.61 692.184 1059.8 693.577 1059.8 695.197C1059.8 697.271 1061.35 698.308 1064.46 698.308H1076.61C1079.33 698.308 1081.83 698.696 1084.1 699.474C1086.43 700.252 1088.31 701.483 1089.73 703.168C1091.16 704.853 1091.87 707.056 1091.87 709.778C1091.87 712.823 1090.9 715.675 1088.96 718.331C1087.01 720.988 1084.1 723.127 1080.21 724.747C1076.39 726.432 1071.62 727.274 1065.92 727.274ZM1066.41 688.296C1063.23 688.296 1060.35 687.777 1057.75 686.741C1055.16 685.639 1053.12 683.954 1051.63 681.686C1050.14 679.418 1049.4 676.502 1049.4 672.938C1049.4 669.374 1050.14 666.458 1051.63 664.189C1053.12 661.921 1055.16 660.269 1057.75 659.232C1060.35 658.13 1063.23 657.58 1066.41 657.58C1069.65 657.58 1072.53 658.13 1075.06 659.232C1077.65 660.269 1079.69 661.921 1081.18 664.189C1082.67 666.458 1083.42 669.374 1083.42 672.938C1083.42 676.502 1082.67 679.418 1081.18 681.686C1079.69 683.954 1077.65 685.639 1075.06 686.741C1072.53 687.777 1069.65 688.296 1066.41 688.296ZM1066.41 686.546C1068.87 686.546 1070.78 685.574 1072.14 683.63C1073.57 681.686 1074.28 678.122 1074.28 672.938C1074.28 667.754 1073.57 664.189 1072.14 662.245C1070.78 660.301 1068.87 659.329 1066.41 659.329C1064.01 659.329 1062.1 660.301 1060.67 662.245C1059.25 664.189 1058.53 667.754 1058.53 672.938C1058.53 678.122 1059.25 681.686 1060.67 683.63C1062.1 685.574 1064.01 686.546 1066.41 686.546ZM1080.4 665.647L1078.65 664.967C1079.56 662.764 1081.12 660.82 1083.32 659.135C1085.52 657.45 1087.82 656.608 1090.22 656.608C1091.91 656.608 1093.27 657.094 1094.3 658.066C1095.34 658.973 1095.86 660.366 1095.86 662.245C1095.86 664.254 1095.31 665.68 1094.21 666.522C1093.17 667.3 1092.1 667.689 1091 667.689C1090.03 667.689 1089.12 667.365 1088.28 666.717C1087.43 666.004 1086.95 664.902 1086.82 663.412C1086.69 661.921 1087.14 660.01 1088.18 657.677L1089.44 657.968C1086.72 659.005 1084.78 660.107 1083.61 661.273C1082.44 662.375 1081.37 663.833 1080.4 665.647ZM1122.06 657.58C1127.76 657.58 1132.2 659.329 1135.38 662.829C1138.62 666.263 1140.24 671.642 1140.24 678.964H1105.92L1105.83 677.117H1130.91C1131.03 673.942 1130.78 671.026 1130.13 668.369C1129.48 665.647 1128.44 663.477 1127.02 661.857C1125.66 660.237 1123.87 659.426 1121.67 659.426C1118.69 659.426 1116.03 660.917 1113.7 663.898C1111.43 666.879 1110.07 671.609 1109.62 678.089L1109.91 678.478C1109.78 679.45 1109.68 680.52 1109.62 681.686C1109.55 682.852 1109.52 684.019 1109.52 685.185C1109.52 689.592 1110.23 693.383 1111.66 696.558C1113.08 699.733 1114.93 702.163 1117.2 703.848C1119.53 705.468 1121.93 706.278 1124.39 706.278C1126.34 706.278 1128.18 705.987 1129.93 705.403C1131.68 704.755 1133.3 703.719 1134.79 702.293C1136.28 700.867 1137.58 698.956 1138.68 696.558L1140.63 697.336C1139.91 699.474 1138.75 701.548 1137.13 703.557C1135.51 705.565 1133.46 707.218 1131 708.514C1128.54 709.745 1125.69 710.361 1122.45 710.361C1117.78 710.361 1113.77 709.292 1110.4 707.153C1107.09 705.015 1104.53 702.066 1102.72 698.308C1100.97 694.484 1100.09 690.11 1100.09 685.185C1100.09 679.483 1101 674.59 1102.81 670.508C1104.63 666.36 1107.19 663.185 1110.49 660.982C1113.8 658.714 1117.65 657.58 1122.06 657.58ZM1163.26 642.805V659.038H1177.65V660.982H1163.26V698.599C1163.26 701.645 1163.81 703.783 1164.91 705.015C1166.01 706.246 1167.54 706.862 1169.48 706.862C1171.43 706.862 1173.11 706.084 1174.54 704.529C1175.96 702.909 1177.19 700.219 1178.23 696.461L1180.17 696.947C1179.53 700.705 1178.23 703.881 1176.29 706.473C1174.41 709.065 1171.49 710.361 1167.54 710.361C1165.33 710.361 1163.52 710.069 1162.09 709.486C1160.67 708.968 1159.4 708.19 1158.3 707.153C1156.88 705.663 1155.87 703.881 1155.29 701.807C1154.77 699.733 1154.51 696.979 1154.51 693.545V660.982H1145.18V659.038H1154.51V644.166C1156.13 644.101 1157.69 643.971 1159.18 643.777C1160.67 643.582 1162.03 643.258 1163.26 642.805Z" fill="#BFA6A1"/>
                    <path d="M275.955 575.932C277.798 579.429 278.641 582.904 278.484 586.356C278.296 589.752 277.204 592.892 275.208 595.775C273.182 598.602 270.334 600.982 266.666 602.916C260.418 606.21 254.365 606.471 248.508 603.698C242.708 600.895 237.466 595.052 232.782 586.166L229.926 580.749C224.939 571.291 223.016 563.404 224.155 557.09C225.264 550.718 228.771 545.975 234.676 542.862C238.516 540.838 242.192 539.889 245.702 540.016C249.269 540.113 252.377 541.075 255.025 542.903C257.731 544.7 259.697 547.179 260.925 550.341L254.21 555.53C252.07 550.358 249.46 546.936 246.38 545.263C243.27 543.533 239.824 543.665 236.04 545.659C233.977 546.747 232.372 548.289 231.226 550.285C230.108 552.193 229.817 554.837 230.354 558.217C230.89 561.597 232.579 565.981 235.42 571.37L239.817 579.71C240.361 576.713 241.481 574.181 243.175 572.116C244.897 569.963 247.019 568.221 249.541 566.891C254.643 564.202 259.558 563.589 264.285 565.052C269.013 566.516 272.751 569.856 275.502 575.072L275.955 575.932ZM243.625 586.933C246.194 591.805 248.648 595.419 250.989 597.775C253.387 600.1 255.763 601.412 258.118 601.709C260.499 601.918 262.922 601.373 265.387 600.074C268.483 598.442 270.388 596.082 271.105 592.994C271.848 589.818 270.829 585.594 268.049 580.32L267.596 579.46C265.269 575.046 262.624 572.045 259.662 570.456C256.67 568.811 253.426 568.909 249.929 570.753C247.865 571.841 246.06 573.489 244.513 575.696C243.024 577.873 242.214 580.644 242.084 584.009L243.625 586.933ZM319.1 533.297L321.956 538.714C324.857 544.217 326.622 549.44 327.25 554.383C327.878 559.326 327.306 563.73 325.534 567.595C323.732 571.402 320.71 574.424 316.468 576.66C312.169 578.927 307.939 579.728 303.78 579.064C299.648 578.312 295.72 576.281 291.996 572.969C288.272 569.658 284.96 565.251 282.059 559.748L279.203 554.331C276.301 548.828 274.552 543.633 273.954 538.747C273.326 533.804 273.884 529.444 275.629 525.667C277.401 521.803 280.436 518.737 284.736 516.47C288.978 514.234 293.193 513.477 297.383 514.198C301.542 514.862 305.484 516.85 309.208 520.161C312.901 523.415 316.198 527.794 319.1 533.297ZM307.586 531.675C304.08 525.025 300.569 520.796 297.051 518.988C293.534 517.18 289.912 517.258 286.186 519.222C282.46 521.186 280.35 524.13 279.854 528.054C279.359 531.978 280.864 537.265 284.37 543.915L293.572 561.37C297.108 568.076 300.635 572.334 304.152 574.142C307.67 575.951 311.291 575.873 315.017 573.908C318.743 571.944 320.854 569 321.349 565.076C321.845 561.152 320.324 555.837 316.788 549.13L307.586 531.675ZM312.52 499.295L311.296 496.973L324.968 489.766L348.178 533.79L355.725 508.713C356.511 506.174 356.871 504.703 356.804 504.298C356.737 503.894 356.187 503.891 355.152 504.29L350.54 506.172L349.316 503.851L365.911 495.102L367.135 497.423L362.976 500.165C362.491 500.494 362.121 500.836 361.868 501.189C361.584 501.485 361.292 502.042 360.991 502.86C360.717 503.591 360.309 504.832 359.767 506.582L355.34 521.113L378.587 534.57C379.937 535.324 380.92 535.868 381.536 536.202C382.179 536.449 382.718 536.568 383.152 536.559C383.557 536.492 384.061 536.336 384.664 536.091L389.407 534.25L390.586 536.486L377.602 543.331L353.109 528.553L350.308 537.831L354.842 546.43C355.899 548.436 356.605 549.566 356.958 549.819C357.311 550.072 357.977 550.015 358.954 549.646L363.956 547.668L365.134 549.904L344.842 560.602L343.663 558.367L348.12 555.358C348.977 554.759 349.401 554.243 349.391 553.808C349.382 553.374 348.849 552.153 347.791 550.147L321.589 500.448C320.531 498.441 319.826 497.311 319.472 497.058C319.119 496.805 318.454 496.863 317.476 497.232L312.52 499.295Z" fill="white"/>
                    <path d="M645.698 330.994L643.915 332.028L642.69 329.915L644.473 328.881C648.127 326.763 650.144 324.358 650.525 321.667C650.95 318.95 650.32 316.139 648.635 313.234C646.849 310.152 644.858 308.189 642.662 307.345C640.467 306.5 638.202 306.754 635.869 308.107C632.832 309.868 631.357 312.194 631.444 315.084C631.55 317.904 632.998 321.212 635.786 325.007L629.429 327.281C627.654 325.134 626.563 322.796 626.156 320.267C625.793 317.713 626.276 315.198 627.605 312.722C628.952 310.176 631.321 307.921 634.71 305.956C637.968 304.067 640.906 303.099 643.525 303.051C646.163 302.933 648.454 303.487 650.399 304.712C652.319 305.892 653.866 307.495 655.04 309.52C656.827 312.602 657.297 315.594 656.451 318.496C655.648 321.373 653.665 324.14 650.5 326.799C654.574 325.201 658.175 324.819 661.305 325.651C664.478 326.458 667.048 328.557 669.013 331.946C670.264 334.103 670.884 336.391 670.874 338.808C670.908 341.2 670.165 343.571 668.646 345.923C667.146 348.204 664.701 350.328 661.311 352.293C658.098 354.156 654.846 355.041 651.557 354.948C648.313 354.83 645.061 353.127 641.802 349.84L645.273 346.24C647.029 348.457 648.743 349.992 650.415 350.847C652.13 351.675 653.77 352.018 655.335 351.876C656.918 351.664 658.413 351.15 659.822 350.333C665.457 347.066 666.385 342.175 662.608 335.66C660.77 332.49 658.472 330.353 655.713 329.246C652.954 328.14 649.616 328.723 645.698 330.994ZM700.79 295.7L703.202 299.861C705.652 304.087 707.201 308.129 707.85 311.988C708.5 315.846 708.19 319.32 706.922 322.408C705.628 325.452 703.352 327.918 700.095 329.807C696.793 331.721 693.5 332.483 690.216 332.094C686.95 331.634 683.804 330.165 680.777 327.684C677.751 325.204 675.013 321.851 672.563 317.625L670.151 313.465C667.7 309.238 666.164 305.218 665.54 301.403C664.891 297.545 665.191 294.106 666.441 291.088C667.709 288 669.994 285.499 673.296 283.584C676.553 281.696 679.837 280.968 683.147 281.402C686.432 281.791 689.587 283.226 692.613 285.707C695.614 288.143 698.339 291.474 700.79 295.7ZM691.705 294.792C688.744 289.685 685.855 286.478 683.038 285.17C680.221 283.863 677.382 284.038 674.521 285.697C671.659 287.356 670.096 289.733 669.832 292.827C669.567 295.922 670.915 300.022 673.876 305.129L681.648 318.533C684.634 323.684 687.535 326.913 690.352 328.221C693.169 329.528 696.008 329.353 698.87 327.694C701.731 326.035 703.294 323.658 703.559 320.564C703.823 317.469 702.463 313.347 699.476 308.196L691.705 294.792ZM694.553 269.23L693.519 267.447L704.018 261.36L723.62 295.169L728.749 275.255C729.286 273.238 729.522 272.072 729.457 271.757C729.391 271.442 728.959 271.457 728.16 271.803L724.601 273.425L723.567 271.642L736.311 264.253L737.345 266.036L734.169 268.319C733.798 268.593 733.519 268.872 733.331 269.157C733.118 269.399 732.906 269.845 732.696 270.496C732.504 271.078 732.223 272.064 731.853 273.455L728.839 284.996L747.504 294.82C748.587 295.369 749.375 295.764 749.869 296.007C750.382 296.181 750.808 296.257 751.149 296.236C751.464 296.171 751.854 296.033 752.32 295.822L755.984 294.227L756.979 295.944L747.008 301.725L727.323 290.904L725.419 298.272L729.248 304.875C730.141 306.416 730.73 307.28 731.016 307.468C731.301 307.655 731.821 307.589 732.577 307.269L736.438 305.559L737.433 307.276L721.85 316.311L720.854 314.594L724.256 312.093C724.91 311.596 725.226 311.178 725.205 310.837C725.184 310.496 724.727 309.556 723.833 308.015L701.705 269.848C700.811 268.307 700.222 267.443 699.937 267.256C699.652 267.068 699.132 267.135 698.376 267.455L694.553 269.23Z" fill="white"/>
                    <path d="M933.805 159.739L937.46 152.789L940.553 150.996L955.682 177.091C956.271 178.107 956.66 178.677 956.848 178.801C957.036 178.925 957.38 178.881 957.878 178.669L960.425 177.542L961.082 178.674L949.712 185.267L949.055 184.134L952.171 181.978C952.619 181.68 952.836 181.418 952.822 181.193C952.791 180.94 952.481 180.304 951.892 179.288L937.975 155.284L935.228 160.486L933.805 159.739ZM961.332 134.175L962.465 133.518L966.481 140.445L953.063 148.224L957.946 157.85C958.451 156.781 959.113 155.815 959.932 154.952C960.781 154.072 961.742 153.321 962.816 152.698C965.692 151.031 968.485 150.595 971.197 151.39C973.891 152.156 976.089 154.005 977.79 156.938C978.75 158.594 979.331 160.333 979.534 162.155C979.72 163.949 979.363 165.708 978.462 167.434C977.573 169.113 975.996 170.61 973.73 171.923C971.726 173.085 969.698 173.602 967.644 173.473C965.573 173.315 963.472 172.167 961.339 170.027L963.629 167.652C965.358 169.831 966.983 171.062 968.505 171.344C970.027 171.626 971.426 171.396 972.704 170.655C974.505 169.611 975.491 168.167 975.663 166.321C975.846 164.429 975.147 162.118 973.564 159.388C972.167 156.978 970.609 155.262 968.891 154.24C967.185 153.172 965.287 153.244 963.196 154.457C962.209 155.029 961.302 155.807 960.475 156.791C959.631 157.746 958.962 158.968 958.468 160.458L957.369 160.571L949.812 145.628L960.615 139.364C961.661 138.758 962.26 138.352 962.413 138.147C962.578 137.896 962.544 137.469 962.311 136.867L961.332 134.175ZM968.396 132.932L967.714 131.755L974.641 127.739L987.573 150.044L990.957 136.906C991.311 135.576 991.466 134.806 991.423 134.598C991.38 134.39 991.095 134.401 990.568 134.629L988.22 135.699L987.538 134.523L995.946 129.648L996.628 130.824L994.532 132.33C994.288 132.511 994.103 132.695 993.98 132.883C993.839 133.043 993.699 133.337 993.561 133.767C993.434 134.151 993.248 134.801 993.004 135.719L991.016 143.333L1003.33 149.814C1004.04 150.176 1004.56 150.437 1004.89 150.597C1005.23 150.712 1005.51 150.762 1005.73 150.748C1005.94 150.705 1006.2 150.614 1006.51 150.475L1008.92 149.423L1009.58 150.555L1003 154.369L990.016 147.23L988.76 152.092L991.286 156.448C991.875 157.464 992.264 158.035 992.452 158.158C992.64 158.282 992.983 158.238 993.482 158.027L996.029 156.899L996.686 158.032L986.405 163.993L985.748 162.86L987.993 161.209C988.424 160.882 988.632 160.606 988.618 160.381C988.604 160.156 988.303 159.536 987.713 158.519L973.115 133.339C972.525 132.323 972.136 131.753 971.948 131.629C971.76 131.505 971.417 131.549 970.919 131.76L968.396 132.932Z" fill="white"/>
                    </svg>

                    {/* <div className="flex gap-[10%] -rotate-[25deg] justify-evenly w-[80%] bg-pink-300">
                        <div className="flex-1 w-80 h-96 aspect-square clip-hexagon flex justify-center items-center" style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                        }}>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_FUpBq1Mf1jpRVYmY--zciFka9BAHFyaCFw&s" className="h-full w-full" alt="" />
                        </div>
                        <div className="flex-[0.75] w-64 h-72 clip-hexagon flex justify-center items-center" style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                        }}>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_FUpBq1Mf1jpRVYmY--zciFka9BAHFyaCFw&s" className="h-full w-full" alt="" />
                        </div>
                        <div className="flex-[0.5] w-48 h-56 aspect-square clip-hexagon flex justify-center items-center" style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                        }}>
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_FUpBq1Mf1jpRVYmY--zciFka9BAHFyaCFw&s" className="h-full w-full" alt="" />
                        </div>
                    </div> */}
                </section>
                {/* <section id="reels-section" className="w-[80%] hidden playfair-display h-screen snap-start items-center justify-center flex flex-col gap-12 self-center justify-self-center"> */}
                <section id="reels-section" className="w-[80%] playfair-display h-screen snap-start flex-col gap-12 self-center justify-self-center">
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
                            <div className="border-2 w-[95%] h-[70%] border-r-0 border-[#BFA6A1] flex  justify-center items-center px-[10%] inria-serif-regular text-[#BFA6A1]">
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

        gsap.to("#blog-section-slide", {
            scrollTrigger: {
                trigger: "#blog-section",
                scroller: "body",
                // markers: true,
                start: "top 10%",
                // snap: 0.7
                // scrub: true
            },
            left: "-20%",
            // duration: 1  
        })
    }, []);

    const [ selectedBlog, setSelectedBlog ] = useState(0);

    const navigate = useNavigate();

    return (
        <section id="blog-section" className="w-[80%] relative playfair-display transition-all snap-start text-[#BFA6A1] aspect-video flex flex-col gap-8 my-36 justify-self-center">
            <div id="blog-section-slide" className="absolute w-2/3 h-[66%] bg-[#E1C6B3] shadow-md -z-1 -left-[100%] top-[20%]"></div>
            <p className="blog-section-fade text-5xl justify-self-end self-end">Read the blog</p>
            <div className="h-full blog-section-fade w-full  gap-4 flex flex-col">
                <div className="flex w-full h-44 justify-around">
                    {BLOGDATA?.map((blog, index) => {
                        return (
                            // <Link to={`/blogs/${blog._id}`} className="hover:scale-110 transition-all">
                                <div className={cn(`flex flex-col w-auto h-full hover:scale-120 transition-all hover:cursor-pointer`, selectedBlog == index && `scale-110` )} onClick={() => {
                                    setSelectedBlog(index);
                                }}>
                                    <img src={blog.blogImageUrl?.url} alt="" className="w-auto min-h-[80%] h-full object-cover" />
                                    <p className="h-full flex justify-center items-center">{blog?.title}</p>
                                </div>
                            // </Link>
                        )
                    })}
                </div>
                <div className="flex w-[80%] self-center justify-self-center h-[75%]">
                    <img src={BLOGDATA[selectedBlog]?.blogImageUrl?.url} alt="" className="flex-1 h-auto" />
                    <div className="flex-1 gap-8 px-10 flex justify-center flex-col">
                        <p>{BLOGDATA[selectedBlog]?.blogContent?.description}</p>
                        <Button className="bg-[#BFA6A1] text-white hover:text-white hover:bg-[#8b7a76] w-36 font-medium px-4 py-2 rounded-none" onClick={(e) => {
                            e.preventDefault();
                            navigate(`/blogs/${BLOGDATA[selectedBlog]?._id}`);
                        }}>See more</Button>
                    </div> 
                </div>
            </div>
            <Button className="text-[#8b7a76] bg-transparent hover:bg-transparent text-3xl absolute bottom-[5%] right-0" onClick={(e) => {
                e.preventDefault();
                navigate("/blogs/");
            }}>See all</Button>
        </section>
    );
};