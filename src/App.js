import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post'
import {db, auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import ImageUpload from './components/ImageUpload';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
}));

const App = () =>
{
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [user, setUser] = useState(null)

    useEffect(() =>
    {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser)
            {   
                //user has logged in
                setUser(authUser)
            }
            else
            {
                //user has logged out
                setUser(null)
            }
        
        return () =>
        {
            //perform some clean up before the function fires again
            unsubscribe()
        }
        
        })
    }, [user, username])

    useEffect(() => {
        //everytime a new post is added, this code will run with onSnapshot
        db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                post: doc.data(),
                id: doc.id
            })));
        })
    }, [])

    const signUp = (e) =>
    {
        e.preventDefault();
        setOpen(false)

        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
            return authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch((error => alert(error.message)))
    }   

    const signIn = (e) =>
    {
        e.preventDefault();
        setOpenSignIn(false)

        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => alert(error.message));
    }

    return (

        <div className="app">
            <div className="app__signInModal">
                <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
                    <div style={modalStyle} className={classes.paper}>
                        <form className="app__signup">
                            <center>
                                <img className="app__headerImage" 
                                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                                    alt="instagram logo"
                                />
                            </center>

                            <input placeholder="email" type="text" value={email} onChange={e => setEmail(e.currentTarget.value)} />
                            <input placeholder="password" type="text" value={password} onChange={e => setPassword(e.currentTarget.value)} />
                            <Button type="submit" onClick={signIn}>Sign In</Button>
                        </form>
                    </div>
                </Modal>
            </div>
            <div className="app__signUpModal">
                <Modal open={open} onClose={() => setOpen(false)}>
                    <div style={modalStyle} className={classes.paper}>
                        <form className="app__signup">
                            <center>
                                <img className="app__headerImage" 
                                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                                    alt="instagram logo"
                                />
                            </center>

                            <input placeholder="email" type="text" value={email} onChange={e => setEmail(e.currentTarget.value)} />
                            <input placeholder="username" type="text" value={username} onChange={e => setUsername(e.currentTarget.value)} />
                            <input placeholder="password" type="text" value={password} onChange={e => setPassword(e.currentTarget.value)} />
                            <Button type="submit" onClick={signUp}>Sign Up</Button>
                        </form>
                    </div>
                </Modal>
            </div>


            <div className="app__header">
                <img className="app__headerImage" 
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                alt="instagram logo"
                />
                {user 
                ? (<Button onClick={() => auth.signOut()}>Log Out</Button>)
                : (
                    <div className="app__loginContainer">
                        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                )
                }
            </div>
            <div className="app__posts">
                <div className="app__postsLeft">
                    {        
                        posts.map(({post, id}) => {
                            return <Post key={id} postId={id} user={user} caption={post.caption} username={post.username} imageUrl={post.imageUrl} />
                        })
                    }
                </div>
                <div className="app__postsRight">
                </div>
            </div>
            {user?.displayName 
                ? <ImageUpload username={user.displayName} />
                : <h3 className="app__notLogged">Login to Upload</h3>
            }
        </div>
    );
};  

export default App;