import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";

var prevCallback = null;

function EmailEditor(
  {
    className,
    state,
    onEditorLoad,
    triggerFetch,
    onFetched,
    forwardedRef,
    EDITOR_HOST = "https://console.ravenapp.dev/email-editor",
    ...rest
  },
  ref
) {
  const receiveMessage = useCallback(
    (event) => {
      //TO FIX: repeat calls to receive messge
      if (!EDITOR_HOST.includes(event.origin)) return;
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
    [onEditorLoad, onFetched, EDITOR_HOST]
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
        EDITOR_HOST
      );
    },
  }));

  const onLoad = () => {
    window.frames["emailEditor"].postMessage(
      { message: "loadEditor", value: state },
      EDITOR_HOST
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
      src={EDITOR_HOST}
    />
  );
}

const forwardedEditor = forwardRef(EmailEditor);
export default forwardedEditor;
