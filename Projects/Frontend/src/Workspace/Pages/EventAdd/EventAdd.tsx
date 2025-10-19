import './EventAdd.css';
import SeveralButton from "../../Components/SeveralButton/SeveralButton";
import InputArea from "../../Components/InputArea/InputArea";
import BaseButton from "../../Components/BaseButton/BaseButton";
import { useNavigate } from "react-router-dom";

function EventAdd() {

    const navigate = useNavigate();
    
    return (
        <div className="AddBackground">
            <div className="AddField">
                <div className="AddName">
                    <p>イベント名</p>
                    <InputArea row={5} col={50} placeholder="イベント名" />
                </div>
                <div className="AddExplain">
                    <p>詳細</p>
                    <InputArea row={5} col={50} placeholder="詳細" />
                </div>
                <div className="AddDate">
                    <p>日時</p>
                    <InputArea row={5} col={50} placeholder="日時" />
                </div>
                <div className="AddFormat">
                    <p>開催形態</p>
                    <InputArea row={5} col={50} placeholder="開催形態" />
                </div>
                <div className="AddFee">
                    <p>参加費</p>
                    <InputArea row={5} col={50} placeholder="参加費" />
                </div>
                <div className="Addlication">
                    <p>申し込み期間</p>
                    <InputArea row={5} col={50} placeholder="申し込み期間" />
                </div>
                <div className="AddCancel">
                    <p>キャンセル期間</p>
                    <InputArea row={5} col={50} placeholder="キャンセル期間" />
                </div>
                <div className="AddAddress">
                    <p>運営連絡先</p>
                    <InputArea row={5} col={50} placeholder="運営連絡先" />
                </div>
                <div className="AddStaff">
                    <p>運営スタッフ名</p>
                    <InputArea row={5} col={50} placeholder="運営スタッフ名" />
                </div>
            </div>
            <div className="AddButton">
                <SeveralButton label="Add" onClick={() => alert("保存")} />
            </div>
            <div className="AddHomeButton">
                <BaseButton label="Home" onClick={() => window.location.href = "/Home"} />
            </div>
        </div>
    );
}

export default EventAdd;