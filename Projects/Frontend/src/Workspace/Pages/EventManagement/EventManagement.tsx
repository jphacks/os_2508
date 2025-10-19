import './EventManagement.css';
import SeveralButton from "../../Components/SeveralButton/SeveralButton";
// import InputArea from "../../Components/InputArea/InputArea";
import BaseButton from "../../Components/BaseButton/BaseButton";
//横を作成してそれを縦ループで作成　見出しの次からループを開始する

function EventManagement() {
    return (
        <div className="ManagementBackground">
            <div className="ManagementField">
                <table className="ManagementList">
                    <thead>
                        <tr>
                            <th></th>
                            <th>name</th>
                            <th>grade</th>
                            <th>birth</th>
                            <th>organization</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ここからデータをループさせる */}
                        <tr>
                            <td><input className="ManagementCheck"type="checkbox" /></td>
                            <td>Ritsumeikan</td>
                            <td>2</td>
                            <td>2005/10/4</td>
                            <td>RiST</td>
                        </tr>
                        <tr>
                            <td><input className="ManagementCheck"type="checkbox" /></td>
                            <td>Ritsumeikan</td>
                            <td>2</td>
                            <td>2005/10/4</td>
                            <td>RiST</td>
                        </tr>
                        <tr>
                            <td><input className="ManagementCheck"type="checkbox" /></td>
                            <td>Ritsumeikan</td>
                            <td>2</td>
                            <td>2005/10/4</td>
                            <td>RiST</td>
                        </tr>
                        <tr>
                            <td><input className="ManagementCheck"type="checkbox" /></td>
                            <td>RitsumeikanRitsumeikanRitsumeikanRitsumeikan</td>
                            <td>2</td>
                            <td>2005/10/4</td>
                            <td>Ritsumeikan</td>
                        </tr>
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
                <BaseButton label="Home" onClick={() => { alert("ホームへ遷移"); }} />
            </div>
        </div>
    );
}

export default EventManagement;