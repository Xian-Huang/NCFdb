import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Data } from "./components/Data";
import { News } from "./components/News";
import { Events } from "./components/Events";
import { Tools } from "./components/Tools";
import { Contact } from "./components/Contact";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "data", Component: Data },
      { path: "news", Component: News },
      { path: "events", Component: Events },
      { path: "tools", Component: Tools },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
]);
