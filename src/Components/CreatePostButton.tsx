// typage des props

type ModalStateProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleIsModalOpen: () => void;
};

const CreatePostButton = ({
  isModalOpen,
  setIsModalOpen,
  handleIsModalOpen,
}: ModalStateProps) => {
  return (
    <button className="createPost-btn" onClick={handleIsModalOpen}>
      <i className="fa-regular fa-pen-to-square"></i>
    </button>
  );
};

export default CreatePostButton;
