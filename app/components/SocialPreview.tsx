import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

type SocialPreviewProps = {
  posts: string[];
};

const Modal: React.FC<{ post: string; onClose: () => void }> = ({
  post,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="overflow-hidden relative border rounded-lg shadow-xl shadow-gray-500/20 flex flex-col items-center">
        <div className="flex gap-2 absolute right-2.5">
          <div className="self-end cursor-pointer text-2xl" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <p>{post}</p>
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
      {posts.map((post, index) => (
        <div
          key={index}
          className="relative border-dashed border-2 border-gray-300 rounded-lg shadow-lg transition-shadow hover:shadow-xl aspect-w-1 aspect-h-1 w-full h-[260px] sm:w-[30%] max-w-xs overflow-hidden"
        >
          <div onClick={() => openModal(post)}>
            <p>{post}</p>
          </div>
        </div>
      ))}
      {modalOpen && <Modal post={activePost} onClose={closeModal} />}
    </div>
  );
};

export default SocialPreview;
