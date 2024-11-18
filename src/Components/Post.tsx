import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { deletePost, patchPost } from "../api/posts";
import { formaterDate } from "../functions/fnDate";
import { PatchPostSchema, PostSchema } from "../schema/postSchema";

// Typage des props
// on fait un Type
type PostProps = {
  post: z.infer<typeof PostSchema>;
};

// ------------- COMPOSANT REACT

const Post = ({ post }: PostProps) => {
  const { id, author, date, content } = post; // on destructure la props post qui est un objet c'est plus explicite c'est plus facile

  // ----USESTATE

  const [isPostEditing, setIsPostEditing] = useState(false);
  const [contentEdited, setContentEdited] = useState("");

  // -------- TANTASTACK POST

  // a1- Accès au queryClient pour invalider le cache ce qui provequera un refresh de fetch concerné
  const queryClient = useQueryClient();

  // a2 - Créer la mutation DELETE

  const {
    mutate: deleteMutate,
    isPending: isDeletePending,
    isError: deleteError,
  } = useMutation({
    mutationFn: (postId: number) => deletePost(postId), // la syntaxe pour une fonction avec paramètres
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("Post supprimé");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // fonction mutate de DELETE
  const handleDelete = (postId: number) => deleteMutate(postId);

  // -----------TANSTACK PATCH
  // comme on a 2 mutate dans le meme composant on est obligé de donnée des pseudo/alias à chaque élément de TanStack
  const {
    mutate: updateMutate,
    isPending: isUpdatePending,
    isError: isUpdateError,
    error: errorUpdate,
  } = useMutation({
    // mutationFn ne peux avoir qu'un seul argument
    // donc obligé de lui passer un objet que l'on destructure
    mutationFn: ({
      contentEdited,
      postId,
    }: {
      contentEdited: z.infer<typeof PatchPostSchema>;
      postId: number;
    }) => patchPost(contentEdited, postId), //notre fonction axios.patch
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      console.log("post édité");
    },
  });

  // fonction handle pour patch le post

  const handleEditPost = (content: string, id: number) => {
    const contentObject = {
      content: content,
      date: Date.now(),
    };
    // ZOD controle du typage de content avec notre schema
    const verifiedContent = PatchPostSchema.parse(contentObject);

    //TANSTACK mutation patch  function

    updateMutate({
      contentEdited: verifiedContent,
      postId: id,
    });

    setIsPostEditing(false);
  };

  return (
    <div className="post-container">
      <div className="header">
        <em className="author">{author}</em>
        <em>{formaterDate(date)}</em>
      </div>
      {/* affichage conditionnel si on clique sur modifier ouvre textarea */}
      <div className="content">
        {isPostEditing ? (
          <textarea
            className="editPostTextArea"
            name=""
            id="editPost"
            defaultValue={content}
            onChange={(e) => setContentEdited(e.target.value)}
          ></textarea>
        ) : (
          <p>{content}</p>
        )}
      </div>
      {isPostEditing ? (
        <div className="ValidateEdit-Btn-Container">
          <button
            className="cancelEditPostBtn"
            onClick={() => setIsPostEditing(false)}
          >
            Annuler
          </button>
          <button
            className="Validate-Btn"
            onClick={() => handleEditPost(contentEdited, id)}
          >
            {isUpdatePending ? "En cours..." : "Valider"}
          </button>
        </div>
      ) : (
        <div className="btn-action-post">
          <button onClick={() => setIsPostEditing(true)}>Modifier</button>
          <button onClick={() => handleDelete(id)}>
            {isDeletePending ? "En cours..." : "Supprimer"}
          </button>
          {deleteError || (errorUpdate && <p>Une erreur est survenue...</p>)}
          {/* message si l'erreur dans le delete */}
        </div>
      )}
    </div>
  );
};

export default Post;
