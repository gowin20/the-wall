import { getNoteDetails } from "../middleware/util";
import "../css/main.css"

export default function Details(props) {
    
    if (!props.note) return <></>;

    const noteInfo = getNoteDetails(props.note);

    let author,name,description;
    if (noteInfo.author) author = <h3 className="author">{noteInfo.author}</h3>;
    else author = <h3 className="author">anonymous</h3>
    if (noteInfo.name) name = <span className="name">{noteInfo.name}</span>;
    else name = <span className="name">untitled</span>;
    if (noteInfo.description) description = <span className="description">{noteInfo.description}</span>;
    let title;
    if (noteInfo.date) title = <p className="title">{name}, <span className="date">{noteInfo.date}</span></p>;
    else title = <p className="title">{name}</p>;
    
    return (
        <div className="detailsContent">
            {author}
            {title}
            {description}
        </div>
    )
}