import { ldflexHelper } from "../../utils/index";
import auth from "solid-auth-client";
import FC from "solid-file-client";
import { RDFToNotification, NotificationToRDF } from "../Parsers";
import { storageHelper, Fetcher } from ".";

const fc = new FC(auth);

export const fetchNotificationsURLS = async (inboxURL) => {
  if (!inboxURL) {
    return;
  }
  try {
    const folder = await fc.readFolder(inboxURL, []);
    return folder.files.map((file) => file.url);
  } catch (err) {
    console.error(err);
    throw new Error("An error has occurred trying to load your notifications");
  }
};

export const fetchNotification = async (url) => {
  try {
    return await RDFToNotification.parse(url);
  } catch (error) {
    console.error(error);
    throw new Error("An error has occurred parsing the notification from RDF");
  }
};

export const findUserInboxes = async (paths) => {
  try {
    let inboxes = [];
    for await (const path of paths) {
      const { path: currentPath } = path;
      const inbox = await ldflexHelper.discoverInbox(currentPath);

      if (inbox) {
        inboxes = [...inboxes, { ...path, path: inbox }];
      }
    }

    return inboxes;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const getDefaultInbox = (inboxes, inbox1, inbox2) =>
  inboxes.find((inbox) => inbox.name === inbox1) ||
  inboxes.find((inbox) => inbox.name === inbox2);

export const addRouteSharedWithMe = async (route, friend) => {
  try {
    let webId = (await auth.currentSession()).webId;
    const path = storageHelper.getSharedWithMeFile(webId);
    let docu = await fc.readFile(path);
    const insert =
      `
          []
              a schema:ShareAction ;
              schema:agent "` +
      friend +
      `" ;
              schema:object "` +
      route +
      `";
              schema:recipient "` +
      webId +
      `".
          `;
    docu += insert;
    await fc.createFile(path, docu, "text/turtle", {});
  } catch (err) {
    console.error(err);
    throw new Error(
      "An error has occurred adding the route they have shared with you"
    );
  }
};

export const markAsRead = async (notification) => {
  try {
    notification.read = true;
    let docu = NotificationToRDF.parse(notification);
    await fc.createFile(notification.url, docu, "text/turtle", {});
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("The notification could not be marked as read");
  }
};

export const hasNotBeenAccepted=async (route,webId) => {
    const urlSharedWithMe=storageHelper.getSharedWithMeFile(webId);
    const sparql=`PREFIX schema: <http://schema.org/>
    SELECT ?blank WHERE {
    ?blank schema:object "`+route+`".
    }`;
    const result=await Fetcher.fetch(sparql,urlSharedWithMe);
    return result.length===0;
};
