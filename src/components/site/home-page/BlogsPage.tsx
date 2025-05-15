import { BLOGDATA } from "@/utils/constants";
import { Link } from "react-router-dom";

export const BlogsPage = () => {
    
    return (
        <section className="w-full sm:flex-row sm:flex-wrap sm:gap-8 p-6 sm:mt-56 gap-4 mt-14 justify-center grid grid-cols-2 inria-serif-regular text-[#BFA6A1] min-h-screen sm:flex">
            {BLOGDATA?.map((blog) => {
                return (
                    <div className="flex-col col-span-1 w-full sm:h-auto h-84 overflow-y-hidden sm:overflow-auto relative flex rounded-md">
                        <img src={blog?.blogImageUrl?.url} className="w-full! rounded-t-[inherit] flex-1" />
                        <div className="flex flex-col p-6 gap-4 flex-1 rounded-b-[inherit] bg-red-500/5 w-full">
                            <p className="font-bold">
                                {blog?.title}
                            </p>
                            <p className="text-wrap">
                                {blog?.blogContent?.description}
                            </p>
                            <div className="flex-1 absolute left-0 bottom-0 right-0 bg-gradient-to-t p-4 to-150% from-white to-transparent h-24 flex items-end">
                                <Link to={`/blogs/${blog?._id}`} className="font-extrabold w-20 text-sm bg-transparent text-[#A68A7E] hover:bg-transparent hover:underline shadow-none">Read more</Link>
                            </div>
                        
                    </div>
                </div>
                )
            })}
        </section>
    )
};