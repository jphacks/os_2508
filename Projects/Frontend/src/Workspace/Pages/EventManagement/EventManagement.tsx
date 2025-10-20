import './EventManagement.css';
import SeveralButton from "../../Components/SeveralButton/SeveralButton";
import BaseButton from "../../Components/BaseButton/BaseButton";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// 型定義
type AttendData = {
  UserID: string;
  EventID: string;
  Status: 0 | 1;
  Nickname: string;
  Graduation: number;
  Organization: string;
};

type ScheduleData = {
  ScheduleID: number;
  EventID: string;
  Time: string;      // HH:MM形式
  Content: string;
  Status: 0 | 1;     // チェックボックス管理用
};

type UserData = {
  Attend: AttendData[];
  Schedules: ScheduleData[];
};

function EventManagement() {
  const { EventID } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [attendChecks, setAttendChecks] = useState<Record<string, boolean>>({});
  const [scheduleChecks, setScheduleChecks] = useState<Record<number, boolean>>({});

    useEffect(() => {
        fetch(`/Event/${EventID}/ManagementEvent/Fetch`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(err => console.error(err));
    }, [EventID]);

    if (!userData) return <p>{userData}</p>;

//     const saveAttend = () => {
//         const body = userData.Attend.map(a => ({
//         UserID: a.UserID,
//         EventID: a.EventID,
//         Status: attendChecks[a.UserID] ? 1 : 0
//         }));

//         fetch(`/Event/${EventID}/ManagementEvent/UpdateAttendLogs`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify(body)
//         })
//         .then(res => res.json())
//         .then(res => alert(res.message))
//         .catch(err => console.error(err));
//   };

    return (
        <div className="ManagementBackground">
            <div className="ManagementField">
                <table className="ManagementList">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nickname</th>
                            <th>UserID</th>
                            <th>Graduation</th>
                            <th>Organization</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userData.Attend.map(attend => (
                            <tr key={attend.UserID}>
                            <td>
                                <input
                                className="ManagementCheck"
                                type="checkbox"
                                checked={attendChecks[attend.UserID] || false} // Statusが1ならチェック
                                onChange={e =>
                                    setAttendChecks(prev => ({ ...prev, [attend.UserID]: e.target.checked }))
                                }
                                />
                            </td>
                            <td>{attend.Nickname}</td>
                            <td>{attend.UserID}</td>
                            <td>{attend.Graduation}</td>
                            <td>{attend.Organization}</td>
                            </tr>
                        ))}
                        </tbody>
                </table>
                <div className="ManagementButton">
                    <SeveralButton label="Save" onClick={() => alert("保存")} />
                </div>
            </div>
            <div className="ManagementField">
                <table className="ManagementTime">
                    <thead>
                        <tr>
                            <th></th>
                            <th>time</th>
                            <th>content</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {/* ここからデータをループさせる */}
                            <td><input className="ManagementCheck"type="checkbox" /></td>
                            <td>12:00</td>
                            <td>イベント開始</td>
                        </tr>
                    </tbody>
                </table>
                <div className="ManagementButton">
                    <SeveralButton label="Save" onClick={() => alert("保存")} />
                </div>
            </div>
            <div className="ManagementHomeButton">
                <BaseButton label="Home" onClick={() => navigate("/Home") } />
            </div>
        </div>
    );
}

export default EventManagement;