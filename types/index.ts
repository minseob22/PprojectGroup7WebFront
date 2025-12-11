// app/types/index.ts
export interface Patient {
  id: number;
  name: string;
  birthDate: string;
  gender: string;
  lastVisit: string;  // 최근 방문일
}


export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  image_path?: string;
  created_at?: string;
};