export interface Client {
  redirectUris: string[];
}

export const CLIENTS = new Map<string, Client>([
  ["blogsavianshsuthar", { redirectUris: ["http://localhost:3001/callback"] }],
]);

// CLIENTS.set("blogsavianshsuthar", {
//   redirectUris: ["http://localhost:3001/callback"],
// });
