import './Profile.css';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BaseButton from "../../Components/BaseButton/BaseButton";

interface UserData {
    nickName: string;
    userId: string;
    gradYear: string;
    organization: string;
    birth: number;
    events: string;
    comment: string;
}



function Profile() {
    const { UserID } = useParams();
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        fetch(UserID ? `/Profile/${UserID}/Fetch` : "/Profile/Fetch", { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserData(data.userData))
            .catch(err => console.error(err));
    }, [UserID]);

    if (!userData) return <p>Loading...</p>; 

    return (
        <div className="ProfileBackground">
            <div className="ProfileTitlebox">
                <p>Nickname: {userData?.nickName}</p>
            </div>
            <div className="ProfileBox">
                <div className="ProfileUserBirth">
                    <p>User ID</p>
                    <p>Birth</p>
                </div>
                <div className="ProfileDoubleField">
                    <div className="ProfileHalfDisplay">
                        <p>{userData?.userId}</p>
                        {/* <p>userid</p> */}
                    </div>
                    <div className="ProfileHalfDisplay">
                        <p>{userData ? new Date(userData.birth).toLocaleDateString('ja-JP') : ''}</p>
                        {/* <p>birthday</p> */}
                    </div>
                </div>
                <div className="ProfileGradOrganization">
                    <p>Grad.year</p>
                    <p>Organization</p>
                </div>
                <div className="ProfileDoubleField">
                    <div className="ProfileHalfDisplay">
                        <p>{userData?.gradYear}</p>
                        {/* <p>grad year</p> */}
                    </div>
                    <div className="ProfileHalfDisplay">
                        <p>{userData?.organization}</p>
                        {/* <p>organizaion</p> */}
                    </div>
                </div>
                <div className="ProfileFont">
                        <p>Event</p>
                    </div>
                    <div className="ProfileDisplay">
                        <p>{userData?.events}</p>
                        {/* <p>event</p> */}
                    </div>
                    <div className="ProfileFont">
                        <p>Message</p>
                    </div>
                    <div className="ProfileDisplay">
                        <p>{userData?.comment}</p>
                        {/* <p>mesage</p> */}
                    </div>
            </div>
            <div className="ProfileHomeButton">
                <BaseButton label="Home" onClick={ () => window.location.href = "/Home" } type="button"/>
            </div>
        </div>
    );
}

export default Profile;
