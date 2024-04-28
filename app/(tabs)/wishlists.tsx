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

const Page = () => {
  // State to hold the list of todos and the input value for new todos
  const [todos, setTodos] = useState<any[]>();
  const [todo, setTodo] = useState("");

  useEffect(() => {
    // Reference to the 'todos' collection in Firestore
    const todoRef = collection(FIRESTORE_DB, "todos");

    // Subscribe to changes in the 'todos' collection
    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        console.log("UPDATED");
        // Array to store fetched todos
        const todos: Todo[] = [];
        // Iterate over the documents in the snapshot
        snapshot.docs.forEach((doc) => {
          // Add each todo to the array
          todos.push({
            id: doc.id,
            ...doc.data(),
          } as Todo);
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
  const addTodo = async () => {
    console.log("ADD");
    // Add a new todo document to the 'todos' collection
    const doc = await addDoc(collection(FIRESTORE_DB, "todos"), {
      title: todo,
      done: false,
    });
    console.log("🚀 ~ file: List.tsx:12 ~ addTodo ~ doc:", doc);
    // Clear the input field after adding todo
    setTodo("");
  };

  const renderTodo = ({ item }: any) => {
    const ref = doc(FIRESTORE_DB, `todos/${item.id}`);

    const toggleDone = async () => {
      updateDoc(ref, { done: !item.done });
    };

    const deleteItem = async () => {
      deleteDoc(ref);
    };

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={toggleDone} style={styles.todo}>
          {!item.done && (
            <Ionicons name="ellipse-outline" size={24} color="black" />
          )}
          {item.done && (
            <Ionicons name="checkmark-circle-outline" size={24} color="green" />
          )}
          <Text style={styles.todoText}>{item.title}</Text>
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
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Add new todo"
          onChangeText={(text: string) => setTodo(text)}
          value={todo}
        />
        <Button onPress={addTodo} title="Add todos" disabled={todo === ""} />
      </View>

      {/* <View>
        {todos?.map((todo) => <Text key={todo.id}>{todo.title}</Text>)}
      </View> */}

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
