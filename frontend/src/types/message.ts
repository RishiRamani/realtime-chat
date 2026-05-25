export interface Message{
  id:number;
  username:string;
  type: "message"|"join"|"leave";
  text:string;
  createdAt:number;
}
