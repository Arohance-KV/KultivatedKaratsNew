import { BLOGDATA } from "@/utils/constants";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";

export const BlogPage = () => {
    
    const { id } = useParams();
    
    const blog = BLOGDATA.filter(blog => blog?._id == id)[0];

    return (
        <section className="p-10 !inria-serif-regular text-[#A68A7E]  w-full min-h-screen sm:mt-36 mt-14">
            {parse(blog?.blogContent?.markup)};
        </section>
    );
};