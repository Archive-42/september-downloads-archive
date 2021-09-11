# 5 Things You Should Know About Props in React

> Important things to know about React props.

Important things to know about React props.
-------------------------------------------

[![Mehdi Aoussiad](https://miro.medium.com/fit/c/43/43/1*SyOXSpLcytDDWp6DWRsgnA.jpeg)](https://mehdiouss.medium.com/?source=post_page-----7e1d13cd80d8--------------------------------)

![React Props.](https://miro.medium.com/max/630/1*AuE7PfgXvtRBh2V7kya1jA.jpeg)

Image created with ❤ ️️️️By author.

React is a very popular JavaScript library when it comes to building user interfaces or web applications. It’s the best friend for the majority of front-end developers these days.

React has many powerful features that make it easier to build web applications. Props are one of those features. That’s why in this article, we will cover the things that you should know about props as a React developer. So let’s get right into it.

Props are defined inside an object that we can access. So when you pass a prop to a component. React will add that prop as a property inside an object called `props` . It will also give the prop value that you passed in the component as a value for the property inside the object `props` .

That’s why we access our props in React using the object `props` with dot notation.

Let’s have a look at an example:

_//index.js_import ReactDOM from "react-dom";import App from "./App";const rootElement = document.getElementById("root");  
ReactDOM.render(  
    <App **message="Hello World"** />,  
  rootElement  
);

As you can see, inside the file `index.js` in our React project, we rendered the component `App` and we passed it the prop `message` . As a result, the prop `message` gets added as a property for the object `props` .

So now we can access that props object using dot notation in order to use our prop that we just passed down.

Here is the example:

_//App.js_import React from "react"  
import "./styles.css";export default function App(**props**) {  
  return (  
    <>  
     <h1>{**props.message**}</h1>  
    </>  
  )  
}

_Output:_

![](https://miro.medium.com/max/27/1*Yy5bP9IlEYprD9PnmCAxEQ.png?q=20)

![](https://miro.medium.com/max/189/1*Yy5bP9IlEYprD9PnmCAxEQ.png)

Capture by the author.

As a result, the prop value `hello world` will be displayed on the screen.

If you only have few props that you want to pass down to a component, it’s a good practice to destructure the props object within the parameters of your component. This is a good way to easily access the props and keep your code cleaner.

Here is the same example that we used above, but now using object destructuring:

_Passing some props:_

_//index.js_import ReactDOM from "react-dom";import App from "./App";const rootElement = document.getElementById("root");  
ReactDOM.render(  
    <App **tool="React"** **message="Hello World" ** />,  
  rootElement  
);

_Using ES6 destructuring:_

_//App.js_import React from "react"  
import "./styles.css";export default function App( **{message, tool}** ) {  
  return (  
    <>  
     <h1>{**message**} **{tool}**!</h1>  
    </>  
  )  
}

_Output:_

![](https://miro.medium.com/max/27/1*Z34DVumVMFRCWOcCbr7bvg.png?q=20)

Capture by the author.

As you can see, by destructuring the props object, we don’t have to use dot notation anymore to access our props. So always use destructuring if you have few props to pass down.

When it comes to writing truthy props, you don’t even have to give them the value `true` .

Props passed with just their name will have a value `true` by default.

<App **message={true}** />

The example above is the same as the below one:

<App **message** />

So if you want to write truthy props, just pass down their name and they will have the boolean value `true` by default.

You can easily pass down multiple props into a single component by putting all the props inside one object.

We can do that by creating an object that contains all our props. Then we can easily pass down all the props just by using the spread operator and the object name.

Here is an example:

_//index.js_import ReactDOM from "react-dom";  
import App from "./App";const rootElement = document.getElementById("root");**const articleData = {  
  title: "Hello world",  
  desc: "Hello world text...",  
  readTime: 5,  
}**ReactDOM.render(  
    <App **{...articleData}** />,  
  rootElement  
);

As you can see above, we created an object `articleData` that contains all the props we need. Then we passed down all the props as one value by using the spread operator and the object name `articleData` .

Now we can easily access these props:

import React from "react"  
import "./styles.css";function App( {title, desc, readTime} ) {  
  return (  
    <>  
     <h1>{title}</h1>  
     <p>{desc}</p>  
     <h4>{readTime}min read.</h4>  
    </>  
  )  
}  
export default App;

Any valid JavaScript data type can be passed down as a prop value. You can pass down numbers, objects, strings, functions, or even a component as a prop.

The example below allows us to update the state of the parent component from the child component by passing down the function `setName` as a prop.

_The parent component:_

_//App.js_import React, {useState} from "react"  
import "./styles.css";  
import Home from './Home'function App() {  
  const \[name, setName\] = useState("VueJS")  
  return (  
    <>  
     <h2>{name}</h2>  
     <Home **setName={setName}** />  
    </>  
  )  
}  
export default App;

_The child component:_

_//Home.js_import React from "react";const Nav = (**{setName}**) => {  
  return (  
    <div>  
      <button onClick={()=> **setName("ReactJS")**}>Update Name</button>  
    </div>  
  );  
};  
export default Nav;

Props are very useful when it comes to passing small data and state to components. Every React developer should know about them. However, when it comes to the complex states, you will have to use the content API, maybe Redux, or any other state management library.

Thank you for reading this article. I hope you found it useful.

**Further Reading:**

_More content at_ [**_plainenglish.io_**](http://plainenglish.io/)


[Source](https://javascript.plainenglish.io/5-things-you-should-know-about-props-in-react-7e1d13cd80d8)