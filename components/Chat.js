import React from "react";
import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  LogBox,
} from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-community/async-storage";
import NetInfo from "@react-native-community/netinfo";

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();

    this.state = {
      message: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      uid: 0,
      isConnected: false,
    };

    // configuration to connect to firebase
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDvHVsss6dVnciK2rYXph1V6TXkecMX-Dk",
        authDomain: "chatty-82b03.firebaseapp.com",
        projectId: "chatty-82b03",
        storageBucket: "chatty-82b03.appspot.com",
        messagingSenderId: "339018453784",
        appId: "1:339018453784:web:43d95515d57d64b7bb046d",
        measurementId: "G-GNL2RX6Q4P",
      });
    }

    // creates reference to Firestone messages collection which stores and retrieves messages the users send
    this.referenceMessages = firebase.firestore().collection("messages");

    LogBox.ignoreLogs([
      "Cannot update a component from inside the function body of a different component.",
      "Setting a timer",
    ]);
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Map throug documents
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
      });
    });
    this.setState({
      messages,
    });
  };

  // add new message to database
  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  // store sent messages
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        // the append function by Gifted chat appends the new message to the message obj.
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  // customising the Bubbles
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#fff",
          },
        }}
      />
    );
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  //getMessages function loads the messages from asyncStorage
  async getMessages() {
    let messages = "";
    //to read the messages in storage, the getItem() method takes a key.  If no value found in storage, messages set to empty array
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //using saveMessages() to convert messages object into a string
  //Note: using try-catch block just in case the promise gets rejected
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  //using deleteMessages() function to delete stored messages
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    //using fetch() method from NetInfo to find out the user's connection status
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        console.log("online");
        //listen to authentication events
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            // Update user
            this.setState({
              isConnected: true,
              user: {
                _id: user.uid,
                name: this.props.route.params.name,
                avatar: "https://placeimg.com/140/140/any",
                createdAt: new Date(),
              },
              //uid: user.uid,
              message: [],
            });

            // calling the onSnapshot function to receive the updated data
            this.referenceMessages = firebase
              .firestore()
              .collection("messages");
            // new msg
            this.unsubscribe = this.referenceMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        console.log("offline");
        this.setState({
          isConnected: false,
        });
        //getMessages() function loads messages from asyncStorage
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    // calling unsubscribe to stop receiving updates from a collection
    this.unsubscribe();
    // stop listening to authentication
    this.authUnsubscribe();
  }

  render() {
    const { name, color } = this.props.route.params;
    const { messages, uid } = this.state;
    // props user's Name
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        {/* actual chat */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={messages}
          onSend={(messages) => this.onSend(messages)}
          user={this.state.user}
        />
        {/* fixing the android keyboard */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
