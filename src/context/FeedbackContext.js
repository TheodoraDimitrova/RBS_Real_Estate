import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase.config";

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [lastVisibleRatings, setLastVisibleRatings] = useState();
  const [popup, setPopup] = useState({
    show: false,
    id: null,
  });

  const [feedbackEdit, setFeedbackEdit] = useState({
    edit: false,
    id: null,
  });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const q = query(
          collection(db, "feedbacks"),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisibleRatings(lastVisible);
        const ratings = [];
        querySnapshot.forEach((doc) => {
          return ratings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setFeedbacks(ratings);
        setIsLoading(false);
      } catch (error) {
        toast.error("Something went wrong");
        setIsLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const deleteFeedback = (id) => {
    setPopup({
      show: true,
      id,
    });
  };
  const handleDeleteTrue = async () => {
    if (popup.show && popup.id) {
      await deleteDoc(doc(db, "feedbacks", popup.id));
      setFeedbacks(feedbacks.filter((item) => item.id !== popup.id));

      setPopup({
        show: false,
        id: null,
      });
      toast.success("Successfull deleted");
    }
  };

  const handleDeleteFalse = () => {
    setPopup({
      show: false,
      id: null,
    });
  };

  const addFeedback = async (newFeedback) => {
    if (auth.currentUser) {
      let newFeed = {
        ...newFeedback,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
      };
      try {
        let docRef = await addDoc(collection(db, "feedbacks"), newFeed);
        let feed = {
          data: newFeed,
          id: docRef.id,
        };

        setFeedbacks([feed, ...feedbacks]);
        toast.success("Thank you!");
        setIsLoading(false);
      } catch (error) {
        toast.error(error);
        setIsLoading(false);
      }
    } else {
      navigate("/sign-in");
    }
  };

  const editFeedback = (item, id) => {
    setFeedbackEdit({
      edit: true,
      item,
      id,
    });
  };
  const updateFeedback = async (id, upItem) => {
    const updatedRef = doc(db, "feedbacks", id);

    await updateDoc(updatedRef, upItem);

    let updatedFeeds = feedbacks.map((item) =>
      item.id === id ? { ...item, data: { ...item.data, ...upItem } } : item
    );

    setFeedbacks(updatedFeeds);
    toast.success("Successfull updated");
  };

  return (
    <div>
      <FeedbackContext.Provider
        value={{
          feedbacks,
          popup,
          setFeedbacks,
          addFeedback,
          handleDeleteTrue,
          handleDeleteFalse,
          deleteFeedback,
          isLoading,
          editFeedback,
          feedbackEdit,
          updateFeedback,
        }}
      >
        {children}
      </FeedbackContext.Provider>
    </div>
  );
};

export default FeedbackContext;
