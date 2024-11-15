import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPosts } from "./api/posts";
import CreatePostButton from "./Components/CreatePostButton";
import CreatePostModal from "./Components/CreatePostModal";
import Post from "./Components/Post";

function App() {
  // state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // function
  const handleIsModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };
  

  // ---- TANSTACK GET
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isError) {
    console.log(error.message);
  }
  // cas les données sont pas encore là
  if (isPending) return <div>is loading...</div>;

  return (
    
    <main>
      <CreatePostButton
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleIsModalOpen={handleIsModalOpen}
      />
      {isModalOpen && (
        <CreatePostModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleIsModalOpen={handleIsModalOpen}
        />
      )}
      <div className="posts-container">
        {data
          ?.sort((a, b) => b.date - a.date)
          .map((post) => (
            <Post key={post.id} post={post}></Post>
          ))}
      </div>
    </main>
  );
}

export default App;
