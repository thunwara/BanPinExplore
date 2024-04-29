import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { FIRESTORE_DB } from "@/FirebaseConfig";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define the interface for a Todo item
export interface Todo {
  title: string;
  done: boolean;
  id: string;
}
export interface Booking {
  endDate: string;
  startDate: string;
  numPeople: string;
  selectedPlace: string;
  status: string;
  id: string;
}

const Page = () => {
  // State to hold the list of todos and the input value for new todos
  const [todos, setTodos] = useState<any[]>();
  const [todo, setTodo] = useState("");

  useEffect(() => {
    // Reference to the 'todos' collection in Firestore
    const todoRef = collection(FIRESTORE_DB, "Booking");

    // Subscribe to changes in the 'todos' collection
    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        console.log("UPDATED");
        // Array to store fetched todos
        const todos: Booking[] = [];
        // Iterate over the documents in the snapshot
        snapshot.docs.forEach((doc) => {
          // Add each todo to the array
          todos.push({
            id: doc.id,
            ...doc.data(),
          } as Booking);
          // Update the todos state with the fetched todos
          setTodos(todos);
        });
      },
      // Error handling for fetching snapshot
      error: (error) => {
        console.error("Error fetching snapshot:", error);
      },
    });

    // Cleanup function to unsubscribe from snapshot listener when component unmounts
    return () => subscriber();
  }, []);

  // Function to add a new todo to Firestore
  // const addTodo = async () => {
  //   console.log("ADD");
  //   // Add a new todo document to the 'todos' collection
  //   const doc = await addDoc(collection(FIRESTORE_DB, "todos"), {
  //     title: todo,
  //     done: false,
  //   });
  //   console.log("🚀 ~ file: List.tsx:12 ~ addTodo ~ doc:", doc);
  //   // Clear the input field after adding todo
  //   setTodo("");
  // };

  const renderTodo = ({ item }: any) => {
    const ref = doc(FIRESTORE_DB, `Booking/${item.id}`);

    const toggleDone = async () => {
      updateDoc(ref, { done: !item.done });
    };

    const deleteItem = async () => {
      deleteDoc(ref);
    };

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={toggleDone} style={styles.todo}>
          <Text style={styles.todoText}>start date is {item.startDate}</Text>
          <Text style={styles.todoText}>end date is {item.endDate}</Text>
          <Text style={styles.todoText}>homestay is {item.selectedPlace}</Text>
          <Text style={styles.todoText}>status is {item.status}</Text>
          
        </TouchableOpacity>
        <Ionicons
          name="trash-outline"
          size={24}
          color="black"
          onPress={deleteItem}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* showing list of todos */}
      {(todos?.length as any) > 0 && (
        <View>
          <FlatList
            data={todos}
            renderItem={(item) => renderTodo(item)}
            keyExtractor={(todo: Todo) => todo.id}
          />
        </View>
      )}
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  form: {
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  todoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFF00",
    padding: 10,
    marginVertical: 4,
  },
  todoText: {
    flex: 1,
    paddingHorizontal: 4,
  },
  todo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
