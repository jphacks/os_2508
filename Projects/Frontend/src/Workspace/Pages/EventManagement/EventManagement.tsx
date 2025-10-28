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
  Date: string;
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
  if (!EventID) return; // EventID がなければ処理しない
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        fetch(`/Event/${EventID}/ManagementEvent/Fetch`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(err => console.error(err));
    }, [EventID]);

    if (!userData) return <p>{userData}</p>;

    // AttendLogs 保存用関数
    const updateAttendStatus = (userID: string, eventID: string, newStatus: 0 | 1) => {
        // userData の更新
        setUserData(prev => {
            if (!prev) return prev;
            const newUserData = {
            ...prev,
            Attend: prev.Attend.map(a =>
                a.UserID === userID ? { ...a, Status: newStatus } : a
            )
            };

            // サーバーに即保存
            fetch(`/Event/${eventID}/ManagementEvent/UpdateAttendLogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify([
                { UserID: userID, EventID: eventID, Status: newStatus }
            ])
            })
            .then(res => res.json())
            .then(res => console.log('AttendLogs 保存完了', res))
            .catch(err => console.error('AttendLogs 保存失敗', err));

            return newUserData;
        });
    };

    // Schedules 保存用関数
    const updateScheduleStatus = (scheduleID: number, eventID: string, newStatus: 0 | 1) => {
        setUserData(prev => {
            if (!prev) return prev;
            const newUserData = {
            ...prev,
            Schedules: prev.Schedules.map(a =>
                a.ScheduleID === scheduleID ? { ...a, Status: newStatus } : a
            )
            };

            fetch(`/Event/${eventID}/ManagementEvent/UpdateSchedules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify([
                { ScheduleID: scheduleID, EventID: eventID, Status: newStatus }
            ])
            })
            .then(res => res.json())
            .then(res => console.log('Schedules 保存完了', res))
            .catch(err => console.error('Schedules 保存失敗', err));

            return newUserData;
        });
    };



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
                                checked={attend.Status === 1} // Statusが1ならチェック
                                onChange={e => updateAttendStatus(attend.UserID, attend.EventID, e.target.checked ? 1 : 0)}
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
                {/* <div className="ManagementButton">
                    <SeveralButton label="Save" onClick={() => alert("保存")} />
                </div> */}
            </div>
            <div className="ManagementField">
                <table className="ManagementTime">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Content</th>
                        </tr>
                    </thead>
                    <tbody>
                    {userData.Schedules.map(schedule => (
                        <tr key={schedule.ScheduleID}>
                        <td>
                            <input
                            className="ManagementCheck"
                            type="checkbox"
                            checked={schedule.Status === 1} // Statusが1ならチェック
                            onChange={e => updateScheduleStatus(schedule.ScheduleID, EventID, e.target.checked ? 1 : 0)}
                            />
                        </td>
                        <td>{schedule.Date.split("T")[0].replace(/-/g, "/")}</td>
                        <td>{schedule.Time}</td>
                        <td>{schedule.Content}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {/* <div className="ManagementButton">
                    <SeveralButton label="Save" onClick={() => alert("保存")} />
                </div> */}
            </div>
            <div className="ManagementHomeButton">
                <BaseButton label="Home" onClick={() => navigate("/Home") } />
            </div>
        </div>
    );
}

export default EventManagement;