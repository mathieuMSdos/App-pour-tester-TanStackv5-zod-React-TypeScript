import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { z } from "zod";
import { createPost } from "../api/posts";
import { FormSchema } from "../schema/postSchema";

// typage des props
type ModalStateProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleIsModalOpen: () => void; // c'est comme ça qu'on type une fonction qui n'a pas de return et pas de paramètre
};

// COMPOSANT REACT

const CreatePostModal = ({
  isModalOpen,
  setIsModalOpen,
  handleIsModalOpen,
}: ModalStateProps) => {
  // Useeffect pour stop le scroll du body quand la modal s'ouvre
  // useEffect


  //----UseEffect

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";

      // cleanUp function :
      const cleanUp = () => {
        document.body.style.overflow = "";
      };

      return cleanUp; //on exécute la cleanup quand on démonte le composant
    }
  }, [isModalOpen]);

  // ---TANSTACK POST

  // c-1 créer une mutation POST ave tanStakc. Accès au queryClient pour invalider le cache ce qui provequera un refresh de fetch concerné
  const queryClient = useQueryClient();

  // c-3 TANSTACK useMutate POST
  const { mutate, isPending, isError } = useMutation({
    // on type grace à notre schema ZOD
    mutationFn: (data: z.infer<typeof FormSchema>) => createPost(data),
    onSuccess: () => {
      //on invalide l'etnrée post du cach stanstack pour provoquer un refresh des données
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // on ferme la modale
      setIsModalOpen(!isModalOpen); //

      console.log("sucessssssss !");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // c-4 On Récupère les donénes du formulaire non contrôlé et on lance la mutation !

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData);

    //ZOD on contrôle le type de data par rapport au schema des posts :
    const verifiedData = FormSchema.parse(data);
    // TANSTACK ON EFECTUE LA MUTATION on lance le post
    mutate(verifiedData);
  };

  return (
    <>
      {/* overlay qui vient assombrir le fond quand la modal est ouverte */}
      <div className="modal-overlay" onClick={() =>setIsModalOpen(false)}> </div>
      {/* contenu de la modal */}
      <div className="modal-container">
        <div className="modal-header">
          <button className="modal-close-Btn" onClick={handleIsModalOpen}>
            x
          </button>
          <h2>Brouillons</h2>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="author"
            required
            placeholder="Votre pseudo..."
          />
          <textarea name="content" placeholder="Quoi de neuf ?!"></textarea>
          <hr />
          <div className="footer-modal">
            <button type="submit">
              {isPending ? "En cours..." : "Poster"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePostModal;
