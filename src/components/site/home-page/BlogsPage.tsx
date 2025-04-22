import { BLOGDATA } from "@/utils/constants";
import { Link } from "react-router-dom";

export const BlogsPage = () => {
    
    return (
        <section className="w-full flex-wrap gap-8 p-6 mt-56 justify-center inria-serif-regular text-[#BFA6A1] h-screen flex">
            {BLOGDATA?.map((blog) => {
                return (
                    <div className="flex-col flex rounded-md flex-1">
                    <img src={blog?.blogImageUrl?.url} className="w-full rounded-t-[inherit] flex-1" />
                    <div className="flex flex-col p-6 gap-4 flex-1 rounded-b-[inherit] bg-red-500/5 w-full">
                        <p className="font-bold">
                            {blog?.title}
                        </p>
                        <p className="text-wrap">
                            {blog?.blogContent?.description}
                        </p>
                        <div className="flex-1 flex items-end">
                            <Link to={`/blogs/${blog?._id}`} className="font-extrabold w-20 text-sm bg-transparent text-[#A68A7E] hover:bg-transparent hover:underline shadow-none">Read more</Link>
                        </div>
                    </div>
                </div>
                )
            })}
        </section>
    )
};