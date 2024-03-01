import './App.css';
import Container from "@mui/material/Container";
import {Route, Routes} from "react-router-dom";
import {Header} from "./components/Header/Header";
import {Registration} from "./pages/Registration/Registration";
import {Login} from "./pages/Login/Login";

function App() {
    return (
        <>
            <Header/>
            <Container maxWidth='lg'>
            <Routes>
                {/*<Route path="/" element={<Home/>}/>*/}
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Registration />}/>
            </Routes>
            </Container>
        </>
    );
}

export default App;
