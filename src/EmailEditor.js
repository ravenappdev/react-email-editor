import React, { useCallback, useEffect } from "react";
const EDITOR_HOST = "https://console.ravenapp.dev/email-editor";
var prevCallback = null;

export default function EmailEditor({
  className,
  state,
  onEditorLoad,
  triggerFetch,
  onFetched,
  ...rest
}) {
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
    [onEditorLoad, onFetched]
  );

  useEffect(() => {
    window.removeEventListener("message", prevCallback);
    prevCallback = receiveMessage;

    window.addEventListener("message", receiveMessage);
  }, [receiveMessage]);

  useEffect(() => {
    if (triggerFetch) {
      window.frames["emailEditor"].postMessage(
        { message: "fetchState", value: true },
        EDITOR_HOST
      );
    }
  }, [triggerFetch]);

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
      title="my-frame"
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
