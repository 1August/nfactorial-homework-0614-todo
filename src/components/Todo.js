import {useEffect, useState} from 'react'
import {v4 as uuidv4} from 'uuid'

import css from '../static/css/todo.module.css'

import deleteIcon from '../static/img/trashIcon.png'
import importantIcon from '../static/img/importantIcon.png'

const Todo = () => {
    const [todos, setTodos] = useState([])

    // useState
    const [todoAddInput, setTodoAddInput] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [listType, setListType] = useState('all')

    // const types = [
    //     {
    //         id: uuidv4(),
    //         type: 'all'
    //     },
    //     {
    //         id: uuidv4(),
    //         type: 'unfinished'
    //     },
    //     {
    //         id: uuidv4(),
    //         type: 'finished'
    //     }
    // ]

    const [sortedTodos, setSortedTodos] = useState([])

    useEffect(() => {
        setTodos(JSON.parse(localStorage.getItem('todos')))
    }, [])

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
        setSortedTodos([...todos.filter(el => el.important && !el.done), ...todos.filter(el => el.important && el.done), ...todos.filter(el => !el.important)])
    }, [todos])

    const handleTypeChange = e => {
        if (e.target.dataset.type === 'all') {
            setListType('all')
            return setSortedTodos([...todos.filter(el => el.important && !el.done), ...todos.filter(el => el.important && el.done), ...todos.filter(el => !el.important)])
        }
        else if (e.target.dataset.type === 'unfinished') {
            setListType('unfinished')
            return setSortedTodos([...todos.filter(el => el.important && !el.done), ...todos.filter(el => !el.important && !el.done)])
        }
        else {
            setListType('finished')
            return setSortedTodos([...todos.filter(el => el.important && el.done), ...todos.filter(el => !el.important && el.done)])
        }
    }

    // Functions
    const handleItemSubmit = e => {
        e.preventDefault()
        setTodos(prevList => [...prevList, {id: uuidv4(), content: todoAddInput, done: false, important: false}])
        setTodoAddInput('')
    }

    const handleToggleDone = ({id}) => {
        setTodos(prevTodos => prevTodos.map(el => el.id === id ? {...el, done: !el.done} : el))
    }

    const handleToggleImportant = ({id}) => {
        setTodos(prevTodos => prevTodos.map(el => el.id === id ? {...el, important: !el.important} : el))
    }

    const handleDeleteItem = ({id}) => {
        setTodos(prevTodos => prevTodos.filter(el => el.id !== id))
    }

    const handleInputChange = e => {
        setTodoAddInput(e.target.value)
    }

    const handleSearchInput = e => {
        setSearchInput(e.target.value)
        const sortedTodosTemp = [...todos.filter(el => el.important && !el.done), ...todos.filter(el => el.important && el.done), ...todos.filter(el => !el.important)]
        if (e.target.value === '') {
            return setSortedTodos(sortedTodosTemp)
        }
        setSortedTodos(sortedTodosTemp.filter(el => el.content.toLowerCase().includes(e.target.value.toLowerCase())))
    }

    const unfinishedTodos = todos.filter(el => el.done === false).length
    const finishedTodos = todos.length - unfinishedTodos

    return (
        <main id={css.todoBody}>
            <h1>ToDo list</h1>
            <section id={css.userControllers}>
                <div className={`${css.container} container`    }>
                    <div className={`${css.todoBlock} ${css.forms}`}>
                        <form id={css.addTodo} onSubmit={handleItemSubmit}>
                            <input id={css.addTodoInput} value={todoAddInput} onChange={handleInputChange}
                                   maxLength={'80'} type="text"/>
                            <button type="submit">Add</button>
                        </form>
                        <form id={css.searchTodo} onSubmit={e => e.preventDefault()}>
                            <input id={css.searchTodoInput} value={searchInput} onChange={handleSearchInput} maxLength={'80'} type="text" placeholder={'Search...'}/>
                        </form>
                    </div>
                    <div className={css.todoBlock}>
                        <div className={css.controllerBtns}>
                            <button onClick={handleTypeChange} data-type={'all'}>All ({todos.length})</button>
                            <button onClick={handleTypeChange} data-type={'unfinished'}>Unfinished ({unfinishedTodos})</button>
                            <button onClick={handleTypeChange} data-type={'finished'}>Finished ({finishedTodos})</button>
                        </div>
                    </div>
                </div>
            </section>
            <section id={css.todoList}>
                <div className="container">
                    <div className={`${css.unfinishedList} ${css.categoryList}`}>
                        <ul>
                            {
                                sortedTodos.map(el => {
                                    return (
                                        <li key={el.id}
                                            className={`${el.done ? css.done : ''} ${el.important ? css.important : ''}`}>
                                                <span className={css.listContent}
                                                      onClick={() => handleToggleDone(el)}>{el.done ? '‣' : ''} {el.content}</span>
                                            <div className={css.listBtns}>
                                                <img className={css.deleteIcon} onClick={() => handleDeleteItem(el)} src={deleteIcon} alt="Delete"/>
                                                <img className={css.importantIcon} onClick={() => handleToggleImportant(el)} src={importantIcon}
                                                     alt="Important"/>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Todo