import React from 'react';
import '../globalstyle.css';

const ListItem = (props) => {
    return (
        <div>
            <input type="checkbox" name="list" value={props.index} onChange={props.change} /><label className={props.className}>{props.task}</label>
            {/* <button>Edit</button> */}
        </div>
    );
}

export default ListItem;
