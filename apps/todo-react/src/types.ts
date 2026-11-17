// Типы этого приложения. В @skvortsov/shared/types — только обобщённые типы, без привязки к приложению.

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}
