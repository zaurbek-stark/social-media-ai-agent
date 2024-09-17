import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { postSchema } from "../api/schema/schema";
import { z } from "zod";

type PartialObject<T> = {
  [P in keyof T]?: T[P] | undefined;
};

type Post = PartialObject<z.infer<typeof postSchema>["posts"][number]>;

type SocialPreviewProps = {
  posts: (Post | undefined)[];
};

const Modal: React.FC<{ post: string; onClose: () => void }> = ({
  post,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white overflow-hidden relative border rounded-lg shadow-xl shadow-gray-500/20 flex flex-col items-center p-4">
        <div className="flex gap-2 absolute right-2.5 top-2.5">
          <div className="self-end cursor-pointer text-2xl" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <p className="mt-6">{post}</p>
      </div>
    </div>
  );
};

const SocialPreview: React.FC<SocialPreviewProps> = ({ posts }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activePost, setActivePost] = useState("");

  const openModal = (post: string) => {
    setActivePost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 m-4">
      {posts.map((post, index) => {
        if (
          post &&
          typeof post.content === "string" &&
          typeof post.potential === "number"
        ) {
          return (
            <div
              key={index}
              className="relative border-dashed border-2 border-gray-300 rounded-lg shadow-lg transition-shadow hover:shadow-xl aspect-w-1 aspect-h-1 w-full h-[260px] sm:w-[30%] max-w-xs overflow-hidden"
            >
              <div
                onClick={() => openModal(post.content)}
                className="p-4 cursor-pointer h-full overflow-auto"
              >
                <p className="font-semibold mb-2">Content:</p>
                <p className="mb-4">{post.content}</p>
                <p className="font-semibold">Potential: {post.potential}</p>
              </div>
            </div>
          );
        }
        return null; // Return null for undefined or invalid posts
      })}
      {modalOpen && <Modal post={activePost} onClose={closeModal} />}
    </div>
  );
};

export default SocialPreview;
