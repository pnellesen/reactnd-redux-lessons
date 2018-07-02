const util = require('util');

// This code would be in a library
function createStore(reducer) {
    console.log("Create Store - reducer: ", reducer);
    /**
     * this should have 4 parts:
     * 1. the state of the app - done.
     * 2. a way to get the state - done.
     * 3. a way to set/update the state
     * 4. a way to respond to/listen for changes to the state. - done
     */
    let state;

    let listeners = []; // This will contain the callback functions sent to the subscribe function whenever it is invoked

    const getState = () => state;

    const subscribe = (listener) => {
        //listener is a callback function sent when the subscribe function is set up
        // there can be an arbitrary number of listeners set up in the app.

        listeners.push(listener);

        // Now we need to return a function to the subscriber which, when invoked, will remove or 'unsubscribe'
        // this listener from list so that it is no longer notified when the state changes

        return () => {
            console.log("removing listener %O", listener);
            listeners = listeners.filter((l) => l !== listener);//'listener' is the callback function sent to subscribe()
        }

    }

    const dispatch = (action) => {
        //do state updates here, based up the event/action that is passed.
        state = reducer(state, action);

        // now loop through the current listeners list, invoking each listener function that was
        // passed in each subscribe() call.
        listeners.forEach((listener) => listener());

    }


    return {
        getState,
        subscribe,
        dispatch
    }
}

// Set up the various action types as variables rather than strings. If we then later have a typo, it will flag an undefined error rather than just doing nothing.
const ADD_TODO = 'ADD_TODO';
const DELETE_TODO = 'DELETE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const DELETE_GOAL = 'DELETE_GOAL';

// set up functions for our various actions
addToDoAction = (todo) => {
    return {
        type: ADD_TODO,
        todo
    }
};

deleteToDoAction = (id) => {
    return {
        type: DELETE_TODO,
        id
    }
};

toggleToDoAction = (id) => {
    return {
        type: TOGGLE_TODO,
        id
    }
};

addGoalAction = (goal) => {
    return {
        type: ADD_GOAL,
        goal
    }
}

deleteGoalAction = (id) => {
    return {
        type: DELETE_GOAL,
        id
    }
};

// This would be part of our app code. This is the reducer function.
function todos (state=[], action) {
    console.log("\nTODO: ", action);
    switch (action.type) {
        case ADD_TODO:
            return state.concat([action.todo]);
            break;
        case DELETE_TODO:
            return state.filter((todo) => (todo.id !== action.id));
            break;
        case TOGGLE_TODO:
            return state.map((todo) => todo.id !== action.id ? todo :
                Object.assign({}, todo, {complete: !todo.complete})
            );
            break;
        default:
            return state
    }
}

function goals (state=[], action) {
    console.log("\nGOAL: ", action);
    switch (action.type) {
        case ADD_GOAL:
            return state.concat([action.goal]);
            break;
        case DELETE_GOAL:
            return state.filter((goal) => (goal.id !== action.goal.id));
            break;
        default:
            return state
    }
}

// We only one one 'state' of the app to manage, so combine goals and todos into a single "app":

function app (state={}, action) {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action)
    }
}


const appStore = createStore(app);

appStore.subscribe(() => {
    console.log("\napp updated: \n", appStore.getState());
});

appStore.dispatch(addToDoAction(
    {
        id: 0,
        subject: 'Finish the todo list',
        complete: false
    }
));

appStore.dispatch(addToDoAction(
    {
        id: 1,
        subject: 'Add goals',
        complete: false
    }
));

appStore.dispatch(addGoalAction(
    {
        id: 0,
        subject: 'Create one reducer for goals and todos?',
        complete: false
    }

));

appStore.dispatch(toggleToDoAction(1));

console.log("finished");