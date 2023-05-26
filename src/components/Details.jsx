import { getNotes } from "../lib/NoteInfo";
import "../css/main.css"

export default function Details(props) {
    
    if (!props.note) return <></>;

    const allNotes = getNotes();
    const noteInfo = allNotes[props.note];

    let author,name,date,description;
    if (noteInfo.author) author = <h3 className="author">{noteInfo.author}</h3>;
    else author = <h3 className="author">anonymous</h3>
    if (noteInfo.name) name = <span className="name">{noteInfo.name}</span>;
    else name = <span className="name">untitled</span>;
    if (noteInfo.description) description = <span className="description">{noteInfo.description}</span>;
    let title;
    if (noteInfo.date) date = title = <p className="title">{name}, <span className="date">{noteInfo.date}</span></p>;
    else title = <p className="title">{name}</p>;
    
    return (
        <div className="detailsContent">
            {author}
            {title}
            {description}
        </div>
    )
}