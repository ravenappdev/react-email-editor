import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";

var prevCallback = null;
const DEFAULT_HOST = process.env.DEFAULT_HOST;
function EmailEditor(
  {
    className,
    state,
    onEditorLoad,
    onFetched,
    editorHostUrl = DEFAULT_HOST,
    ...rest
  },
  ref
) {
  console.log(editorHostUrl);
  const receiveMessage = useCallback(
    (event) => {
      //TO FIX: repeat calls to receive messge
      if (!editorHostUrl.includes(event.origin)) return;
      const message = event.data.message;
      switch (message) {
        case "editorLoaded":
          onEditorLoad();
          break;
        case "savedState":
          var obj = event.data.value;
          onFetched(obj["state"], obj["html"]);
          break;
        default:
      }
    },
    [onEditorLoad, onFetched, editorHostUrl]
  );
  useEffect(() => {
    window.removeEventListener("message", prevCallback);
    prevCallback = receiveMessage;

    window.addEventListener("message", receiveMessage);
  }, [receiveMessage]);

  useImperativeHandle(ref, () => ({
    fetchState() {
      window.frames["emailEditor"].postMessage(
        { message: "fetchState", value: true },
        editorHostUrl
      );
    },
  }));

  const onLoad = () => {
    window.frames["emailEditor"].postMessage(
      { message: "loadEditor", value: state },
      editorHostUrl
    );
    // window.removeEventListener("beforeunload", onPageUnload);
    // window.addEventListener("beforeunload", onPageUnload);
  };

  return (
    <iframe
      title={"my-editor"}
      ref={ref}
      name="emailEditor"
      frameBorder="0"
      marginWidth="0"
      marginHeight="0"
      width="100%"
      height="100%"
      onLoad={onLoad}
      src={editorHostUrl}
    />
  );
}

const forwardedEditor = forwardRef(EmailEditor);
export default forwardedEditor;
