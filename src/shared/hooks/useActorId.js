import { useContext } from 'react';
import { ActorContext } from '../../app/providers/ActorProvider';

export function useActorId() {
  const context = useContext(ActorContext);
  if (!context) throw new Error('useActorId must be used within ActorProvider');
  return context.actorId;
}
