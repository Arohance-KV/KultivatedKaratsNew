import { BLOGDATA } from "@/utils/constants";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import { UIsideBar } from "./Solitare";

export const BlogPage = () => {
    
    const { id } = useParams();
    
    const blog = BLOGDATA.filter(blog => blog?._id == id)[0];

    return (
        <section className="sm:p-20 flex flex-col justify-center items-center sm:gap-8 gap-4 !inria-serif-regular relative text-[#A68A7E]  w-full min-h-screen sm:mt-36 mt-14">
            <UIsideBar side="left" />
            <UIsideBar side="right" />
            <img src={blog?.blogImageUrl?.url} className="h-56 rounded-md" />
            <div>
                {parse(blog?.blogContent?.markup)};
            </div>
        </section>
    );
};