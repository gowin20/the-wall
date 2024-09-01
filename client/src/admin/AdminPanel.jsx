import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import LayoutGenerator from "./layout-generator/LayoutGenerator";
import AdminConfig from "./AdminConfig";


const AdminPanel = () => {
    const [panel,setPanel] = useState('config');
    const navigate = useNavigate();

    let content;
    switch (panel) {
        case 'layoutGen':
            content = <LayoutGenerator/>
            break;
        case 'config':
        default:
            content = <AdminConfig/>
    }

    console.log(panel,content)
    return (
        <div>
            <p>Welcome, administrator</p>
            <div className='adminPanel'>
                <div className='panel'>
                    <div className='adminLink' onClick={e=>navigate('/')}>Back to Wall</div>
                    <div className='adminLink' onClick={e=>setPanel('config')}>Admin panel</div>
                    <div className='adminLink' onClick={e=>setPanel('layoutGen')}>Layout generator</div>
                </div>
                {content}
            </div>
        </div>
    )
}

export default AdminPanel;