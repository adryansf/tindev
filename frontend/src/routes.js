import React from 'react'
import {BrowserRouter,Route} from 'react-router-dom'

import Login from './pages/Login'
import Main from './pages/Main'

export default props=>(
    <BrowserRouter>
        <Route exact path="/" component={Login}/>
        <Route path="/dev/:id" component={Main}/>
    </BrowserRouter>
)
