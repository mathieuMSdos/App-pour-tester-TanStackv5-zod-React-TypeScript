import axios from "axios";
import { z } from "zod";
import {
  FormSchema,
  PatchPostSchema,
  PostSchema,
  PostSchemaArray,
} from "../schema/postSchema";

const API_URL = "http://localhost:3000/posts/";

// fonction GET

export const getPosts = async () => {
  const response = await axios.get(API_URL);
  console.log("je fetch");
  // comparaison/Vérification data reçu avec schema zod
  const verifiedData = PostSchemaArray.parse(response.data);
  return verifiedData;
};

// fonction POST

// b-1 on créé un type pour notre post sur la base de notre schema de data : FormData

// b-2 on utilise ce type pour typer le message newPost qu'on va envoyer
export const createPost = async (newPost: z.infer<typeof FormSchema>) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const response = await axios.post(API_URL, {
    ...newPost, //ici on destructure notre objet NewPost qui contient (author, content)
    date: Date.now(),
  });
  const verifiedPost = PostSchema.parse(response.data);
  // console.log(verifiedPost);
  return verifiedPost;
};

// fonction DELETE
export const deletePost = async (postId: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); //fake delay 1sec
  const deleteReponse = await axios.delete(API_URL + postId);
  console.log(deleteReponse);
};
// fonction PATCH
export const patchPost = async (
  contentEdited: z.infer<typeof PatchPostSchema>,
  postId: number
) => {
  // fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // patch !
  const response = await axios.patch(API_URL + postId, contentEdited);
  const verifiedPost = PatchPostSchema.parse(response.data);
  return verifiedPost;
};

// fonction PUT
