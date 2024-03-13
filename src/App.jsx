import './App.css';
import Container from "@mui/material/Container";
import {Route, Routes} from "react-router-dom";
import {Header} from './components/Header'
import {Home, FullPost, Registration, Login, AddPost} from "./pages";

export function App() {
    return (
        <>
            <Header/>
            <Container maxWidth='lg'>


                <Routes>

                    <Route path="/" element={<Home/>}/>
                    <Route path="/posts/:id" element={<FullPost/>}/>
                    <Route path="/add-post" element={<AddPost/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Registration/>}/>
                </Routes>
            </Container>
        </>
    );
}

export default App;
