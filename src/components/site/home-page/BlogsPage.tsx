import { BLOGDATA } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

export const BlogsPage = () => {
    
    const navigate = useNavigate();
    
    return (
        <section className="w-full mt-56 justify-center inria-serif-regular text-[#BFA6A1] h-screen flex p-[10] gap-4">
            {BLOGDATA?.map((blog) => {
                return (
                    <div className="w-[200px] flex flex-col" onClick={() => {
                        navigate(`/blogs/${blog?._id}`);
                    }}>
                        <img src={blog?.blogImageUrl?.url} alt="" className="w-1/2 object cover" />
                        <p>{blog?.title}</p>
                    </div>
                )
            })}
        </section>
    )
};