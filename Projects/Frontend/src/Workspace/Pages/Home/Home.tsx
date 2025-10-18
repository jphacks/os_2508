import './Home.css';
import BaseButton from "../../Components/BaseButton/BaseButton";

function Home(){
    return (
        <div className="HomeBackground">
            <div className="NavigationBox">
                <BaseButton label="Profile" onClick={ () => window.location.href = "/Profile" } />
                <BaseButton label="Event" onClick={ () => window.location.href = "/Event" } />
                <BaseButton label="Login" onClick={ () => window.location.href = "/Login" } />
                <BaseButton label="Register" onClick={ () => window.location.href = "/Register" } />

            </div>
        </div>
    )
}

export default Home;