import React, { Component } from 'react';
import update from 'immutability-helper';

import '../globalstyle.scss';
import { db } from '../firebase/firebase';
import uuidv4 from 'uuid/v4';

let INITIAL = {
    tasklist: []
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL };
        this.addToList = this.addToList.bind(this);
    }

    componentWillMount = () => {
        var data;
        db.ref('tasks/').on("value", (snapshot) => {
            var arr = [];
            data = snapshot.exists() ? snapshot.val() : {};
            for (var k in data) {
                arr.push(data[k]);
            }
            this.setState({
                tasklist: arr
            })
        });
    }

    addToList = (newTask) => {
        let uid = uuidv4();
        var data = {};
        //add
        db.ref('tasks/' + uid).set({
            id: uid,
            title: newTask,
            completed: false
        });
    };
    udpateTask = (index) => {
        let a = this.state.tasklist[index].completed;
       // let todo = update(this.state.tasklist, { [index]: { completed: { $set: !a } } })
       // this.setState({ tasklist: todo });
        db.ref('tasks/' +this.state.tasklist[index].id).update({
            completed: !a
        });

    };
    deleteTasks = (index) => {
        // this.state.tasklist.splice(index, 1);
        // this.setState({
        //     tasklist: this.state.tasklist
        // })
        console.log(this.state.tasklist[index]);
        db.ref('tasks/' +this.state.tasklist[index].id).set(null);  

    }
    render() {
        let len = (this.state.tasklist.filter(x => !x.completed)).length;
        let totalLen = this.state.tasklist.length;
        let completedPer = ((totalLen - len) * 100) / totalLen | 0;
        return (
            <div className='main'>
                <h2 className="title">Todo Application</h2>
                <hr />
                <Form onSubmit={this.addToList} />
                <p className='sub-title is-size-7'>{len} Task{len > 1 ? 's' : ''}</p>
                <svg version="1.1" className="progress-bar2-wid" id="Layer_1" xmlns="http://www.w3.org/2000/svg" link="http://www.w3.org/1999/xlink" x="0px" y="0px" height="5px" space="preserve">
                    <rect x="0.25" fill="#E5E5E5" width="500" height="8"></rect>
                    <rect className="progress-bar3" fill="#8EC241" width={completedPer + "%"} height="8"></rect>
                </svg>
                <ListItems tasklist={this.state.tasklist} onChange={this.udpateTask} delete={this.deleteTasks} />
            </div>
        );
    }
}

class Form extends Component {
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.tasks.value);
        this.tasks.value = "";
    }
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="add field">
                    <div className="control">
                        <input className="add input is-rounded" type="textbox" placeholder="things to do" ref={(input) => this.tasks = input} />
                        <button className="add button is-primary" type="submit">+</button>
                    </div>
                </div>
            </form>
        );
    }
}

class ListItems extends Component {
    constructor(props) {
        super(props);
        this.updateTask = this.updateTask.bind(this);
    }
    updateTask = (target) => {
        this.props.onChange(target.target.value);
    };
    deleteTasks = (prop, e) => {
        this.props.delete(prop.index);
    }
    render() {
        return (
            <div>
                {this.props.tasklist.map((key, value) => <ListItem {...key} key={value} task={key.title} change={this.updateTask} index={value} delete={this.deleteTasks} />)}
            </div>
        )
    }
}

const ListItem = (props) => {
    return (
        <div className={'task-list ' + (props.completed ? 'done' : '')}>
            <input type="checkbox" id={'ck' + props.index} name="list" value={props.index} onChange={props.change} />
            <label htmlFor={'ck' + props.index}>
                <svg className="check" x="0px" y="0px" viewBox="0 0 10 10">
                    <path className="st0" d="M5,9.8L5,9.8C2.3,9.8,0.2,7.7,0.2,5v0c0-2.7,2.2-4.8,4.8-4.8h0c2.7,0,4.8,2.2,4.8,4.8v0C9.8,7.7,7.7,9.8,5,9.8z" />
                    <polyline className="st1" points="7.8,3.1 3.9,6.9 2.2,5.2" />
                </svg>
            </label>
            <label className="task">{props.task}</label>
            <button className="delete" onClick={(e) => props.delete(props, e)}></button>
        </div>
    );
}

export default App;
