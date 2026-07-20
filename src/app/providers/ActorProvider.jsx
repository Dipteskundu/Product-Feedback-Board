import { createContext, useMemo, useContext } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const ActorContext = createContext({ actorId: null });

function ActorProvider({ children }) {
  const { user } = useAuth();
  const value = useMemo(() => ({ actorId: user?._id || null }), [user]);
  return <ActorContext.Provider value={value}>{children}</ActorContext.Provider>;
}

export function useActorIdFromContext() {
  const context = useContext(ActorContext);
  if (!context) throw new Error('useActorId must be used within ActorProvider');
  return context.actorId;
}

export default ActorProvider;
