import { createContext, useEffect, useState } from 'react';

export const ActorContext = createContext(null);

function getActorIdFromCookie() {
  const match = document.cookie.match(/actorId=([^;]+)/);
  return match ? match[1] : null;
}

function ActorProvider({ children }) {
  const [actorId, setActorId] = useState(() => getActorIdFromCookie());

  useEffect(() => {
    if (!actorId) {
      const id = getActorIdFromCookie();
      if (id) setActorId(id);
    }
  }, [actorId]);

  return <ActorContext.Provider value={{ actorId }}>{children}</ActorContext.Provider>;
}

export default ActorProvider;
