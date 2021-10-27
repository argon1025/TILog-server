import { SessionInfo } from './session-info.dto';

export type Done = (err: Error, users: SessionInfo) => void;
