import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import storage from './FirebaseConfig';

export default function Media() {
  const [image, setImage] = useState(null);
  const [quizType, setQuizType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [percentUploaded, setPercentUploaded] = useState("");

  //component did mount
  useEffect(() => {
    //asking for permission to access phone's gallery
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


//function to upload the image in firebase
 async function uploadImage(uri) {
    const timeStamp = Math.floor(Date.now() / 1000);
    const imageName = timeStamp + ".jpg";

    const response = await fetch(uri);
    const blob = await response.blob();

    //putting image in firebase
    const storageRef = storage.ref().child("image/" + imageName);
    const resp = storageRef.put(blob);
    resp.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
            const percent = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log("percent: ", percent);
            setPercentUploaded(Math.floor(percent) + " %");
        },
        error => {
            console.log("image upload error: ", error.message);
            setPercentUploaded("");
        },
        () => {
            storageRef.getDownloadURL()
                .then((downloadUrl) => {  
                    setImage(downloadUrl);   
                    console.log("File available at: ", downloadUrl);
                })
        }
    );
return resp;
}

    //function to handle when submit quiz btn is pressed on
    function handleUploadImageBtnClick() {
        console.log("Upload Image btn pressed", image);

        if (image) {
            setImage("");
            setIsUploading(true);
            //saving image to firebase
            uploadImage(image)
                .then(() => {
                    setIsUploading(false);
                    console.log("Successful!")
                })
                .catch((error) => {
                    console.log("Fail to upload Image", error);
                    setIsUploading(false);
                });
        }
    }

  //function to handle when load superhero Image btn is clicked on
  async function handleSuperheroImgBtnClick() {
    var result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  //component rendering
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Media Management</Text>
      <View style={styles.divider}></View>

      <Text style={styles.label}>Choose SuperHero</Text>
      <Picker
        style={styles.inputField}
        selectedValue={quizType}
        onValueChange={(quizType, itemIndex) => setQuizType(quizType)}>
        <Picker.Item label="" value="" />
        <Picker.Item label="Iron Man" value="Iron Man" />
        <Picker.Item label="Spider-Man" value="Spider-Man" />
        <Picker.Item label="Superman" value="Superman" />
        <Picker.Item label="Thor" value="Thor" />
        <Picker.Item label="Wonder Woman" value="Wonder Woman" />
        <Picker.Item label="Wolverine" value="Wolverine" />
        <Picker.Item label="Black Panther" value="Black Panther" />
      </Picker>
      <View style={styles.divider}></View>

      <Button title="Load Superhero Image" onPress={handleSuperheroImgBtnClick} />
       <View style={styles.divider}></View>
       <Button title="Upload Superhero Image" onPress={handleUploadImageBtnClick} />
      <View style={styles.divider}></View>

      {image ? (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.divider}></View>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 60,
    paddingHorizontal: 30,
  },

  title: {
    fontWeight: '500',
    fontSize: 30,
    letterSpacing: 0.1,
    textAlign: 'center',
  },

  label: {
    fontSize: 16,
    lineHeight: 18,
    color: '#666666',
    marginBottom: 3,
  },

  inputField: {
    fontSize: 14,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#BFBFBF',
    paddingVertical: 6,
  },

  divider: {
    paddingVertical: 8,
  },

  image: {
    alignSelf: 'center',
    width: '100%',
    height: 200,
  },
});
