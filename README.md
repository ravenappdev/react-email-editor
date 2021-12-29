# <img src="public/email_logo.png" align="left" width=50 height=40>React-Email-Editor

A [React.js](https://reactjs.org/) wrapper component around [Email-Editor](https://github.com/ravenappdev/email-editor). It is built on [craft.js](https://craft.js.org/) that provides a drag-n-drop system and handles the way user components should be rendered, updated, and moved. It loads in an iframe and can be embedded directly in your application.

![Optional Text](public/email_template.png)

## Live Demo

Checkout the demo app here - https://email-editor-demo-mu.vercel.app/

## Installation

To use the React Email Editor, install it from NPM and include it in your own React build process.

```
npm i raven-react-email-editor
```

## Example Usage

```
import React, { useState, useCallback, useRef } from "react";
import EmailEditor from "raven-react-email-editor";

const myStyle = {
  div: {
    height: "100vh",
  },
  nav: {
    height: "8%",
    borderBottom: "1px solid #a39f9f",
  },
  button: {
    float: "right",
    margin: "10px 20px 10px 10px",
    padding: "10px 40px",
    color: "white",
    border: "1px solid rgba(88, 80, 236, 0.5)",
    fontSize: "0.875rem",
    backgroundColor: "#5850EC",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editor: {
    height: "91.9%",
  },
};

function App() {
  const [savedState, setSavedState] = useState({ state: "", html: "" });
  const [isLoaded, setIsLoaded] = useState(false);
  const editorRef = useRef(null);
  const onLoad = () => {
    setIsLoaded(true);
  };

  const onFetched = useCallback((state, html) => {
    setSavedState((prevState) => ({
      ...prevState,
      state: state,
      html: html,
    }));
    setIsLoaded(true);
  }, []);

  const onEditorSave = useCallback(() => {
    if (isLoaded) {
      setIsLoaded(false);
      editorRef.current.fetchState();
    }
  }, [isLoaded]);

  return (
    <div style={myStyle.div}>
      <nav style={myStyle.nav}>
        <button onClick={onEditorSave} style={myStyle.button}>
          SAVE
        </button>
      </nav>
      <div style={myStyle.editor}>
        <EmailEditor
          state={savedState.state}
          onEditorLoad={onLoad}
          onFetched={onFetched}
          ref={editorRef}
        />
      </div>
    </div>
  );
}

export default App;


```

### Props

| **props**        | **description**                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **onEditorLoad** | callback when editor has loaded completely. Params - empty                                                                          |
| **onFetched**    | callback that gives the state of editor and html of the email. Params - state, html                                                 |
| **state**        | describes the editor's state. pass a state you saved earlier to load an already designed email. pass empty to load an empty editor. |

## License

MIT Licensed
