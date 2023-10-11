import React, { useEffect } from 'react';
import FocusMode from './focus-mode/FocusMode';
import Canvas from './Canvas';
import { useSelector, useDispatch } from 'react-redux';
import { setLayout } from './wallSlice';
import { getDefaultLayout } from '../api/wall';


export default function Wall() {

    const layout = useSelector((state) => state.wall.layout);
    const dispatch = useDispatch();
    
    //const [layout, setLayout] = useState({
    //    image:null
    //});

    useEffect(() => {
        async function setupLayout() {
            const defaultLayout = await getDefaultLayout();
            dispatch(setLayout(defaultLayout));
        }

        setupLayout().catch(console.error);
    }, [])

    return (
        <div id="wall" className="with-header-height">
            <FocusMode />
            <Canvas sourceId={layout.image} />
        </div>
    )

}