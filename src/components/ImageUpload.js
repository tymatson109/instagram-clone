import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import { storage, db } from '../firebase';
import firebase from 'firebase'
import './ImageUpload.css';

const ImageUpload = ({username}) => {
    const [caption, setCaption] = useState('');
    const [url, setUrl] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) =>
    {
        if (e.currentTarget.files[0])
        {
            setImage(e.currentTarget.files[0])
        }
    }

    const handleUpload = (e) =>
    {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on("state_changed", (snapshot) => {
            //progress function
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
        }, 
        (error) => {
            //error function
            console.log(error);
            alert(error.message)
        }, 
        () => {
            //complete function
            storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                    //post image in database
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });

                    setProgress(0);
                    setCaption('');
                    setImage(null);
                })
        });
    }

    return (
        <div className="imageUpload">
            <progress value={progress} className="imageUpload__progress" max="100" className="item"/>
            <input className="item" type="text" value={caption} placeholder='Enter caption...' onChange={(e) => setCaption(e.currentTarget.value)}/>
            <input className="item" type="file" onChange={handleChange} />
            <Button className="imageupload__button item" onClick={handleUpload} >
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload

