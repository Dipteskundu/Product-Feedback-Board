import { createContext } from 'react';

export const ActorContext = createContext({ actorId: null });

function ActorProvider({ children }) {
  return <ActorContext.Provider value={{ actorId: null }}>{children}</ActorContext.Provider>;
}

export default ActorProvider;
