import React, { useState } from "react";
import { NotificationTypes } from "@inrupt/solid-react-components";
import { storageHelper } from "../../../viade";
import { List, LoggedIn } from "@solid/react";
import { FriendCard } from "../../index";
import { errorToaster, successToaster } from "../../../utils";

const ShareFormComponent = ({ webId, friend, sendNotification, route }) => {
  let [sentTo, setSentTo] = useState([]);

  const shareWith = (target) => {
    setSentTo([...sentTo, target]);

    if (target.includes("profile/card#me")) {
      friend = target;
    } else {
      friend = target.concat("profile/card#me");
    }

    shareRoute();
  };

  const shareRoute = async () => {
    try {
      const licenseUrl = "https://creativecommons.org/licenses/by-sa/4.0/";
      const inbox=storageHelper.getInboxFolder(friend);
      const to = inbox;
      const target = friend;
      await sendNotification(
        {
          title: route.name,
          summary: "route sharing",
          actor: webId,
          object: route.url,
          target,
        },
        to,
        NotificationTypes.OFFER,
        licenseUrl
      );
      successToaster("The route has been shared!!");
    } catch (error) {
      errorToaster("An error has occurred sharing the route");
    }
  };

  return (
    <form className={"list-holder"} style={{ width: "750px" }}>
      <h1>Share with</h1>
      <LoggedIn>
        <List src="user.friends">
          {(friend) =>
            sentTo.includes(`${friend}`) ? null : (
              <FriendCard
                key={`${friend}`}
                friend={`${friend}`}
                enable={false}
                onClick={() => shareWith(`${friend}`)}
              />
            )
          }
        </List>
      </LoggedIn>
    </form>
  );
};

export default ShareFormComponent;