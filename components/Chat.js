import React from "react";
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();

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

    this.state = {
      message: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      uid: 0,
    };
  }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      // Update user
      this.setState({
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
      this.referenceMessages = firebase.firestore().collection("messages");
      // new msg
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // calling unsubscribe to stop receiving updates from a collection
    this.unsubscribe();
    // stop listening to authentication
    this.authUnsubscribe();
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

  // store sent messages
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        // the append function by Gifted chat appends the new message to the message obj.
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
  }

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
